---
title: What is a Lesson?
description: A Lesson Resource is a collection of content that is designed to be taught to a student.
---

A Lesson Resource is a collection of content that is designed to be taught to a student.

{% callout title="You should know!" %}
Check out this article [Information Architecture for Courses and Educational Products](https://badass.dev/information-architecture)
{% /callout %}

## What is a Lesson Resource?

The lesson is the atomic unit of a learning module, often grouped into sections. 

A lesson resource is a collection of content resources that is designed to be taught to a student. A lesson can be a video, a solution (itself a lesson), an article, a quiz, a code challenge, or any combination of these.

All lesson resources have the following properties:

* **title**: this is the presented title of the lesson which describes to the learner what they will learn. Often the title is good for SEO as will.
* **description**: this is a short description of the lesson. It is used in the lesson list and in the lesson page.
* **slug**: this is the unique identifier for the lesson. It is used in the URL and in the lesson list.
* **summary**: this is a short summary of the lesson. It is "tweet sized" and is used as metadata for social media.
* **body**: this is the main text content of the lesson. It is a markdown file that is rendered in the lesson page.

We refer to the base as a `LessonResource`.

When you add media to the lesson it is an extension of the base `LessonResource` and will often be specific to the context of the module. For example, a video lesson will have sort of a `video_url` property that is specific to a video.

### VideoResource

In the Skill Stack system, a video is a `VideoResource` which is has a direct reference to the video media on mux, the transcript, and the captions/subtitles.

A `VideoResource` is immutable reference to the content of a video! We aren't adding body text or any subjective/editorial content within a video resource. The video url is the source of truth for the video content and the SRT (subtitle file) and transcript are a 1:1 textual reference to the video itself.

### The lesson body

The body of a lesson is translated from the resources that compose the lesson to make it something that can be read by learners and provides a multi-modal experience. 

With a video lesson, this means we will often process machine created transcripts to create a lesson body that can in many ways be used as a replacement for the video itself.

With other lesson types the body might wholly comprise the content of the lesson!

At the very least it is a strong companion to the video and enhances the multi-modal learning experience.








