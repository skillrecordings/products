exports.id = 671
exports.ids = [671]
exports.modules = {
  /***/ 9482: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    'use strict'
    var __webpack_unused_export__

    __webpack_unused_export__ = {
      value: true,
    }
    exports.default = Image1

    var _react = _interopRequireDefault(__webpack_require__(9297))

    var _head = _interopRequireDefault(__webpack_require__(6695))

    var _toBase64 = __webpack_require__(556)

    var _imageConfig = __webpack_require__(822)

    var _useIntersection = __webpack_require__(5345)

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true,
        })
      } else {
        obj[key] = value
      }

      return obj
    }

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule
        ? obj
        : {
            default: obj,
          }
    }

    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {}
        var ownKeys = Object.keys(source)

        if (typeof Object.getOwnPropertySymbols === 'function') {
          ownKeys = ownKeys.concat(
            Object.getOwnPropertySymbols(source).filter(function (sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable
            }),
          )
        }

        ownKeys.forEach(function (key) {
          _defineProperty(target, key, source[key])
        })
      }

      return target
    }

    function _objectWithoutProperties(source, excluded) {
      if (source == null) return {}

      var target = _objectWithoutPropertiesLoose(source, excluded)

      var key, i

      if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source)

        for (i = 0; i < sourceSymbolKeys.length; i++) {
          key = sourceSymbolKeys[i]
          if (excluded.indexOf(key) >= 0) continue
          if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue
          target[key] = source[key]
        }
      }

      return target
    }

    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null) return {}
      var target = {}
      var sourceKeys = Object.keys(source)
      var key, i

      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i]
        if (excluded.indexOf(key) >= 0) continue
        target[key] = source[key]
      }

      return target
    }

    const loadedImageURLs = new Set()

    if (true) {
      global.__NEXT_IMAGE_IMPORTED = true
    }

    const VALID_LOADING_VALUES = ['lazy', 'eager', undefined]
    const loaders = new Map([
      ['default', defaultLoader],
      ['imgix', imgixLoader],
      ['cloudinary', cloudinaryLoader],
      ['akamai', akamaiLoader],
      ['custom', customLoader],
    ])
    const VALID_LAYOUT_VALUES = [
      'fill',
      'fixed',
      'intrinsic',
      'responsive',
      undefined,
    ]

    function isStaticRequire(src) {
      return src.default !== undefined
    }

    function isStaticImageData(src) {
      return src.src !== undefined
    }

    function isStaticImport(src) {
      return (
        typeof src === 'object' &&
        (isStaticRequire(src) || isStaticImageData(src))
      )
    }

    const {
      deviceSizes: configDeviceSizes,
      imageSizes: configImageSizes,
      loader: configLoader,
      path: configPath,
      domains: configDomains,
    } = {
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      path: '/_next/image',
      loader: 'default',
    } || _imageConfig.imageConfigDefault // sort smallest to largest

    const allSizes = [...configDeviceSizes, ...configImageSizes]
    configDeviceSizes.sort((a, b) => a - b)
    allSizes.sort((a, b) => a - b)

    function getWidths(width, layout, sizes) {
      if (sizes && (layout === 'fill' || layout === 'responsive')) {
        // Find all the "vw" percent sizes used in the sizes prop
        const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g
        const percentSizes = []

        for (let match; (match = viewportWidthRe.exec(sizes)); match) {
          percentSizes.push(parseInt(match[2]))
        }

        if (percentSizes.length) {
          const smallestRatio = Math.min(...percentSizes) * 0.01
          return {
            widths: allSizes.filter(
              (s) => s >= configDeviceSizes[0] * smallestRatio,
            ),
            kind: 'w',
          }
        }

        return {
          widths: allSizes,
          kind: 'w',
        }
      }

      if (
        typeof width !== 'number' ||
        layout === 'fill' ||
        layout === 'responsive'
      ) {
        return {
          widths: configDeviceSizes,
          kind: 'w',
        }
      }

      const widths = [
        ...new Set( // > This means that most OLED screens that say they are 3x resolution,
          // > are actually 3x in the green color, but only 1.5x in the red and
          // > blue colors. Showing a 3x resolution image in the app vs a 2x
          // > resolution image will be visually the same, though the 3x image
          // > takes significantly more data. Even true 3x resolution screens are
          // > wasteful as the human eye cannot see that level of detail without
          // > something like a magnifying glass.
          // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
          [
            width,
            width * 2,
            /*, width * 3*/
          ].map(
            (w) =>
              allSizes.find((p) => p >= w) || allSizes[allSizes.length - 1],
          ),
        ),
      ]
      return {
        widths,
        kind: 'x',
      }
    }

    function generateImgAttrs({
      src,
      unoptimized,
      layout,
      width,
      quality,
      sizes,
      loader,
    }) {
      if (unoptimized) {
        return {
          src,
          srcSet: undefined,
          sizes: undefined,
        }
      }

      const {widths, kind} = getWidths(width, layout, sizes)
      const last = widths.length - 1
      return {
        sizes: !sizes && kind === 'w' ? '100vw' : sizes,
        srcSet: widths
          .map(
            (w, i) =>
              `${loader({
                src,
                quality,
                width: w,
              })} ${kind === 'w' ? w : i + 1}${kind}`,
          )
          .join(', '),
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        src: loader({
          src,
          quality,
          width: widths[last],
        }),
      }
    }

    function getInt(x) {
      if (typeof x === 'number') {
        return x
      }

      if (typeof x === 'string') {
        return parseInt(x, 10)
      }

      return undefined
    }

    function defaultImageLoader(loaderProps) {
      const load = loaders.get(configLoader)

      if (load) {
        return load(
          _objectSpread(
            {
              root: configPath,
            },
            loaderProps,
          ),
        )
      }

      throw new Error(
        `Unknown "loader" found in "next.config.js". Expected: ${_imageConfig.VALID_LOADERS.join(
          ', ',
        )}. Received: ${configLoader}`,
      )
    } // See https://stackoverflow.com/q/39777833/266535 for why we use this ref
    // handler instead of the img's onLoad attribute.

    function handleLoading(img, src, layout, placeholder, onLoadingComplete) {
      if (!img) {
        return
      }

      const handleLoad = () => {
        if (!img.src.startsWith('data:')) {
          const p = 'decode' in img ? img.decode() : Promise.resolve()
          p.catch(() => {}).then(() => {
            if (placeholder === 'blur') {
              img.style.filter = 'none'
              img.style.backgroundSize = 'none'
              img.style.backgroundImage = 'none'
            }

            loadedImageURLs.add(src)

            if (onLoadingComplete) {
              const {naturalWidth, naturalHeight} = img // Pass back read-only primitive values but not the
              // underlying DOM element because it could be misused.

              onLoadingComplete({
                naturalWidth,
                naturalHeight,
              })
            }

            if (false) {
              var ref
            }
          })
        }
      }

      if (img.complete) {
        // If the real image fails to load, this will still remove the placeholder.
        // This is the desired behavior for now, and will be revisited when error
        // handling is worked on for the image component itself.
        handleLoad()
      } else {
        img.onload = handleLoad
      }
    }

    function Image1(_param) {
      var {
          src,
          sizes,
          unoptimized = false,
          priority = false,
          loading,
          lazyBoundary = '200px',
          className,
          quality,
          width,
          height,
          objectFit,
          objectPosition,
          onLoadingComplete,
          loader = defaultImageLoader,
          placeholder = 'empty',
          blurDataURL,
        } = _param,
        all = _objectWithoutProperties(_param, [
          'src',
          'sizes',
          'unoptimized',
          'priority',
          'loading',
          'lazyBoundary',
          'className',
          'quality',
          'width',
          'height',
          'objectFit',
          'objectPosition',
          'onLoadingComplete',
          'loader',
          'placeholder',
          'blurDataURL',
        ])

      let rest = all
      let layout = sizes ? 'responsive' : 'intrinsic'

      if ('layout' in rest) {
        // Override default layout if the user specified one:
        if (rest.layout) layout = rest.layout // Remove property so it's not spread into image:

        delete rest['layout']
      }

      let staticSrc = ''

      if (isStaticImport(src)) {
        const staticImageData = isStaticRequire(src) ? src.default : src

        if (!staticImageData.src) {
          throw new Error(
            `An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(
              staticImageData,
            )}`,
          )
        }

        blurDataURL = blurDataURL || staticImageData.blurDataURL
        staticSrc = staticImageData.src

        if (!layout || layout !== 'fill') {
          height = height || staticImageData.height
          width = width || staticImageData.width

          if (!staticImageData.height || !staticImageData.width) {
            throw new Error(
              `An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(
                staticImageData,
              )}`,
            )
          }
        }
      }

      src = typeof src === 'string' ? src : staticSrc
      const widthInt = getInt(width)
      const heightInt = getInt(height)
      const qualityInt = getInt(quality)
      let isLazy =
        !priority && (loading === 'lazy' || typeof loading === 'undefined')

      if (src.startsWith('data:') || src.startsWith('blob:')) {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
        unoptimized = true
        isLazy = false
      }

      if (false) {
      }

      if (false) {
      }

      const [setRef, isIntersected] = (0, _useIntersection).useIntersection({
        rootMargin: lazyBoundary,
        disabled: !isLazy,
      })
      const isVisible = !isLazy || isIntersected
      let wrapperStyle
      let sizerStyle
      let sizerSvg
      let imgStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        boxSizing: 'border-box',
        padding: 0,
        border: 'none',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        objectFit,
        objectPosition,
      }
      const blurStyle =
        placeholder === 'blur'
          ? {
              filter: 'blur(20px)',
              backgroundSize: objectFit || 'cover',
              backgroundImage: `url("${blurDataURL}")`,
              backgroundPosition: objectPosition || '0% 0%',
            }
          : {}

      if (layout === 'fill') {
        // <Image src="i.png" layout="fill" />
        wrapperStyle = {
          display: 'block',
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          boxSizing: 'border-box',
          margin: 0,
        }
      } else if (
        typeof widthInt !== 'undefined' &&
        typeof heightInt !== 'undefined'
      ) {
        // <Image src="i.png" width="100" height="100" />
        const quotient = heightInt / widthInt
        const paddingTop = isNaN(quotient) ? '100%' : `${quotient * 100}%`

        if (layout === 'responsive') {
          // <Image src="i.png" width="100" height="100" layout="responsive" />
          wrapperStyle = {
            display: 'block',
            overflow: 'hidden',
            position: 'relative',
            boxSizing: 'border-box',
            margin: 0,
          }
          sizerStyle = {
            display: 'block',
            boxSizing: 'border-box',
            paddingTop,
          }
        } else if (layout === 'intrinsic') {
          // <Image src="i.png" width="100" height="100" layout="intrinsic" />
          wrapperStyle = {
            display: 'inline-block',
            maxWidth: '100%',
            overflow: 'hidden',
            position: 'relative',
            boxSizing: 'border-box',
            margin: 0,
          }
          sizerStyle = {
            boxSizing: 'border-box',
            display: 'block',
            maxWidth: '100%',
          }
          sizerSvg = `<svg width="${widthInt}" height="${heightInt}" xmlns="http://www.w3.org/2000/svg" version="1.1"/>`
        } else if (layout === 'fixed') {
          // <Image src="i.png" width="100" height="100" layout="fixed" />
          wrapperStyle = {
            overflow: 'hidden',
            boxSizing: 'border-box',
            display: 'inline-block',
            position: 'relative',
            width: widthInt,
            height: heightInt,
          }
        }
      } else {
        // <Image src="i.png" />
        if (false) {
        }
      }

      let imgAttributes = {
        src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        srcSet: undefined,
        sizes: undefined,
      }

      if (isVisible) {
        imgAttributes = generateImgAttrs({
          src,
          unoptimized,
          layout,
          width: widthInt,
          quality: qualityInt,
          sizes,
          loader,
        })
      }

      let srcString = src
      return /*#__PURE__*/ _react.default.createElement(
        'div',
        {
          style: wrapperStyle,
        },
        sizerStyle
          ? /*#__PURE__*/ _react.default.createElement(
              'div',
              {
                style: sizerStyle,
              },
              sizerSvg
                ? /*#__PURE__*/ _react.default.createElement('img', {
                    style: {
                      maxWidth: '100%',
                      display: 'block',
                      margin: 0,
                      border: 'none',
                      padding: 0,
                    },
                    alt: '',
                    'aria-hidden': true,
                    src: `data:image/svg+xml;base64,${(0, _toBase64).toBase64(
                      sizerSvg,
                    )}`,
                  })
                : null,
            )
          : null,
        /*#__PURE__*/ _react.default.createElement(
          'img',
          Object.assign({}, rest, imgAttributes, {
            decoding: 'async',
            'data-nimg': layout,
            className: className,
            ref: (img) => {
              setRef(img)
              handleLoading(
                img,
                srcString,
                layout,
                placeholder,
                onLoadingComplete,
              )
            },
            style: _objectSpread({}, imgStyle, blurStyle),
          }),
        ),
        /*#__PURE__*/ _react.default.createElement(
          'noscript',
          null,
          /*#__PURE__*/ _react.default.createElement(
            'img',
            Object.assign(
              {},
              rest,
              generateImgAttrs({
                src,
                unoptimized,
                layout,
                width: widthInt,
                quality: qualityInt,
                sizes,
                loader,
              }),
              {
                decoding: 'async',
                'data-nimg': layout,
                style: imgStyle,
                className: className,
                loading: loading || 'lazy',
              },
            ),
          ),
        ),
        priority // Note how we omit the `href` attribute, as it would only be relevant
          ? // for browsers that do not support `imagesrcset`, and in those cases
            // it would likely cause the incorrect image to be preloaded.
            //
            // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset

            /*#__PURE__*/
            _react.default.createElement(
              _head.default,
              null,
              /*#__PURE__*/ _react.default.createElement('link', {
                key:
                  '__nimg-' +
                  imgAttributes.src +
                  imgAttributes.srcSet +
                  imgAttributes.sizes,
                rel: 'preload',
                as: 'image',
                href: imgAttributes.srcSet ? undefined : imgAttributes.src,
                // @ts-ignore: imagesrcset is not yet in the link element type.
                imagesrcset: imgAttributes.srcSet,
                // @ts-ignore: imagesizes is not yet in the link element type.
                imagesizes: imgAttributes.sizes,
              }),
            )
          : null,
      )
    }

    function normalizeSrc(src) {
      return src[0] === '/' ? src.slice(1) : src
    }

    function imgixLoader({root, src, width, quality}) {
      // Demo: https://static.imgix.net/daisy.png?auto=format&fit=max&w=300
      const url = new URL(`${root}${normalizeSrc(src)}`)
      const params = url.searchParams
      params.set('auto', params.get('auto') || 'format')
      params.set('fit', params.get('fit') || 'max')
      params.set('w', params.get('w') || width.toString())

      if (quality) {
        params.set('q', quality.toString())
      }

      return url.href
    }

    function akamaiLoader({root, src, width}) {
      return `${root}${normalizeSrc(src)}?imwidth=${width}`
    }

    function cloudinaryLoader({root, src, width, quality}) {
      // Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
      const params = [
        'f_auto',
        'c_limit',
        'w_' + width,
        'q_' + (quality || 'auto'),
      ]
      let paramsString = params.join(',') + '/'
      return `${root}${paramsString}${normalizeSrc(src)}`
    }

    function customLoader({src}) {
      throw new Error(
        `Image with src "${src}" is missing "loader" prop.` +
          `\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader`,
      )
    }

    function defaultLoader({root, src, width, quality}) {
      if (false) {
      }

      return `${root}?url=${encodeURIComponent(src)}&w=${width}&q=${
        quality || 75
      }`
    }

    /***/
  },

  /***/ 5671: /***/ (module, __unused_webpack_exports, __webpack_require__) => {
    module.exports = __webpack_require__(9482)

    /***/
  },
}
