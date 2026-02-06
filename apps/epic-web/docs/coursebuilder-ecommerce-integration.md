# CourseBuilder E-Commerce Integration Architecture

> Created: 2026-02-04
> Context: Integration of CourseBuilder as CMS with existing e-commerce system

## Overview

CourseBuilder serves as the **CMS** (Content Management System) for creating and managing products and workshops. The **OG Database** (Prisma/PostgreSQL) remains the source of truth for e-commerce transactions, purchases, and Stripe integration.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA SOURCES                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────────┐         ┌─────────────────────┐               │
│   │    CourseBuilder    │         │   Sanity (Legacy)   │               │
│   │    MySQL Database   │         │      CMS            │               │
│   ├─────────────────────┤         ├─────────────────────┤               │
│   │ zEW_Product         │         │ product             │               │
│   │ zEW_ContentResource │         │ module (workshop)   │               │
│   │ zEW_ContentResource │         │                     │               │
│   │   Product           │         │                     │               │
│   └──────────┬──────────┘         └──────────┬──────────┘               │
│              │                               │                           │
│              │    getAllProducts()           │                           │
│              │    getAllWorkshops()          │                           │
│              │    getWorkshop()              │                           │
│              └───────────┬───────────────────┘                           │
│                          │                                               │
│                          ▼                                               │
│              ┌───────────────────────┐                                   │
│              │   Merged & Sorted     │                                   │
│              │   Products/Workshops  │                                   │
│              └───────────┬───────────┘                                   │
│                          │                                               │
└──────────────────────────┼───────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DISPLAY LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   /products page          /workshops/[slug] page        /buy page        │
│         │                        │                          │            │
│         └────────────────────────┴──────────────────────────┘            │
│                                  │                                       │
│                                  ▼                                       │
│                        propsForCommerce()                                │
│                                  │                                       │
│                     Returns products + user purchases                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         PURCHASE FLOW                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   User clicks "Buy"                                                      │
│         │                                                                │
│         ▼                                                                │
│   ┌─────────────────┐                                                    │
│   │ Stripe Checkout │  Uses productId from CourseBuilder                 │
│   └────────┬────────┘                                                    │
│            │                                                             │
│            ▼                                                             │
│   ┌─────────────────┐                                                    │
│   │ Payment Success │                                                    │
│   │    Webhook      │                                                    │
│   └────────┬────────┘                                                    │
│            │                                                             │
│            ▼                                                             │
│   ┌─────────────────────────────────────────┐                            │
│   │  getMerchantProduct(stripeProductId)    │                            │
│   │  ─────────────────────────────────────  │                            │
│   │  Looks up in OG Database:               │                            │
│   │  MerchantProduct → Product → productId  │                            │
│   └────────┬────────────────────────────────┘                            │
│            │                                                             │
│            ▼                                                             │
│   ┌─────────────────┐                                                    │
│   │    Purchase     │  Created in OG Database                            │
│   │     Record      │  with productId, userId, etc.                      │
│   └─────────────────┘                                                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Tables

### CourseBuilder MySQL Database

| Table | Purpose |
|-------|---------|
| `zEW_Product` | Product definitions (name, type, fields JSON) |
| `zEW_ContentResource` | Workshops, lessons, sections |
| `zEW_ContentResourceProduct` | Links workshops to products |
| `zEW_ContentResourceResource` | Links sections/lessons to workshops |

### OG Prisma Database (E-Commerce)

| Table | Purpose |
|-------|---------|
| `Product` | Product record with productId |
| `Price` | Price tiers for products |
| `MerchantAccount` | Stripe account connection |
| `MerchantProduct` | Links Product to Stripe product ID |
| `MerchantPrice` | Links Price to Stripe price ID |
| `MerchantCharge` | Individual Stripe charges |
| `Purchase` | User purchase records |
| `Coupon` | Discount codes |

## Critical Requirement

**For purchases to work, each CourseBuilder product MUST have:**

1. A `Product` row in OG database with **same productId**
2. A `MerchantProduct` linking to Stripe product
3. A `MerchantPrice` linking to Stripe price

Without these, the purchase webhook fails with `NO_ASSOCIATED_PRODUCT`.

## State Mapping

CourseBuilder uses `published` state, Sanity uses `active` state. Both are treated as "active" products:

```typescript
// Products are shown if state is 'active' OR 'published'
allProducts.filter(p => p.state === 'active' || p.state === 'published')
```

## File Locations

### Data Fetching (CourseBuilder + Sanity merged)

- `src/lib/products.ts` - Product fetching with CourseBuilder integration
- `src/lib/workshops.ts` - Workshop fetching with CourseBuilder integration

### Key Transformations

```typescript
// CourseBuilder product → App format
{
  _id: product.id,
  productId: product.id,  // Same ID used in OG database
  title: product.name,
  state: fields.state,    // 'published' accepted
  // ...
}

// CourseBuilder workshop → App format
{
  _id: workshop.id,
  title: fields.title,
  state: fields.state,
  product: fetchedProduct,  // Linked via zEW_ContentResourceProduct
  // ...
}
```

## Lesson Progress Tracking

Progress is stored in the **OG Database** (Prisma/PostgreSQL) in the `LessonProgress` table. The `lessonId` field stores the content resource ID, which works for both Sanity and CourseBuilder content.

### Progress Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PROGRESS TRACKING                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   User completes lesson                                                  │
│         │                                                                │
│         ▼                                                                │
│   ┌─────────────────────────────────────────┐                            │
│   │  progress.add / progress.toggle         │                            │
│   │  (TRPC mutation)                        │                            │
│   └────────┬────────────────────────────────┘                            │
│            │                                                             │
│            ▼                                                             │
│   ┌─────────────────────────────────────────┐                            │
│   │  getLesson(lessonSlug)                  │                            │
│   │  ─────────────────────────────────────  │                            │
│   │  1. Query CourseBuilder first           │                            │
│   │  2. Fall back to Sanity                 │                            │
│   │  3. Returns lesson with _id             │                            │
│   └────────┬────────────────────────────────┘                            │
│            │                                                             │
│            ▼                                                             │
│   ┌─────────────────────────────────────────┐                            │
│   │  completeLessonProgressForUser()        │                            │
│   │  ─────────────────────────────────────  │                            │
│   │  Stores in OG Database:                 │                            │
│   │  LessonProgress { lessonId, userId }    │                            │
│   └─────────────────────────────────────────┘                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Module Progress

Module progress aggregates lesson progress to show completion percentages:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MODULE PROGRESS                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   getModuleProgress({ moduleId, userId })                                │
│         │                                                                │
│         ▼                                                                │
│   ┌─────────────────────────────────────────┐                            │
│   │  getModuleStructure(moduleId)           │                            │
│   │  ─────────────────────────────────────  │                            │
│   │  1. Query CourseBuilder first           │                            │
│   │  2. Fall back to Sanity                 │                            │
│   │  3. Returns module with all lesson IDs  │                            │
│   └────────┬────────────────────────────────┘                            │
│            │                                                             │
│            ▼                                                             │
│   ┌─────────────────────────────────────────┐                            │
│   │  Query LessonProgress table             │                            │
│   │  WHERE lessonId IN (all module lessons) │                            │
│   │  AND userId = currentUser               │                            │
│   └────────┬────────────────────────────────┘                            │
│            │                                                             │
│            ▼                                                             │
│   ┌─────────────────────────────────────────┐                            │
│   │  Return ModuleProgress:                 │                            │
│   │  - percentComplete                      │                            │
│   │  - completedLessonCount                 │                            │
│   │  - nextLesson                           │                            │
│   │  - moduleCompleted                      │                            │
│   └─────────────────────────────────────────┘                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `packages/skill-lesson/trpc/routers/progress.ts` | TRPC endpoints for progress tracking |
| `packages/skill-lesson/lib/module-progress.ts` | Module progress calculation |
| `packages/skill-lesson/lib/lesson-resource.ts` | Lesson fetching (CourseBuilder + Sanity) |
| `packages/skill-lesson/lib/modules.ts` | Module structure fetching |
| `packages/database/src/prisma-api.ts` | Database SDK for LessonProgress table |

## Video Access & Ability Rules

Video playback is gated by CASL-based ability rules. Admin users have access regardless of purchase status.

### Access Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         VIDEO ACCESS CHECK                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   User navigates to lesson                                               │
│         │                                                                │
│         ▼                                                                │
│   ┌─────────────────────────────────────────┐                            │
│   │  modules.rules TRPC query               │                            │
│   │  ─────────────────────────────────────  │                            │
│   │  Fetches: module, lesson, section       │                            │
│   │  from CourseBuilder or Sanity           │                            │
│   └────────┬────────────────────────────────┘                            │
│            │                                                             │
│            ▼                                                             │
│   ┌─────────────────────────────────────────┐                            │
│   │  defineRulesForPurchases()              │                            │
│   │  ─────────────────────────────────────  │                            │
│   │  1. Check user role (admin/superadmin)  │◄── Admins get full access  │
│   │  2. Check purchased modules             │                            │
│   │  3. Return ability rules                │                            │
│   └────────┬────────────────────────────────┘                            │
│            │                                                             │
│            ▼                                                             │
│   ┌─────────────────────────────────────────┐                            │
│   │  Client receives rules                  │                            │
│   │  ─────────────────────────────────────  │                            │
│   │  canShowVideo = ability.can('view',     │                            │
│   │                            'Content')   │                            │
│   └────────┬────────────────────────────────┘                            │
│            │                                                             │
│            ▼                                                             │
│   ┌─────────────────────────────────────────┐                            │
│   │  Video playback decision                │                            │
│   │  ─────────────────────────────────────  │                            │
│   │  IF canShowVideo && muxPlaybackId:      │                            │
│   │    Show MuxPlayer                       │                            │
│   │  ELSE:                                  │                            │
│   │    Show BlockedOverlay                  │                            │
│   └─────────────────────────────────────────┘                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Admin Access

Admins bypass purchase checks via role detection in `ability.ts`:

```typescript
const userRole = ((user?.role as string) || (user?.roles as string) || '')
  .toLowerCase()
  .trim()
if (['admin', 'superadmin', 'contributor'].includes(userRole)) {
  can('create', 'Content')
  can('view', 'Content')  // Grants video access
  can('view', 'Invoice')
  can('view', 'Team')
  can('invite', 'Team')
}
```

### Video Resource Fetching

Video resources are fetched from CourseBuilder with fallback to Sanity:

```typescript
// packages/skill-lesson/lib/video-resources.ts
const videoResource = {
  _id: videoRow.id,
  // Check both possible locations in CourseBuilder
  muxPlaybackId:
    fields.muxPlaybackId ||
    fields.muxAsset?.muxPlaybackId ||
    null,
  transcript: fields.transcript?.text || fields.castingwords?.transcript || null,
  // ...
}
```

### Key Files

| File | Purpose |
|------|---------|
| `packages/skill-lesson/utils/ability.ts` | CASL ability rules definition |
| `packages/skill-lesson/trpc/routers/modules.ts` | Rules endpoint |
| `packages/skill-lesson/lib/video-resources.ts` | Video resource fetching |
| `packages/skill-lesson/video/video.tsx` | Video player component |

## Testing Checklist

### E-Commerce
- [ ] Product appears on `/products` page
- [ ] Workshop appears on `/workshops` page
- [ ] Workshop detail page loads (`/workshops/[slug]`)
- [ ] "Buy" button initiates Stripe checkout
- [ ] Purchase webhook completes successfully
- [ ] Purchase appears in user's purchased products
- [ ] User can access purchased workshop content

### Video Access
- [ ] Admin users can view all workshop videos
- [ ] Non-admin users see overlay for unpurchased content
- [ ] Purchased content plays correctly
- [ ] Video resources load from CourseBuilder

### Progress Tracking
- [x] Lesson completion saves correctly
- [ ] Module progress percentage updates
- [ ] Next lesson suggestion works
- [ ] Progress persists across sessions

## Known Issues & Fixes

### Schema Validation for CourseBuilder Lessons

**Issue:** `getLesson()` was failing silently because `videoResourceId` field was missing.

**Root Cause:** `ResourceSchema` requires `videoResourceId`, but the CourseBuilder response didn't include it. Zod validation failed, error was caught, and function fell through to Sanity (returning null).

**Fix:** Added query to fetch `videoResourceId` from `zEW_ContentResourceResource` for both lesson and solution objects in `lesson-resource.ts`.
