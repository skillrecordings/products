import {COURSE_CERTIFICATE_COPY} from './course-certificate'

export function CertificateTemplate({
  name,
  issuedDate,
  backgroundImage,
  courseMark,
  workshop,
}: {
  name: string
  issuedDate: string
  backgroundImage: string
  courseMark: string
  workshop?: {title: string; image?: string | null}
}) {
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
      {workshop ? (
        workshop.image && (
          <img
            src={workshop.image}
            width={350}
            height={350}
            tw="absolute top-24"
          />
        )
      ) : (
        <img src={courseMark} width={280} height={280} tw="absolute top-32" />
      )}
      <div tw="flex flex-col items-center justify-center mt-72">
        <p
          tw="text-7xl leading-none flex pb-10 text-gray-700"
          style={{fontWeight: 700, fontFamily: 'Larsseit'}}
        >
          {name}
        </p>
        <p tw="text-center text-2xl flex" style={{fontFamily: 'Larsseit'}}>
          {workshop
            ? `Has successfully completed the ${workshop.title} workshop.`
            : COURSE_CERTIFICATE_COPY}
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
