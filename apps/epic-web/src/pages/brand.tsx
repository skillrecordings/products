import Layout from 'components/app/layout'
import React from 'react'
import {useCopyToClipboard} from 'react-use'
import {twMerge} from 'tailwind-merge'
import {renderToString} from 'react-dom/server'
import toast from 'react-hot-toast'

const BrandPage = () => {
  return (
    <Layout
      meta={{
        title: 'Brand Assets',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1687188572/brand-card_2x.png',
        },
      }}
    >
      <header className="mx-auto w-full max-w-screen-lg px-5 pb-3 pt-10 sm:pb-5 sm:pt-20">
        <h1 className="text-center text-3xl font-bold">Brand Assets</h1>
      </header>
      <main className="mx-auto w-full max-w-screen-lg px-5 pb-32 pt-10">
        <h2 className="w-full border-b border-black/5 pb-2 text-2xl font-bold dark:border-white/5">
          Epic Stack
        </h2>
        <section className="space-y-12 pt-12">
          <article>
            <h3 className="pb-2 text-sm font-semibold uppercase tracking-wide">
              Logomark
            </h3>
            <Grid>
              <LogoCard
                className="bg-black"
                logo={<EpicStackMark variant="light" />}
              />
              <LogoCard
                className="bg-white"
                logo={<EpicStackMark variant="dark" />}
              />
            </Grid>
          </article>
          <article className="">
            <h3 className="pb-2 text-sm font-semibold uppercase tracking-wide">
              Horizontal Version
            </h3>
            <h4 className="pb-2 pt-2 text-xs font-semibold uppercase tracking-wide opacity-80">
              Grayscale
            </h4>
            <Grid>
              <LogoCard
                className="bg-black"
                logo={<EpicStackHorizontal variant="light" />}
              />
              <LogoCard
                className="bg-white"
                logo={<EpicStackHorizontal variant="dark" />}
              />
            </Grid>
            <h4 className="pb-2 pt-8 text-xs font-semibold uppercase tracking-wide opacity-80">
              Color
            </h4>
            <Grid>
              <LogoCard
                className="bg-[#140C3E]"
                logo={
                  <EpicStackHorizontal variant="light" isGrayscale={false} />
                }
              />
              <LogoCard
                className="bg-white"
                logo={
                  <EpicStackHorizontal variant="dark" isGrayscale={false} />
                }
              />
            </Grid>
          </article>
          <article>
            <h3 className="pb-2 text-sm font-semibold uppercase tracking-wide">
              Vertical Version
            </h3>
            <h4 className="pb-2 pt-2 text-xs font-semibold uppercase tracking-wide opacity-80">
              Grayscale
            </h4>
            <Grid>
              <LogoCard
                className="bg-black"
                logo={<EpicStackVertical variant="light" />}
              />
              <LogoCard
                className="bg-white"
                logo={<EpicStackVertical variant="dark" />}
              />
            </Grid>
            <h4 className="pb-2 pt-8 text-xs font-semibold uppercase tracking-wide opacity-80">
              Color
            </h4>
            <Grid>
              <LogoCard
                className="bg-[#140C3E]"
                logo={<EpicStackVertical variant="light" isGrayscale={false} />}
              />
              <LogoCard
                className="bg-white"
                logo={<EpicStackVertical variant="dark" isGrayscale={false} />}
              />
            </Grid>
          </article>
        </section>
      </main>
    </Layout>
  )
}

export default BrandPage

const LogoCard: React.FC<
  React.PropsWithChildren<{logo: React.ReactElement; className?: string}>
> = ({children, className, logo}) => {
  const [copiedState, setCopied] = useCopyToClipboard()
  return (
    <div>
      <div
        className={twMerge(
          'flex aspect-video items-center justify-center rounded',
          className,
        )}
      >
        {logo}
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button
          className="font-mono text-xs font-medium uppercase hover:underline"
          onClick={() => {
            setCopied(renderToString(logo))
            !copiedState.error && toast.success('Copied to clipboard')
          }}
        >
          Copy SVG
        </button>
      </div>
    </div>
  )
}

const Grid: React.FC<React.PropsWithChildren> = ({children}) => {
  return <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{children}</div>
}

const EpicStackMark: React.FC<{variant?: 'light' | 'dark'}> = ({
  variant = 'light',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="65"
      height="65"
      fill="none"
      viewBox="0 0 65 65"
    >
      <path
        fill={variant === 'light' ? '#FFF' : '#000'}
        d="M39.445 25.555 37 17.163 65 0 47.821 28l-8.376-2.445Zm-13.89 0L28 17.163 0 0l17.179 28 8.376-2.445Zm13.89 13.89L37 47.837 65 65 47.821 37l-8.376 2.445Zm-13.89 0L28 47.837 0 65l17.179-28 8.376 2.445Z"
      />
    </svg>
  )
}

const EpicStackVertical: React.FC<{
  variant?: 'light' | 'dark'
  isGrayscale?: boolean
}> = ({variant, isGrayscale = true}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="112"
      fill="none"
      viewBox="0 0 100 112"
    >
      <path
        fill={
          variant === 'light'
            ? isGrayscale
              ? '#FFF'
              : '#D6C5FF'
            : isGrayscale
            ? '#000'
            : '#6A24FF'
        }
        d="M7.885 111.479c-3.652 0-6.356-1.812-7.388-4.795l2.23-1.283c.753 2.37 2.51 3.541 5.214 3.541 2.676 0 4.126-1.199 4.126-3.011 0-.92-.362-1.617-1.06-2.091-.696-.474-1.895-.948-3.54-1.478l-1.868-.613a29.066 29.066 0 0 1-1.617-.725c-.641-.335-1.115-.669-1.422-1.004-.641-.697-1.227-1.84-1.227-3.262 0-1.7.586-3.039 1.785-4.014 1.199-1.004 2.648-1.506 4.35-1.506 3.094 0 5.463 1.7 6.607 4.266L11.9 96.758c-.836-2.007-2.314-3.01-4.433-3.01-2.119 0-3.54 1.114-3.54 2.899 0 .864.306 1.505.92 1.951.613.446 1.672.92 3.178 1.394l1.143.363c.223.083.557.195 1.031.39.976.363 1.2.502 1.952.92.78.418 1.031.725 1.505 1.283.697.697.976 1.7.976 2.927 0 1.701-.613 3.067-1.868 4.098-1.254 1.004-2.871 1.506-4.879 1.506ZM19.587 91.6h14.08v2.454h-5.771v17.062H25.33V94.054h-5.744V91.6Zm35.025 19.516h-2.76l-1.59-4.377H41.48l-1.589 4.377h-2.76L44.408 91.6h2.927l7.277 19.516Zm-8.755-16.42-3.484 9.618h6.997l-3.512-9.619Zm23.703 16.783c-2.955 0-5.408-.976-7.332-2.928-1.924-1.951-2.871-4.349-2.871-7.193 0-2.843.947-5.241 2.871-7.193 1.924-1.951 4.377-2.927 7.333-2.927 3.568 0 6.747 1.84 8.42 4.74l-2.259 1.31c-1.115-2.147-3.485-3.54-6.161-3.54-2.259 0-4.099.724-5.52 2.174-1.422 1.45-2.12 3.262-2.12 5.436 0 2.147.697 3.959 2.12 5.409 1.421 1.45 3.261 2.175 5.52 2.175 2.676 0 5.046-1.394 6.161-3.513l2.258 1.282c-.808 1.45-1.98 2.621-3.485 3.485-1.505.865-3.15 1.283-4.934 1.283Zm20.836-10.399 8.894 10.036h-3.18l-8.42-9.367v9.367H85.1V91.6h2.593v8.811l8.14-8.81h3.179l-8.615 9.479Z"
      />
      <path
        fill={variant === 'light' ? '#FFF' : '#000'}
        fill-rule="evenodd"
        d="M18.003 74.265v6.189h9.061v2.453H15.411V63.392h11.514v2.453h-8.922v5.994h8.225v2.426h-8.225Zm17.35-10.873h7.08c1.813 0 3.29.613 4.49 1.812 1.198 1.199 1.812 2.676 1.812 4.46 0 1.757-.614 3.262-1.812 4.461-1.2 1.2-2.677 1.813-4.49 1.813h-4.488v6.97h-2.593V63.39Zm2.592 10.12h4.489c1.087 0 1.98-.362 2.676-1.087.697-.753 1.06-1.673 1.06-2.76 0-2.23-1.59-3.848-3.736-3.848h-4.489v7.695Zm18.592 7.472V65.072h-2.949v-1.829h8.81v1.828H59.13v15.913h3.268v1.829H59.13v.094h-2.593v-.094h-2.949v-1.829h2.949Zm21.11 2.286c-2.956 0-5.41-.976-7.333-2.927-1.924-1.952-2.872-4.35-2.872-7.194 0-2.843.948-5.241 2.872-7.193 1.924-1.951 4.377-2.927 7.332-2.927 3.57 0 6.747 1.84 8.42 4.74l-2.258 1.31c-1.115-2.147-3.485-3.54-6.162-3.54-2.258 0-4.098.724-5.52 2.174-1.422 1.45-2.119 3.262-2.119 5.437 0 2.146.697 3.958 2.12 5.408 1.421 1.45 3.261 2.175 5.52 2.175 2.676 0 5.046-1.394 6.16-3.513l2.26 1.282c-.81 1.45-1.98 2.621-3.486 3.485-1.505.865-3.15 1.283-4.935 1.283Z"
        clip-rule="evenodd"
      />
      <path
        fill={
          variant === 'light'
            ? isGrayscale
              ? '#FFF'
              : '#D6C5FF'
            : isGrayscale
            ? '#000'
            : '#6A24FF'
        }
        d="m46.177 13.174-1.806 6.197-6.185 1.806L25.5.5l20.677 12.674Zm6.646 0 1.806 6.197 6.186 1.806L73.5.5 52.823 13.174ZM54.63 29.63l-1.806 6.197L73.5 48.5 60.815 27.823l-6.186 1.806Zm-8.452 6.197-1.806-6.197-6.185-1.806L25.5 48.5l20.677-12.674Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

const EpicStackHorizontal: React.FC<{
  variant?: 'light' | 'dark'
  isGrayscale?: boolean
}> = ({variant, isGrayscale = true}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="228"
      height="48"
      fill="none"
      viewBox="0 0 228 48"
    >
      <path
        fill={
          variant === 'light'
            ? isGrayscale
              ? '#FFF'
              : '#D6C5FF'
            : isGrayscale
            ? '#000'
            : '#6A24FF'
        }
        d="m20.677 12.674-1.806 6.197-6.185 1.806L0 0l20.677 12.674Zm6.646 0 1.806 6.197 6.185 1.806L48 0 27.323 12.674ZM29.13 29.13l-1.806 6.197L48 48 35.314 27.323 29.13 29.13Zm-8.452 6.197-1.806-6.197-6.185-1.806L0 48l20.677-12.674Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        fill={
          variant === 'light'
            ? isGrayscale
              ? '#FFF'
              : '#D6C5FF'
            : isGrayscale
            ? '#000'
            : '#6A24FF'
        }
        d="M145.523 33.556c-3.354 0-5.838-1.665-6.786-4.404l2.049-1.178c.691 2.176 2.304 3.252 4.788 3.252 2.458 0 3.79-1.101 3.79-2.766 0-.845-.333-1.485-.973-1.92-.64-.436-1.741-.871-3.252-1.357l-1.716-.564a26.477 26.477 0 0 1-1.485-.666c-.589-.307-1.024-.614-1.306-.921-.589-.64-1.127-1.69-1.127-2.996 0-1.562.538-2.792 1.639-3.688 1.101-.921 2.433-1.382 3.995-1.382 2.842 0 5.019 1.562 6.069 3.917l-1.998 1.153c-.768-1.844-2.125-2.766-4.071-2.766-1.946 0-3.252 1.024-3.252 2.663 0 .794.282 1.383.845 1.793.563.41 1.536.845 2.919 1.28l1.05.333c.205.077.512.18.947.358.897.333 1.101.461 1.793.845.717.384.947.666 1.382 1.178.641.64.897 1.562.897 2.689 0 1.562-.564 2.817-1.716 3.764-1.152.922-2.637 1.383-4.481 1.383Zm10.758-18.257h12.931v2.253h-5.301v15.67h-2.355v-15.67h-5.275v-2.253Zm31.804 17.924h-2.535l-1.46-4.02h-8.066l-1.459 4.02h-2.535l6.683-17.924h2.689l6.683 17.924Zm-8.041-15.082-3.2 8.834h6.427l-3.227-8.834Zm20.884 15.415c-2.714 0-4.967-.896-6.734-2.689-1.767-1.792-2.638-3.995-2.638-6.606 0-2.612.871-4.814 2.638-6.607 1.767-1.792 4.02-2.688 6.734-2.688 3.278 0 6.197 1.69 7.733 4.353l-2.074 1.203c-1.024-1.971-3.2-3.252-5.659-3.252-2.074 0-3.764.666-5.07 1.997-1.306 1.332-1.946 2.996-1.946 4.994 0 1.971.64 3.636 1.946 4.967 1.306 1.332 2.996 1.998 5.07 1.998 2.459 0 4.635-1.28 5.659-3.227l2.074 1.178c-.742 1.332-1.818 2.407-3.2 3.2-1.383.795-2.894 1.179-4.533 1.179Zm18.572-9.551 8.168 9.218h-2.919l-7.733-8.604v8.604h-2.382V15.299h2.382v8.091l7.477-8.091h2.919l-7.912 8.706Z"
      />
      <path
        fill={variant === 'light' ? '#FFF' : '#000'}
        d="M104.912 14.5h-8.094v1.679h2.875v17.044h2.381V16.18h2.838V14.5Zm-40.61 16.47v-5.685h7.554v-2.227h-7.554v-5.506h8.194V15.3H61.92v17.924h10.704V30.97h-8.322ZM86.74 15.299h-6.504v17.924h2.381v-6.401h4.123c1.664 0 3.021-.564 4.123-1.665 1.1-1.1 1.664-2.484 1.664-4.097 0-1.639-.563-2.996-1.665-4.097-1.1-1.1-2.458-1.664-4.122-1.664Zm0 9.295h-4.123v-7.068h4.123c1.972 0 3.431 1.486 3.431 3.534 0 .999-.333 1.844-.973 2.535-.64.666-1.46.999-2.458.999Zm25.606 6.273c1.767 1.793 4.021 2.689 6.735 2.689 1.639 0 3.149-.384 4.532-1.178 1.383-.794 2.458-1.87 3.201-3.2L124.74 28c-1.024 1.945-3.201 3.226-5.659 3.226-2.074 0-3.764-.666-5.07-1.997-1.306-1.332-1.946-2.996-1.946-4.968 0-1.997.64-3.662 1.946-4.993 1.306-1.332 2.996-1.998 5.07-1.998 2.458 0 4.635 1.28 5.659 3.252l2.074-1.203c-1.536-2.663-4.456-4.353-7.733-4.353-2.714 0-4.968.896-6.735 2.688-1.766 1.793-2.637 3.995-2.637 6.607s.871 4.814 2.637 6.606Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        fill={variant === 'light' ? '#FFF' : '#000'}
        d="M96.819 31.821h8.093V33.5h-8.094v-1.68Z"
      />
    </svg>
  )
}
