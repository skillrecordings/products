---
title: MDX Components Documentation
description: This page documents a set of versatile MDX components. From embedding tweets, videos, and YouTube content to showcasing testimonials, our components offer seamless integration and enhanced user engagement.
---

## Tweet Component

The `Tweet` component is used to embed a tweet within your content. It accepts the following props:

| Prop   | Type   | Description                           |
| ------ | ------ | ------------------------------------- |
| text   | string | The content of the tweet.             |
| url    | string | The URL of the tweet.                 |
| author | object | Information about the tweet's author. |

### Example Usage

```jsx
<Tweet
  text="Excited about the new features in our latest release! 🚀 #ProductUpdate"
  url="https://twitter.com/exampleuser/status/123456789"
  author={{
    name: 'John Doe',
    handle: 'exampleuser',
    avatar: '/path/to/avatar.jpg',
  }}
/>
```

## Video Component

The `Video` component is used to embed a local video within your content. It accepts the following props:

| Prop  | Type              | Description                |
| ----- | ----------------- | -------------------------- |
| url   | string            | The URL of the video file. |
| title | string (opiotnal) | The title of the video.    |

### Example Usage

```jsx
<Video url="/path/to/video.mp4" title="Introduction to Our Product" />
```

## YouTube Component

The `YouTube` component allows you to embed YouTube videos in your content. It accepts the following prop:

| Prop    | Type   | Description           |
| ------- | ------ | --------------------- |
| videoId | string | The YouTube video ID. |

### Example Usage

```jsx
<YouTube videoId="your-youtube-video-id" />
```

## MuxVideo Component

The `MuxVideo` component is designed to embed Mux-hosted videos. It accepts the following prop:

| Prop       | Type   | Description                |
| ---------- | ------ | -------------------------- |
| playbackId | string | The Mux video playback ID. |

### Example Usage

```jsx
<MuxVideo playbackId="your-mux-video-playback-id" />
```

## Testimonial Component

The `Testimonial` component is used to display customer testimonials. It accepts the following prop:

| Prop         | Type              | Description                                 |
| ------------ | ----------------- | ------------------------------------------- |
| children     | node              | The content of the testimonial.             |
| author       | object            | Information about the testimonial's author. |
| author.name  | string            | The name of the testimonial's author.       |
| author.image | string (optional) | The image URL of the testimonial's author.  |

### Example Usage

```jsx
<Testimonial
  author={{
    name: 'Jane Doe',
    image: '/path/to/author-image.jpg',
  }}
>
  "This product changed my life! Highly recommended."
</Testimonial>
```
