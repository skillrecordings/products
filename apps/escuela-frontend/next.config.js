/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins')
const withMDX = require('@next/mdx')()
const IMAGE_HOST_DOMAINS = [
  `res.cloudinary.com`,
  `d2eip9sf3oo6c2.cloudfront.net`,
  `cdn.sanity.io`,
  process.env.NEXT_PUBLIC_HOST,
]

const nextConfig = {
  eslint: {ignoreDuringBuilds: true},
  experimental: {scrollRestoration: true},
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  images: {
    domains: IMAGE_HOST_DOMAINS,
  },
  async redirects() {
    return [...articleRoutes]
  },
}

const articleRoutes = [
  {
    source: 'articulos/guia-practica-de-graphql',
    destination: '/guia-practica-de-graphql',
    permanent: true,
  },
  {
    source: '/articulos/css-el-modelo-de-caja',
    destination: '/css-el-modelo-de-caja',
    permanent: true,
  },
  {
    source: '/articulos/metodos-de-arreglos',
    destination: '/metodos-de-arreglos',
    permanent: true,
  },
  {
    source: '/articulos/como-funciona-la-prop-key-en-react',
    destination: '/prop-key-en-react',
    permanent: true,
  },
  {
    source: '/articulos/var-let-y-const-cual-es-la-diferencia',
    destination: '/var-let-y-const-cual-es-la-diferencia',
    permanent: true,
  },
  {
    source: '/articulos/guia-de-datos-en-javascript-linked-lists',
    destination: '/guia-de-datos-en-javascript-linked-lists',
    permanent: true,
  },
  {
    source: '/articulos/como-crear-un-blog-con-next-js',
    destination: '/como-crear-un-blog-con-next-js',
    permanent: true,
  },
  {
    source: '/articulos/conoce-remix-un-framework-para-mejorar-tu-ux',
    destination: '/remix-js',
    permanent: true,
  },
  {
    source: '/articulos/estructuras-de-datos-en-javascript-stacks-and-queues',
    destination: '/stacks-and-queues',
    permanent: true,
  },
  {
    source: '/articulos/alg-ordenacion-js',
    destination: '/algoritmos-de-ordenacion-javascript',
    permanent: true,
  },
  {
    source: '/articulos/rutas-react-router6',
    destination: '/react-router-6',
    permanent: true,
  },
  {
    source: '/articulos/aprende-sobre-la-coercion-de-datos-en-javascript',
    destination: '/coercion-de-datos-en-javascript',
    permanent: true,
  },
  {
    source: '/articulos/arrow-functions',
    destination: '/arrow-functions',
    permanent: true,
  },
  {
    source: '/articulos/mutabilidad-de-objetos',
    destination: '/mutabilidad-de-objetos-en-javascript',
    permanent: true,
  },
  {
    source: '/articulos/intro-rendimiento-algo-busqueda',
    destination: '/rendimiento-de-algoritmos-busqueda',
    permanent: true,
  },
  {
    source: '/articulos/clonar-objetos-en-javascript',
    destination: '/clonar-objetos-en-javascript',
    permanent: true,
  },
  {
    source: '/articulos/importancia-sobre-los-ambitos-de-js',
    destination: '/ambitos-de-javascript',
    permanent: true,
  },
  {
    source: '/articulos/data-fetching-con-react',
    destination: '/data-fetching-con-react',
    permanent: true,
  },
  {
    source: '/articulos/que-es-graphql-y-como-usarlo',
    destination: '/aprende-que-es-graphql',
    permanent: true,
  },

  {
    source: '/articulos/elementos-usestate-usecontext-y-usereducer',
    destination: '/usestate-usecontext-y-usereducer',
    permanent: true,
  },
  {
    source: '/articulos/diferencias-valor-y-referencia-en-js',
    destination: '/valor-y-referencia-en-javascript',
    permanent: true,
  },
  {
    source: '/articulos/hoisting-javascript',
    destination: '/concepto-de-hoisting-en-javascript',
    permanent: true,
  },
  {
    source: '/articulos/css-en-js-styled-components-en-react',
    destination: '/styled-components-en-react',
    permanent: true,
  },
  {
    source: '/articulos/nadie-te-ensena-sobre-la-igualdad-en-js',
    destination: '/igualdad-en-javascript',
    permanent: true,
  },
  {
    source: '/articulos/gestionar-versiones-dependencias',
    destination: '/gestionar-las-versiones-de-dependencias',
    permanent: true,
  },
  {
    source: '/articulos/formularios-en-react-una-guia-practica',
    destination: '/formularios-en-react',
    permanent: true,
  },
  {
    source: '/articulos/los-tipos-primitivos-en-javascript',
    destination: '/tipos-primitivos-en-javascript',
    permanent: true,
  },
  {
    source: '/articulos/como-crear-una-aplicacion-en-react',
    destination: '/crear-aplicaciones-en-react',
    permanent: true,
  },
  {
    source: '/articulos/context-manejo-de-estado-en-tu-aplicacion-react',
    destination: '/context-para-el-manejo-de-estado',
    permanent: true,
  },
  {
    source: '/articulos/la-guia-definitiva-de-console-api',
    destination: '/la-guia-definitiva-de-consola-api',
    permanent: true,
  },
  {
    source: '/articulos/hoisting-ejemplos-practicos',
    destination: '/hoisting-en-javascript',
    permanent: true,
  },
  {
    source:
      '/articulos/como-configurar-eslint-prettier-y-git-hooks-en-tu-proximo-proyecto-de-javascript',
    destination: '/eslint-prettier-y-git-hooks',
    permanent: true,
  },
  {
    source: '/articulos/data-fetching-in-nextjs',
    destination: '/data-fetching-con-next-js',
    permanent: true,
  },
  {
    source: '/articulos/declaraciones-de-funciones-y-expresiones-de-funciones',
    destination: '/declaraciones-de-funciones-y-expresiones-de-funciones',
    permanent: true,
  },
  {
    source:
      '/articulos/las-diferencias-entre-componentes-controlados-y-no-controlados-en-react',
    destination: '/componentes-controlados-y-no-controlados-en-react',
    permanent: true,
  },
]

module.exports = withPlugins(
  [
    withMDX({
      options: {
        providerImportSource: '@mdx-js/react',
      },
      pageExtensions: ['ts', 'tsx', 'mdx'],
      rehypePlugins: [require('mdx-prism')],
    }),
  ],
  nextConfig,
)
