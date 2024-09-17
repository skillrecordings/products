import {render} from '@react-email/render'
import {ServerClient} from 'postmark'
import * as React from 'react'
const client = new ServerClient(process.env.POSTMARK_KEY)

export async function sendTheEmail<ComponentPropsType>({
  Component,
  componentProps,
  Subject,
  To,
  From = `Kody from Epic Web <kody@epicweb.dev>`,
}: {
  Component: (props: ComponentPropsType) => React.JSX.Element
  componentProps: ComponentPropsType
  Subject: string
  From?: string
  To: string
}) {
  const emailHtml = render(Component(componentProps))

  const options = {
    From,
    To,
    Subject,
    HtmlBody: emailHtml,
  }

  return await client.sendEmail(options)
}
