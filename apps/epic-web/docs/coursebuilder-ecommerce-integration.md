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

## Testing Checklist

- [ ] Product appears on `/products` page
- [ ] Workshop appears on `/workshops` page
- [ ] Workshop detail page loads (`/workshops/[slug]`)
- [ ] "Buy" button initiates Stripe checkout
- [ ] Purchase webhook completes successfully
- [ ] Purchase appears in user's purchased products
- [ ] User can access purchased workshop content
