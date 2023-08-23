---
title: Module Collection
description: Displays an interactive list of sections and lessons within a module along with visual indication of user progress.
---

Displays an interactive list of sections and lessons within a module along with visual indication of user progress.

## Features

- Full keyboard navigation
- User progress indication
- Supports all modules with or without sections
- Treats empty sections as "coming soon"
- Accommodates single-section modules

## Installation

This component is part of `@skillrecordings/ui` package.

```bash
pnpm add @skillrecordings/ui
```

## Anatomy

```tsx
import * as Collection from '@skillrecordings/ui/module/collection'
;() => (
  <Collection.Root module={workshop}>
    <Collection.Metadata />
    <Collection.Sections>
      <Collection.Section>
        <Collection.Lessons>
          <Collection.Lesson />
        </Collection.Lessons>
      </Collection.Section>
    </Collection.Sections>
    <Collection.Lessons>
      <Collection.Lesson />
    </Collection.Lessons>
  </Collection.Root>
)
```

## API Reference

### Root

Contains all the parts of a collection.

| Prop   | Type   | Default |
| ------ | ------ | ------- |
| module | Module | —       |

### Metadata

Contains information about section or lesson count and acts as toggle to open/close all of sections at once.

### Sections

Contains `Section`.

### Section

Contains `Lessons`.

### Lessons

Contains `Lesson`.
