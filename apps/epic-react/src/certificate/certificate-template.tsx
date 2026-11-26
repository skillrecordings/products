import {COURSE_CERTIFICATE_COPY} from './course-certificate'

export function CertificateTemplate({
  name,
  issuedDate,
  backgroundImage,
  courseMark,
}: {
  name: string
  issuedDate: string
  backgroundImage: string
  courseMark: string
}) {
  // Budget 1.25 em per code point so even a long, unbroken name fits.
  const nameFontSize = Math.min(
    72,
    1320 / (1.25 * Math.max(1, Array.from(name).length)),
  )

  return (
    <div
      tw="flex w-full relative items-center h-full justify-center"
      style={{
        backgroundColor: '#fff',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <img src={courseMark} width={280} height={280} tw="absolute top-32" />
      <div tw="flex flex-col items-center justify-center mt-72">
        <div
          tw="flex items-center justify-center text-gray-700"
          style={{
            width: 1320,
            height: 112,
            fontSize: nameFontSize,
            fontFamily: 'Larsseit',
          }}
        >
          {name}
        </div>
        <p tw="text-center text-2xl flex" style={{fontFamily: 'Larsseit'}}>
          {COURSE_CERTIFICATE_COPY}
        </p>
      </div>
      <div
        tw="absolute text-2xl text-right right-16 bottom-24 flex"
        style={{fontFamily: 'Larsseit'}}
      >
        {issuedDate}
      </div>
    </div>
  )
}
