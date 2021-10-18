;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [405],
  {
    76654: function (e, t, n) {
      'use strict'
      n.r(t),
        n.d(t, {
          default: function () {
            return T
          },
        })
      n(29901)
      var o,
        a = n(22239),
        r = n(4389),
        s = n(47549),
        i = n(57522),
        l = {
          src: '/_next/static/image/public/chris-biscardi.82cc34021f56dbc3d13da1c39591eff0.jpg',
          height: 312,
          width: 312,
          blurDataURL:
            'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAgACAMBIgACEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAB/9oACAEBAAAAAD//xAAUAQEAAAAAAAAAAAAAAAAAAAAE/9oACAECEAAAAEf/xAAUAQEAAAAAAAAAAAAAAAAAAAAD/9oACAEDEAAAAD//xAAbEAACAgMBAAAAAAAAAAAAAAABAgQRAAMTkf/aAAgBAQABPwDvAL7HeRbooC0TS+HP/8QAGxEAAgEFAAAAAAAAAAAAAAAAAgMBAAQREiH/2gAIAQIBAT8ARaLbB7EfJxX/xAAaEQACAgMAAAAAAAAAAAAAAAABAgADERIh/9oACAEDAQE/ALbmTTAXon//2Q==',
        },
        c = ['components'],
        u =
          ((o = 'Image'),
          function (e) {
            return (
              console.warn(
                'Component ' +
                  o +
                  ' was not imported, exported, or provided by MDXProvider as global scope',
              ),
              (0, i.kt)('div', e)
            )
          }),
        d = {}
      function h(e) {
        var t = e.components,
          n = (0, s.Z)(e, c)
        return (0, i.kt)(
          'wrapper',
          (0, r.Z)({}, d, n, {components: t, mdxType: 'MDXLayout'}),
          (0, i.kt)(
            'div',
            {className: 'relative text-lg'},
            (0, i.kt)(
              'h2',
              {className: 'font-bold pl-8'},
              'Performance.',
              (0, i.kt)('br', null),
              'Reliability.',
              (0, i.kt)('br', null),
              'Comfort.',
            ),
            (0, i.kt)('div', {
              className:
                'w-1 bg-brand-orange-600 h-[145%] absolute left-0 top-[-45%]',
            }),
          ),
          (0, i.kt)(
            'p',
            null,
            'In car commercials, you\u2019re promised all three, but for software development, you\u2019re in a \u201cchoose two\u201d situation.',
          ),
          (0, i.kt)('h3', null, 'Let\u2019s talk about performance first.'),
          (0, i.kt)(
            'p',
            null,
            'One maxim of software development states that the more lower-level the language, the higher the performance.',
          ),
          (0, i.kt)(
            'p',
            null,
            'However, these lower-level languages come with baggage.',
          ),
          (0, i.kt)(
            'p',
            null,
            'You have to have an understanding of how your code uses memory, and have the knowledge to manually manage it. Once you introduce concurrency into the mix, it becomes even easier to stall out.',
          ),
          (0, i.kt)(
            'p',
            null,
            'Low-level languages have a tendency to be unsafe at any speed.',
          ),
          (0, i.kt)('h3', null, 'Let\u2019s look at C and C++.'),
          (0, i.kt)(
            'p',
            null,
            'These old timers are more than happy to sit back and watch you try to run your error-prone code. At best, you\u2019ll crash due to something innocent that you can catch and fix right away. At worst, you won\u2019t notice anything bad happening but have opened up the entire system to being carjacked through memory exploits (Stack overflow, anyone?).',
          ),
          (0, i.kt)(
            'p',
            null,
            'And if you\u2019re coming from a modern language like JavaScript, Ruby, or Go\u2026',
          ),
          (0, i.kt)('h3', null, 'Finally, the subject of comfort.'),
          (0, i.kt)(
            'p',
            null,
            'While how you feel sitting in the driver\u2019s seat plays a large part in how good you feel in a car, it\u2019s not the only concern. Similarly, working in a language is more than just syntax.',
          ),
          (0, i.kt)(
            'p',
            null,
            'Terse legacy code written by others can be hard to read, and even scarier to modify.',
          ),
          (0, i.kt)(
            'p',
            null,
            'Different library and version tooling can make it annoying to collaborate on larger projects.',
          ),
          (0, i.kt)('hr', null),
          (0, i.kt)(
            'p',
            null,
            'Just as certain vehicles have their ideal environment, these system level languages have theirs. Your choice of language may make it hard to find a change of scenery.',
          ),
          (0, i.kt)(
            'p',
            null,
            (0, i.kt)(
              'strong',
              {parentName: 'p'},
              "So how do you choose between performance, safety, and comfort? How will you know you've made the right choice?",
            ),
          ),
          (0, i.kt)(
            'div',
            {className: 'relative'},
            (0, i.kt)(
              'h2',
              {className: 'text-3xl font-bold pl-8'},
              'With Rust, you get it all.',
            ),
            (0, i.kt)('div', {
              className: 'w-1 bg-brand-orange-600 h-full absolute left-0 top-0',
            }),
          ),
          (0, i.kt)(
            'p',
            null,
            'Thanks to its benchmarks in both runtime and developer experience, Rust has been growing in popularity amongst developers of all backgrounds.',
          ),
          (0, i.kt)(
            'h3',
            null,
            'The compiler is what sets Rust apart from other languages.',
          ),
          (0, i.kt)(
            'p',
            null,
            'It provides a super stable platform for you to build on.',
          ),
          (0, i.kt)(
            'p',
            null,
            "With Rust\u2019s default behavior it is impossible to end up with null pointers. Being both strongly and statically typed with the power of inference makes it hard to write programs that don't work.",
          ),
          (0, i.kt)(
            'p',
            null,
            "If there's an issue with your code, the Rust compiler tells you what part is wrong and points you to the solution.",
          ),
          (0, i.kt)(
            'p',
            null,
            'As your skills grow and you become more confident, you can start working with Unsafe Rust. This opens up even more possibilities, but that\u2019s a subject for another time\u2026',
          ),
          (0, i.kt)(
            'p',
            null,
            'Now, some people online have complained that the learning curve for Rust is a bit steeper than some other languages.',
          ),
          (0, i.kt)(
            'h3',
            null,
            "Rust has mechanics that aren't found in other languages.",
          ),
          (0, i.kt)(
            'p',
            null,
            'Rust\u2019s concept of Ownership, for example, is a major part of the language and it combines with the rest of the language in a way that makes it hard to ignore. Borrowing, Lifetimes, and Traits all interact to make Ownership what it is. This combination is the source of foreign looking types like ',
            (0, i.kt)('inlineCode', {parentName: 'p'}, "'``a"),
            ', the differences between ',
            (0, i.kt)('inlineCode', {parentName: 'p'}, 'String'),
            ' and ',
            (0, i.kt)('inlineCode', {parentName: 'p'}, '&str'),
            ', and more.',
          ),
          (0, i.kt)(
            'p',
            null,
            'Seeing these explained in isolation makes it feel like like cobbling things together.',
          ),
          (0, i.kt)('br', null),
          (0, i.kt)(
            'div',
            {className: 'relative sm:text-2xl text-xl font-bold pl-5'},
            (0, i.kt)(
              'div',
              null,
              "The compiler won't let you write code that doesn't run, but how do you know you're writing ",
              (0, i.kt)('i', null, 'good'),
              ' code?',
              (0, i.kt)('br', null),
              (0, i.kt)('br', null),
              "That's why I developed Rust Adventure.",
            ),
            (0, i.kt)('div', {
              className:
                'w-1 bg-brand-orange-600 h-[100%] absolute left-0 top-0',
            }),
          ),
          (0, i.kt)('br', null),
          (0, i.kt)(
            'div',
            {className: 'items-start py-5'},
            (0, i.kt)(
              'div',
              {
                className:
                  'flex flex-shrink-0 items-center justify-center sm:w-auto w-full max-w-[110px] float-left pr-5',
              },
              (0, i.kt)(u, {
                src: l,
                placeholder: 'blur',
                quality: 100,
                className: 'rounded-md',
                mdxType: 'Image',
              }),
            ),
            (0, i.kt)(
              'div',
              {className: 'font-medium'},
              "Hey, I'm Chris Biscardi. For the past few years, I've been diving deep into the Rust ecosystem and working with beginners to figure out what people stumble on most when learning Rust. Through many cohorts and separate live sessions I've discovered what it takes for someone familiar with languages like JavaScript to get up to speed and produce working production code using Rust.",
            ),
          ),
          (0, i.kt)(
            'p',
            null,
            "I've seen first-hand the struggles people have with Rust.",
          ),
          (0, i.kt)(
            'p',
            null,
            'Rust Adventure builds your understanding of the syntax, concepts, and idiomatic practices of the language.',
          ),
          (0, i.kt)(
            'p',
            null,
            'Where other materials focus on little demos or toys, ',
            (0, i.kt)(
              'strong',
              {parentName: 'p'},
              'in Rust Adventure you will experience the versatility of the language through building games, powerful CLI apps, and serverless functions.',
            ),
          ),
          (0, i.kt)(
            'p',
            null,
            'Whether your goal is to jump start the next stretch of your development career or just to tinker, Rust Adventure is what you need.',
          ),
        )
      }
      h.isMDXComponent = !0
      var m = n(41669),
        p = n(64682),
        A = n(99333),
        g = n.n(A),
        b = n(38577),
        f = n(53847),
        w = n(74714),
        x = n(66226),
        y = n(61250),
        v = ['node', 'inline', 'className', 'children']
      function k(e, t) {
        var n = Object.keys(e)
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e)
          t &&
            (o = o.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable
            })),
            n.push.apply(n, o)
        }
        return n
      }
      function j(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {}
          t % 2
            ? k(Object(n), !0).forEach(function (t) {
                ;(0, m.Z)(e, t, n[t])
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : k(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t),
                )
              })
        }
        return e
      }
      var N =
          ' \n~~~rust\nfn main() {\n  println!("Hello World!");\n}\n\nuse adventure_time::{config::get_manifest, init};\nuse clap::{crate_description, crate_version, App, AppSettings, Arg};\nuse tokio::prelude::*;\n\n#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n  let matches = App::new("Adventure Time")\n      .version(crate_version!())\n      .author("Chris Biscardi <chris@christopherbiscardi.com>")\n      .about(crate_description!())\n      .setting(AppSettings::ColoredHelp)\n      .subcommand(App::new("init"))\n      .subcommand(\n          App::new("watch")\n              .about("Run all the tests for a course and watch for changes.")\n              .arg(\n                  Arg::new("debug")\n                      .short(\'d\')\n                      .about("print debug information verbosely"),\n              ),\n      )\n      .subcommand(\n          App::new("list").about("list courses").arg(\n              Arg::new("course")\n                  .short(\'c\')\n                  .about("List the lessons in a course"),\n          ),\n      )\n      .subcommand(\n          App::new("init")\n              .about("start working on a new course in a new directory")\n              .arg(\n                  Arg::new("course")\n                      .short(\'c\')\n                      .about("The course id you want to start"),\n              ),\n      )\n      .get_matches();\n\n  match matches.subcommand_name() {\n      Some("init") => init(matches.subcommand_matches("init").unwrap()),\n      Some("list") => {}\n      Some("watch") => {}\n      _ => {}\n  };\n  Ok(())\n}\n\nfn main() {\n  println!("Hello World!");\n}\n\nuse adventure_time::{config::get_manifest, init};\nuse clap::{crate_description, crate_version, App, AppSettings, Arg};\nuse tokio::prelude::*;\n\n#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n  let matches = App::new("Adventure Time")\n      .version(crate_version!())\n      .author("Chris Biscardi <chris@christopherbiscardi.com>")\n      .about(crate_description!())\n      .setting(AppSettings::ColoredHelp)\n      .subcommand(App::new("init"))\n      .subcommand(\n          App::new("watch")\n              .about("Run all the tests for a course and watch for changes.")\n              .arg(\n                  Arg::new("debug")\n                      .short(\'d\')\n                      .about("print debug information verbosely"),\n              ),\n      )\n      .subcommand(\n          App::new("list").about("list courses").arg(\n              Arg::new("course")\n                  .short(\'c\')\n                  .about("List the lessons in a course"),\n          ),\n      )\n      .subcommand(\n          App::new("init")\n              .about("start working on a new course in a new directory")\n              .arg(\n                  Arg::new("course")\n                      .short(\'c\')\n                      .about("The course id you want to start"),\n              ),\n\n~~~\n\n',
        C = function () {
          var e = (0, w.J)(),
            t = {
              code: function (t) {
                t.node
                var n = t.inline,
                  o = t.className,
                  a = t.children,
                  r = (0, s.Z)(t, v),
                  i = /language-(\w+)/.exec(o || '')
                return !n && i
                  ? (0, y.jsx)(x.E.div, {
                      animate: e ? {} : {y: ['0%', '-55.5%']},
                      transition: {
                        duration: 30,
                        repeat: 1 / 0,
                        repeatType: 'loop',
                        ease: 'linear',
                      },
                      children: (0, y.jsx)(
                        b.Z,
                        j(
                          {
                            style: f.lR,
                            language: i[1],
                            PreTag: 'div',
                            children: String(a).replace(/\n$/, ''),
                            codeTagProps: {
                              className:
                                'bg-transparent overflow-visible font-mono text-[0.6rem]',
                            },
                            customStyle: {
                              backgroundColor: 'transparent',
                              lineHeight: 1.1,
                              padding: '0 0.75rem',
                            },
                          },
                          r,
                        ),
                      ),
                    })
                  : (0, y.jsx)(
                      'code',
                      j(j({className: o}, r), {}, {children: a}),
                    )
              },
            }
          return (0, y.jsx)('div', {
            className:
              'lg:max-w-[265px] md:max-w-[200px] max-w-[265px] sm:scale-100 scale-75',
            'aria-hidden': 'true',
            children: (0, y.jsxs)('div', {
              className: 'relative',
              children: [
                (0, y.jsxs)('div', {
                  className:
                    'bg-brand-gray shadow-inner h-64 w-full rounded-lg overflow-hidden flex flex-col justify-between',
                  children: [
                    (0, y.jsx)(g(), {components: t, children: N}),
                    (0, y.jsxs)('div', {
                      className:
                        'absolute bottom-0 w-full z-10 text-[0.6rem] font-mono space-x-2 font-semibold p-3 bg-white border border-brand-gray rounded-b-lg',
                      children: [
                        (0, y.jsx)('span', {
                          className: 'text-blue-500',
                          children: '$',
                        }),
                        (0, y.jsx)('span', {children: 'rustc adventure.rs'}),
                      ],
                    }),
                  ],
                }),
                (0, y.jsx)('div', {
                  className: 'w-40 absolute z-20 -bottom-12 -right-8',
                  children: (0, y.jsx)(p.ZP, {}),
                }),
              ],
            }),
          })
        },
        E = n(46102),
        R = n(78905)
      function T() {
        var e = (0, R.useRouter)()
        return (0, y.jsxs)(a.Z, {
          meta: {
            title: 'Learn to build reliable and efficient software in Rust',
          },
          children: [
            (0, y.jsxs)('header', {
              className:
                '-mx-page sm:-mt-page -mt-8 sm:pt-32 pt-16 sm:pb-24 pb-16 flex md:flex-row flex-col-reverse items-center justify-between lg:px-12 px-0',
              children: [
                (0, y.jsx)('div', {
                  className: 'flex-shrink-0 md:pt-0 sm:pt-16 pt-10',
                  children: (0, y.jsxs)('h1', {
                    className:
                      'sm:text-4xl text-3xl font-bold max-w-[16ch] sm:text-left text-center',
                    children: [
                      'Learn to build reliable and efficient software',
                      (0, y.jsx)('div', {
                        className: 'font-light text-brand-orange-600 text-3xl',
                        children: 'in Rust',
                      }),
                    ],
                  }),
                }),
                (0, y.jsx)(C, {}),
              ],
            }),
            (0, y.jsxs)('main', {
              children: [
                (0, y.jsx)('article', {
                  className: 'max-w-2xl mx-auto w-full prose sm:prose-lg',
                  children: (0, y.jsx)(h, {}),
                }),
                (0, y.jsx)('section', {
                  id: 'subscribe',
                  className: 'mt-10',
                  children: (0, y.jsxs)('div', {
                    className: 'max-w-lg mx-auto py-24',
                    children: [
                      (0, y.jsx)('div', {
                        className: 'w-24 mx-auto pb-5',
                        children: (0, y.jsx)(p.Jc, {}),
                      }),
                      (0, y.jsxs)('div', {
                        className: 'pb-8 text-center',
                        children: [
                          (0, y.jsx)('h2', {
                            className:
                              'max-w-sm mx-auto sm:text-4xl text-3xl font-bold',
                            children: "Jump in, we're going to learn Rust!",
                          }),
                          (0, y.jsx)('h3', {
                            className:
                              'sm:text-xl text-lg pt-3 text-brand-orange-600',
                            children:
                              'Get a head start with my free 5-Part email course.',
                          }),
                        ],
                      }),
                      (0, y.jsxs)('div', {
                        className: 'max-w-sm mx-auto',
                        children: [
                          (0, y.jsx)(E.SubscribeToConvertkitForm, {
                            successMessage: 'We did it!',
                            onSuccess: function (t) {
                              if (t) {
                                var n = (0, E.redirectUrlBuilder)(t, '/confirm')
                                e.push(n)
                              }
                            },
                          }),
                          (0, y.jsx)('div', {
                            className:
                              'text-xs opacity-50 pt-8 italic text-center',
                            children:
                              'No spam, and you are free to unsubscribe at any time.',
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        })
      }
    },
    68115: function (e, t, n) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/',
        function () {
          return n(76654)
        },
      ])
    },
  },
  function (e) {
    e.O(0, [358, 333, 778, 239, 888, 179], function () {
      return (t = 68115), e((e.s = t))
      var t
    })
    var t = e.O()
    _N_E = t
  },
])
