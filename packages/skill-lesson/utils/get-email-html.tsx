import {
  render,
  Mjml,
  MjmlText,
  MjmlAttributes,
  MjmlAll,
  MjmlHead,
  MjmlTitle,
  MjmlStyle,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlSpacer,
  MjmlRaw,
  MjmlFont,
  MjmlDivider,
} from 'mjml-react'
import {MDXRemote, type MDXRemoteSerializeResult} from 'next-mdx-remote'
import Refractor from 'react-refractor'
import typescript from 'refractor/lang/typescript'
import tsx from 'refractor/lang/tsx'
import jsx from 'refractor/lang/jsx'
import javascript from 'refractor/lang/javascript'
import markdown from 'refractor/lang/markdown'
import json from 'refractor/lang/json'

Refractor.registerLanguage(tsx)
Refractor.registerLanguage(typescript)
Refractor.registerLanguage(javascript)
Refractor.registerLanguage(jsx)
Refractor.registerLanguage(markdown)
Refractor.registerLanguage(json)

export const getEmailHtml = (
  emailBodySerialized: MDXRemoteSerializeResult,
  emailMeta: {title: string; body: string} | any,
) => {
  const {html, errors} = render(
    <Mjml lang="en">
      <MjmlAttributes>
        <MjmlAll fontFamily="Inter, sans-serif" lineHeight="1.65" />
      </MjmlAttributes>
      <MjmlHead>
        <MjmlFont
          name="Inter"
          href="https://fonts.googleapis.com/css2?family=Inter:400;500;600;700"
        />
        <MjmlTitle>{emailMeta.title}</MjmlTitle>
        {/* {description && <MjmlPreview>{description}</MjmlPreview>} */}
        <MjmlStyle>{prism}</MjmlStyle>
        <MjmlRaw>
          <style type="text/css">
            {`
          <!--[if mso]>
          <style type="text/css">
          body, table, td, a {font-family: Inter, Helvetica, sans-serif !important;}
          </style>
          <![endif]>
          `}
          </style>
        </MjmlRaw>
        <MjmlRaw>
          <meta name="color-scheme" content="light" />
          <meta name="supported-color-schemes" content="light" />
        </MjmlRaw>
      </MjmlHead>
      <MjmlBody>
        <MjmlSection>
          <MjmlColumn>
            <MDXRemote
              {...emailBodySerialized}
              components={{
                p: ({children}: any) => (
                  <MjmlText
                    fontFamily="Inter, Helvetica, Arial, sans-serif"
                    fontSize="16px"
                    lineHeight="1.65"
                  >
                    {children}
                  </MjmlText>
                ),
                a: ({children, href}: any) => {
                  return (
                    <MjmlText fontFamily="Inter, Helvetica, Arial, sans-serif">
                      <a
                        style={{
                          color: '#3b82f6',
                          textDecoration: 'underline',
                        }}
                        href={href}
                      >
                        {children}
                      </a>
                    </MjmlText>
                  )
                },
                code: ({children}: any) => (
                  <MjmlRaw>
                    <code
                      style={{
                        background: '#f1f1f1',
                        padding: '2px 3px',
                        borderRadius: 1,
                      }}
                    >
                      {children}
                    </code>
                  </MjmlRaw>
                ),
                hr: () => (
                  <>
                    <MjmlSpacer />
                    <MjmlDivider
                      border-width="1px"
                      border-style="dashed"
                      border-color="lightgrey"
                    />
                    <MjmlSpacer />
                  </>
                ),
                h1: ({children}: any) => (
                  <MjmlText
                    fontWeight={800}
                    fontFamily="Inter, Helvetica, Arial, sans-serif"
                    fontSize="32px"
                  >
                    {children}
                  </MjmlText>
                ),
                h2: ({children}: any) => (
                  <MjmlText
                    paddingTop={48}
                    fontWeight={800}
                    fontFamily="Inter, Helvetica, Arial, sans-serif"
                    fontSize="24px"
                  >
                    {children}
                  </MjmlText>
                ),
                h3: ({children}: any) => (
                  <MjmlText
                    paddingTop={32}
                    fontWeight={800}
                    fontFamily="Inter, Helvetica, Arial, sans-serif"
                    fontSize="20px"
                  >
                    {children}
                  </MjmlText>
                ),
                pre: ({children}: any) => {
                  return (
                    <MjmlText>
                      <Refractor
                        value={children.props.children}
                        language={children.props.className.replace(
                          'language-',
                          '',
                        )}
                      />
                    </MjmlText>
                  )
                },
              }}
            />
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>,
  )
  if (html) {
    return {html, errors}
  } else {
    return {html: '', errors: []}
  }
}

// This Prism theme is used for syntax highlighting in emails.

const prism = `
pre {
  font-family: monospace;
  padding: 16px;
}
code {
  background: rgba(0,0,0,0.1);
  padding: 1px 2px;
}
pre > code {
  color: #fff;
}
  code,
  pre {
    font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono',
      monospace;
    direction: ltr;
    text-align: left;
      white-space: break-spaces;
      word-spacing: normal;
      word-break: break-word;
    line-height: 1.75;
    -moz-tab-size: 2;
    -o-tab-size: 2;
    tab-size: 2;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
    font-size: 15px;
    border-radius: 5px;
    background: #111827;
    
  }

  
  .token.comment,
  .token.prolog,
  .token.cdata {
    color: hsl(220, 10%, 40%);
  }
  
  .token.doctype,
  .token.punctuation,
  .token.entity {
    color: hsl(220, 14%, 71%);
  }
  
  .token.attr-name,
  .token.class-name,
  .token.boolean,
  .token.constant,
  .token.number,
  .token.atrule {
    color: hsl(29, 54%, 61%);
  }
  
  .token.keyword {
    color: hsl(286, 60%, 67%);
  }
  
  .token.property,
  .token.tag,
  .token.symbol,
  .token.deleted,
  .token.important {
    color: hsl(355, 65%, 65%);
  }
  
  .token.selector,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted,
  .token.regex,
  .token.attr-value,
  .token.attr-value > .token.punctuation {
    color: hsl(95, 38%, 62%);
  }
  
  .token.variable,
  .token.operator,
  .token.function {
    color: hsl(207, 82%, 66%);
  }
  
  .token.url {
    color: hsl(187, 47%, 55%);
  }
  
  /* HTML overrides */
  .token.attr-value > .token.punctuation.attr-equals,
  .token.special-attr > .token.attr-value > .token.value.css {
    color: hsl(220, 14%, 71%);
  }
  
  /* CSS overrides */
  .language-css .token.selector {
    color: hsl(355, 65%, 65%);
  }
  
  .language-css .token.property {
    color: hsl(220, 14%, 71%);
  }
  
  .language-css .token.function,
  .language-css .token.url > .token.function {
    color: hsl(187, 47%, 55%);
  }
  
  .language-css .token.url > .token.string.url {
    color: hsl(95, 38%, 62%);
  }
  
  .language-css .token.important,
  .language-css .token.atrule .token.rule {
    color: hsl(286, 60%, 67%);
  }
  
  /* JS overrides */
  .language-javascript .token.operator {
    color: hsl(286, 60%, 67%);
  }
  
  .language-javascript
    .token.template-string
    > .token.interpolation
    > .token.interpolation-punctuation.punctuation {
    color: hsl(5, 48%, 51%);
  }
  
  /* JSON overrides */
  .language-json .token.operator {
    color: hsl(220, 14%, 71%);
  }
  
  .language-json .token.null.keyword {
    color: hsl(29, 54%, 61%);
  }
  
  /* MD overrides */
  .language-markdown .token.url,
  .language-markdown .token.url > .token.operator,
  .language-markdown .token.url-reference.url > .token.string {
    color: hsl(220, 14%, 71%);
  }
  
  .language-markdown .token.url > .token.content {
    color: hsl(207, 82%, 66%);
  }
  
  .language-markdown .token.url > .token.url,
  .language-markdown .token.url-reference.url {
    color: hsl(187, 47%, 55%);
  }
  
  .language-markdown .token.blockquote.punctuation,
  .language-markdown .token.hr.punctuation {
    color: hsl(220, 10%, 40%);
    font-style: italic;
  }
  
  .language-markdown .token.code-snippet {
    color: hsl(95, 38%, 62%);
  }
  
  .language-markdown .token.bold .token.content {
    color: hsl(29, 54%, 61%);
  }
  
  .language-markdown .token.italic .token.content {
    color: hsl(286, 60%, 67%);
  }
  
  .language-markdown .token.strike .token.content,
  .language-markdown .token.strike .token.punctuation,
  .language-markdown .token.list.punctuation,
  .language-markdown .token.title.important > .token.punctuation {
    color: hsl(355, 65%, 65%);
  }
  
  /* General */
  .token.bold {
    font-weight: bold;
  }
  
  .token.comment,
  .token.italic {
    font-style: italic;
  }
  
  .token.entity {
    cursor: help;
  }
  
  .token.namespace {
    opacity: 0.8;
  }
  
  /* Plugin overrides */
  /* Selectors should have higher specificity than those in the plugins' default stylesheets */
  
  /* Show Invisibles plugin overrides */
  .token.token.tab:not(:empty):before,
  .token.token.cr:before,
  .token.token.lf:before,
  .token.token.space:before {
    color: hsla(220, 14%, 71%, 0.15);
    text-shadow: none;
  }
  
  /* Toolbar plugin overrides */
  /* Space out all buttons and move them away from the right edge of the code block */
  div.code-toolbar > .toolbar.toolbar > .toolbar-item {
    margin-right: 0.4em;
  }
  
  /* Styling the buttons */
  div.code-toolbar > .toolbar.toolbar > .toolbar-item > button,
  div.code-toolbar > .toolbar.toolbar > .toolbar-item > a,
  div.code-toolbar > .toolbar.toolbar > .toolbar-item > span {
    background: hsl(220, 13%, 26%);
    color: hsl(220, 9%, 55%);
    padding: 0.1em 0.4em;
    border-radius: 0.3em;
  }
  
  div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:hover,
  div.code-toolbar > .toolbar.toolbar > .toolbar-item > button:focus,
  div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:hover,
  div.code-toolbar > .toolbar.toolbar > .toolbar-item > a:focus,
  div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:hover,
  div.code-toolbar > .toolbar.toolbar > .toolbar-item > span:focus {
    background: hsl(220, 13%, 28%);
    color: hsl(220, 14%, 71%);
  }
  
  /* Line Highlight plugin overrides */
  /* The highlighted line itself */
  .line-highlight.line-highlight {
    background: hsla(220, 100%, 80%, 0.04);
  }
  
  /* Default line numbers in Line Highlight plugin */
  .line-highlight.line-highlight:before,
  .line-highlight.line-highlight[data-end]:after {
    background: hsl(220, 13%, 26%);
    color: hsl(220, 14%, 71%);
    padding: 0.1em 0.6em;
    border-radius: 0.3em;
    box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.2); /* same as Toolbar plugin default */
  }
  
  /* Hovering over a linkable line number (in the gutter area) */
  /* Requires Line Numbers plugin as well */
  pre[id].linkable-line-numbers.linkable-line-numbers
    span.line-numbers-rows
    > span:hover:before {
    background-color: hsla(220, 100%, 80%, 0.04);
  }
  
  /* Line Numbers and Command Line plugins overrides */
  /* Line separating gutter from coding area */
  .line-numbers.line-numbers .line-numbers-rows,
  .command-line .command-line-prompt {
    border-right-color: hsla(220, 14%, 71%, 0.15);
  }
  
  /* Stuff in the gutter */
  .line-numbers .line-numbers-rows > span:before,
  .command-line .command-line-prompt > span:before {
    color: hsl(220, 14%, 45%);
  }
  
  /* Match Braces plugin overrides */
  /* Note: Outline colour is inherited from the braces */
  .rainbow-braces .token.token.punctuation.brace-level-1,
  .rainbow-braces .token.token.punctuation.brace-level-5,
  .rainbow-braces .token.token.punctuation.brace-level-9 {
    color: hsl(355, 65%, 65%);
  }
  
  .rainbow-braces .token.token.punctuation.brace-level-2,
  .rainbow-braces .token.token.punctuation.brace-level-6,
  .rainbow-braces .token.token.punctuation.brace-level-10 {
    color: hsl(95, 38%, 62%);
  }
  
  .rainbow-braces .token.token.punctuation.brace-level-3,
  .rainbow-braces .token.token.punctuation.brace-level-7,
  .rainbow-braces .token.token.punctuation.brace-level-11 {
    color: hsl(207, 82%, 66%);
  }
  
  .rainbow-braces .token.token.punctuation.brace-level-4,
  .rainbow-braces .token.token.punctuation.brace-level-8,
  .rainbow-braces .token.token.punctuation.brace-level-12 {
    color: hsl(286, 60%, 67%);
  }
  
  /* Diff Highlight plugin overrides */
  /* Taken from https://github.com/atom/github/blob/master/styles/variables.less */
  pre.diff-highlight > code .token.token.deleted:not(.prefix),
  pre > code.diff-highlight .token.token.deleted:not(.prefix) {
    background-color: hsla(353, 100%, 66%, 0.15);
  }
  
  pre.diff-highlight > code .token.token.deleted:not(.prefix)::-moz-selection,
  pre.diff-highlight > code .token.token.deleted:not(.prefix) *::-moz-selection,
  pre > code.diff-highlight .token.token.deleted:not(.prefix)::-moz-selection,
  pre > code.diff-highlight .token.token.deleted:not(.prefix) *::-moz-selection {
    background-color: hsla(353, 95%, 66%, 0.25);
  }
  
  pre.diff-highlight > code .token.token.deleted:not(.prefix)::selection,
  pre.diff-highlight > code .token.token.deleted:not(.prefix) *::selection,
  pre > code.diff-highlight .token.token.deleted:not(.prefix)::selection,
  pre > code.diff-highlight .token.token.deleted:not(.prefix) *::selection {
    background-color: hsla(353, 95%, 66%, 0.25);
  }
  
  pre.diff-highlight > code .token.token.inserted:not(.prefix),
  pre > code.diff-highlight .token.token.inserted:not(.prefix) {
    background-color: hsla(137, 100%, 55%, 0.15);
  }
  
  pre.diff-highlight > code .token.token.inserted:not(.prefix)::-moz-selection,
  pre.diff-highlight > code .token.token.inserted:not(.prefix) *::-moz-selection,
  pre > code.diff-highlight .token.token.inserted:not(.prefix)::-moz-selection,
  pre > code.diff-highlight .token.token.inserted:not(.prefix) *::-moz-selection {
    background-color: hsla(135, 73%, 55%, 0.25);
  }
  
  pre.diff-highlight > code .token.token.inserted:not(.prefix)::selection,
  pre.diff-highlight > code .token.token.inserted:not(.prefix) *::selection,
  pre > code.diff-highlight .token.token.inserted:not(.prefix)::selection,
  pre > code.diff-highlight .token.token.inserted:not(.prefix) *::selection {
    background-color: hsla(135, 73%, 55%, 0.25);
  }
  
  /* Previewers plugin overrides */
  /* Based on https://github.com/atom-community/atom-ide-datatip/blob/master/styles/atom-ide-datatips.less and https://github.com/atom/atom/blob/master/packages/one-dark-ui */
  /* Border around popup */
  .prism-previewer.prism-previewer:before,
  .prism-previewer-gradient.prism-previewer-gradient div {
    border-color: hsl(224, 13%, 17%);
  }
  
  /* Angle and time should remain as circles and are hence not included */
  .prism-previewer-color.prism-previewer-color:before,
  .prism-previewer-gradient.prism-previewer-gradient div,
  .prism-previewer-easing.prism-previewer-easing:before {
    border-radius: 0.3em;
  }
  
  /* Triangles pointing to the code */
  .prism-previewer.prism-previewer:after {
    border-top-color: hsl(224, 13%, 17%);
  }
  
  .prism-previewer-flipped.prism-previewer-flipped.after {
    border-bottom-color: hsl(224, 13%, 17%);
  }
  
  /* Background colour within the popup */
  .prism-previewer-angle.prism-previewer-angle:before,
  .prism-previewer-time.prism-previewer-time:before,
  .prism-previewer-easing.prism-previewer-easing {
    background: hsl(219, 13%, 22%);
  }
  
  /* For angle, this is the positive area (eg. 90deg will display one quadrant in this colour) */
  /* For time, this is the alternate colour */
  .prism-previewer-angle.prism-previewer-angle circle,
  .prism-previewer-time.prism-previewer-time circle {
    stroke: hsl(220, 14%, 71%);
    stroke-opacity: 1;
  }
  
  /* Stroke colours of the handle, direction point, and vector itself */
  .prism-previewer-easing.prism-previewer-easing circle,
  .prism-previewer-easing.prism-previewer-easing path,
  .prism-previewer-easing.prism-previewer-easing line {
    stroke: hsl(220, 14%, 71%);
  }
  
  /* Fill colour of the handle */
  .prism-previewer-easing.prism-previewer-easing circle {
    fill: transparent;
  }
  `
