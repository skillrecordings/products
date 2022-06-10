const withPreconstruct = require('@preconstruct/next')

module.exports = withPreconstruct({
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
})
