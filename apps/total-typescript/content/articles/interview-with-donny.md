# Rewriting TypeScript in Rust? You'd have to be...

For the last few months, Donny (or [dudykr](https://github.com/dudykr) on GitHub) has been walking a long, lonely road. The author of [swc](https://swc.rs), a native-speed replacement for [Babel](https://babeljs.io/), has his eyes on another goal: rewriting TypeScript in Rust.

[`stc`](https://github.com/dudykr/stc) is his attempt. It's a drop-in replacement for `tsc` supporting "all typing and type inference", including all the complexity of generics, conditional types and template literals.

## An Impossible Challenge

In Donny's words, "the official TypeScript type checker, `tsc`, is very slow". This means in VSCode, the red lines and warnings take a long time to update on large projects.

The main problem is that `tsc` is itself "written in TypeScript - which does not support parallel processing". Rewriting `tsc` in a native language, like Rust, could speed it up immensely.

<!-- TODO - wait for followup question for a quote here -->

But there's a problem. Rewriting a library like TypeScript is extremely challenging. First, "absence of \[a\] specification" for TypeScript's behaviour. Donny's had to infer TypeScript's behaviour mostly test cases alone.

The pure size of TypeScript is daunting. It's had ten years to iterate, grow and add features. A glance at TypeScript's [2.6MB `checker.ts` file](https://github.com/microsoft/TypeScript/blob/main/src/compiler/checker.ts) would be enough to frighten most away.

TypeScript's velocity is extraordinary. In Donny's words, it's "way too fast". It's one of the most active open-source projects in the world. For a single developer to keep up with a huge team seems impossible.

But Donny is confident. "I think there is no one else on the planet who can and will do it. \[...\] Many people do not have enough energy to investigate such long-term projects."

## Is Open Source Working?

But the real killer is the state of open source. Donny doesn't know if his work will be rewarded. But he's seen it happen before. His work on swc landed him a job at Vercel.

"Vercel wanted to make [Next.js](https://nextjs.org/) fast, and swc was a perfect fit for them". Vercel are now the long-term stewards of swc - which is now an integral part of their bundler, [Turbopack](https://turbo.build/pack).

Donny sees problems with the sustainability of open source. "I'm sort of a lucky case. Many open-source maintainers are using enormous amounts of their own time without enough reward."

For Donny, the only source of sustainability is sponsorship from companies. "Honestly, I'm still not sure if open-source is sustainable without companies like Vercel."

## Community Counts

But despite the possibility his work might not be rewarded, Donny persists. The project is "too essential for the web development ecosystem".

It takes its toll. "Although it's quite fun, it's super exhausting. \[...\] I stopped working on it several times."

But community contributions help. Donny is working on `stc` alone, apart from "some short-time contributors". Financial backers help morale, too. The best place to contribute is `stc`'s [Open Collective](https://opencollective.com/stc).

## The Future of `stc`

To me, the project seems precarious. It's an enormous amount to ask from a single developer, even one with extraordinary abilities like Donny. TypeScript's velocity means the project is a long-term commitment.

Financial contributions could help keep the project sustainable. But a ["Tragedy of the Commons"](https://en.wikipedia.org/wiki/Tragedy_of_the_commons) seems more likely - where the users of the project don't contribute back to its development.

Right now, `stc` is pre-alpha. Donny is working his way towards reducing erroneous errors, and getting feature-complete with TypeScript.

Personally, I can think of few projects more deserving of your support. You can:

- [Contribute to the Open Collective](https://opencollective.com/stc)
- [Get involved on GitHub](https://github.com/dudykr)

# Full Interview

**Matt**: Let's start with the basics - what is stc? What problem is it trying to solve?

**Donny**: `stc` stands for a Speedy TypeScript Type Checker. The goal is to improve DX by reducing build time and iteration time.

The official TypeScript type checker, `tsc`, is very slow because it's written in TypeScript - which does not support parallel processing.

**M**: Why did you decide to start working on `stc`? Why you? Why now?

**D**: I started it because I wanted to improve [swc](https://swc.rs/). It was actually a subproject of swc at the start.

I think there is no one else on the planet who can and will do it. I mean, it requires way too much effort. Many people do not have enough energy to investigate such long-term projects. But I have. I have seen my effort rewarding me back thanks to swc.

I open-sourced it recently because I thought I will be able to be rewarded via sponsorship in the future if there's enough company using it for everyday development.

Until recently, I couldn't think open-sourcing will compensate me back. Thanks to Vercel, I concluded I can.

**M**: Right - were you hired at Vercel because of your work on swc?

**D**: Yes, Vercel wanted to make Next.js fast, and swc was a perfect fit for them. They needed extensibility.

**M**: But without Vercel, your work on swc might not have been rewarded? What do you think this says about the sustainability of open source?

**D**: I could be rewarded by Deno, but I don't think it's the point. I think it was possible I couldn't get rewarded enough. And it means a Tragedy of the Commons for open-source. I'm sort of a lucky case. Many open-source maintainers are using enormous amounts of their own time without enough reward.

Honestly, I'm still not sure if open-source is sustainable without companies like Vercel.

**M**: So despite that, you've put a lot of effort into `stc` already (thank you). You're willing to keep pushing even though it might not be rewarded?

**D**: I can't be 100% sure, but I think so. But I don't think I would develop `stc` as open-source if it was the case.

Rather, I would develop it as BUSL or closed source.

**M**: Let's talk more about the technical details of the project. What have you found challenging so far? I'd heard that you switched languages a couple of times.

**D**: The most challenging thing is the absence of the specification. I had to infer everything just from test cases.

The second thing is the velocity of tsc. It's way too fast, and I was unsure if I could follow it up. So I decided to use semi-automated translation and selected Golang.

But it was too boring, and more importantly, my programming ability has improved enough to follow tsc only by myself.

**M**: What are your goals with `stc`? Are you planning to support everything tsc can currently support, or only a subset?

**D**: The former, but not exactly 100%. I don't like some design decisions of tsc, mainly about diagnostics. Error messages of tsc are too hard to understand, in my opinion.

**M**: Definitely agree about the errors being hard to read. But you're planning to support advanced features like generics, conditional types, overloads etc?

**D**: Yes, all typing and type inference should match 100%. All three features you mentioned are already implemented

**M**: So in theory, you'd be able to use `stc` as a drop-in replacement for tsc?

**D**: Yes, exactly.

**M**: How is progress going? What are you using to measure your progress?

**D**: I'm using stats of the conformance test suite from tsc:

```
Stats {
required_error: 4334,
matched_error: 5550,
extra_error: 942,
panic: 74,
}
```

This is the current stat. I'm focusing on reducing `extra_error`.

**M**: Are you able to estimate when it might be 'complete'? I.e. when required_error and extra_error go to 0? Or would you plan to release an alpha earlier than that?

**D**: I'm not sure about the time when it is complete, but I'll release alpha with a language server when the extra_error goes to 0
I hope I can finish within... about 6 months, but I can't be sure. I mean alpha by 'finish'

**M**: Do you have any help on the project? Or so far, is it just you?

**D**: Currently, it's only me, although there are some short-time contributors.

**M**: What's the best way that the community can support you right now?

**D**: As always, contributing developer time is the best. But honestly, I don't think it's possible, considering the difficulty of the project. And the second best contribution is a financial contribution, which helps me use almost all my free time for `stc`.

**M**: Where's the best spot to give a financial contribution?

**D**: Our [open collective](https://opencollective.com/stc) is the best place.

**M**: How does it _feel_ right now to be working on the project? Doing something so difficult in your spare time must be extremely draining.

Yeah, honestly, it's quite exhausting. But today, I'm quite motivated thanks to [@DCbuild3r, who donated 0.5 ETH](https://twitter.com/DCbuild3r/status/1596878223433994241). Although it's quite fun, it's super exhausting.

**M**: It's great when the community gets involved. Do you think there's a danger that exhaustion could prevent the project from being completed?

**D**: Yes, actually I stopped working on it several times.

**M**: So it's a project which is exhausting, extremely complicated, possibly never-ending and could be without reward. Why do you keep going?

**D**: There are several reasons.

- I trust Vercel
- This is too essential for the web development ecosystem
- I think I may get rewarded sometime in future
