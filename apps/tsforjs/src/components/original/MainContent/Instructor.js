import React from 'react'

import {
  InstructorPic,
  InstructorContainer,
  TaughtBy,
  ShaundaiNameLink,
  AboutShaundai,
} from '../styles'

export const Instructor = () => {
  return (
    <>
      <InstructorContainer>
        <a href="https://www.twitter.com/shaundai">
          <InstructorPic
            width={80}
            height={80}
            src="https://res.cloudinary.com/tsforjs/image/upload/c_fill,dpr_2.0,fl_force_dpi,h_120,w_120/v1658263809/website/shaundaipic_caejti.jpg"
            alt="Shaundai Person headshot"
          />
        </a>
        <TaughtBy>
          Course Instructor:{' '}
          <ShaundaiNameLink href="https://www.twitter.com/shaundai">
            Shaundai Person
          </ShaundaiNameLink>
        </TaughtBy>
      </InstructorContainer>
      <AboutShaundai>
        When Shaundai Person started as a Software Engineer, she found herself
        part of an engineering team responsible for refactoring a huge legacy
        codebase to TypeScript. In this course she compiles her learnings about
        getting started with TypeScript (while helping you avoid making the
        mistakes she made!).
        <br />
        <br />
        Shaundai is a frontend developer, technical writer, and co-organizer of{' '}
        <a href="https://www.reactrobins.com/">React Robins</a>.
      </AboutShaundai>
    </>
  )
}
