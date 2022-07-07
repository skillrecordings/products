export const workshops = [
  {
    title: 'Foundations of Accessibility',
    image: {
      url: 'https://res.cloudinary.com/testing-accessibility/image/upload/v1655221557/00-foundations-of-accessibility/01-setting-the-stage-for-testing-accessibility/illustration-setting-the-stage-for-testing-accessibility_2x_o36van_igu0tf.png',
      alt: 'an empty wheelchair by the river in front of vast mountains',
    },
    description:
      'An introduction for technologists of all roles, skills, and experience levels. Learn the definitions and motivations for accessibility, including making a business case in the global market. You’ll also dive into the essential components of accessibility, setting the scene for the following workshops in the series.',
  },
  {
    title: 'Design Thinking and People Skills for Accessibility',
    image: {
      url: 'https://res.cloudinary.com/testing-accessibility/image/upload/v1655221527/design-and-people-skills/design-and-people-skills-module-illustrations_2x_mhezar.png',
      alt: 'a wooden bridge that is half-sketched and half-finished',
    },
    description:
      'Ensure the application designs you implement are usable for all by learning how to watch for potential issues before they happen and tactfully discuss alternative approaches. There is also guidance on how to create and adopt a culture of accessibility in your organization.',
    topics: [
      'Accessibility as User Experience',
      'Collaboration on Designs and Prototyping',
      'Animation and Design Impacts on Accessibility',
      'Finding Answers to Accessibility Issues',
      'Creating a Culture of Accessibility',
    ],
  },
  {
    title: 'Manual Accessibility Testing',
    image: {
      url: 'https://res.cloudinary.com/testing-accessibility/image/upload/v1655221697/01-manual-testing/manual-testing-module-illustration_w1olx7_aps7q0.png',
      alt: 'a wooden trail sign pointing at manual testing trail',
    },
    description:
      "From keyboard testing to browser DevTools and web extensions, manual accessibility testing is more powerful than ever. In the Manual Testing workshop module, you'll learn recommended testing steps and accessibility requirements used by the pros, so they become second nature. You'll practice testing the CampSpots app and fixing the issues you find.",
    topics: [
      'Keyboard Testing',
      'DevTools Testing',
      'Accessibility Browser Extensions',
      'Zoom Testing',
      'Screen Reader Testing',
      'Issue Remediation',
    ],
  },
  {
    title: 'Semantic Markup with HTML and ARIA',
    image: {
      url: 'https://res.cloudinary.com/testing-accessibility/image/upload/v1656013871/04-semantics-and-aria/illustration-semantics-and-aria_2x_ty5o3q.png',
      alt: "A paper map with two mountains standing out, the bigger one has a floating label of H1 and the smaller one H2. There's a small camp by the lake in front of the mountains.",
    },
    description:
      'Accessibility best practices can be baked in from the start. Learn my approach to plumbing accessibility information into sites by following along as we implement accessible parts of the CampSpots application from scratch. This workshop includes features specific to React applications but is applicable to any web application.',
    topics: [
      'Headings and Landmarks',
      'The “When” and “How” of ARIA',
      'Accessible naming',
      'Programmatic Accessibility Information',
      'The AOM (Accessibility Object Model)',
      'React Hooks and Portals',
    ],
  },
  {
    title: 'Coding Accessible Interactions and Mechanics',
    image: {
      url: 'https://res.cloudinary.com/testing-accessibility/image/upload/v1657206113/03-interactions-and-mechanics/illustration-interactions-and-mechanics_2x_spduit.png',
      alt: 'a hand holding a radio transmitter in front of a vast mountain',
    },
    description:
      'Continuing with building for the CampSpots application, but this time with a focus on ensuring interactive components are usable by keyboard and screen reader users. You’ll also practice building accessible versions of common components from scratch using React.',
    topics: [
      'Accessible navigation and skip links',
      'CSS visibility and impact on assistive technologies',
      'Adding ergonomic keyboard interactions to a date picker component',
      'Focus management with key events',
      'Announcements with assistive technology',
      'Advanced scripting with ARIA',
      'React Hooks and Refs',
    ],
  },
  {
    title: 'Automated Accessibility Testing',
    image: {
      url: 'https://res.cloudinary.com/testing-accessibility/image/upload/v1655221590/02-automated-testing/illustration-automated-testing_2x_lamrri_qdxdnz.png',
      alt: 'cableway cabin with accessibility tech logo stickers',
    },
    description: `
      Writing reliable automated tests that assert things like keyboard operability, ARIA states, and other common accessibility requirements we can bake quality into your applications and potentially help you sleep better at night.

      Learn about the many automated tools at your disposal and their strengths and weaknesses to gain an understanding of how to configure accessibility tests that serve your team’s needs.
      `,
    topics: [
      'Storybook',
      'Jest',
      'Cypress and Cypress Component Testing',
      'Automated Browser-based Snapshot Testing',
      'Continuous Integration',
    ],
  },
]
