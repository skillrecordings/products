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

// Establish connection options for the course-builder database (same as articles)
const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
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
  const transformedTipPosts = tipPosts.map(transformTipPost)

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
    await connection.end()
    return transformTipPost(tipPostsParsed.data[0])
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
