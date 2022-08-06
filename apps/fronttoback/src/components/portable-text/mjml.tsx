import {PortableText, PortableTextComponents} from '@portabletext/react'
import {TypedObject} from '@portabletext/types'
import get from 'lodash/get'
import first from 'lodash/first'
import {
  MjmlButton,
  MjmlImage,
  MjmlText,
  MjmlGroup,
  MjmlRaw,
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlPreview,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlAll,
  MjmlAttributes,
  MjmlFont,
  MjmlStyle,
} from 'mjml-react'

import Refractor from 'react-refractor'

import jsx from 'refractor/lang/jsx'
import tsx from 'refractor/lang/tsx'
import css from 'refractor/lang/css'
import javascript from 'refractor/lang/javascript'
import React from 'react'
import {prism} from 'styles/prism'

type EmailTemplateProps = {
  emailBody: TypedObject
  title: string
  image: {
    src: string
    alt: string
  }
  description?: string
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  emailBody,
  title,
  image,
  description,
}) => {
  return (
    <Mjml>
      <MjmlAttributes>
        <MjmlAll />
      </MjmlAttributes>
      <MjmlHead>
        <MjmlTitle>{title}</MjmlTitle>
        {description && <MjmlPreview>{description}</MjmlPreview>}
        <MjmlFont
          name="Inter"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        />
        <MjmlStyle>{prism}</MjmlStyle>
      </MjmlHead>
      <MjmlBody width={500}>
        <MjmlSection>
          <MjmlColumn>
            {image?.src && <MjmlImage src={image.src} align="left" />}
            <PortableText
              value={emailBody}
              components={portableTextMjmlComponents}
            />
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  )
}

Refractor.registerLanguage(jsx)
Refractor.registerLanguage(tsx)
Refractor.registerLanguage(css)
Refractor.registerLanguage(javascript)

export const portableTextMjmlComponents: PortableTextComponents = {
  block: {
    h1: ({children}) => {
      return (
        <MjmlText
          fontSize={32}
          fontWeight={800}
          lineHeight="1.4"
          fontFamily="Inter"
        >
          {children}
        </MjmlText>
      )
    },
    h2: ({children}) => {
      return (
        <MjmlText
          fontSize={24}
          fontWeight={800}
          lineHeight="1.4"
          fontFamily="Inter"
        >
          {children}
        </MjmlText>
      )
    },
    h3: ({children}) => {
      return (
        <MjmlText
          fontSize={18}
          fontWeight={800}
          lineHeight="1.4"
          fontFamily="Inter"
        >
          {children}
        </MjmlText>
      )
    },
    // p
    normal: ({children}) => {
      return (
        <MjmlText lineHeight="1.65" fontSize={16} fontFamily="Inter">
          {children}
        </MjmlText>
      )
    },
    blockquote: ({children}) => {
      return (
        <MjmlText
          fontStyle="italic"
          lineHeight="1.65"
          fontSize={16}
          fontFamily="Inter"
        >
          {children}
        </MjmlText>
      )
    },
  },
  types: {
    emailImage: ({value}: any) => {
      return (
        <MjmlImage
          align="left"
          width={value.width || '100%'}
          src={value.src}
          alt={value.alt}
        />
      )
    },
    emailButton: ({value}: any) => {
      return (
        <MjmlButton
          fontSize={16}
          padding={20}
          borderRadius={0}
          align="center"
          lineHeight={30}
          backgroundColor="#000"
          color="#FFF"
          href={value.url}
          fontFamily="Inter"
          fontWeight={600}
        >
          {value.label}
        </MjmlButton>
      )
    },
    emailQuizQuestion: ({value}: any) => {
      const ANSWER_URL = `${process.env.NEXT_PUBLIC_URL}/answer?question=${get(
        first(value.question),
        'questionId',
      )}`
      return (
        <MjmlButton
          href={ANSWER_URL}
          fontSize={16}
          padding={20}
          borderRadius={0}
          align="center"
          lineHeight={30}
          backgroundColor="#000"
          color="#FFF"
          fontFamily="Inter"
          fontWeight={600}
        >
          {value.label}
        </MjmlButton>
      )
    },
    code: ({value}: any) => {
      const {code, language} = value
      return (
        <MjmlGroup width="100%">
          <MjmlRaw>
            <pre
              style={{
                fontSize: '14px',
                padding: '16px',
                whiteSpace: 'break-spaces',
                wordBreak: 'break-word',
                wordSpacing: 'normal',
                borderRadius: 5,
                background: '#011627',
                margin: 0,
              }}
            >
              <Refractor inline value={code} language={language} />
            </pre>
          </MjmlRaw>
        </MjmlGroup>
      )
    },
  },
  unknownType: ({children}) => {
    return <MjmlText>{children}</MjmlText>
  },
  unknownBlockStyle: ({children}) => {
    return <MjmlText>{children}</MjmlText>
  },
  unknownList: ({children}) => {
    return <MjmlText>{children}</MjmlText>
  },
  unknownListItem: ({children}) => {
    return <MjmlText>{children}</MjmlText>
  },
  unknownMark: ({children}) => {
    return <MjmlText>{children}</MjmlText>
  },
}
