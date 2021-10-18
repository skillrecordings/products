;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [878],
  {
    63344: function (e, t, r) {
      'use strict'
      r.r(t),
        r.d(t, {
          __N_SSG: function () {
            return o
          },
        })
      r(29901)
      var n = r(1386),
        a = r(22239),
        l = r(61250),
        o = !0
      t.default = function (e) {
        var t = e.questions
        return (0, l.jsx)(a.Z, {
          noIndex: !0,
          meta: {title: 'Quiz'},
          children: (0, l.jsx)(n.QuizAnswerPage, {
            questions: t,
            author: 'Chris Biscardi',
            title: 'Rust Adventure',
          }),
        })
      }
    },
    56079: function (e, t, r) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/answer',
        function () {
          return r(63344)
        },
      ])
    },
    43009: function (e, t, r) {
      'use strict'
      var n =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : {default: e}
        }
      t.__esModule = !0
      var a = n(r(29901)),
        l = n(r(77875))
      t.default = function (e) {
        var t = e.answeredCorrectly,
          r = e.neutral,
          n = void 0 !== r && r,
          o = e.question,
          i = e.questions,
          s = e.title,
          u = void 0 === s ? 'Skill Recordings Product' : s,
          c = e.author,
          d = void 0 === c ? 'Your Instructor' : c,
          f = Object.keys(i),
          m = i[l.default(f) || ''].tagId === o.tagId,
          p = a.default.createElement(
            'span',
            {className: 'sr-only'},
            'Quiz complete.\xa0',
          ),
          h = a.default.useRef()
        return (
          a.default.useEffect(function () {
            h.current.focus()
          }, []),
          a.default.createElement(
            a.default.Fragment,
            null,
            n
              ? a.default.createElement(
                  'div',
                  {
                    className:
                      'pt-10 prose prose-lg text-center sm:prose-xl dark:prose-dark',
                  },
                  m
                    ? a.default.createElement(
                        'p',
                        {tabIndex: -1, ref: h},
                        p,
                        'This was the last lesson from the ',
                        u,
                        ' email course. We hope you learned something new, and we look forward to sharing more in the future!',
                      )
                    : a.default.createElement(
                        'p',
                        {tabIndex: -1, ref: h},
                        p,
                        a.default.createElement(
                          'span',
                          null,
                          "Thanks for submitting your answer! We'll send the next lesson in 5-10 minutes. Check your inbox.",
                        ),
                      ),
                  a.default.createElement(
                    'p',
                    null,
                    'Thanks, ',
                    a.default.createElement('br', null),
                    ' ',
                    d,
                  ),
                )
              : t
              ? a.default.createElement(
                  'div',
                  {
                    className:
                      'pt-10 mt-10 prose prose-lg text-center border-t border-gray-200 sm:prose-xl dark:prose-dark dark:border-gray-700',
                  },
                  a.default.createElement(
                    'p',
                    {tabIndex: -1, ref: h},
                    'Nice work. You chose the correct answer!',
                  ),
                  m
                    ? a.default.createElement(
                        'p',
                        null,
                        'This was the last lesson from the ',
                        u,
                        ' email course. We hope you learned something new, and I look forward to sharing more in the future!',
                      )
                    : a.default.createElement(
                        'p',
                        null,
                        "We'll send the next lesson in 5-10 minutes. Check your inbox.",
                      ),
                  a.default.createElement(
                    'p',
                    null,
                    'Thanks, ',
                    a.default.createElement('br', null),
                    ' ',
                    d,
                  ),
                )
              : a.default.createElement(
                  'div',
                  {
                    className:
                      'pt-10 mt-10 prose prose-lg text-center border-t border-gray-200 sm:prose-xl dark:prose-dark dark:border-gray-700',
                  },
                  a.default.createElement(
                    'p',
                    {tabIndex: -1, ref: h},
                    "You chose an incorrect answer, but don't worry. Just go back and re-read the email and check out any linked resources. You can refresh the page if you'd like to try again! \ud83d\udc4d",
                  ),
                  m
                    ? a.default.createElement(
                        'p',
                        null,
                        'This was the last lesson from the ',
                        u,
                        ' email course. We hope you learned something new, and I look forward to sharing more in the future!',
                      )
                    : a.default.createElement(
                        'p',
                        null,
                        "We'll send the next email in 5-10 minutes too so you can learn more.",
                      ),
                  a.default.createElement(
                    'p',
                    null,
                    'Thanks, ',
                    a.default.createElement('br', null),
                    ' ',
                    d,
                  ),
                ),
          )
        )
      }
    },
    25593: function (e, t, r) {
      'use strict'
      var n =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, r, n) {
                void 0 === n && (n = r),
                  Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: function () {
                      return t[r]
                    },
                  })
              }
            : function (e, t, r, n) {
                void 0 === n && (n = r), (e[n] = t[r])
              }),
        a =
          (this && this.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, 'default', {enumerable: !0, value: t})
              }
            : function (e, t) {
                e.default = t
              }),
        l =
          (this && this.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e
            var t = {}
            if (null != e)
              for (var r in e)
                'default' !== r &&
                  Object.prototype.hasOwnProperty.call(e, r) &&
                  n(t, e, r)
            return a(t, e), t
          },
        o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : {default: e}
          }
      t.__esModule = !0
      var i = l(r(29901)),
        s = o(r(99333)),
        u = o(r(8678)),
        c = o(r(38813)),
        d = o(r(43009))
      t.default = function (e) {
        var t = e.question,
          r = e.questions,
          n = e.author,
          a = e.title,
          l = u.default(t, r),
          o = l.formik,
          f = l.onAnswer,
          m = l.isAnswered,
          p = (l.answeredCorrectly, l.isSubmitting)
        return i.createElement(
          'form',
          {onSubmit: f, className: 'w-full'},
          i.createElement(
            'legend',
            {className: 'lg:text-4xl sm:text-3xl text-2xl font-semibold pb-6'},
            i.createElement(s.default, {
              className: 'prose lg:prose-xl sm:prose-lg dark:prose-dark',
              children: null === t || void 0 === t ? void 0 : t.question,
            }),
          ),
          i.createElement(
            'label',
            null,
            i.createElement(
              'span',
              {
                className:
                  'text-xl font-medium pb-2 inline-block text-gray-800 dark:text-gray-300',
              },
              'Please explain:',
            ),
            i.createElement('textarea', {
              disabled: m,
              name: 'answer',
              onChange: o.handleChange,
              rows: 6,
              className:
                'form-textarea w-full text-lg dark:bg-gray-800 dark:text-white rounded-lg dark:placeholder-gray-500',
              placeholder: 'Type your answer here...',
            }),
          ),
          !m &&
            i.createElement(
              'div',
              {className: 'w-full py-5'},
              o.errors.answer &&
                i.createElement(
                  'div',
                  {className: 'pb-5 font-medium text-lg'},
                  i.createElement(
                    'span',
                    {role: 'img', 'aria-label': 'Alert'},
                    '\u26a0\ufe0f',
                  ),
                  ' ',
                  o.errors.answer,
                ),
              i.createElement(c.default, {isSubmitting: p, isAnswered: m}),
            ),
          m &&
            (null === t || void 0 === t ? void 0 : t.answer) &&
            i.createElement(s.default, {
              children: t.answer,
              className: 'prose sm:prose-xl prose-lg pt-5',
            }),
          m &&
            i.createElement(d.default, {
              questions: r,
              question: t,
              neutral: !0,
              author: n,
              title: a,
            }),
        )
      }
    },
    59190: function (e, t, r) {
      'use strict'
      var n =
        (this && this.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              void 0 === n && (n = r),
                Object.defineProperty(e, n, {
                  enumerable: !0,
                  get: function () {
                    return t[r]
                  },
                })
            }
          : function (e, t, r, n) {
              void 0 === n && (n = r), (e[n] = t[r])
            })
      ;(t.__esModule = !0),
        (t.Submit =
          t.MultipleChoiceQuestion =
          t.EssayQuestion =
          t.CompletedQuiz =
            void 0),
        n(t, r(43009), 'default', 'CompletedQuiz'),
        n(t, r(25593), 'default', 'EssayQuestion'),
        n(t, r(91441), 'default', 'MultipleChoiceQuestion'),
        n(t, r(38813), 'default', 'Submit')
    },
    91441: function (e, t, r) {
      'use strict'
      var n =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, r, n) {
                void 0 === n && (n = r),
                  Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: function () {
                      return t[r]
                    },
                  })
              }
            : function (e, t, r, n) {
                void 0 === n && (n = r), (e[n] = t[r])
              }),
        a =
          (this && this.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, 'default', {enumerable: !0, value: t})
              }
            : function (e, t) {
                e.default = t
              }),
        l =
          (this && this.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e
            var t = {}
            if (null != e)
              for (var r in e)
                'default' !== r &&
                  Object.prototype.hasOwnProperty.call(e, r) &&
                  n(t, e, r)
            return a(t, e), t
          },
        o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : {default: e}
          }
      t.__esModule = !0
      var i = l(r(29901)),
        s = o(r(99333)),
        u = o(r(8678)),
        c = o(r(38813)),
        d = o(r(43009)),
        f = o(r(74137))
      t.default = function (e) {
        var t = e.question,
          r = e.questions,
          n = e.author,
          a = e.title,
          l = u.default(t, r),
          o = l.formik,
          m = l.onAnswer,
          p = l.hasMultipleCorrectAnswers,
          h = l.isCorrectAnswer,
          b = l.isSubmitting,
          v = l.answeredCorrectly,
          w = l.isAnswered,
          g = i.useState([]),
          _ = g[0],
          y = g[1]
        return (
          i.useEffect(function () {
            y(f.default(null === t || void 0 === t ? void 0 : t.choices))
          }, []),
          i.createElement(
            'form',
            {onSubmit: m, className: 'w-full'},
            i.createElement(
              'legend',
              {
                className:
                  'lg:text-4xl sm:text-3xl text-2xl font-semibold pb-6',
              },
              i.createElement(s.default, {
                className: 'prose lg:prose-xl sm:prose-lg dark:prose-dark',
                children: null === t || void 0 === t ? void 0 : t.question,
              }),
            ),
            i.createElement(
              'div',
              {className: 'flex flex-col', 'aria-required': !0},
              null === _ || void 0 === _
                ? void 0
                : _.map(function (e) {
                    return i.createElement(
                      'label',
                      {
                        key: e.answer,
                        className:
                          'text-lg font-medium group flex items-center rounded-lg sm:p-4 p-3 mb-2 border transition-all ease-in-our duration-200 ' +
                          (w ? 'cursor-default' : 'cursor-pointer') +
                          '  ' +
                          (w
                            ? h(e)
                              ? 'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-500 dark:bg-opacity-10 dark:text-teal-100 dark:border-teal-500'
                              : 'bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-500 dark:bg-opacity-10 dark:border-pink-500 dark:text-pink-100'
                            : 'border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'),
                      },
                      i.createElement('input', {
                        type: p ? 'checkbox' : 'radio',
                        name: 'answer',
                        value: e.answer,
                        onChange: o.handleChange,
                        disabled: w,
                        className:
                          (p ? 'sm:translate-y-0' : 'sm:-translate-y-px') +
                          ' border-gray-400 ',
                      }),
                      i.createElement(
                        'div',
                        {
                          className:
                            'flex sm:flex-row flex-col sm:items-center items-start justify-between relative w-full pl-2 leading-tighter',
                        },
                        i.createElement(
                          'span',
                          {className: 'flex-grow'},
                          e.label,
                        ),
                        w &&
                          i.createElement(
                            'span',
                            {
                              className:
                                'text-xs px-2 rounded-full flex-shrink-0 ' +
                                (h(e)
                                  ? 'bg-teal-100 dark:bg-teal-500'
                                  : 'bg-pink-100 dark:bg-pink-500'),
                            },
                            h(e) ? 'correct' : 'incorrect',
                          ),
                      ),
                    )
                  }),
            ),
            !w &&
              i.createElement(
                'div',
                {className: 'w-full py-5'},
                o.errors.answer &&
                  i.createElement(
                    'div',
                    {className: 'pb-5 font-medium text-lg'},
                    i.createElement(
                      'span',
                      {role: 'img', 'aria-label': 'Alert'},
                      '\u26a0\ufe0f',
                    ),
                    ' ',
                    o.errors.answer,
                  ),
                i.createElement(c.default, {isAnswered: w, isSubmitting: b}),
              ),
            w &&
              (null === t || void 0 === t ? void 0 : t.answer) &&
              i.createElement(s.default, {
                children: t.answer,
                className: 'prose sm:prose-xl prose-lg pt-5 dark:prose-dark',
              }),
            w &&
              i.createElement(d.default, {
                question: t,
                questions: r,
                answeredCorrectly: v,
                author: n,
                title: a,
              }),
          )
        )
      }
    },
    38813: function (e, t, r) {
      'use strict'
      var n =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : {default: e}
        }
      t.__esModule = !0
      var a = n(r(61691)),
        l = n(r(29901))
      t.default = function (e) {
        var t = e.isAnswered,
          r = e.isSubmitting
        return l.default.createElement(
          'button',
          {
            type: 'submit',
            disabled: t,
            className:
              'text-white inline-flex items-center px-6 py-3 text-lg leading-6 font-semibold  rounded-full border-none bg-indigo-600 hover:bg-indigo-800 hover:shadow-xl active:bg-cool-gray-700 transition hover:scale-105 ease-in-out duration-300 shadow-xl ' +
              (t ? 'cursor-not-allowed' : 'cursor-pointer') +
              '\n      ',
          },
          r
            ? l.default.createElement(a.default, {className: 'w-6 h-6'})
            : 'Submit',
        )
      }
    },
    8678: function (e, t, r) {
      'use strict'
      var n =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, r, n) {
                void 0 === n && (n = r),
                  Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: function () {
                      return t[r]
                    },
                  })
              }
            : function (e, t, r, n) {
                void 0 === n && (n = r), (e[n] = t[r])
              }),
        a =
          (this && this.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, 'default', {enumerable: !0, value: t})
              }
            : function (e, t) {
                e.default = t
              }),
        l =
          (this && this.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e
            var t = {}
            if (null != e)
              for (var r in e)
                'default' !== r &&
                  Object.prototype.hasOwnProperty.call(e, r) &&
                  n(t, e, r)
            return a(t, e), t
          },
        o =
          (this && this.__awaiter) ||
          function (e, t, r, n) {
            return new (r || (r = Promise))(function (a, l) {
              function o(e) {
                try {
                  s(n.next(e))
                } catch (t) {
                  l(t)
                }
              }
              function i(e) {
                try {
                  s(n.throw(e))
                } catch (t) {
                  l(t)
                }
              }
              function s(e) {
                var t
                e.done
                  ? a(e.value)
                  : ((t = e.value),
                    t instanceof r
                      ? t
                      : new r(function (e) {
                          e(t)
                        })).then(o, i)
              }
              s((n = n.apply(e, t || [])).next())
            })
          },
        i =
          (this && this.__generator) ||
          function (e, t) {
            var r,
              n,
              a,
              l,
              o = {
                label: 0,
                sent: function () {
                  if (1 & a[0]) throw a[1]
                  return a[1]
                },
                trys: [],
                ops: [],
              }
            return (
              (l = {next: i(0), throw: i(1), return: i(2)}),
              'function' === typeof Symbol &&
                (l[Symbol.iterator] = function () {
                  return this
                }),
              l
            )
            function i(l) {
              return function (i) {
                return (function (l) {
                  if (r) throw new TypeError('Generator is already executing.')
                  for (; o; )
                    try {
                      if (
                        ((r = 1),
                        n &&
                          (a =
                            2 & l[0]
                              ? n.return
                              : l[0]
                              ? n.throw || ((a = n.return) && a.call(n), 0)
                              : n.next) &&
                          !(a = a.call(n, l[1])).done)
                      )
                        return a
                      switch (((n = 0), a && (l = [2 & l[0], a.value]), l[0])) {
                        case 0:
                        case 1:
                          a = l
                          break
                        case 4:
                          return o.label++, {value: l[1], done: !1}
                        case 5:
                          o.label++, (n = l[1]), (l = [0])
                          continue
                        case 7:
                          ;(l = o.ops.pop()), o.trys.pop()
                          continue
                        default:
                          if (
                            !(a = (a = o.trys).length > 0 && a[a.length - 1]) &&
                            (6 === l[0] || 2 === l[0])
                          ) {
                            o = 0
                            continue
                          }
                          if (
                            3 === l[0] &&
                            (!a || (l[1] > a[0] && l[1] < a[3]))
                          ) {
                            o.label = l[1]
                            break
                          }
                          if (6 === l[0] && o.label < a[1]) {
                            ;(o.label = a[1]), (a = l)
                            break
                          }
                          if (a && o.label < a[2]) {
                            ;(o.label = a[2]), o.ops.push(l)
                            break
                          }
                          a[2] && o.ops.pop(), o.trys.pop()
                          continue
                      }
                      l = t.call(e, o)
                    } catch (i) {
                      ;(l = [6, i]), (n = 0)
                    } finally {
                      r = a = 0
                    }
                  if (5 & l[0]) throw l[1]
                  return {value: l[0] ? l[1] : void 0, done: !0}
                })([l, i])
              }
            }
          },
        s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : {default: e}
          }
      t.__esModule = !0
      var u = s(r(44186)),
        c = r(85897),
        d = r(39378),
        f = s(r(29787)),
        m = s(r(29901)),
        p = l(r(76431)),
        h = s(r(81193))
      t.default = function (e, t) {
        var r = this,
          n = m.default.useState(),
          a = n[0],
          l = n[1],
          s = m.default.useState(),
          b = s[0],
          v = (s[1], e || {}),
          w = v.tagId,
          g = v.correct,
          _ = d.isArray(g),
          y = !f.default(a),
          x = m.default.useState(!1),
          k = x[0],
          E = x[1],
          O = c.useFormik({
            initialValues: {answer: null},
            validationSchema: p.object({
              answer: g
                ? _
                  ? p
                      .array()
                      .required('Please pick at least one option.')
                      .label('Options')
                      .nullable()
                  : p.string().required('Please pick an option.').nullable()
                : p
                    .string()
                    .nullable()
                    .required("Can't stay empty. Mind to elaborate? :)"),
            }),
            onSubmit: function (n) {
              return o(r, void 0, void 0, function () {
                return i(this, function (r) {
                  return (
                    E(!0),
                    u.default
                      .post('/api/answer', {
                        tagId: w,
                        survey: {id: h.default(t, e), answer: n.answer},
                      })
                      .then(function () {
                        l(n), E(!1)
                      }),
                    [2]
                  )
                })
              })
            },
            validateOnChange: !1,
          })
        return {
          isCorrectAnswer: function (e) {
            return (
              (t = e),
              g && _
                ? g.includes(t.answer)
                : g === (null === t || void 0 === t ? void 0 : t.answer)
            )
            var t
          },
          answeredCorrectly: (function () {
            var e =
              d.isArray(null === a || void 0 === a ? void 0 : a.answer) &&
              d.every(
                a.answer.map(function (e) {
                  return null === g || void 0 === g ? void 0 : g.includes(e)
                }),
              )
            return y && _
              ? e
              : g === (null === a || void 0 === a ? void 0 : a.answer)
          })(),
          onAnswer: O.handleSubmit,
          hasMultipleCorrectAnswers: _,
          isSubmitting: k,
          isAnswered: y,
          formik: O,
          error: b,
        }
      }
    },
    1386: function (e, t, r) {
      'use strict'
      var n =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, r, n) {
                void 0 === n && (n = r),
                  Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: function () {
                      return t[r]
                    },
                  })
              }
            : function (e, t, r, n) {
                void 0 === n && (n = r), (e[n] = t[r])
              }),
        a =
          (this && this.__exportStar) ||
          function (e, t) {
            for (var r in e)
              'default' === r ||
                Object.prototype.hasOwnProperty.call(t, r) ||
                n(t, e, r)
          }
      ;(t.__esModule = !0),
        (t.quizAnswerApiHandler = t.QuizAnswerPage = t.useQuizQuestion = void 0)
      var l = r(8678)
      n(t, l, 'default', 'useQuizQuestion')
      var o = r(39892)
      n(t, o, 'default', 'QuizAnswerPage')
      var i = r(93114)
      n(t, i, 'default', 'quizAnswerApiHandler'), a(r(59190), t)
    },
    39892: function (e, t, r) {
      'use strict'
      var n =
          (this && this.__createBinding) ||
          (Object.create
            ? function (e, t, r, n) {
                void 0 === n && (n = r),
                  Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: function () {
                      return t[r]
                    },
                  })
              }
            : function (e, t, r, n) {
                void 0 === n && (n = r), (e[n] = t[r])
              }),
        a =
          (this && this.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, 'default', {enumerable: !0, value: t})
              }
            : function (e, t) {
                e.default = t
              }),
        l =
          (this && this.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e
            var t = {}
            if (null != e)
              for (var r in e)
                'default' !== r &&
                  Object.prototype.hasOwnProperty.call(e, r) &&
                  n(t, e, r)
            return a(t, e), t
          },
        o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : {default: e}
          }
      ;(t.__esModule = !0), (t.sampleQuestions = void 0)
      var i = l(r(29901)),
        s = r(39378),
        u = r(78905),
        c = o(r(25593)),
        d = o(r(91441))
      t.sampleQuestions = {
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
            {answer: 'true', label: 'Yes'},
            {answer: 'false', label: 'No'},
          ],
        },
        multipleCorrect: {
          question: '## Lorem ipsum dolor sit amet?',
          type: 'multiple-choice',
          tagId: 0,
          correct: ['one', 'two'],
          answer: 'Yes! Lorem ipsum!',
          choices: [
            {answer: 'one', label: 'One'},
            {answer: 'two', label: 'Two'},
            {answer: 'three', label: 'Three'},
            {answer: 'four', label: 'Four'},
          ],
        },
      }
      var f = function (e) {
        e.questions
        var t = i.useState(!1)
        t[0], t[1], u.useRouter()
        return null
      }
      t.default = function (e) {
        var t = e.questions,
          r = e.author,
          n = e.title,
          a = u.useRouter(),
          l = i.useState(),
          o = l[0],
          m = l[1]
        i.useEffect(
          function () {
            var e = s.get(a.query, 'question')
            if (!s.isEmpty(e)) {
              var r = s.get(t, e)
              m(r)
            }
          },
          [a],
        )
        return i.createElement(
          i.Fragment,
          null,
          i.createElement(f, {questions: t}),
          i.createElement(
            'div',
            {
              className:
                'max-w-screen-sm w-full mx-auto flex items-center justify-center xl:pt-36 md:pt-32 pt-24 sm:pb-16 pb-8',
            },
            (function (e) {
              if (!o) return null
              switch (o.type) {
                case 'multiple-choice':
                  return i.createElement(d.default, {
                    question: o,
                    questions: e,
                    author: r,
                    title: n,
                  })
                default:
                  return i.createElement(c.default, {
                    question: o,
                    questions: e,
                    author: r,
                    title: n,
                  })
              }
            })(t),
          ),
        )
      }
    },
    93114: function (e, t, r) {
      'use strict'
      var n = r(73656),
        a =
          (this && this.__awaiter) ||
          function (e, t, r, n) {
            return new (r || (r = Promise))(function (a, l) {
              function o(e) {
                try {
                  s(n.next(e))
                } catch (t) {
                  l(t)
                }
              }
              function i(e) {
                try {
                  s(n.throw(e))
                } catch (t) {
                  l(t)
                }
              }
              function s(e) {
                var t
                e.done
                  ? a(e.value)
                  : ((t = e.value),
                    t instanceof r
                      ? t
                      : new r(function (e) {
                          e(t)
                        })).then(o, i)
              }
              s((n = n.apply(e, t || [])).next())
            })
          },
        l =
          (this && this.__generator) ||
          function (e, t) {
            var r,
              n,
              a,
              l,
              o = {
                label: 0,
                sent: function () {
                  if (1 & a[0]) throw a[1]
                  return a[1]
                },
                trys: [],
                ops: [],
              }
            return (
              (l = {next: i(0), throw: i(1), return: i(2)}),
              'function' === typeof Symbol &&
                (l[Symbol.iterator] = function () {
                  return this
                }),
              l
            )
            function i(l) {
              return function (i) {
                return (function (l) {
                  if (r) throw new TypeError('Generator is already executing.')
                  for (; o; )
                    try {
                      if (
                        ((r = 1),
                        n &&
                          (a =
                            2 & l[0]
                              ? n.return
                              : l[0]
                              ? n.throw || ((a = n.return) && a.call(n), 0)
                              : n.next) &&
                          !(a = a.call(n, l[1])).done)
                      )
                        return a
                      switch (((n = 0), a && (l = [2 & l[0], a.value]), l[0])) {
                        case 0:
                        case 1:
                          a = l
                          break
                        case 4:
                          return o.label++, {value: l[1], done: !1}
                        case 5:
                          o.label++, (n = l[1]), (l = [0])
                          continue
                        case 7:
                          ;(l = o.ops.pop()), o.trys.pop()
                          continue
                        default:
                          if (
                            !(a = (a = o.trys).length > 0 && a[a.length - 1]) &&
                            (6 === l[0] || 2 === l[0])
                          ) {
                            o = 0
                            continue
                          }
                          if (
                            3 === l[0] &&
                            (!a || (l[1] > a[0] && l[1] < a[3]))
                          ) {
                            o.label = l[1]
                            break
                          }
                          if (6 === l[0] && o.label < a[1]) {
                            ;(o.label = a[1]), (a = l)
                            break
                          }
                          if (a && o.label < a[2]) {
                            ;(o.label = a[2]), o.ops.push(l)
                            break
                          }
                          a[2] && o.ops.pop(), o.trys.pop()
                          continue
                      }
                      l = t.call(e, o)
                    } catch (i) {
                      ;(l = [6, i]), (n = 0)
                    } finally {
                      r = a = 0
                    }
                  if (5 & l[0]) throw l[1]
                  return {value: l[0] ? l[1] : void 0, done: !0}
                })([l, i])
              }
            }
          },
        o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : {default: e}
          }
      t.__esModule = !0
      var i = r(44106),
        s = o(r(97422)),
        u = o(r(29787)),
        c = o(r(26969))
      if (!r(92519).CONVERTKIT_BASE_URL)
        throw new Error('No Convertkit API Base Url Found: CONVERTKIT_BASE_URL')
      t.default = function (e, t) {
        return a(void 0, void 0, void 0, function () {
          var r, a, o, d, f, m, p, h, b, v, w
          return l(this, function (l) {
            switch (l.label) {
              case 0:
                if ('POST' !== e.method) return [3, 9]
                l.label = 1
              case 1:
                return (
                  l.trys.push([1, 7, , 8]),
                  (r = e.body),
                  (a = r.tagId),
                  (o = r.survey),
                  (d = e.headers.cookie),
                  (f = n.env.NEXT_PUBLIC_SITE_NAME_SHORT),
                  [4, s.default(d)]
                )
              case 2:
                return (
                  (m = l.sent()),
                  (p = m[0]),
                  (h = m[1]),
                  (b = f ? f + '-survey-' + o.id : 'survey-' + o.id),
                  [
                    4,
                    i.convertkitAxios.post('/tags/' + a + '/subscribe', {
                      api_key: '1FReP6d6e79X7Ttl8qyKmQ',
                      email: p.email_address,
                    }),
                  ]
                )
              case 3:
                return (
                  l.sent(),
                  !u.default(
                    c.default(Object.keys(p.fields), function (e) {
                      return e === b
                    }),
                  )
                    ? [3, 5]
                    : [
                        4,
                        i.convertkitAxios.post('/custom_fields', {
                          api_secret: n.env.CONVERTKIT_API_SECRET,
                          label: b,
                        }),
                      ]
                )
              case 4:
                l.sent(), (l.label = 5)
              case 5:
                return [
                  4,
                  i.convertkitAxios.put('/subscribers/' + p.id, {
                    api_secret: n.env.CONVERTKIT_API_SECRET,
                    fields: ((w = {}), (w[b] = o.answer), w),
                  }),
                ]
              case 6:
                return (
                  l.sent(),
                  t.setHeader('Set-Cookie', h),
                  t.setHeader('Cache-Control', 'max-age=10'),
                  t.status(200).json(p),
                  [3, 8]
                )
              case 7:
                return (
                  (v = l.sent()), console.log(v), t.status(200).end(), [3, 8]
                )
              case 8:
                return [3, 10]
              case 9:
                console.error('non-post request made'),
                  t.status(404).end(),
                  (l.label = 10)
              case 10:
                return [2]
            }
          })
        })
      }
    },
  },
  function (e) {
    e.O(0, [358, 333, 473, 239, 888, 179], function () {
      return (t = 56079), e((e.s = t))
      var t
    })
    var t = e.O()
    _N_E = t
  },
])
