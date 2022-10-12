import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'

export type Podcast = {
  title: string
  slug: string
  description: string
  seasons: PodcastSeason[]
  coverArtUrl: string
}

export type PodcastSeason = {
  title: string
  slug: string
  description: string
  podcast: Podcast
  episodes: PodcastEpisode[]
  coverArtUrl: string
}

export type PodcastEpisode = {
  title: string
  slug: string
  description: string
  summary: string
  simplecastId: string
  coverArtUrl: string
  transcript: string
  duration: string
  _updatedAt: string
  publishedAt: string
}

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
    'coverArtUrl': coverArt.asset->url
  }`,
    {
      slug: podcastEpisodeSlug,
    },
  )
}
