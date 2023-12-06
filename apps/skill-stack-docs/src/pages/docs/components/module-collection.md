---
title: Module Collection
description: Displays an interactive list of sections and lessons within a module along with visual indication of user progress.
---

Displays an interactive list of sections and lessons within a module along with visual indication of user progress.

{% repl example="ModuleCollection" /%}

## Features

- Full keyboard navigation
- User progress indication
- Supports all modules with or without sections
- Renders sections as accordions
- Treats empty sections as "coming soon"
- Accommodates single-section modules
- Displays module metadata

## Installation

This component is part of `@skillrecordings/skill-lesson` package.

```bash
pnpm add @skillrecordings/skill-lesson
```

## Anatomy

```tsx
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
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
    {/* Used if module has either none or single section so they can be styled differently */}
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

Contains information about section or lesson count and acts as toggle to quickly open/close all sections at once.

### Sections

A list of `Section`s.

### Section

Accordion with nested `Lessons`.

### Lessons

A list of `Lesson`s.

### Lesson

Link with lesson title.
