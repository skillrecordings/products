import React from 'react'
import queryString from 'query-string'
import {removeQueryParamsFromRouter} from 'utils/remove-query-params-from-router'
import {USER_ID_QUERY_PARAM_KEY} from 'pages/tutorials/[module]'
import {useRouter} from 'next/router'
import isEmpty from 'lodash/isEmpty'

/**
 * Return certificate url and remove user hash param from location bar.
 * @param title Resource title to generate certificate with
 * @param image Resource image to generate certificate with
 * @param name Who is the certificate for?
 * @returns Certificate image URL
 * @requires NEXT_PUBLIC_CERTIFICATE_URI must be set
 */

export const useLearnerCertificateAsOgImage = (
  title: string,
  image: string,
  name?: string,
) => {
  const router = useRouter()

  React.useEffect(() => {
    router.query[USER_ID_QUERY_PARAM_KEY] &&
      removeQueryParamsFromRouter(router, [USER_ID_QUERY_PARAM_KEY])
  }, [router])

  const certificateUrl = queryString.stringifyUrl({
    url: `${process.env.NEXT_PUBLIC_CERTIFICATE_URI}/${encodeURI(title)}`,
    query: {
      name,
      image,
    },
  })

  return !isEmpty(name) ? certificateUrl : null
}
