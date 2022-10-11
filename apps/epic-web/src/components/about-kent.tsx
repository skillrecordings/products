import React from 'react'

const AboutKent = () => {
  return (
    <section className="flex md:flex-row flex-col px-5 items-center justify-center w-full max-w-4xl mx-auto gap-16">
      <img
        src="/kent-c-dodds.png"
        width={200}
        height={200}
        className="rounded-full bg-black/50"
        alt="Kent C. Dodds"
      />
      <div className="prose lg:prose-lg prose-a:underline prose-a:decoration-white/30 prose-a:underline-offset-2 hover:prose-a:decoration-brand prose-a:transition">
        <p>
          Kent C. Dodds is a world renowned speaker, teacher, and trainer and
          he&#39;s actively involved in the{' '}
          <a
            href="https://github.com/kentcdodds"
            rel="noopener noreferrer"
            target="_blank"
          >
            open source community
          </a>{' '}
          as a maintainer and contributor of hundreds of popular npm packages.
          He is the creator of{' '}
          <a
            href="https://epicreact.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            EpicReact.Dev
          </a>{' '}
          and{' '}
          <a
            href="https://testingjavascript.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            TestingJavaScript.com
          </a>
          . He&#39;s an instructor on{' '}
          <a
            href="https://egghead.io/instructors/kentcdodds"
            rel="noopener noreferrer"
            target="_blank"
          >
            egghead.io
          </a>{' '}
          and{' '}
          <a
            href="https://frontendmasters.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Frontend Masters
          </a>
          . He&#39;s also a{' '}
          <a
            href="https://developers.google.com/community/experts/directory/profile/profile-kent-c-dodds"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Developer Expert
          </a>
          . Kent is happily married and the father of four kids. He likes his
          family, code, JavaScript, and Remix.
        </p>
      </div>
    </section>
  )
}

export default AboutKent
