import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'
import z from 'zod'

export const PodcastEpisodeSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  summary: z.string(),
  simplecastId: z.string(),
  coverArtUrl: z.string(),
  transcript: z.string(),
  duration: z.string(),
  _updatedAt: z.string(),
  publishedAt: z.string(),
  content: z.any().array().nullable().optional(),
})

export type PodcastEpisode = z.infer<typeof PodcastEpisodeSchema>

export const PodcastSeasonSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  episodes: z.array(PodcastEpisodeSchema),
  coverArtUrl: z.string(),
  content: z.any().array().nullable().optional(),
})

export type PodcastSeason = z.infer<typeof PodcastSeasonSchema>

export const PodcastSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  seasons: z.array(PodcastSeasonSchema),
  coverArtUrl: z.string(),
})

export type Podcast = z.infer<typeof PodcastSchema>

export async function getAllPodcastSeasons() {
  return sanityClient.fetch(
    groq`*[_type == "podcastSeason"][]{
    title,
    "slug": slug.current,
    description,
    'episodes': episodes[]->{
      _updatedAt,
      'publishedAt': schedule.publish,
      title,
      description,
      duration,
      summary,
      'slug': slug.current,
      simplecastId,
      'coverArtUrl': coverArt.asset->url
    }
  }`,
  )
}

export async function getPodcastSeason(podcastSeasonSlug: string) {
  return sanityClient.fetch(
    groq`*[_type == "podcastSeason" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    description,
    content,
    'episodes': episodes[]->{
      _updatedAt,
      title,
      description,
      duration,
      'slug': slug.current,
      simplecastId,
      'coverArtUrl': coverArt.asset->url
    }
  }`,
    {
      slug: podcastSeasonSlug,
    },
  )
}

export async function getPodcastEpisode(podcastEpisodeSlug: string) {
  return await sanityClient.fetch(
    groq`*[_type == "podcastEpisode" && slug.current == $slug][0]{
    title,
    description,
    duration,
    'slug': slug.current,
    simplecastId,
    transcript,
    content,
    'coverArtUrl': coverArt.asset->url
  }`,
    {
      slug: podcastEpisodeSlug,
    },
  )
}
