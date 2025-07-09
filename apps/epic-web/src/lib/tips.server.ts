import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {pickBy} from 'lodash'
import * as mysql from 'mysql2/promise'
import {
  Tip,
  TipSchema,
  TipsSchema,
  TipPostSchema,
  transformTipPost,
} from './tips'
import slugify from '@sindresorhus/slugify'
import {prisma} from '@skillrecordings/database'
import type {Contributor} from './contributors'
import {ContributorSchema} from './contributors'

// Establish connection options for the course-builder database (same as articles)
const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

// Helper to build a Contributor object from name / image and ids
const buildContributor = ({
  id,
  name,
  image,
}: {
  id: string
  name: string | null
  image: string | null
}): Contributor => {
  return {
    _id: id,
    _type: 'contributor',
    _updatedAt: new Date().toISOString(),
    _createdAt: new Date().toISOString(),
    name: name || 'Unknown',
    slug: slugify(name || 'unknown'),
    bio: null,
    links: null,
    picture: image
      ? {
          url: image,
          alt: name || 'Contributor',
        }
      : null,
  }
}

// Helper to fetch contributor document from Sanity by userId
const fetchContributorFromSanityByUserId = async (
  userId: string,
): Promise<Contributor | null> => {
  try {
    const contributor = await sanityClient.fetch(
      groq`*[_type == "contributor" && userId == $userId][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        name,
        "slug": slug.current,
        bio,
        links[] {
          url, label
        },
        picture {
          "url": asset->url,
          alt
        }
      }`,
      {userId},
    )
    if (contributor && contributor._id) {
      return ContributorSchema.parse(contributor)
    }
  } catch (err) {
    console.error('Error fetching contributor from Sanity', err)
  }
  return null
}

export const getAllTips = async (onlyPublished = true): Promise<Tip[]> => {
  // --------------------------
  // 1. Fetch tips from database
  // --------------------------
  const connection = await mysql.createConnection(access)

  const [rows] = await connection.execute(
    `
    SELECT
      tip.*,
      (
        SELECT
          resource.id
        FROM
          zEW_ContentResourceResource crr
        JOIN
          zEW_ContentResource resource ON crr.resourceId = resource.id
        WHERE
          crr.resourceOfId = tip.id AND JSON_EXTRACT(resource.fields, '$.muxPlaybackId') IS NOT NULL
        LIMIT 1
      ) AS videoResourceId,
      (
        SELECT
          resource.fields
        FROM
          zEW_ContentResourceResource crr
        JOIN
          zEW_ContentResource resource ON crr.resourceId = resource.id
        WHERE
          crr.resourceOfId = tip.id AND JSON_EXTRACT(resource.fields, '$.muxPlaybackId') IS NOT NULL
        LIMIT 1
      ) AS videoFields
    FROM
      zEW_ContentResource tip
    WHERE
      JSON_EXTRACT(tip.fields, "$.postType") = 'tip'
  `,
  )

  const tipPosts = z.array(TipPostSchema.passthrough()).parse(rows)

  const instructorsMap: Record<string, Contributor | null> = {}
  for (const post of tipPosts) {
    const userLookupId = post.createdById ?? null
    const membershipLookupId = post.createdByOrganizationMembershipId ?? null
    const instructorKey = userLookupId ?? membershipLookupId

    if (instructorKey && !instructorsMap[instructorKey]) {
      try {
        // 0. Try to get contributor directly from Sanity using userId
        if (userLookupId) {
          const directContributor = await fetchContributorFromSanityByUserId(
            userLookupId,
          )
          if (directContributor) {
            instructorsMap[instructorKey] = directContributor
            continue
          }
        }

        let cbUser: any = null
        if (userLookupId) {
          // fetch user directly
          const [userRows] = await connection.execute(
            'SELECT * FROM zEW_User WHERE id = ? LIMIT 1',
            [userLookupId],
          )
          if (Array.isArray(userRows) && userRows.length > 0) {
            cbUser = userRows[0]
          }
        }

        // If not found by direct id but we have organization membership id, resolve through membership table
        if (!cbUser && membershipLookupId) {
          const [membershipRows] = await connection.execute(
            `SELECT userId FROM zEW_OrganizationMembership WHERE id = ? LIMIT 1`,
            [membershipLookupId],
          )
          if (Array.isArray(membershipRows) && membershipRows.length > 0) {
            const {userId} = membershipRows[0] as any
            if (userId) {
              const [userRows] = await connection.execute(
                'SELECT * FROM zEW_User WHERE id = ? LIMIT 1',
                [userId],
              )
              if (Array.isArray(userRows) && userRows.length > 0) {
                cbUser = userRows[0]
              }
            }
          }
        }

        if (cbUser) {
          // try to find matching user in product DB
          let productUser = null
          if (cbUser.email) {
            productUser = await prisma.user.findUnique({
              where: {email: cbUser.email as string},
            })
          }

          let contributor: Contributor | null = null
          if (productUser?.id) {
            contributor = await fetchContributorFromSanityByUserId(
              productUser.id,
            )
          }

          if (!contributor) {
            contributor = buildContributor({
              id: productUser?.id || cbUser.id,
              name: productUser?.name || cbUser.name || cbUser.fullName || null,
              image:
                productUser?.image ||
                cbUser.avatar_url ||
                cbUser.avatarUrl ||
                null,
            })
          }

          if (instructorKey) instructorsMap[instructorKey] = contributor
        } else {
          if (instructorKey) instructorsMap[instructorKey] = null
        }
      } catch (error) {
        console.error('Error fetching instructor for tip', error)
        if (instructorKey) instructorsMap[instructorKey] = null
      }
    }
  }

  const transformedTipPosts = tipPosts.map((post) => {
    const transformed = transformTipPost(post)
    const key = post.createdById ?? post.createdByOrganizationMembershipId
    if (key && instructorsMap[key]) {
      transformed.instructor = instructorsMap[key]
    }
    return transformed
  })

  // Close the connection as soon as we're done
  await connection.end()

  // -------------------------
  // 2. Fetch tips from Sanity
  // -------------------------
  const sanityTipsRaw = await sanityClient.fetch(groq`*[_type == "tip" ${
    onlyPublished ? `&& state == "published"` : ''
  }] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        description,
        summary,
        body,
        "instructor": contributors[@.role == 'instructor'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
        },
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId
  }`)

  const sanityTips = TipsSchema.parse(sanityTipsRaw)

  // -------------------------
  // 3. Merge and sort results
  // -------------------------
  let allTips: Tip[] = [...sanityTips, ...transformedTipPosts]

  if (onlyPublished) {
    allTips = allTips.filter((tip) => tip.state === 'published')
  }

  allTips.sort(
    (a, b) =>
      new Date(b._createdAt || '').getTime() -
      new Date(a._createdAt || '').getTime(),
  )

  return TipsSchema.parse(allTips)
}

export const getTip = async (slug: string): Promise<Tip> => {
  // --------------------------
  // 1. Try to fetch from DB
  // --------------------------
  const connection = await mysql.createConnection(access)

  const [rows] = await connection.execute(
    `
    SELECT
      tip.*,
      (
        SELECT
          resource.id
        FROM
          zEW_ContentResourceResource crr
        JOIN
          zEW_ContentResource resource ON crr.resourceId = resource.id
        WHERE
          crr.resourceOfId = tip.id AND JSON_EXTRACT(resource.fields, '$.muxPlaybackId') IS NOT NULL
        LIMIT 1
      ) AS videoResourceId,
      (
        SELECT
          resource.fields
        FROM
          zEW_ContentResourceResource crr
        JOIN
          zEW_ContentResource resource ON crr.resourceId = resource.id
        WHERE
          crr.resourceOfId = tip.id AND JSON_EXTRACT(resource.fields, '$.muxPlaybackId') IS NOT NULL
        LIMIT 1
      ) AS videoFields
    FROM
      zEW_ContentResource tip
    WHERE
      JSON_EXTRACT(tip.fields, "$.postType") = 'tip' AND JSON_EXTRACT(tip.fields, "$.slug") = ?
  `,
    [slug],
  )

  const tipPostsParsed = z.array(TipPostSchema.passthrough()).safeParse(rows)

  if (tipPostsParsed.success && tipPostsParsed.data.length > 0) {
    const dbTip = transformTipPost(tipPostsParsed.data[0])
    try {
      const keyId = tipPostsParsed.data[0].createdById || null
      if (keyId) {
        const directContributor = await fetchContributorFromSanityByUserId(
          keyId,
        )
        if (directContributor) {
          dbTip.instructor = directContributor
          await connection.end()
          return dbTip
        }
      }

      let cbUser: any = null
      if (keyId) {
        const [userRows] = await connection.execute(
          'SELECT * FROM zEW_User WHERE id = ? LIMIT 1',
          [keyId],
        )
        if (Array.isArray(userRows) && userRows.length > 0) {
          cbUser = userRows[0]
        }
      }
      const membershipId =
        tipPostsParsed.data[0].createdByOrganizationMembershipId || null
      if (!cbUser && membershipId) {
        const [membershipRows] = await connection.execute(
          `SELECT userId FROM zEW_OrganizationMembership WHERE id = ? LIMIT 1`,
          [membershipId],
        )
        if (Array.isArray(membershipRows) && membershipRows.length > 0) {
          const {userId} = membershipRows[0] as any
          const [userRows] = await connection.execute(
            'SELECT * FROM zEW_User WHERE id = ? LIMIT 1',
            [userId],
          )
          if (Array.isArray(userRows) && userRows.length > 0) {
            cbUser = userRows[0]
          }
        }
      }
      if (cbUser) {
        let productUser = null
        if (cbUser.email) {
          productUser = await prisma.user.findUnique({
            where: {email: cbUser.email as string},
          })
        }
        let contributor: Contributor | null = null
        if (productUser?.id) {
          contributor = await fetchContributorFromSanityByUserId(productUser.id)
        }
        if (!contributor) {
          contributor = buildContributor({
            id: productUser?.id || cbUser.id,
            name: productUser?.name || cbUser.name || cbUser.fullName || null,
            image:
              productUser?.image ||
              cbUser.avatar_url ||
              cbUser.avatarUrl ||
              null,
          })
        }
        dbTip.instructor = contributor
      }
    } catch (error) {
      console.error('Error fetching instructor for tip', error)
    }
    await connection.end()
    return dbTip
  }

  await connection.end()

  // --------------------------
  // 2. Fallback to Sanity
  // --------------------------
  const tip = await sanityClient.fetch(
    groq`*[_type == "tip" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        description,
        summary,
        body,
        "instructor": contributors[@.role == 'instructor'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
        },
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "videoPosterUrl": resources[@->._type == 'videoResource'][0]->poster,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "legacyTranscript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "transcript": resources[@->._type == 'videoResource'][0]-> transcript.text,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId
    }`,
    {slug},
  )

  if (tip && tip.legacyTranscript && !tip.transcript) {
    tip.transcript = tip.legacyTranscript
  }

  return TipSchema.parse(pickBy(tip))
}

export {TipSchema, TipsSchema}
export type {Tip}
