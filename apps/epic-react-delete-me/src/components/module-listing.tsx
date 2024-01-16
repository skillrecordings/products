import {ModuleSchema} from 'lib/modules'
import {z} from 'zod'
import {LessonListing} from './lesson-listing'

export const ModuleListing = ({
  module,
}: {
  module: z.infer<typeof ModuleSchema>
}) => {
  return (
    <div className="mb-4 text-lg font-semibold">
      <a className="font-semibold underline" href={module.slug.current}>
        {module.title}
      </a>
      <ul className="mt-2 list-inside list-disc pl-4">
        {module.resources.map((resource) => {
          if (resource._type === 'section') {
            // asserting that this should be defined in this case
            const sectionResources = resource.resources as NonNullable<
              typeof resource.resources
            >

            return (
              <li className="mt-1 font-medium">
                {resource.title}
                <ul className="mt-1 list-inside list-decimal pl-6">
                  {sectionResources.map((lesson) => {
                    return (
                      <LessonListing
                        lesson={lesson}
                        moduleSlug={module.slug.current}
                      />
                    )
                  })}
                </ul>
              </li>
            )
          } else {
            return (
              <LessonListing
                lesson={resource}
                moduleSlug={module.slug.current}
              />
            )
          }
        })}
      </ul>
    </div>
  )
}
