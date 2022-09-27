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
  links: PodcastLink[]
  duration: string
  _updatedAt: string
  publishedAt: string
}

export type PodcastLink = {
  URL: string
  title: string
  excerpt: string
}

export async function getPodcast(podcastSlug: string) {
  return await sanityClient.fetch(
    groq`*[_type == "podcast" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  description,
  'coverArtUrl': coverArt.asset->url,
  'seasons': *[_type == "podcastSeason" && podcast[0]->slug.current == $slug][]{
    title,
    "slug": slug.current,
    description,
    'podcast': podcast[0]->{
      title,
      "slug": slug.current,
      description
    },
    'coverArtUrl': coverArt.asset->url,
    'episodes': episodes[]->{
     'publishedAt': schedule.publish,
      title,
      description,
      duration,
      summary,
      'slug': slug.current,
      simplecastId,
      'coverArtUrl': coverArt.asset->url
    }
  }
 }`,
    {
      slug: podcastSlug,
    },
  )
}

export async function getAllPodcastSeasons() {
  return sanityClient.fetch(
    groq`*[_type == "podcastSeason"][]{
    title,
    "slug": slug.current,
    description,
    'podcast': podcast[0]->{
      title,
      "slug": slug.current,
      description,
      'coverArtUrl': coverArt.asset->url
    },
    'coverArtUrl': coverArt.asset->url,
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
    'podcast': podcast[0]->{
      title,
      "slug": slug.current,
      description,
      'coverArtUrl': coverArt.asset->url
    },
    'coverArtUrl': coverArt.asset->url,
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
    summary,
    'publishedAt': schedule.publish,
    'slug': slug.current,
    simplecastId,
    'links': linkList[] {
      URL,
      title,
      excerpt
    },
    transcript,
    'season': season[0]->{
      title,
      "slug": slug.current,
      description,
      'coverArtUrl': coverArt.asset->url
    },
    'coverArtUrl': coverArt.asset->url
  }`,
    {
      slug: podcastEpisodeSlug,
    },
  )
}
