import Image from 'next/image'

const mdxComponents = {
  SectionHeader: (props: any) => {
    return (
      <div className="text-4xl font-bold" {...props}>
        {props.children}
      </div>
    )
  },
  Image,
}

export default mdxComponents
