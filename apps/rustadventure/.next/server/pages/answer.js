'use strict'
;(() => {
  var exports = {}
  exports.id = 878
  exports.ids = [878]
  exports.modules = {
    /***/ 3344: /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__,
    ) => {
      __webpack_require__.r(__webpack_exports__)
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ getStaticProps: () => /* binding */ getStaticProps,
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      })
      /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(9297)
      /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default =
        /*#__PURE__*/ __webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__)
      /* harmony import */ var _skillrecordings_quiz__WEBPACK_IMPORTED_MODULE_1__ =
        __webpack_require__(1386)
      /* harmony import */ var _skillrecordings_quiz__WEBPACK_IMPORTED_MODULE_1___default =
        /*#__PURE__*/ __webpack_require__.n(
          _skillrecordings_quiz__WEBPACK_IMPORTED_MODULE_1__,
        )
      /* harmony import */ var layouts__WEBPACK_IMPORTED_MODULE_2__ =
        __webpack_require__(2239)
      /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
        __webpack_require__(5282)
      /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default =
        /*#__PURE__*/ __webpack_require__.n(
          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__,
        )

      const Answer = ({questions}) => {
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx(
          layouts__WEBPACK_IMPORTED_MODULE_2__ /* .default */.Z,
          {
            noIndex: true,
            meta: {
              title: 'Quiz',
            },
            children:
              /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx(
                _skillrecordings_quiz__WEBPACK_IMPORTED_MODULE_1__.QuizAnswerPage,
                {
                  questions: questions,
                  author: 'Chris Biscardi',
                  title: 'Rust Adventure',
                },
              ),
          },
        )
      }

      async function getStaticProps() {
        // pass the questions in as static (or dynamic!) props
        const questions = {
          welcome: {
            question: `In our email, we created a file called \`src/main.rs\` and a function in that file called \`fn main\`. What happens if either of these are called something else?`,
            type: `essay`,
            answer: `### Answers\r\n\r\n#### No main.rs file\r\n\r\nThe name and location of the \`main.rs\` file is important, but only because we haven\'t configured which file to use as the entrypoint for the binary target. If we don\'t specify the target details in \`Cargo.toml\` _and_ we don\'t have the default \`src\/main.rs\` file, then we see this error message from the compiler when we build.\r\n\r\n\`\`\`\r\n\u276F cargo build\r\nerror: failed to parse manifest at \`\/Users\/chris\/weather-cli\/Cargo.toml\`\r\n\r\nCaused by:\r\n  no targets specified in the manifest\r\n  either src\/lib.rs, src\/main.rs, a [lib] section, or [[bin]] section must be present\r\n\`\`\`\r\n\r\nThis message is telling us that we need at least one library or binary target to be able to build the project. If we don\'t want to use \`src\/main.rs\`, we can specify the binary by adding a [\`[[bin]]\` field](https:\/\/doc.rust-lang.org\/cargo\/reference\/cargo-targets.html#binaries) in our \`Cargo.toml\`\r\n\r\n\`\`\`\r\n[[bin]]\r\nname = \"weather-cli\"\r\npath = \"src\/my-binary-file.rs\"\r\n\`\`\`\r\n\r\nThis is also how you\'d specify a number of other configuration options for how to build a specific target, such as the name of the binary that gets built.\r\n\r\n#### No \`main\` function\r\n\r\nIf we rename the main function in \`main.rs\` to something nonsensical like \`fn asfasf()\` then when we try to build we\'ll see this error message.\r\n\r\n\`\`\`\r\n\u276F cargo build\r\n   Compiling thingd v0.1.0 (\/Users\/chris\/weather-cli)\r\nerror[E0601]: \`main\` function not found in crate \`weather-cli\`\r\n --> src\/main.rs:1:1\r\n  |\r\n1 | \/ fn asfasf() {\r\n2 | |     println!(\"Hello, world!\");\r\n3 | | }\r\n  | |_^ consider adding a \`main\` function to \`src\/main.rs\`\r\n\r\nerror: aborting due to previous error\r\n\r\nFor more information about this error, try \`rustc --explain E0601\`.\r\nerror: could not compile \`thingd\`\r\n\r\nTo learn more, run the command again with --verbose.\r\n\`\`\`\r\n\r\nThe most important piece of the error message is this line:\r\n\r\n> consider adding a \`main\` function to \`src\/main.rs\r\n\r\nThis error occurs because we _must_ have a function called \`main\` in the binary entrypoint file. It is a convention enforced by the compiler.\r\n\r\nIn the future when we get into async Rust and other higher level macros, this error can pop up if you\'ve misconfigured a macro that wraps the main function.`,
            tagId: 2479279, // ec - ra - 001 Introducing Rust completed
          },
          envVariables: {
            question: `Semicolons are important in other languages for seemingly arbitrary reasons.\n\n What happens if you remove the semicolon from the \`dbg!\` call in our program? What do you think the error message is telling you?`,
            type: `essay`,
            answer: `### Answers\r\n\r\nWhen we remove the semicolon from the \`dbg!\` macro we get this error message.\r\n\r\n\`\`\`\r\n\u276F cargo build\r\n   Compiling weather-cli v0.1.0 (\/Users\/chris\/weatcher-cli)\r\nerror[E0308]: mismatched types\r\n --> src\/main.rs:4:5\r\n  |\r\n1 | fn main() {\r\n  |           - expected \`()\` because of default return type\r\n...\r\n4 |     dbg!(api_token)\r\n  |     ^^^^^^^^^^^^^^^ expected \`()\`, found struct \`String\`\r\n  |\r\n  = note: this error originates in a macro (in Nightly builds, run with -Z macro-backtrace for more info)\r\n\r\nerror: aborting due to previous error\r\n\r\nFor more information about this error, try \`rustc --explain E0308\`.\r\nerror: could not compile \`thingd\`\r\n\r\nTo learn more, run the command again with --verbose.\r\n\`\`\`\r\n\r\nThere are a couple of key insights here.\r\n\r\n1. The default return value of a function is \`()\`\r\n2. Everything in Rust is either a Statement or an Expression\r\n3. \`dbg!\` returns the value of the expression we pass it\r\n4. Semicolons turn Expressions into Statements\r\n\r\n## 1. The default return value of a function is \`()\`\r\n\r\n\`()\` is pronounced \"unit\" and is a 0 element tuple. If we don\'t specify a return type for our functions, they return \`()\` by default. The type unit \`()\` and the only value that can satisfy that type \`()\` are spelled the same way. This means if a function\'s return type is \`()\`, then the only value we can return at the end of our function is \`()\`.\r\n\r\nBy comparison in JavaScript if a function returns the type \"Number\", then it would return values like: \`1\`, \`2\`, \`3\`, etc.\r\n\r\n## 2. Everything in Rust is either a Statement or an Expression\r\n\r\nRust is primarily an Expression based language. This means that inside of a block there is always a return value from that block. This even applies to \`if\`.\r\n\r\nIn JavaScript \`if\` is a statement, and thus doesn\'t return a value. This leads us into using hacks like ternary operators, or \`mything && MyComponent\`.\r\n\r\nIn Rust, we can return values from an if expression and put them into a variable as such.\r\n\r\n\`\`\`rust\r\nlet y = if 12 * 15 > 150 {\r\n    \"Bigger\"\r\n} else {\r\n    \"Smaller\"\r\n};\r\n\`\`\`\r\n\r\nWe could put this into a function that returns a \`String\`. Notice how we removed the variable assignment as well as the semi-colon. The last value in an expression will be returned.\r\n\r\n\`\`\`rust\r\nfn test_a_number() -> String {\r\n    if 12 * 15 > 150 {\r\n        \"Bigger\".to_string()\r\n    } else {\r\n        \"Smaller\".to_string()\r\n    }\r\n}\r\n\`\`\`\r\n\r\nIn this case, that means \`\"Bigger\".to_string()\` is returned from one branch of the if expression, and \`\"Smaller\".to_string()\` is returned from the other branch of the if expression.\r\n\r\nThis means that overall the if expression returns a \`String\`, and since the if expression is the last expression in the function body, the function returns a \`String\` as well.\r\n\r\n## 3. \`dbg!\` returns the value of the expression we pass it\r\n\r\nOne unique feature of the \`dbg!\` macro is that since it is use for debugging purposes, the value returned from it is the value of the expression we pass it. It\'s as if the \`dbg!\` macro wasn\'t even there.\r\n\r\nIn the following example, we print out the result of \`dbg!(2) == 2\`, which is the same as \`2 == 2\`, to prove that \`dbg\` passes the value through.\r\n\r\n\`\`\`rust\r\nfn main() {\r\n    println!(\"{}\", dbg!(2) == 2);\r\n}\r\n\`\`\`\r\n\r\n## 4. Semicolons turn Expressions into Statements\r\n\r\nSo to recap:\r\n\r\n- Functions return the \`()\` type by default\r\n- Most things in Rust are expressions\r\n- The last value in an expression is returned from that expression\r\n- \`dbg!\` returns whatever we give it, as is.\r\n\r\nThat means we\'re left with a main function with \`dbg!\` in the last position, which returns whatever we gave it. In this case, that was the api token: a \`String\`.\r\n\r\nThis lets us read the error message we got from the Rust compiler. First, the compiler expected \`()\` because that\'s a function\'s default return type.\r\n\r\n\`\`\`rust\r\n  |\r\n1 | fn main() {\r\n  |           - expected \`()\` because of default return type\r\n\`\`\`\r\n\r\nThen, on line 4, the compiler expected the \`()\` value because the default return type of the function told it to. Instead, it found that we are returning a \`String\` because \`dbg!\` returns whatever we give it, and \`dbg!\` is in the last position in the function body, which means whatever value it is, is what gets returned from the function.\r\n\r\n\`\`\`rust\r\n4 |     dbg!(api_token)\r\n  |     ^^^^^^^^^^^^^^^ expected \`()\`, found struct \`String\`\r\n  |\r\n\`\`\`\r\n\r\nSo the question becomes how do we discard the \`dbg!\` value and the answer is the semicolon: \`;\`.\r\n\r\nA semicolon is an operator that takes an expression, evaluates it, then discards the result. In place of the discarded result, we get \`()\`, which is the return type we need for the \`main\` function.\r\n\r\nThis is why the semicolon is important. It takes our \`dbg!\` expression and evaluates it which lets us print to the console, while also letting us return \`()\`.`,
            tagId: 2479287, // ec - ra - 002 Environment Variables completed
          },
          cliArgs: {
            question: `We\'ve used \`std::env::args\` in the example from the email, but for more complex applications we\'d likely use a crate. Using [crates.io](https:\/\/crates.io\/) or [lib.rs](https:\/\/lib.rs\/) find a crate that looks like it would be useful for command line argument and flag parsing.`,
            type: `essay`,
            answer: `Popular crates include \`clap\` and \`structopt\` but there are many more as well. The important part here is knowing what crates.io and lib.rs are and how to navigate them to find what you want.`,
            tagId: 2479298, // ec - ra - 003 Command Line Args completed
          },
          httpReqs: {
            question: `Here is a link to [the reqwest docs](https:\/\/docs.rs\/reqwest\/0.11.3\/reqwest\/blocking\/struct.RequestBuilder.html) for \`RequestBuilder\`. Let\'s say you wanted to add a user agent header to the reqwest (some services, like Discord, require you to set a unique user agent for your client).\r\n\r\nHow would you add the user agent header?`,
            type: `essay`,
            answer: `You can use the \`.header\` function on \`RequestBuilder\` to add additional headers.\r\n\r\n\`\`\`rust\r\n.header(reqwest::header::USER_AGENT, \"my weather app\")\r\n\`\`\`\r\n\r\nTurning the program into this:\r\n\r\n\`\`\`rust\r\nlet client = reqwest::blocking::Client::new();\r\n\r\nlet response = client\r\n    .get(\"https:\/\/api.waqi.info\/search\/\")\r\n    .query(&[(\"token\", api_token), (\"keyword\", args)])\r\n    .header(reqwest::header::USER_AGENT, \"my weather app\")\r\n    .send()\r\n    .expect(\"a successful request\")\r\n    .json::<serde_json::Value>()\r\n    .expect(\"expected the body to be json\");\r\n\r\ndbg!(response);\r\n\`\`\``,
            tagId: 2479304,
          },
          close: {
            question: `What are you most interested in learning about Rust?`,
            type: `essay`,
            // ec - ra - 004 HTTP Requests completed
            tagId: 2479310,
          },
        }
        return {
          props: {
            questions,
          },
        }
      }
      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = Answer

      /***/
    },

    /***/ 3009: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) {
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : {default: mod}
        }
      exports.__esModule = true
      var react_1 = __importDefault(__webpack_require__(9297))
      var last_1 = __importDefault(__webpack_require__(9066))
      var CompletedMessage = function (_a) {
        var answeredCorrectly = _a.answeredCorrectly,
          _b = _a.neutral,
          neutral = _b === void 0 ? false : _b,
          question = _a.question,
          questions = _a.questions,
          _c = _a.title,
          title = _c === void 0 ? 'Skill Recordings Product' : _c,
          _d = _a.author,
          author = _d === void 0 ? 'Your Instructor' : _d
        var questionsKeys = Object.keys(questions)
        var lastQuestionKey = last_1['default'](questionsKeys) || ''
        var isLast = questions[lastQuestionKey].tagId === question.tagId
        var srMessage = react_1['default'].createElement(
          'span',
          {className: 'sr-only'},
          'Quiz complete.\u00A0',
        )
        var answeredMessageRef = react_1['default'].useRef()
        react_1['default'].useEffect(function () {
          answeredMessageRef.current.focus()
        }, [])
        return react_1['default'].createElement(
          react_1['default'].Fragment,
          null,
          neutral
            ? react_1['default'].createElement(
                'div',
                {
                  className:
                    'pt-10 prose prose-lg text-center sm:prose-xl dark:prose-dark',
                },
                isLast
                  ? react_1['default'].createElement(
                      'p',
                      {tabIndex: -1, ref: answeredMessageRef},
                      srMessage,
                      'This was the last lesson from the ',
                      title,
                      ' email course. We hope you learned something new, and we look forward to sharing more in the future!',
                    )
                  : react_1['default'].createElement(
                      'p',
                      {tabIndex: -1, ref: answeredMessageRef},
                      srMessage,
                      react_1['default'].createElement(
                        'span',
                        null,
                        "Thanks for submitting your answer! We'll send the next lesson in 5-10 minutes. Check your inbox.",
                      ),
                    ),
                react_1['default'].createElement(
                  'p',
                  null,
                  'Thanks, ',
                  react_1['default'].createElement('br', null),
                  ' ',
                  author,
                ),
              )
            : answeredCorrectly
            ? react_1['default'].createElement(
                'div',
                {
                  className:
                    'pt-10 mt-10 prose prose-lg text-center border-t border-gray-200 sm:prose-xl dark:prose-dark dark:border-gray-700',
                },
                react_1['default'].createElement(
                  'p',
                  {tabIndex: -1, ref: answeredMessageRef},
                  'Nice work. You chose the correct answer!',
                ),
                isLast
                  ? react_1['default'].createElement(
                      'p',
                      null,
                      'This was the last lesson from the ',
                      title,
                      ' email course. We hope you learned something new, and I look forward to sharing more in the future!',
                    )
                  : react_1['default'].createElement(
                      'p',
                      null,
                      "We'll send the next lesson in 5-10 minutes. Check your inbox.",
                    ),
                react_1['default'].createElement(
                  'p',
                  null,
                  'Thanks, ',
                  react_1['default'].createElement('br', null),
                  ' ',
                  author,
                ),
              )
            : react_1['default'].createElement(
                'div',
                {
                  className:
                    'pt-10 mt-10 prose prose-lg text-center border-t border-gray-200 sm:prose-xl dark:prose-dark dark:border-gray-700',
                },
                react_1['default'].createElement(
                  'p',
                  {tabIndex: -1, ref: answeredMessageRef},
                  "You chose an incorrect answer, but don't worry. Just go back and re-read the email and check out any linked resources. You can refresh the page if you'd like to try again! \uD83D\uDC4D",
                ),
                isLast
                  ? react_1['default'].createElement(
                      'p',
                      null,
                      'This was the last lesson from the ',
                      title,
                      ' email course. We hope you learned something new, and I look forward to sharing more in the future!',
                    )
                  : react_1['default'].createElement(
                      'p',
                      null,
                      "We'll send the next email in 5-10 minutes too so you can learn more.",
                    ),
                react_1['default'].createElement(
                  'p',
                  null,
                  'Thanks, ',
                  react_1['default'].createElement('br', null),
                  ' ',
                  author,
                ),
              ),
        )
      }
      exports.default = CompletedMessage

      /***/
    },

    /***/ 5593: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) {
      var __createBinding =
        (this && this.__createBinding) ||
        (Object.create
          ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              Object.defineProperty(o, k2, {
                enumerable: true,
                get: function () {
                  return m[k]
                },
              })
            }
          : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
            })
      var __setModuleDefault =
        (this && this.__setModuleDefault) ||
        (Object.create
          ? function (o, v) {
              Object.defineProperty(o, 'default', {enumerable: true, value: v})
            }
          : function (o, v) {
              o['default'] = v
            })
      var __importStar =
        (this && this.__importStar) ||
        function (mod) {
          if (mod && mod.__esModule) return mod
          var result = {}
          if (mod != null)
            for (var k in mod)
              if (
                k !== 'default' &&
                Object.prototype.hasOwnProperty.call(mod, k)
              )
                __createBinding(result, mod, k)
          __setModuleDefault(result, mod)
          return result
        }
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : {default: mod}
        }
      exports.__esModule = true
      var React = __importStar(__webpack_require__(9297))
      var react_markdown_1 = __importDefault(__webpack_require__(3703))
      var use_quiz_question_1 = __importDefault(__webpack_require__(8678))
      var submit_1 = __importDefault(__webpack_require__(8813))
      var completed_1 = __importDefault(__webpack_require__(3009))
      var EssayQuestion = function (_a) {
        var question = _a.question,
          questions = _a.questions,
          author = _a.author,
          title = _a.title
        var _b = use_quiz_question_1['default'](question, questions),
          formik = _b.formik,
          onAnswer = _b.onAnswer,
          isAnswered = _b.isAnswered,
          answeredCorrectly = _b.answeredCorrectly,
          isSubmitting = _b.isSubmitting
        return React.createElement(
          'form',
          {onSubmit: onAnswer, className: 'w-full'},
          React.createElement(
            'legend',
            {className: 'lg:text-4xl sm:text-3xl text-2xl font-semibold pb-6'},
            React.createElement(react_markdown_1['default'], {
              className: 'prose lg:prose-xl sm:prose-lg dark:prose-dark',
              children:
                question === null || question === void 0
                  ? void 0
                  : question.question,
            }),
          ),
          React.createElement(
            'label',
            null,
            React.createElement(
              'span',
              {
                className:
                  'text-xl font-medium pb-2 inline-block text-gray-800 dark:text-gray-300',
              },
              'Please explain:',
            ),
            React.createElement('textarea', {
              disabled: isAnswered,
              name: 'answer',
              onChange: formik.handleChange,
              rows: 6,
              className:
                'form-textarea w-full text-lg dark:bg-gray-800 dark:text-white rounded-lg dark:placeholder-gray-500',
              placeholder: 'Type your answer here...',
            }),
          ),
          !isAnswered &&
            React.createElement(
              'div',
              {className: 'w-full py-5'},
              formik.errors.answer &&
                React.createElement(
                  'div',
                  {className: 'pb-5 font-medium text-lg'},
                  React.createElement(
                    'span',
                    {role: 'img', 'aria-label': 'Alert'},
                    '\u26A0\uFE0F',
                  ),
                  ' ',
                  formik.errors.answer,
                ),
              React.createElement(submit_1['default'], {
                isSubmitting: isSubmitting,
                isAnswered: isAnswered,
              }),
            ),
          isAnswered &&
            (question === null || question === void 0
              ? void 0
              : question.answer) &&
            React.createElement(react_markdown_1['default'], {
              children: question.answer,
              className: 'prose sm:prose-xl prose-lg pt-5',
            }),
          isAnswered &&
            React.createElement(completed_1['default'], {
              questions: questions,
              question: question,
              neutral: true,
              author: author,
              title: title,
            }),
        )
      }
      exports.default = EssayQuestion

      /***/
    },

    /***/ 9190: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) {
      var __createBinding =
        (this && this.__createBinding) ||
        (Object.create
          ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              Object.defineProperty(o, k2, {
                enumerable: true,
                get: function () {
                  return m[k]
                },
              })
            }
          : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
            })
      exports.__esModule = true
      exports.Submit =
        exports.MultipleChoiceQuestion =
        exports.EssayQuestion =
        exports.CompletedQuiz =
          void 0
      var completed_1 = __webpack_require__(3009)
      __createBinding(exports, completed_1, 'default', 'CompletedQuiz')
      var essay_question_1 = __webpack_require__(5593)
      __createBinding(exports, essay_question_1, 'default', 'EssayQuestion')
      var multiple_choice_question_1 = __webpack_require__(1441)
      __createBinding(
        exports,
        multiple_choice_question_1,
        'default',
        'MultipleChoiceQuestion',
      )
      var submit_1 = __webpack_require__(8813)
      __createBinding(exports, submit_1, 'default', 'Submit')

      /***/
    },

    /***/ 1441: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) {
      var __createBinding =
        (this && this.__createBinding) ||
        (Object.create
          ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              Object.defineProperty(o, k2, {
                enumerable: true,
                get: function () {
                  return m[k]
                },
              })
            }
          : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
            })
      var __setModuleDefault =
        (this && this.__setModuleDefault) ||
        (Object.create
          ? function (o, v) {
              Object.defineProperty(o, 'default', {enumerable: true, value: v})
            }
          : function (o, v) {
              o['default'] = v
            })
      var __importStar =
        (this && this.__importStar) ||
        function (mod) {
          if (mod && mod.__esModule) return mod
          var result = {}
          if (mod != null)
            for (var k in mod)
              if (
                k !== 'default' &&
                Object.prototype.hasOwnProperty.call(mod, k)
              )
                __createBinding(result, mod, k)
          __setModuleDefault(result, mod)
          return result
        }
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : {default: mod}
        }
      exports.__esModule = true
      var React = __importStar(__webpack_require__(9297))
      var react_markdown_1 = __importDefault(__webpack_require__(3703))
      var use_quiz_question_1 = __importDefault(__webpack_require__(8678))
      var submit_1 = __importDefault(__webpack_require__(8813))
      var completed_1 = __importDefault(__webpack_require__(3009))
      var shuffle_1 = __importDefault(__webpack_require__(805))
      var MultipleChoiceQuestion = function (_a) {
        var question = _a.question,
          questions = _a.questions,
          author = _a.author,
          title = _a.title
        var _b = use_quiz_question_1['default'](question, questions),
          formik = _b.formik,
          onAnswer = _b.onAnswer,
          hasMultipleCorrectAnswers = _b.hasMultipleCorrectAnswers,
          isCorrectAnswer = _b.isCorrectAnswer,
          isSubmitting = _b.isSubmitting,
          answeredCorrectly = _b.answeredCorrectly,
          isAnswered = _b.isAnswered
        var _c = React.useState([]),
          choices = _c[0],
          setChoices = _c[1]
        React.useEffect(function () {
          setChoices(
            shuffle_1['default'](
              question === null || question === void 0
                ? void 0
                : question.choices,
            ),
          )
        }, [])
        return React.createElement(
          'form',
          {onSubmit: onAnswer, className: 'w-full'},
          React.createElement(
            'legend',
            {className: 'lg:text-4xl sm:text-3xl text-2xl font-semibold pb-6'},
            React.createElement(react_markdown_1['default'], {
              className: 'prose lg:prose-xl sm:prose-lg dark:prose-dark',
              children:
                question === null || question === void 0
                  ? void 0
                  : question.question,
            }),
          ),
          React.createElement(
            'div',
            {className: 'flex flex-col', 'aria-required': true},
            choices === null || choices === void 0
              ? void 0
              : choices.map(function (choice) {
                  return React.createElement(
                    'label',
                    {
                      key: choice.answer,
                      className:
                        'text-lg font-medium group flex items-center rounded-lg sm:p-4 p-3 mb-2 border transition-all ease-in-our duration-200 ' +
                        (isAnswered ? 'cursor-default' : 'cursor-pointer') +
                        '  ' +
                        (isAnswered
                          ? isCorrectAnswer(choice)
                            ? 'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-500 dark:bg-opacity-10 dark:text-teal-100 dark:border-teal-500'
                            : 'bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-500 dark:bg-opacity-10 dark:border-pink-500 dark:text-pink-100'
                          : 'border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'),
                    },
                    React.createElement('input', {
                      type: hasMultipleCorrectAnswers ? 'checkbox' : 'radio',
                      name: 'answer',
                      value: choice.answer,
                      onChange: formik.handleChange,
                      disabled: isAnswered,
                      className:
                        (hasMultipleCorrectAnswers
                          ? 'sm:translate-y-0'
                          : 'sm:-translate-y-px') + ' border-gray-400 ',
                    }),
                    React.createElement(
                      'div',
                      {
                        className:
                          'flex sm:flex-row flex-col sm:items-center items-start justify-between relative w-full pl-2 leading-tighter',
                      },
                      React.createElement(
                        'span',
                        {className: 'flex-grow'},
                        choice.label,
                      ),
                      isAnswered &&
                        React.createElement(
                          'span',
                          {
                            className:
                              'text-xs px-2 rounded-full flex-shrink-0 ' +
                              (isCorrectAnswer(choice)
                                ? 'bg-teal-100 dark:bg-teal-500'
                                : 'bg-pink-100 dark:bg-pink-500'),
                          },
                          isCorrectAnswer(choice) ? 'correct' : 'incorrect',
                        ),
                    ),
                  )
                }),
          ),
          !isAnswered &&
            React.createElement(
              'div',
              {className: 'w-full py-5'},
              formik.errors.answer &&
                React.createElement(
                  'div',
                  {className: 'pb-5 font-medium text-lg'},
                  React.createElement(
                    'span',
                    {role: 'img', 'aria-label': 'Alert'},
                    '\u26A0\uFE0F',
                  ),
                  ' ',
                  formik.errors.answer,
                ),
              React.createElement(submit_1['default'], {
                isAnswered: isAnswered,
                isSubmitting: isSubmitting,
              }),
            ),
          isAnswered &&
            (question === null || question === void 0
              ? void 0
              : question.answer) &&
            React.createElement(react_markdown_1['default'], {
              children: question.answer,
              className: 'prose sm:prose-xl prose-lg pt-5 dark:prose-dark',
            }),
          isAnswered &&
            React.createElement(completed_1['default'], {
              question: question,
              questions: questions,
              answeredCorrectly: answeredCorrectly,
              author: author,
              title: title,
            }),
        )
      }
      exports.default = MultipleChoiceQuestion

      /***/
    },

    /***/ 8813: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) {
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : {default: mod}
        }
      exports.__esModule = true
      var spinner_1 = __importDefault(__webpack_require__(1691))
      var react_1 = __importDefault(__webpack_require__(9297))
      var SubmitButton = function (_a) {
        var isAnswered = _a.isAnswered,
          isSubmitting = _a.isSubmitting
        return react_1['default'].createElement(
          'button',
          {
            type: 'submit',
            disabled: isAnswered,
            className:
              'text-white inline-flex items-center px-6 py-3 text-lg leading-6 font-semibold  rounded-full border-none bg-indigo-600 hover:bg-indigo-800 hover:shadow-xl active:bg-cool-gray-700 transition hover:scale-105 ease-in-out duration-300 shadow-xl ' +
              (isAnswered ? 'cursor-not-allowed' : 'cursor-pointer') +
              '\n      ',
          },
          isSubmitting
            ? react_1['default'].createElement(spinner_1['default'], {
                className: 'w-6 h-6',
              })
            : 'Submit',
        )
      }
      exports.default = SubmitButton

      /***/
    },

    /***/ 8678: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) {
      var __createBinding =
        (this && this.__createBinding) ||
        (Object.create
          ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              Object.defineProperty(o, k2, {
                enumerable: true,
                get: function () {
                  return m[k]
                },
              })
            }
          : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
            })
      var __setModuleDefault =
        (this && this.__setModuleDefault) ||
        (Object.create
          ? function (o, v) {
              Object.defineProperty(o, 'default', {enumerable: true, value: v})
            }
          : function (o, v) {
              o['default'] = v
            })
      var __importStar =
        (this && this.__importStar) ||
        function (mod) {
          if (mod && mod.__esModule) return mod
          var result = {}
          if (mod != null)
            for (var k in mod)
              if (
                k !== 'default' &&
                Object.prototype.hasOwnProperty.call(mod, k)
              )
                __createBinding(result, mod, k)
          __setModuleDefault(result, mod)
          return result
        }
      var __awaiter =
        (this && this.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value)
                })
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value))
              } catch (e) {
                reject(e)
              }
            }
            function rejected(value) {
              try {
                step(generator['throw'](value))
              } catch (e) {
                reject(e)
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected)
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next(),
            )
          })
        }
      var __generator =
        (this && this.__generator) ||
        function (thisArg, body) {
          var _ = {
              label: 0,
              sent: function () {
                if (t[0] & 1) throw t[1]
                return t[1]
              },
              trys: [],
              ops: [],
            },
            f,
            y,
            t,
            g
          return (
            (g = {next: verb(0), throw: verb(1), return: verb(2)}),
            typeof Symbol === 'function' &&
              (g[Symbol.iterator] = function () {
                return this
              }),
            g
          )
          function verb(n) {
            return function (v) {
              return step([n, v])
            }
          }
          function step(op) {
            if (f) throw new TypeError('Generator is already executing.')
            while (_)
              try {
                if (
                  ((f = 1),
                  y &&
                    (t =
                      op[0] & 2
                        ? y['return']
                        : op[0]
                        ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                        : y.next) &&
                    !(t = t.call(y, op[1])).done)
                )
                  return t
                if (((y = 0), t)) op = [op[0] & 2, t.value]
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op
                    break
                  case 4:
                    _.label++
                    return {value: op[1], done: false}
                  case 5:
                    _.label++
                    y = op[1]
                    op = [0]
                    continue
                  case 7:
                    op = _.ops.pop()
                    _.trys.pop()
                    continue
                  default:
                    if (
                      !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                      (op[0] === 6 || op[0] === 2)
                    ) {
                      _ = 0
                      continue
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                      _.label = op[1]
                      break
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1]
                      t = op
                      break
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2]
                      _.ops.push(op)
                      break
                    }
                    if (t[2]) _.ops.pop()
                    _.trys.pop()
                    continue
                }
                op = body.call(thisArg, _)
              } catch (e) {
                op = [6, e]
                y = 0
              } finally {
                f = t = 0
              }
            if (op[0] & 5) throw op[1]
            return {value: op[0] ? op[1] : void 0, done: true}
          }
        }
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : {default: mod}
        }
      exports.__esModule = true
      var axios_1 = __importDefault(__webpack_require__(2376))
      var formik_1 = __webpack_require__(7717)
      var lodash_1 = __webpack_require__(3804)
      var isEmpty_1 = __importDefault(__webpack_require__(8718))
      var react_1 = __importDefault(__webpack_require__(9297))
      var Yup = __importStar(__webpack_require__(9440))
      var findKey_1 = __importDefault(__webpack_require__(1589))
      function useQuestion(question, questions) {
        var _this = this
        var _a = react_1['default'].useState(),
          answer = _a[0],
          setAnswer = _a[1]
        var _b = react_1['default'].useState(),
          error = _b[0],
          setError = _b[1]
        var _c = question || {},
          tagId = _c.tagId,
          correct = _c.correct
        var hasMultipleCorrectAnswers = lodash_1.isArray(correct)
        var isAnswered = !isEmpty_1['default'](answer)
        var _d = react_1['default'].useState(false),
          isSubmitting = _d[0],
          setSubmitting = _d[1]
        var formik = formik_1.useFormik({
          initialValues: {
            answer: null,
          },
          validationSchema: Yup.object({
            answer: correct
              ? hasMultipleCorrectAnswers
                ? Yup.array()
                    // .min(correct.length, `Pick at least ${correct.length}.`)
                    .required('Please pick at least one option.')
                    .label('Options')
                    .nullable()
                : Yup.string().required('Please pick an option.').nullable()
              : Yup.string()
                  .nullable()
                  .required("Can't stay empty. Mind to elaborate? :)"),
          }),
          onSubmit: function (values) {
            return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                setSubmitting(true)
                axios_1['default']
                  .post('/api/answer', {
                    tagId: tagId,
                    survey: {
                      id: findKey_1['default'](questions, question),
                      answer: values.answer,
                    },
                  })
                  .then(function () {
                    setAnswer(values)
                    setSubmitting(false)
                  })
                return [2 /*return*/]
              })
            })
          },
          validateOnChange: false,
        })
        var isCorrectAnswer = function (choice) {
          return correct && hasMultipleCorrectAnswers
            ? correct.includes(choice.answer)
            : correct ===
                (choice === null || choice === void 0 ? void 0 : choice.answer)
        }
        var answeredCorrectly = function () {
          var allCorrect =
            lodash_1.isArray(
              answer === null || answer === void 0 ? void 0 : answer.answer,
            ) &&
            lodash_1.every(
              answer.answer.map(function (a) {
                return correct === null || correct === void 0
                  ? void 0
                  : correct.includes(a)
              }),
            )
          return isAnswered && hasMultipleCorrectAnswers
            ? allCorrect
            : correct ===
                (answer === null || answer === void 0 ? void 0 : answer.answer)
        }
        return {
          isCorrectAnswer: function (props) {
            return isCorrectAnswer(props)
          },
          answeredCorrectly: answeredCorrectly(),
          onAnswer: formik.handleSubmit,
          hasMultipleCorrectAnswers: hasMultipleCorrectAnswers,
          isSubmitting: isSubmitting,
          isAnswered: isAnswered,
          formik: formik,
          error: error,
        }
      }
      exports.default = useQuestion

      /***/
    },

    /***/ 1386: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) {
      var __createBinding =
        (this && this.__createBinding) ||
        (Object.create
          ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              Object.defineProperty(o, k2, {
                enumerable: true,
                get: function () {
                  return m[k]
                },
              })
            }
          : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
            })
      var __exportStar =
        (this && this.__exportStar) ||
        function (m, exports) {
          for (var p in m)
            if (
              p !== 'default' &&
              !Object.prototype.hasOwnProperty.call(exports, p)
            )
              __createBinding(exports, m, p)
        }
      exports.__esModule = true
      exports.quizAnswerApiHandler =
        exports.QuizAnswerPage =
        exports.useQuizQuestion =
          void 0
      var use_quiz_question_1 = __webpack_require__(8678)
      __createBinding(
        exports,
        use_quiz_question_1,
        'default',
        'useQuizQuestion',
      )
      var answer_1 = __webpack_require__(9892)
      __createBinding(exports, answer_1, 'default', 'QuizAnswerPage')
      var answer_2 = __webpack_require__(3114)
      __createBinding(exports, answer_2, 'default', 'quizAnswerApiHandler')
      __exportStar(__webpack_require__(9190), exports)

      /***/
    },

    /***/ 9892: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) {
      var __createBinding =
        (this && this.__createBinding) ||
        (Object.create
          ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              Object.defineProperty(o, k2, {
                enumerable: true,
                get: function () {
                  return m[k]
                },
              })
            }
          : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
            })
      var __setModuleDefault =
        (this && this.__setModuleDefault) ||
        (Object.create
          ? function (o, v) {
              Object.defineProperty(o, 'default', {enumerable: true, value: v})
            }
          : function (o, v) {
              o['default'] = v
            })
      var __importStar =
        (this && this.__importStar) ||
        function (mod) {
          if (mod && mod.__esModule) return mod
          var result = {}
          if (mod != null)
            for (var k in mod)
              if (
                k !== 'default' &&
                Object.prototype.hasOwnProperty.call(mod, k)
              )
                __createBinding(result, mod, k)
          __setModuleDefault(result, mod)
          return result
        }
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : {default: mod}
        }
      exports.__esModule = true
      exports.sampleQuestions = void 0
      var React = __importStar(__webpack_require__(9297))
      var lodash_1 = __webpack_require__(3804)
      var router_1 = __webpack_require__(6731)
      var essay_question_1 = __importDefault(__webpack_require__(5593))
      var multiple_choice_question_1 = __importDefault(
        __webpack_require__(1441),
      )
      var Answer = function (_a) {
        var questions = _a.questions,
          author = _a.author,
          title = _a.title
        var router = router_1.useRouter()
        var _b = React.useState(),
          currentQuestion = _b[0],
          setCurrentQuestion = _b[1]
        React.useEffect(
          function () {
            var param = lodash_1.get(router.query, 'question')
            if (!lodash_1.isEmpty(param)) {
              var question = lodash_1.get(questions, param)
              setCurrentQuestion(question)
            }
          },
          [router],
        )
        var QuestionToShow = function (questions) {
          if (!currentQuestion) {
            return null
          }
          switch (currentQuestion.type) {
            case 'multiple-choice':
              return React.createElement(
                multiple_choice_question_1['default'],
                {
                  question: currentQuestion,
                  questions: questions,
                  author: author,
                  title: title,
                },
              )
            default:
              return React.createElement(essay_question_1['default'], {
                question: currentQuestion,
                questions: questions,
                author: author,
                title: title,
              })
          }
        }
        return React.createElement(
          React.Fragment,
          null,
          React.createElement(DevTools, {questions: questions}),
          React.createElement(
            'div',
            {
              className:
                'max-w-screen-sm w-full mx-auto flex items-center justify-center xl:pt-36 md:pt-32 pt-24 sm:pb-16 pb-8',
            },
            QuestionToShow(questions),
          ),
        )
      }
      exports.sampleQuestions = {
        essay: {
          question: '## Lorem ipsum dolor sit amet?',
          type: 'essay',
          tagId: 0,
        },
        trueFalse: {
          question: '## True or false: Lorem ipsum dolor sit amet?',
          type: 'multiple-choice',
          tagId: 0,
          correct: 'true',
          answer: 'Yes! Lorem ipsum!',
          choices: [
            {
              answer: 'true',
              label: 'Yes',
            },
            {
              answer: 'false',
              label: 'No',
            },
          ],
        },
        multipleCorrect: {
          question: '## Lorem ipsum dolor sit amet?',
          type: 'multiple-choice',
          tagId: 0,
          correct: ['one', 'two'],
          answer: 'Yes! Lorem ipsum!',
          choices: [
            {
              answer: 'one',
              label: 'One',
            },
            {
              answer: 'two',
              label: 'Two',
            },
            {
              answer: 'three',
              label: 'Three',
            },
            {
              answer: 'four',
              label: 'Four',
            },
          ],
        },
      }
      var DevTools = function (_a) {
        var questions = _a.questions
        var _b = React.useState(false),
          hidden = _b[0],
          setHidden = _b[1]
        var router = router_1.useRouter()
        if (true) {
          return null
        }
        return React.createElement(
          'nav',
          {
            className:
              'z-10 flex border border-gray-100 dark:border-gray-700 flex-col fixed bottom-5 right-5 rounded-md bg-white dark:bg-gray-800 shadow-xl p-4 sm:visible invisible',
          },
          React.createElement(
            'div',
            {
              className:
                'w-full flex leading-tighter justify-end absolute right-2 top-2',
            },
            React.createElement(
              'button',
              {
                onClick: function () {
                  return setHidden(true)
                },
                className: 'text-xs text-black dark:text-white font-bold',
              },
              React.createElement('span', {className: 'not-sr-only'}, '\u2715'),
              React.createElement(
                'span',
                {className: 'sr-only'},
                'close navigation',
              ),
            ),
          ),
          React.createElement(
            'span',
            {
              className:
                'text-sm font-medium pb-2 text-indigo-600 dark:text-indigo-200',
            },
            'Questions:',
          ),
          React.createElement(
            'ol',
            {className: 'list-decimal list-inside'},
            lodash_1.keys(questions).map(function (q) {
              return React.createElement(
                'li',
                {className: 'pb-1', key: q},
                React.createElement(
                  'a',
                  {
                    href: '/answer?question=' + q,
                    className:
                      lodash_1.get(router.query, 'question') === q
                        ? 'underline'
                        : 'hover:underline',
                  },
                  q,
                ),
              )
            }),
          ),
        )
      }
      exports.default = Answer

      /***/
    },

    /***/ 7295: /***/ (module) => {
      module.exports = require('@xstate/react')

      /***/
    },

    /***/ 2376: /***/ (module) => {
      module.exports = require('axios')

      /***/
    },

    /***/ 8652: /***/ (module) => {
      module.exports = require('client-oauth2')

      /***/
    },

    /***/ 8883: /***/ (module) => {
      module.exports = require('cookie')

      /***/
    },

    /***/ 7717: /***/ (module) => {
      module.exports = require('formik')

      /***/
    },

    /***/ 762: /***/ (module) => {
      module.exports = require('framer-motion')

      /***/
    },

    /***/ 3804: /***/ (module) => {
      module.exports = require('lodash')

      /***/
    },

    /***/ 4105: /***/ (module) => {
      module.exports = require('lodash/filter')

      /***/
    },

    /***/ 3935: /***/ (module) => {
      module.exports = require('lodash/find')

      /***/
    },

    /***/ 1589: /***/ (module) => {
      module.exports = require('lodash/findKey')

      /***/
    },

    /***/ 9741: /***/ (module) => {
      module.exports = require('lodash/first')

      /***/
    },

    /***/ 2566: /***/ (module) => {
      module.exports = require('lodash/get')

      /***/
    },

    /***/ 8718: /***/ (module) => {
      module.exports = require('lodash/isEmpty')

      /***/
    },

    /***/ 6414: /***/ (module) => {
      module.exports = require('lodash/isEqual')

      /***/
    },

    /***/ 3946: /***/ (module) => {
      module.exports = require('lodash/isString')

      /***/
    },

    /***/ 9066: /***/ (module) => {
      module.exports = require('lodash/last')

      /***/
    },

    /***/ 6355: /***/ (module) => {
      module.exports = require('lodash/reduce')

      /***/
    },

    /***/ 805: /***/ (module) => {
      module.exports = require('lodash/shuffle')

      /***/
    },

    /***/ 2364: /***/ (module) => {
      module.exports = require('next-seo')

      /***/
    },

    /***/ 9325: /***/ (module) => {
      module.exports = require('next/dist/server/denormalize-page-path.js')

      /***/
    },

    /***/ 5378: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/i18n/normalize-locale-path.js')

      /***/
    },

    /***/ 7162: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/mitt.js')

      /***/
    },

    /***/ 8773: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router-context.js')

      /***/
    },

    /***/ 2248: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/get-asset-path-from-route.js')

      /***/
    },

    /***/ 9372: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/is-dynamic.js')

      /***/
    },

    /***/ 665: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/parse-relative-url.js')

      /***/
    },

    /***/ 2747: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/querystring.js')

      /***/
    },

    /***/ 333: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/route-matcher.js')

      /***/
    },

    /***/ 3456: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/route-regex.js')

      /***/
    },

    /***/ 7620: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/utils.js')

      /***/
    },

    /***/ 6731: /***/ (module) => {
      module.exports = require('next/router')

      /***/
    },

    /***/ 1366: /***/ (module) => {
      module.exports = require('query-string')

      /***/
    },

    /***/ 9297: /***/ (module) => {
      module.exports = require('react')

      /***/
    },

    /***/ 3703: /***/ (module) => {
      module.exports = require('react-markdown')

      /***/
    },

    /***/ 5282: /***/ (module) => {
      module.exports = require('react/jsx-runtime')

      /***/
    },

    /***/ 2043: /***/ (module) => {
      module.exports = require('xstate')

      /***/
    },

    /***/ 9440: /***/ (module) => {
      module.exports = require('yup')

      /***/
    },
  }
  // load runtime
  var __webpack_require__ = require('../webpack-runtime.js')
  __webpack_require__.C(exports)
  var __webpack_exec__ = (moduleId) =>
    __webpack_require__((__webpack_require__.s = moduleId))
  var __webpack_exports__ = __webpack_require__.X(
    0,
    [800, 345, 676, 106, 667, 383, 587, 422, 691, 114],
    () => __webpack_exec__(3344),
  )
  module.exports = __webpack_exports__
})()
