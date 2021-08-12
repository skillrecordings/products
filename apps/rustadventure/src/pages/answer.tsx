import * as React from 'react'
import {get, isEmpty, keys} from 'lodash'
import {useRouter} from 'next/router'
import Layout from 'layouts'
import Link from 'next/link'
import EssayQuestion from 'components/forms/quiz/essay-question'
import MultipleChoiceQuestion from 'components/forms/quiz/multiple-choice-question'

export type Question = {
  question: string
  type: 'multiple-choice' | 'essay'
  tagId: number
  correct?: string[] | string
  answer?: string
  choices?: {answer: string; label: string}[]
}

export type Questions = {
  [key: string]: Question
}

type AnswerProps = {
  questions: Questions
}

const Answer: React.FC<AnswerProps> = () => {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = React.useState<Question>()

  React.useEffect(() => {
    const param: any = get(router.query, 'question')
    if (!isEmpty(param)) {
      const question = get(questions, param)
      setCurrentQuestion(question)
    }
  }, [router])

  const QuestionToShow = () => {
    if (!currentQuestion) {
      return null
    }
    switch (currentQuestion.type as string) {
      case 'multiple-choice':
        return <MultipleChoiceQuestion question={currentQuestion as Question} />
      default:
        return <EssayQuestion question={currentQuestion as Question} />
    }
  }

  return (
    <>
      <DevTools questions={questions} />
      <Layout noIndex meta={{title: 'Quiz'}}>
        <header>
          <Link href="/">
            <a aria-label="Home" className="sm:w-36 w-28 sm:mt-6 mt-4 absolute">
              <h1 className="sr-only">Quiz</h1>
            </a>
          </Link>
        </header>
        <div className="max-w-screen-sm w-full mx-auto flex items-center justify-center xl:pt-36 md:pt-32 pt-24 sm:pb-16 pb-8">
          {QuestionToShow()}
        </div>
      </Layout>
    </>
  )
}

export const questions: Questions = {
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
    type: `essay`, // ec - ra - 004 HTTP Requests completed
    tagId: 2479310,
  },
}

const DevTools: React.FC<{questions: Questions}> = ({questions}) => {
  const [hidden, setHidden] = React.useState(false)
  const router = useRouter()
  if (process.env.NODE_ENV !== 'development' || hidden) {
    return null
  }

  return (
    <nav className="z-10 flex border border-gray-100 flex-col fixed top-5 right-5 rounded-md bg-white shadow-xl p-4 sm:visible invisible">
      <div className="w-full flex leading-tighter justify-end absolute right-2 top-2">
        <button
          onClick={() => setHidden(true)}
          className="text-xs text-black font-bold"
        >
          <span className="not-sr-only">✕</span>
          <span className="sr-only">close navigation</span>
        </button>
      </div>
      <span className="text-sm font-medium pb-2 text-indigo-600">
        Questions:
      </span>
      <ol className="list-decimal list-inside">
        {keys(questions).map((q) => (
          <li className="pb-1" key={q}>
            <a
              href={`/answer?question=${q}`}
              className={
                get(router.query, 'question') === q
                  ? 'underline'
                  : 'hover:underline'
              }
            >
              {q}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
export default Answer
