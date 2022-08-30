import {NextApiRequest, NextApiResponse} from 'next'
import {EmailTemplate} from 'components/portable-text/mjml'
import {getEmail} from 'lib/emails'
import {render} from 'mjml-react'

const email = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const email = await getEmail(`${req.query.slug}`)
      const {body: emailBody, title, description, image} = email

      const {html, errors} = render(
        <EmailTemplate
          emailBody={emailBody}
          title={title}
          description={description}
          image={image}
        />,
        {validationLevel: 'soft'},
      )

      res.status(200).json(html)
    } catch (error) {
      res.status(200).end()
    }
  } else {
    console.error('non-get request made')
    res.status(404).end()
  }
}

export default email
