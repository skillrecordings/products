# Module Collection

Displays an interactive list of sections and lessons within a module, allowing seamless navigation and provides visual indication of user progress.

## Notes

- feature: if module only has a single (1) section, we dont render it as accordion
- example: how to display skeleton loaders when user progress is loading
- important: has to be wrapped in `ModuleProgressProvider` (`<ModuleProgressProvider moduleSlug={tutorial.slug.current}>`)
