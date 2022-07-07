import {faq} from './faq'
import ReactMarkdown from 'react-markdown'

const FAQ = () => {
  return (
    <ul className="grid md:grid-cols-2 grid-cols-1 gap-16 px-5">
      {faq.map(({question, answer}) => {
        return (
          <li key={question}>
            <strong className="pb-4 inline-block sm:text-2xl text-xl font-heading">
              {question}
            </strong>
            <ReactMarkdown className="prose">{answer}</ReactMarkdown>
          </li>
        )
      })}
    </ul>
  )
}

export default FAQ
