import {GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  return {
    redirect: {
      destination: `/modules/${params?.module}/${params?.actualLesson}`,
      permanent: false,
    },
  }
}

export default function LessonPage() {
  return null
}
