

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = TestPage

var _preact = require('preact')

var React = _interopRequireWildcard(require('react'))

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null
  var cacheBabelInterop = new WeakMap()
  var cacheNodeInterop = new WeakMap()
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop
  })(nodeInterop)
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj}
  }
  var cache = _getRequireWildcardCache(nodeInterop)
  if (cache && cache.has(obj)) {
    return cache.get(obj)
  }
  var newObj = {}
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc)
      } else {
        newObj[key] = obj[key]
      }
    }
  }
  newObj.default = obj
  if (cache) {
    cache.set(obj, newObj)
  }
  return newObj
}

function TestPage(props) {
  const {theme} = props

  if (typeof document !== 'undefined' && theme.brandColor) {
    document.documentElement.style.setProperty(
      '--brand-color',
      theme.brandColor,
    )
  }

  const errors = {
    default: 'Unable to show test.',
  }
  const error = false
  return (0, _preact.h)(
    'div',
    {
      className: 'test',
    },
    theme.brandColor &&
      (0, _preact.h)('style', {
        dangerouslySetInnerHTML: {
          __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `,
        },
      }),
    (0, _preact.h)('h1', null, 'This is a Test'),
    theme.logo &&
      (0, _preact.h)('img', {
        src: theme.logo,
        alt: 'Logo',
        className: 'logo',
      }),
    (0, _preact.h)(
      'div',
      {
        className: 'card',
      },
      error &&
        (0, _preact.h)(
          'div',
          {
            className: 'error',
          },
          (0, _preact.h)('p', null, error),
        ),
    ),
  )
}
