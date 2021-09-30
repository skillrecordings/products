import React from 'react'

const HighlightedText: React.FC<any> = (props) => {
  return (
    <mark className="bg-white bg-opacity-10 rounded-tr-lg px-1 pb-0.5">
      {props.children}
    </mark>
  )
}

const WithStars: React.FC<any> = (props) => {
  return (
    <strong {...props}>
      <svg
        className="w-5 pr-1 inline-block text-brand-orange"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="none"
        viewBox="0 0 30 30"
      >
        <path
          fill="#FFBB6A"
          fillRule="evenodd"
          d="M30 15A18.734 18.734 0 0115 0 18.734 18.734 0 010 15a18.734 18.734 0 0115 15 18.734 18.734 0 0115-15zm-10 0a6.245 6.245 0 01-5-5 6.245 6.245 0 01-5 5 6.245 6.245 0 015 5 6.245 6.245 0 015-5z"
          clipRule="evenodd"
        />
      </svg>
      {props.children}
      <svg
        className="w-5 pl-1 inline-block text-brand-yellow"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="none"
        viewBox="0 0 30 30"
      >
        <path
          fill="#FFBB6A"
          fillRule="evenodd"
          d="M30 15A18.734 18.734 0 0115 0 18.734 18.734 0 010 15a18.734 18.734 0 0115 15 18.734 18.734 0 0115-15zm-10 0a6.245 6.245 0 01-5-5 6.245 6.245 0 01-5 5 6.245 6.245 0 015 5 6.245 6.245 0 015-5z"
          clipRule="evenodd"
        />
      </svg>
    </strong>
  )
}

const ParagraphWithArrow: React.FC<any> = (props) => {
  return <strong>{props.children}</strong>
}

export {HighlightedText, WithStars, ParagraphWithArrow}
