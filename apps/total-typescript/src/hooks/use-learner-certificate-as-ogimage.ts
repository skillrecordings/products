import React from 'react'
import queryString from 'query-string'
import {removeQueryParamsFromRouter} from 'utils/remove-query-params-from-router'
import {USER_ID_QUERY_PARAM_KEY} from 'pages/tutorials/[module]'
import {User} from '@skillrecordings/database'
import {useRouter} from 'next/router'

/**
 * Return certificate url and remove user hash param from location bar.
 * @param user User from database
 * @param title Resource title to generate certificate with
 * @param image Resource image to generate certificate with
 * @returns Certificate image URL
 */

export const useLearnerCertificateAsOgImage = (
  title: string,
  image: string,
  user: User,
) => {
  const router = useRouter()

  React.useEffect(() => {
    return () => {
      router.query[USER_ID_QUERY_PARAM_KEY] &&
        removeQueryParamsFromRouter(router, [USER_ID_QUERY_PARAM_KEY])
    }
  }, [router])

  const certificateUrl = queryString.stringifyUrl({
    url: `${process.env.NEXT_PUBLIC_CERTIFICATE_URI}/${encodeURI(title)}`,
    query: {
      name: user?.name,
      image,
    },
  })

  return user ? certificateUrl : null
}
