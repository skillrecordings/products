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
  simplecastUrl: string
  coverArtUrl: string
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
    'episodes': *[_type == "podcastEpisode" && season[0]->slug.current == ^.slug.current][]{
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
    'episodes': *[_type == "podcastEpisode" && season[0]->slug.current == ^.slug.current][]{
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
    'slug': slug.current,
    simplecastId,
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
