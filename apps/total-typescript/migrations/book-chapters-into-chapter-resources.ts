// TODO: Add a check for if chapterResource already exists. If it does, skip creating and assigning it.

import {getCliClient} from 'sanity/cli'
import groq from 'groq'
import slugify from '@sindresorhus/slugify'

const client = getCliClient()

const DRY_RUN = false

interface Chapter {
  _id: string
  _rev: string
  title: string
  body: string
}

interface ChapterResource {
  _type: 'chapterResource'
  body: string
  title: string
  chapter: {
    _type: 'reference'
    _ref: string
  }
  state: 'published' | 'draft'
  slug: {
    _type: 'slug'
    current: string
  }
}

const fetchChapters = async (): Promise<Chapter[]> => {
  return client.fetch(
    groq`*[_type == 'module' && moduleType == 'chapter']{_id, _rev, title, body}`,
  )
}

const parseSectionsByH2 = (
  data: string,
): {heading: string; content: string}[] => {
  const sections = data.split(/(?=^##\s)/gm)
  return sections.map((section) => {
    const match = section.match(/^##\s(.+)\n/)
    const heading = match ? match[1] : 'Intro'
    const content = section.replace(/^##\s.+\n/, '').trim()
    return {heading, content}
  })
}

const createChapterResource = async (
  section: {heading: string; content: string},
  chapterId: string,
  chapterTitle: string,
): Promise<string> => {
  const slug = slugify(section.heading, {
    decamelize: false,
    customReplacements: [
      ['&', ''],
      ['.', ''],
    ],
  })
  const title =
    section.heading === 'Intro' ? `Intro to ${chapterTitle}` : section.heading

  const newResource: ChapterResource = {
    _type: 'chapterResource',
    body: section.content,
    title,
    state: 'published',
    chapter: {
      _type: 'reference',
      _ref: chapterId,
    },
    slug: {
      _type: 'slug',
      current: slug === 'intro' ? `intro-to-${slugify(chapterTitle)}` : slug,
    },
  }

  if (DRY_RUN) {
    console.log('creating chapter resource: ', newResource)
    return newResource.title
  } else {
    const createdResource = await client.create(newResource)
    return createdResource._id
  }
}

const assignResourcesToChapter = async (
  chapterId: string,
  resourceIds: string[],
): Promise<void> => {
  await client
    .patch(chapterId)
    .set({resources: resourceIds.map((id) => ({_type: 'reference', _ref: id}))})
    .commit()
}

const processChapters = async () => {
  try {
    const chapters = await fetchChapters()

    for (const chapter of chapters) {
      const sections = parseSectionsByH2(chapter.body)

      // Check if sections are not empty
      if (sections.length === 0) {
        console.warn(`Chapter ${chapter._id} has no sections.`)
        continue
      }

      const resourceIds = await Promise.all(
        sections.map((section) =>
          createChapterResource(section, chapter._id, chapter.title),
        ),
      )

      if (DRY_RUN) {
        console.log(
          'Assigning resources to chapter: ',
          chapter._id,
          resourceIds,
        )
      } else {
        await assignResourcesToChapter(chapter._id, resourceIds)
      }
    }
  } catch (error) {
    console.error('Error processing chapters:', error)
  }
}

processChapters().catch(console.error)
