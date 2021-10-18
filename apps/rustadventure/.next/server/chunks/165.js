exports.id = 165
exports.ids = [165]
exports.modules = {
  /***/ 8739: /***/ (__unused_webpack_module, exports) => {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.default = initHeadManager
    exports.DOMAttributeNames = void 0
    const DOMAttributeNames = {
      acceptCharset: 'accept-charset',
      className: 'class',
      htmlFor: 'for',
      httpEquiv: 'http-equiv',
      noModule: 'noModule',
    }
    exports.DOMAttributeNames = DOMAttributeNames

    function reactElementToDOM({type, props}) {
      const el = document.createElement(type)

      for (const p in props) {
        if (!props.hasOwnProperty(p)) continue
        if (p === 'children' || p === 'dangerouslySetInnerHTML') continue // we don't render undefined props to the DOM

        if (props[p] === undefined) continue
        const attr = DOMAttributeNames[p] || p.toLowerCase()

        if (
          type === 'script' &&
          (attr === 'async' || attr === 'defer' || attr === 'noModule')
        ) {
          el[attr] = !!props[p]
        } else {
          el.setAttribute(attr, props[p])
        }
      }

      const {children, dangerouslySetInnerHTML} = props

      if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || ''
      } else if (children) {
        el.textContent =
          typeof children === 'string'
            ? children
            : Array.isArray(children)
            ? children.join('')
            : ''
      }

      return el
    }

    function updateElements(type, components) {
      const headEl = document.getElementsByTagName('head')[0]
      const headCountEl = headEl.querySelector('meta[name=next-head-count]')

      if (false) {
      }

      const headCount = Number(headCountEl.content)
      const oldTags = []

      for (
        let i = 0, j = headCountEl.previousElementSibling;
        i < headCount;
        i++, j = j.previousElementSibling
      ) {
        if (j.tagName.toLowerCase() === type) {
          oldTags.push(j)
        }
      }

      const newTags = components.map(reactElementToDOM).filter((newTag) => {
        for (let k = 0, len = oldTags.length; k < len; k++) {
          const oldTag = oldTags[k]

          if (oldTag.isEqualNode(newTag)) {
            oldTags.splice(k, 1)
            return false
          }
        }

        return true
      })
      oldTags.forEach((t) => t.parentNode.removeChild(t))
      newTags.forEach((t) => headEl.insertBefore(t, headCountEl))
      headCountEl.content = (
        headCount -
        oldTags.length +
        newTags.length
      ).toString()
    }

    function initHeadManager() {
      let updatePromise = null
      return {
        mountedInstances: new Set(),
        updateHead: (head) => {
          const promise = (updatePromise = Promise.resolve().then(() => {
            if (promise !== updatePromise) return
            updatePromise = null
            const tags = {}
            head.forEach((h) => {
              if (
                // If the font tag is loaded only on client navigation
                // it won't be inlined. In this case revert to the original behavior
                h.type === 'link' &&
                h.props['data-optimized-fonts'] &&
                !document.querySelector(
                  `style[data-href="${h.props['data-href']}"]`,
                )
              ) {
                h.props.href = h.props['data-href']
                h.props['data-href'] = undefined
              }

              const components = tags[h.type] || []
              components.push(h)
              tags[h.type] = components
            })
            const titleComponent = tags.title ? tags.title[0] : null
            let title = ''

            if (titleComponent) {
              const {children} = titleComponent.props
              title =
                typeof children === 'string'
                  ? children
                  : Array.isArray(children)
                  ? children.join('')
                  : ''
            }

            if (title !== document.title) document.title = title
            ;['meta', 'base', 'link', 'style', 'script'].forEach((type) => {
              updateElements(type, tags[type] || [])
            })
          }))
        },
      }
    }

    /***/
  },

  /***/ 5842: /***/ (__unused_webpack_module, exports) => {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.requestIdleCallback = exports.cancelIdleCallback = void 0

    const requestIdleCallback =
      (typeof self !== 'undefined' &&
        self.requestIdleCallback &&
        self.requestIdleCallback.bind(window)) ||
      function (cb) {
        let start = Date.now()
        return setTimeout(function () {
          cb({
            didTimeout: false,
            timeRemaining: function () {
              return Math.max(0, 50 - (Date.now() - start))
            },
          })
        }, 1)
      }

    exports.requestIdleCallback = requestIdleCallback

    const cancelIdleCallback =
      (typeof self !== 'undefined' &&
        self.cancelIdleCallback &&
        self.cancelIdleCallback.bind(window)) ||
      function (id) {
        return clearTimeout(id)
      }

    exports.cancelIdleCallback = cancelIdleCallback

    /***/
  },

  /***/ 4343: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.initScriptLoader = initScriptLoader
    exports.default = void 0

    var _react = __webpack_require__(9297)

    var _headManagerContext = __webpack_require__(6098)

    var _headManager = __webpack_require__(8739)

    var _requestIdleCallback = __webpack_require__(5842)

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

    const ScriptCache = new Map()
    const LoadCache = new Set()
    const ignoreProps = [
      'onLoad',
      'dangerouslySetInnerHTML',
      'children',
      'onError',
      'strategy',
    ]

    const loadScript = (props) => {
      const {
        src,
        id,
        onLoad = () => {},
        dangerouslySetInnerHTML,
        children = '',
        strategy = 'afterInteractive',
        onError,
      } = props
      const cacheKey = id || src // Script has already loaded

      if (cacheKey && LoadCache.has(cacheKey)) {
        return
      } // Contents of this script are already loading/loaded

      if (ScriptCache.has(src)) {
        LoadCache.add(cacheKey) // Execute onLoad since the script loading has begun

        ScriptCache.get(src).then(onLoad, onError)
        return
      }

      const el = document.createElement('script')
      const loadPromise = new Promise((resolve, reject) => {
        el.addEventListener('load', function (e) {
          resolve()

          if (onLoad) {
            onLoad.call(this, e)
          }
        })
        el.addEventListener('error', function (e) {
          reject(e)
        })
      }).catch(function (e) {
        if (onError) {
          onError(e)
        }
      })

      if (src) {
        ScriptCache.set(src, loadPromise)
      }

      LoadCache.add(cacheKey)

      if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || ''
      } else if (children) {
        el.textContent =
          typeof children === 'string'
            ? children
            : Array.isArray(children)
            ? children.join('')
            : ''
      } else if (src) {
        el.src = src
      }

      for (const [k, value] of Object.entries(props)) {
        if (value === undefined || ignoreProps.includes(k)) {
          continue
        }

        const attr = _headManager.DOMAttributeNames[k] || k.toLowerCase()
        el.setAttribute(attr, value)
      }

      el.setAttribute('data-nscript', strategy)
      document.body.appendChild(el)
    }

    function handleClientScriptLoad(props) {
      const {strategy = 'afterInteractive'} = props

      if (strategy === 'afterInteractive') {
        loadScript(props)
      } else if (strategy === 'lazyOnload') {
        window.addEventListener('load', () => {
          ;(0, _requestIdleCallback).requestIdleCallback(() =>
            loadScript(props),
          )
        })
      }
    }

    function loadLazyScript(props) {
      if (document.readyState === 'complete') {
        ;(0, _requestIdleCallback).requestIdleCallback(() => loadScript(props))
      } else {
        window.addEventListener('load', () => {
          ;(0, _requestIdleCallback).requestIdleCallback(() =>
            loadScript(props),
          )
        })
      }
    }

    function initScriptLoader(scriptLoaderItems) {
      scriptLoaderItems.forEach(handleClientScriptLoad)
    }

    function Script(props) {
      const {
          src = '',
          onLoad = () => {},
          dangerouslySetInnerHTML,
          strategy = 'afterInteractive',
          onError,
        } = props,
        restProps = _objectWithoutProperties(props, [
          'src',
          'onLoad',
          'dangerouslySetInnerHTML',
          'strategy',
          'onError',
        ]) // Context is available only during SSR

      const {updateScripts, scripts, getIsSsr} = (0, _react).useContext(
        _headManagerContext.HeadManagerContext,
      )
      ;(0, _react).useEffect(() => {
        if (strategy === 'afterInteractive') {
          loadScript(props)
        } else if (strategy === 'lazyOnload') {
          loadLazyScript(props)
        }
      }, [props, strategy])

      if (strategy === 'beforeInteractive') {
        if (updateScripts) {
          scripts.beforeInteractive = (scripts.beforeInteractive || []).concat([
            _objectSpread(
              {
                src,
                onLoad,
                onError,
              },
              restProps,
            ),
          ])
          updateScripts(scripts)
        } else if (getIsSsr && getIsSsr()) {
          // Script has already loaded during SSR
          LoadCache.add(restProps.id || src)
        } else if (getIsSsr && !getIsSsr()) {
          loadScript(props)
        }
      }

      return null
    }

    var _default = Script
    exports.default = _default

    /***/
  },

  /***/ 4903: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    'use strict'
    var __webpack_unused_export__

    const _excluded = ['strategy']

    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object)
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object)
        if (enumerableOnly) {
          symbols = symbols.filter(function (sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable
          })
        }
        keys.push.apply(keys, symbols)
      }
      return keys
    }

    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {}
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key])
          })
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(
            target,
            Object.getOwnPropertyDescriptors(source),
          )
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(
              target,
              key,
              Object.getOwnPropertyDescriptor(source, key),
            )
          })
        }
      }
      return target
    }

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

    __webpack_unused_export__ = {
      value: true,
    }
    __webpack_unused_export__ = {
      enumerable: true,
      get: function () {
        return _utils.DocumentContext
      },
    }
    __webpack_unused_export__ = {
      enumerable: true,
      get: function () {
        return _utils.DocumentInitialProps
      },
    }
    __webpack_unused_export__ = {
      enumerable: true,
      get: function () {
        return _utils.DocumentProps
      },
    }
    exports.Html = Html
    exports.Main = Main
    exports.default = void 0

    var _react = _interopRequireWildcard(__webpack_require__(9297))

    var _server = _interopRequireDefault(__webpack_require__(8809))

    var _constants = __webpack_require__(6044)

    var _utils = __webpack_require__(7620)

    var _getPageFiles = __webpack_require__(372)

    var _utils1 = __webpack_require__(6464)

    var _htmlescape = __webpack_require__(5041)

    var _script = _interopRequireDefault(__webpack_require__(4343))

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule
        ? obj
        : {
            default: obj,
          }
    }

    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj
      } else {
        var newObj = {}

        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              var desc =
                Object.defineProperty && Object.getOwnPropertyDescriptor
                  ? Object.getOwnPropertyDescriptor(obj, key)
                  : {}

              if (desc.get || desc.set) {
                Object.defineProperty(newObj, key, desc)
              } else {
                newObj[key] = obj[key]
              }
            }
          }
        }

        newObj.default = obj
        return newObj
      }
    }

    function getDocumentFiles(buildManifest, pathname, inAmpMode) {
      const sharedFiles = (0, _getPageFiles).getPageFiles(
        buildManifest,
        '/_app',
      )
      const pageFiles = inAmpMode
        ? []
        : (0, _getPageFiles).getPageFiles(buildManifest, pathname)
      return {
        sharedFiles,
        pageFiles,
        allFiles: [...new Set([...sharedFiles, ...pageFiles])],
      }
    }

    function getPolyfillScripts(context, props) {
      // polyfills.js has to be rendered as nomodule without async
      // It also has to be the first script to load
      const {
        assetPrefix,
        buildManifest,
        devOnlyCacheBusterQueryString,
        disableOptimizedLoading,
      } = context
      return buildManifest.polyfillFiles
        .filter(
          (polyfill) =>
            polyfill.endsWith('.js') && !polyfill.endsWith('.module.js'),
        )
        .map((polyfill) =>
          /*#__PURE__*/ _react.default.createElement('script', {
            key: polyfill,
            defer: !disableOptimizedLoading,
            nonce: props.nonce,
            crossOrigin: props.crossOrigin || undefined,
            noModule: true,
            src: `${assetPrefix}/_next/${polyfill}${devOnlyCacheBusterQueryString}`,
          }),
        )
    }

    function getPreNextScripts(context, props) {
      const {scriptLoader, disableOptimizedLoading} = context
      return (scriptLoader.beforeInteractive || []).map((file, index) => {
        const {strategy} = file,
          scriptProps = _objectWithoutProperties(file, _excluded)

        return /*#__PURE__*/ _react.default.createElement(
          'script',
          Object.assign({}, scriptProps, {
            key: scriptProps.src || index,
            defer: !disableOptimizedLoading,
            nonce: props.nonce,
            'data-nscript': 'beforeInteractive',
            crossOrigin: props.crossOrigin || undefined,
          }),
        )
      })
    }

    function getDynamicChunks(context, props, files) {
      const {
        dynamicImports,
        assetPrefix,
        isDevelopment,
        devOnlyCacheBusterQueryString,
        disableOptimizedLoading,
      } = context
      return dynamicImports.map((file) => {
        if (!file.endsWith('.js') || files.allFiles.includes(file)) return null
        return /*#__PURE__*/ _react.default.createElement('script', {
          async: !isDevelopment && disableOptimizedLoading,
          defer: !disableOptimizedLoading,
          key: file,
          src: `${assetPrefix}/_next/${encodeURI(
            file,
          )}${devOnlyCacheBusterQueryString}`,
          nonce: props.nonce,
          crossOrigin: props.crossOrigin || undefined,
        })
      })
    }

    function getScripts(context, props, files) {
      var ref
      const {
        assetPrefix,
        buildManifest,
        isDevelopment,
        devOnlyCacheBusterQueryString,
        disableOptimizedLoading,
      } = context
      const normalScripts = files.allFiles.filter((file) =>
        file.endsWith('.js'),
      )
      const lowPriorityScripts =
        (ref = buildManifest.lowPriorityFiles) === null || ref === void 0
          ? void 0
          : ref.filter((file) => file.endsWith('.js'))
      return [...normalScripts, ...lowPriorityScripts].map((file) => {
        return /*#__PURE__*/ _react.default.createElement('script', {
          key: file,
          src: `${assetPrefix}/_next/${encodeURI(
            file,
          )}${devOnlyCacheBusterQueryString}`,
          nonce: props.nonce,
          async: !isDevelopment && disableOptimizedLoading,
          defer: !disableOptimizedLoading,
          crossOrigin: props.crossOrigin || undefined,
        })
      })
    }

    class Document1 extends _react.Component {
      /**
       * `getInitialProps` hook returns the context object with the addition of `renderPage`.
       * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
       */
      static async getInitialProps(ctx) {
        const enhanceApp = (App) => {
          return (props) =>
            /*#__PURE__*/ _react.default.createElement(
              App,
              Object.assign({}, props),
            )
        }

        const {html, head} = await ctx.renderPage({
          enhanceApp,
        })
        const styles = [...(0, _server).default()]
        return {
          html,
          head,
          styles,
        }
      }

      render() {
        return /*#__PURE__*/ _react.default.createElement(
          Html,
          null,
          /*#__PURE__*/ _react.default.createElement(Head, null),
          /*#__PURE__*/ _react.default.createElement(
            'body',
            null,
            /*#__PURE__*/ _react.default.createElement(Main, null),
            /*#__PURE__*/ _react.default.createElement(NextScript, null),
          ),
        )
      }
    }

    exports.default = Document1

    function Html(props) {
      const {inAmpMode, docComponentsRendered, locale} = (0, _react).useContext(
        _utils.HtmlContext,
      )
      docComponentsRendered.Html = true
      return /*#__PURE__*/ _react.default.createElement(
        'html',
        Object.assign({}, props, {
          lang: props.lang || locale || undefined,
          amp: inAmpMode ? '' : undefined,
          'data-ampdevmode': inAmpMode && false ? '' : undefined,
        }),
      )
    }

    class Head extends _react.Component {
      getCssLinks(files) {
        const {assetPrefix, devOnlyCacheBusterQueryString, dynamicImports} =
          this.context
        const cssFiles = files.allFiles.filter((f) => f.endsWith('.css'))
        const sharedFiles = new Set(files.sharedFiles) // Unmanaged files are CSS files that will be handled directly by the
        // webpack runtime (`mini-css-extract-plugin`).

        let unmangedFiles = new Set([])
        let dynamicCssFiles = Array.from(
          new Set(dynamicImports.filter((file) => file.endsWith('.css'))),
        )

        if (dynamicCssFiles.length) {
          const existing = new Set(cssFiles)
          dynamicCssFiles = dynamicCssFiles.filter(
            (f) => !(existing.has(f) || sharedFiles.has(f)),
          )
          unmangedFiles = new Set(dynamicCssFiles)
          cssFiles.push(...dynamicCssFiles)
        }

        let cssLinkElements = []
        cssFiles.forEach((file) => {
          const isSharedFile = sharedFiles.has(file)

          if (true) {
            cssLinkElements.push(
              /*#__PURE__*/ _react.default.createElement('link', {
                key: `${file}-preload`,
                nonce: this.props.nonce,
                rel: 'preload',
                href: `${assetPrefix}/_next/${encodeURI(
                  file,
                )}${devOnlyCacheBusterQueryString}`,
                as: 'style',
                crossOrigin: this.props.crossOrigin || undefined,
              }),
            )
          }

          const isUnmanagedFile = unmangedFiles.has(file)
          cssLinkElements.push(
            /*#__PURE__*/ _react.default.createElement('link', {
              key: file,
              nonce: this.props.nonce,
              rel: 'stylesheet',
              href: `${assetPrefix}/_next/${encodeURI(
                file,
              )}${devOnlyCacheBusterQueryString}`,
              crossOrigin: this.props.crossOrigin || undefined,
              'data-n-g': isUnmanagedFile
                ? undefined
                : isSharedFile
                ? ''
                : undefined,
              'data-n-p': isUnmanagedFile
                ? undefined
                : isSharedFile
                ? undefined
                : '',
            }),
          )
        })

        if (true) {
          cssLinkElements = this.makeStylesheetInert(cssLinkElements)
        }

        return cssLinkElements.length === 0 ? null : cssLinkElements
      }

      getPreloadDynamicChunks() {
        const {dynamicImports, assetPrefix, devOnlyCacheBusterQueryString} =
          this.context
        return dynamicImports
          .map((file) => {
            if (!file.endsWith('.js')) {
              return null
            }

            return /*#__PURE__*/ _react.default.createElement('link', {
              rel: 'preload',
              key: file,
              href: `${assetPrefix}/_next/${encodeURI(
                file,
              )}${devOnlyCacheBusterQueryString}`,
              as: 'script',
              nonce: this.props.nonce,
              crossOrigin: this.props.crossOrigin || undefined,
            })
          }) // Filter out nulled scripts
          .filter(Boolean)
      }

      getPreloadMainLinks(files) {
        const {assetPrefix, devOnlyCacheBusterQueryString, scriptLoader} =
          this.context
        const preloadFiles = files.allFiles.filter((file) => {
          return file.endsWith('.js')
        })
        return [
          ...(scriptLoader.beforeInteractive || []).map((file) =>
            /*#__PURE__*/ _react.default.createElement('link', {
              key: file.src,
              nonce: this.props.nonce,
              rel: 'preload',
              href: file.src,
              as: 'script',
              crossOrigin: this.props.crossOrigin || undefined,
            }),
          ),
          ...preloadFiles.map((file) =>
            /*#__PURE__*/ _react.default.createElement('link', {
              key: file,
              nonce: this.props.nonce,
              rel: 'preload',
              href: `${assetPrefix}/_next/${encodeURI(
                file,
              )}${devOnlyCacheBusterQueryString}`,
              as: 'script',
              crossOrigin: this.props.crossOrigin || undefined,
            }),
          ),
        ]
      }

      getDynamicChunks(files) {
        return getDynamicChunks(this.context, this.props, files)
      }

      getPreNextScripts() {
        return getPreNextScripts(this.context, this.props)
      }

      getScripts(files) {
        return getScripts(this.context, this.props, files)
      }

      getPolyfillScripts() {
        return getPolyfillScripts(this.context, this.props)
      }

      handleDocumentScriptLoaderItems(children) {
        const {scriptLoader} = this.context
        const scriptLoaderItems = []
        const filteredChildren = []

        _react.default.Children.forEach(children, (child) => {
          if (child.type === _script.default) {
            if (child.props.strategy === 'beforeInteractive') {
              scriptLoader.beforeInteractive = (
                scriptLoader.beforeInteractive || []
              ).concat([_objectSpread({}, child.props)])
              return
            } else if (
              ['lazyOnload', 'afterInteractive'].includes(child.props.strategy)
            ) {
              scriptLoaderItems.push(child.props)
              return
            }
          }

          filteredChildren.push(child)
        })

        this.context.__NEXT_DATA__.scriptLoader = scriptLoaderItems
        return filteredChildren
      }

      makeStylesheetInert(node) {
        return _react.default.Children.map(node, (c) => {
          if (
            c.type === 'link' &&
            c.props['href'] &&
            _constants.OPTIMIZED_FONT_PROVIDERS.some(({url}) =>
              c.props['href'].startsWith(url),
            )
          ) {
            const newProps = _objectSpread({}, c.props || {})

            newProps['data-href'] = newProps['href']
            newProps['href'] = undefined
            return /*#__PURE__*/ _react.default.cloneElement(c, newProps)
          } else if (c.props && c.props['children']) {
            c.props['children'] = this.makeStylesheetInert(c.props['children'])
          }

          return c
        })
      }

      render() {
        const {
          styles,
          ampPath,
          inAmpMode,
          hybridAmp,
          canonicalBase,
          __NEXT_DATA__,
          dangerousAsPath,
          headTags,
          unstable_runtimeJS,
          unstable_JsPreload,
          disableOptimizedLoading,
        } = this.context
        const disableRuntimeJS = unstable_runtimeJS === false
        const disableJsPreload =
          unstable_JsPreload === false || !disableOptimizedLoading
        this.context.docComponentsRendered.Head = true
        let {head} = this.context
        let cssPreloads = []
        let otherHeadElements = []

        if (head) {
          head.forEach((c) => {
            if (
              c &&
              c.type === 'link' &&
              c.props['rel'] === 'preload' &&
              c.props['as'] === 'style'
            ) {
              cssPreloads.push(c)
            } else {
              c && otherHeadElements.push(c)
            }
          })
          head = cssPreloads.concat(otherHeadElements)
        }

        let children = _react.default.Children.toArray(
          this.props.children,
        ).filter(Boolean) // show a warning if Head contains <title> (only in development)

        if (false) {
        }

        if (true && !inAmpMode) {
          children = this.makeStylesheetInert(children)
        }

        children = this.handleDocumentScriptLoaderItems(children)
        let hasAmphtmlRel = false
        let hasCanonicalRel = false // show warning and remove conflicting amp head tags

        head = _react.default.Children.map(head || [], (child) => {
          if (!child) return child
          const {type, props} = child

          if (inAmpMode) {
            let badProp = ''

            if (type === 'meta' && props.name === 'viewport') {
              badProp = 'name="viewport"'
            } else if (type === 'link' && props.rel === 'canonical') {
              hasCanonicalRel = true
            } else if (type === 'script') {
              // only block if
              // 1. it has a src and isn't pointing to ampproject's CDN
              // 2. it is using dangerouslySetInnerHTML without a type or
              // a type of text/javascript
              if (
                (props.src && props.src.indexOf('ampproject') < -1) ||
                (props.dangerouslySetInnerHTML &&
                  (!props.type || props.type === 'text/javascript'))
              ) {
                badProp = '<script'
                Object.keys(props).forEach((prop) => {
                  badProp += ` ${prop}="${props[prop]}"`
                })
                badProp += '/>'
              }
            }

            if (badProp) {
              console.warn(
                `Found conflicting amp tag "${child.type}" with conflicting prop ${badProp} in ${__NEXT_DATA__.page}. https://nextjs.org/docs/messages/conflicting-amp-tag`,
              )
              return null
            }
          } else {
            // non-amp mode
            if (type === 'link' && props.rel === 'amphtml') {
              hasAmphtmlRel = true
            }
          }

          return child
        }) // try to parse styles from fragment for backwards compat

        const curStyles = Array.isArray(styles) ? styles : []

        if (
          inAmpMode &&
          styles && // @ts-ignore Property 'props' does not exist on type ReactElement
          styles.props && // @ts-ignore Property 'props' does not exist on type ReactElement
          Array.isArray(styles.props.children)
        ) {
          const hasStyles = (el) => {
            var ref2, ref3
            return el === null || el === void 0
              ? void 0
              : (ref2 = el.props) === null || ref2 === void 0
              ? void 0
              : (ref3 = ref2.dangerouslySetInnerHTML) === null ||
                ref3 === void 0
              ? void 0
              : ref3.__html
          } // @ts-ignore Property 'props' does not exist on type ReactElement

          styles.props.children.forEach((child) => {
            if (Array.isArray(child)) {
              child.forEach((el) => hasStyles(el) && curStyles.push(el))
            } else if (hasStyles(child)) {
              curStyles.push(child)
            }
          })
        }

        const files = getDocumentFiles(
          this.context.buildManifest,
          this.context.__NEXT_DATA__.page,
          inAmpMode,
        )

        var _nonce, _nonce1

        return /*#__PURE__*/ _react.default.createElement(
          'head',
          Object.assign({}, this.props),
          this.context.isDevelopment &&
            /*#__PURE__*/ _react.default.createElement(
              _react.default.Fragment,
              null,
              /*#__PURE__*/ _react.default.createElement('style', {
                'data-next-hide-fouc': true,
                'data-ampdevmode': inAmpMode ? 'true' : undefined,
                dangerouslySetInnerHTML: {
                  __html: `body{display:none}`,
                },
              }),
              /*#__PURE__*/ _react.default.createElement(
                'noscript',
                {
                  'data-next-hide-fouc': true,
                  'data-ampdevmode': inAmpMode ? 'true' : undefined,
                },
                /*#__PURE__*/ _react.default.createElement('style', {
                  dangerouslySetInnerHTML: {
                    __html: `body{display:block}`,
                  },
                }),
              ),
            ),
          children,
          true &&
            /*#__PURE__*/ _react.default.createElement('meta', {
              name: 'next-font-preconnect',
            }),
          head,
          /*#__PURE__*/ _react.default.createElement('meta', {
            name: 'next-head-count',
            content: _react.default.Children.count(head || []).toString(),
          }),
          inAmpMode &&
            /*#__PURE__*/ _react.default.createElement(
              _react.default.Fragment,
              null,
              /*#__PURE__*/ _react.default.createElement('meta', {
                name: 'viewport',
                content: 'width=device-width,minimum-scale=1,initial-scale=1',
              }),
              !hasCanonicalRel &&
                /*#__PURE__*/ _react.default.createElement('link', {
                  rel: 'canonical',
                  href:
                    canonicalBase + (0, _utils1).cleanAmpPath(dangerousAsPath),
                }),
              /*#__PURE__*/ _react.default.createElement('link', {
                rel: 'preload',
                as: 'script',
                href: 'https://cdn.ampproject.org/v0.js',
              }),
              styles &&
                /*#__PURE__*/ _react.default.createElement('style', {
                  'amp-custom': '',
                  dangerouslySetInnerHTML: {
                    __html: curStyles
                      .map(
                        (style) => style.props.dangerouslySetInnerHTML.__html,
                      )
                      .join('')
                      .replace(/\/\*# sourceMappingURL=.*\*\//g, '')
                      .replace(/\/\*@ sourceURL=.*?\*\//g, ''),
                  },
                }),
              /*#__PURE__*/ _react.default.createElement('style', {
                'amp-boilerplate': '',
                dangerouslySetInnerHTML: {
                  __html: `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`,
                },
              }),
              /*#__PURE__*/ _react.default.createElement(
                'noscript',
                null,
                /*#__PURE__*/ _react.default.createElement('style', {
                  'amp-boilerplate': '',
                  dangerouslySetInnerHTML: {
                    __html: `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`,
                  },
                }),
              ),
              /*#__PURE__*/ _react.default.createElement('script', {
                async: true,
                src: 'https://cdn.ampproject.org/v0.js',
              }),
            ),
          !inAmpMode &&
            /*#__PURE__*/ _react.default.createElement(
              _react.default.Fragment,
              null,
              !hasAmphtmlRel &&
                hybridAmp &&
                /*#__PURE__*/ _react.default.createElement('link', {
                  rel: 'amphtml',
                  href: canonicalBase + getAmpPath(ampPath, dangerousAsPath),
                }),
              true && this.getCssLinks(files),
              true &&
                /*#__PURE__*/ _react.default.createElement('noscript', {
                  'data-n-css':
                    (_nonce = this.props.nonce) !== null && _nonce !== void 0
                      ? _nonce
                      : '',
                }),
              false && /*#__PURE__*/ 0,
              !disableRuntimeJS &&
                !disableJsPreload &&
                this.getPreloadDynamicChunks(),
              !disableRuntimeJS &&
                !disableJsPreload &&
                this.getPreloadMainLinks(files),
              !disableOptimizedLoading &&
                !disableRuntimeJS &&
                this.getPolyfillScripts(),
              !disableOptimizedLoading &&
                !disableRuntimeJS &&
                this.getPreNextScripts(),
              !disableOptimizedLoading &&
                !disableRuntimeJS &&
                this.getDynamicChunks(files),
              !disableOptimizedLoading &&
                !disableRuntimeJS &&
                this.getScripts(files),
              false && 0,
              false && /*#__PURE__*/ 0,
              this.context.isDevelopment && // this element is used to mount development styles so the
                // ordering matches production
                // (by default, style-loader injects at the bottom of <head />)

                /*#__PURE__*/
                _react.default.createElement('noscript', {
                  id: '__next_css__DO_NOT_USE__',
                }),
              styles || null,
            ),
          /*#__PURE__*/ _react.default.createElement(
            _react.default.Fragment,
            {},
            ...(headTags || []),
          ),
        )
      }
    }

    exports.Head = Head
    Head.contextType = _utils.HtmlContext

    function Main() {
      const {inAmpMode, docComponentsRendered} = (0, _react).useContext(
        _utils.HtmlContext,
      )
      docComponentsRendered.Main = true
      if (inAmpMode)
        return /*#__PURE__*/ _react.default.createElement(
          _react.default.Fragment,
          null,
          _constants.BODY_RENDER_TARGET,
        )
      return /*#__PURE__*/ _react.default.createElement(
        'div',
        {
          id: '__next',
        },
        _constants.BODY_RENDER_TARGET,
      )
    }

    class NextScript extends _react.Component {
      getDynamicChunks(files) {
        return getDynamicChunks(this.context, this.props, files)
      }

      getPreNextScripts() {
        return getPreNextScripts(this.context, this.props)
      }

      getScripts(files) {
        return getScripts(this.context, this.props, files)
      }

      getPolyfillScripts() {
        return getPolyfillScripts(this.context, this.props)
      }

      static getInlineScriptSource(context) {
        const {__NEXT_DATA__} = context

        try {
          const data = JSON.stringify(__NEXT_DATA__)
          return (0, _htmlescape).htmlEscapeJsonString(data)
        } catch (err) {
          if (err.message.indexOf('circular structure')) {
            throw new Error(
              `Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://nextjs.org/docs/messages/circular-structure`,
            )
          }

          throw err
        }
      }

      render() {
        const {
          assetPrefix,
          inAmpMode,
          buildManifest,
          unstable_runtimeJS,
          docComponentsRendered,
          devOnlyCacheBusterQueryString,
          disableOptimizedLoading,
        } = this.context
        const disableRuntimeJS = unstable_runtimeJS === false
        docComponentsRendered.NextScript = true

        if (inAmpMode) {
          if (true) {
            return null
          }

          const ampDevFiles = [
            ...buildManifest.devFiles,
            ...buildManifest.polyfillFiles,
            ...buildManifest.ampDevFiles,
          ]
          return /*#__PURE__*/ _react.default.createElement(
            _react.default.Fragment,
            null,
            disableRuntimeJS
              ? null
              : /*#__PURE__*/ _react.default.createElement('script', {
                  id: '__NEXT_DATA__',
                  type: 'application/json',
                  nonce: this.props.nonce,
                  crossOrigin: this.props.crossOrigin || undefined,
                  dangerouslySetInnerHTML: {
                    __html: NextScript.getInlineScriptSource(this.context),
                  },
                  'data-ampdevmode': true,
                }),
            ampDevFiles.map((file) =>
              /*#__PURE__*/ _react.default.createElement('script', {
                key: file,
                src: `${assetPrefix}/_next/${file}${devOnlyCacheBusterQueryString}`,
                nonce: this.props.nonce,
                crossOrigin: this.props.crossOrigin || undefined,
                'data-ampdevmode': true,
              }),
            ),
          )
        }

        if (false) {
        }

        const files = getDocumentFiles(
          this.context.buildManifest,
          this.context.__NEXT_DATA__.page,
          inAmpMode,
        )
        return /*#__PURE__*/ _react.default.createElement(
          _react.default.Fragment,
          null,
          !disableRuntimeJS && buildManifest.devFiles
            ? buildManifest.devFiles.map((file) =>
                /*#__PURE__*/ _react.default.createElement('script', {
                  key: file,
                  src: `${assetPrefix}/_next/${encodeURI(
                    file,
                  )}${devOnlyCacheBusterQueryString}`,
                  nonce: this.props.nonce,
                  crossOrigin: this.props.crossOrigin || undefined,
                }),
              )
            : null,
          disableRuntimeJS
            ? null
            : /*#__PURE__*/ _react.default.createElement('script', {
                id: '__NEXT_DATA__',
                type: 'application/json',
                nonce: this.props.nonce,
                crossOrigin: this.props.crossOrigin || undefined,
                dangerouslySetInnerHTML: {
                  __html: NextScript.getInlineScriptSource(this.context),
                },
              }),
          disableOptimizedLoading &&
            !disableRuntimeJS &&
            this.getPolyfillScripts(),
          disableOptimizedLoading &&
            !disableRuntimeJS &&
            this.getPreNextScripts(),
          disableOptimizedLoading &&
            !disableRuntimeJS &&
            this.getDynamicChunks(files),
          disableOptimizedLoading &&
            !disableRuntimeJS &&
            this.getScripts(files),
        )
      }
    }

    exports.NextScript = NextScript
    NextScript.contextType = _utils.HtmlContext
    NextScript.safariNomoduleFix =
      '!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();'

    function getAmpPath(ampPath, asPath) {
      return ampPath || `${asPath}${asPath.includes('?') ? '&' : '?'}amp=1`
    }

    /***/
  },

  /***/ 8165: /***/ (module, __unused_webpack_exports, __webpack_require__) => {
    module.exports = __webpack_require__(4903)

    /***/
  },

  /***/ 90: /***/ (module) => {
    'use strict'

    function hash(str) {
      var hash = 5381,
        i = str.length

      while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i)
      }

      /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
       * integers. Since we want the results to be always positive, convert the
       * signed int to an unsigned by doing an unsigned bitshift. */
      return hash >>> 0
    }

    module.exports = hash

    /***/
  },

  /***/ 2686: /***/ (__unused_webpack_module, exports) => {
    'use strict'

    exports.__esModule = true
    exports.default = void 0

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i]
        descriptor.enumerable = descriptor.enumerable || false
        descriptor.configurable = true
        if ('value' in descriptor) descriptor.writable = true
        Object.defineProperty(target, descriptor.key, descriptor)
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps)
      if (staticProps) _defineProperties(Constructor, staticProps)
      return Constructor
    }

    /*
Based on Glamor's sheet
https://github.com/threepointone/glamor/blob/667b480d31b3721a905021b26e1290ce92ca2879/src/sheet.js
*/
    var isProd =
      typeof process !== 'undefined' &&
      process.env &&
      'production' === 'production'

    var isString = function isString(o) {
      return Object.prototype.toString.call(o) === '[object String]'
    }

    var StyleSheet = /*#__PURE__*/ (function () {
      function StyleSheet(_temp) {
        var _ref = _temp === void 0 ? {} : _temp,
          _ref$name = _ref.name,
          name = _ref$name === void 0 ? 'stylesheet' : _ref$name,
          _ref$optimizeForSpeed = _ref.optimizeForSpeed,
          optimizeForSpeed =
            _ref$optimizeForSpeed === void 0 ? isProd : _ref$optimizeForSpeed,
          _ref$isBrowser = _ref.isBrowser,
          isBrowser =
            _ref$isBrowser === void 0
              ? typeof window !== 'undefined'
              : _ref$isBrowser

        invariant(isString(name), '`name` must be a string')
        this._name = name
        this._deletedRulePlaceholder = '#' + name + '-deleted-rule____{}'
        invariant(
          typeof optimizeForSpeed === 'boolean',
          '`optimizeForSpeed` must be a boolean',
        )
        this._optimizeForSpeed = optimizeForSpeed
        this._isBrowser = isBrowser
        this._serverSheet = undefined
        this._tags = []
        this._injected = false
        this._rulesCount = 0
        var node =
          this._isBrowser &&
          document.querySelector('meta[property="csp-nonce"]')
        this._nonce = node ? node.getAttribute('content') : null
      }

      var _proto = StyleSheet.prototype

      _proto.setOptimizeForSpeed = function setOptimizeForSpeed(bool) {
        invariant(
          typeof bool === 'boolean',
          '`setOptimizeForSpeed` accepts a boolean',
        )
        invariant(
          this._rulesCount === 0,
          'optimizeForSpeed cannot be when rules have already been inserted',
        )
        this.flush()
        this._optimizeForSpeed = bool
        this.inject()
      }

      _proto.isOptimizeForSpeed = function isOptimizeForSpeed() {
        return this._optimizeForSpeed
      }

      _proto.inject = function inject() {
        var _this = this

        invariant(!this._injected, 'sheet already injected')
        this._injected = true

        if (this._isBrowser && this._optimizeForSpeed) {
          this._tags[0] = this.makeStyleTag(this._name)
          this._optimizeForSpeed = 'insertRule' in this.getSheet()

          if (!this._optimizeForSpeed) {
            if (!isProd) {
              console.warn(
                'StyleSheet: optimizeForSpeed mode not supported falling back to standard mode.',
              )
            }

            this.flush()
            this._injected = true
          }

          return
        }

        this._serverSheet = {
          cssRules: [],
          insertRule: function insertRule(rule, index) {
            if (typeof index === 'number') {
              _this._serverSheet.cssRules[index] = {
                cssText: rule,
              }
            } else {
              _this._serverSheet.cssRules.push({
                cssText: rule,
              })
            }

            return index
          },
          deleteRule: function deleteRule(index) {
            _this._serverSheet.cssRules[index] = null
          },
        }
      }

      _proto.getSheetForTag = function getSheetForTag(tag) {
        if (tag.sheet) {
          return tag.sheet
        } // this weirdness brought to you by firefox

        for (var i = 0; i < document.styleSheets.length; i++) {
          if (document.styleSheets[i].ownerNode === tag) {
            return document.styleSheets[i]
          }
        }
      }

      _proto.getSheet = function getSheet() {
        return this.getSheetForTag(this._tags[this._tags.length - 1])
      }

      _proto.insertRule = function insertRule(rule, index) {
        invariant(isString(rule), '`insertRule` accepts only strings')

        if (!this._isBrowser) {
          if (typeof index !== 'number') {
            index = this._serverSheet.cssRules.length
          }

          this._serverSheet.insertRule(rule, index)

          return this._rulesCount++
        }

        if (this._optimizeForSpeed) {
          var sheet = this.getSheet()

          if (typeof index !== 'number') {
            index = sheet.cssRules.length
          } // this weirdness for perf, and chrome's weird bug
          // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule

          try {
            sheet.insertRule(rule, index)
          } catch (error) {
            if (!isProd) {
              console.warn(
                'StyleSheet: illegal rule: \n\n' +
                  rule +
                  '\n\nSee https://stackoverflow.com/q/20007992 for more info',
              )
            }

            return -1
          }
        } else {
          var insertionPoint = this._tags[index]

          this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint))
        }

        return this._rulesCount++
      }

      _proto.replaceRule = function replaceRule(index, rule) {
        if (this._optimizeForSpeed || !this._isBrowser) {
          var sheet = this._isBrowser ? this.getSheet() : this._serverSheet

          if (!rule.trim()) {
            rule = this._deletedRulePlaceholder
          }

          if (!sheet.cssRules[index]) {
            // @TBD Should we throw an error?
            return index
          }

          sheet.deleteRule(index)

          try {
            sheet.insertRule(rule, index)
          } catch (error) {
            if (!isProd) {
              console.warn(
                'StyleSheet: illegal rule: \n\n' +
                  rule +
                  '\n\nSee https://stackoverflow.com/q/20007992 for more info',
              )
            } // In order to preserve the indices we insert a deleteRulePlaceholder

            sheet.insertRule(this._deletedRulePlaceholder, index)
          }
        } else {
          var tag = this._tags[index]
          invariant(tag, 'old rule at index `' + index + '` not found')
          tag.textContent = rule
        }

        return index
      }

      _proto.deleteRule = function deleteRule(index) {
        if (!this._isBrowser) {
          this._serverSheet.deleteRule(index)

          return
        }

        if (this._optimizeForSpeed) {
          this.replaceRule(index, '')
        } else {
          var tag = this._tags[index]
          invariant(tag, 'rule at index `' + index + '` not found')
          tag.parentNode.removeChild(tag)
          this._tags[index] = null
        }
      }

      _proto.flush = function flush() {
        this._injected = false
        this._rulesCount = 0

        if (this._isBrowser) {
          this._tags.forEach(function (tag) {
            return tag && tag.parentNode.removeChild(tag)
          })

          this._tags = []
        } else {
          // simpler on server
          this._serverSheet.cssRules = []
        }
      }

      _proto.cssRules = function cssRules() {
        var _this2 = this

        if (!this._isBrowser) {
          return this._serverSheet.cssRules
        }

        return this._tags.reduce(function (rules, tag) {
          if (tag) {
            rules = rules.concat(
              Array.prototype.map.call(
                _this2.getSheetForTag(tag).cssRules,
                function (rule) {
                  return rule.cssText === _this2._deletedRulePlaceholder
                    ? null
                    : rule
                },
              ),
            )
          } else {
            rules.push(null)
          }

          return rules
        }, [])
      }

      _proto.makeStyleTag = function makeStyleTag(
        name,
        cssString,
        relativeToTag,
      ) {
        if (cssString) {
          invariant(
            isString(cssString),
            'makeStyleTag acceps only strings as second parameter',
          )
        }

        var tag = document.createElement('style')
        if (this._nonce) tag.setAttribute('nonce', this._nonce)
        tag.type = 'text/css'
        tag.setAttribute('data-' + name, '')

        if (cssString) {
          tag.appendChild(document.createTextNode(cssString))
        }

        var head = document.head || document.getElementsByTagName('head')[0]

        if (relativeToTag) {
          head.insertBefore(tag, relativeToTag)
        } else {
          head.appendChild(tag)
        }

        return tag
      }

      _createClass(StyleSheet, [
        {
          key: 'length',
          get: function get() {
            return this._rulesCount
          },
        },
      ])

      return StyleSheet
    })()

    exports.default = StyleSheet

    function invariant(condition, message) {
      if (!condition) {
        throw new Error('StyleSheet: ' + message + '.')
      }
    }

    /***/
  },

  /***/ 1729: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    'use strict'

    exports.__esModule = true
    exports.default = flushToReact
    exports.flushToHTML = flushToHTML

    var _react = _interopRequireDefault(__webpack_require__(9297))

    var _style = __webpack_require__(7943)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {default: obj}
    }

    function flushToReact(options) {
      if (options === void 0) {
        options = {}
      }

      return (0, _style.flush)().map(function (args) {
        var id = args[0]
        var css = args[1]
        return _react['default'].createElement('style', {
          id: '__' + id,
          // Avoid warnings upon render with a key
          key: '__' + id,
          nonce: options.nonce ? options.nonce : undefined,
          dangerouslySetInnerHTML: {
            __html: css,
          },
        })
      })
    }

    function flushToHTML(options) {
      if (options === void 0) {
        options = {}
      }

      return (0, _style.flush)().reduce(function (html, args) {
        var id = args[0]
        var css = args[1]
        html +=
          '<style id="__' +
          id +
          '"' +
          (options.nonce ? ' nonce="' + options.nonce + '"' : '') +
          '>' +
          css +
          '</style>'
        return html
      }, '')
    }

    /***/
  },

  /***/ 7943: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    'use strict'

    exports.__esModule = true
    exports.default = JSXStyle
    exports.flush = flush

    var _react = __webpack_require__(9297)

    var _stylesheetRegistry = _interopRequireDefault(__webpack_require__(2208))

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {default: obj}
    }

    var styleSheetRegistry = new _stylesheetRegistry['default']()

    function JSXStyle(props) {
      if (typeof window === 'undefined') {
        styleSheetRegistry.add(props)
        return null
      }

      ;(0, _react.useLayoutEffect)(
        function () {
          styleSheetRegistry.add(props)
          return function () {
            styleSheetRegistry.remove(props)
          } // props.children can be string[], will be striped since id is identical
        },
        [props.id, String(props.dynamic)],
      )
      return null
    }

    JSXStyle.dynamic = function (info) {
      return info
        .map(function (tagInfo) {
          var baseId = tagInfo[0]
          var props = tagInfo[1]
          return styleSheetRegistry.computeId(baseId, props)
        })
        .join(' ')
    }

    function flush() {
      var cssRules = styleSheetRegistry.cssRules()
      styleSheetRegistry.flush()
      return cssRules
    }

    /***/
  },

  /***/ 2208: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    'use strict'

    exports.__esModule = true
    exports.default = void 0

    var _stringHash = _interopRequireDefault(__webpack_require__(90))

    var _stylesheet = _interopRequireDefault(__webpack_require__(2686))

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {default: obj}
    }

    var sanitize = function sanitize(rule) {
      return rule.replace(/\/style/gi, '\\/style')
    }

    var StyleSheetRegistry = /*#__PURE__*/ (function () {
      function StyleSheetRegistry(_temp) {
        var _ref = _temp === void 0 ? {} : _temp,
          _ref$styleSheet = _ref.styleSheet,
          styleSheet = _ref$styleSheet === void 0 ? null : _ref$styleSheet,
          _ref$optimizeForSpeed = _ref.optimizeForSpeed,
          optimizeForSpeed =
            _ref$optimizeForSpeed === void 0 ? false : _ref$optimizeForSpeed,
          _ref$isBrowser = _ref.isBrowser,
          isBrowser =
            _ref$isBrowser === void 0
              ? typeof window !== 'undefined'
              : _ref$isBrowser

        this._sheet =
          styleSheet ||
          new _stylesheet['default']({
            name: 'styled-jsx',
            optimizeForSpeed: optimizeForSpeed,
          })

        this._sheet.inject()

        if (styleSheet && typeof optimizeForSpeed === 'boolean') {
          this._sheet.setOptimizeForSpeed(optimizeForSpeed)

          this._optimizeForSpeed = this._sheet.isOptimizeForSpeed()
        }

        this._isBrowser = isBrowser
        this._fromServer = undefined
        this._indices = {}
        this._instancesCounts = {}
        this.computeId = this.createComputeId()
        this.computeSelector = this.createComputeSelector()
      }

      var _proto = StyleSheetRegistry.prototype

      _proto.add = function add(props) {
        var _this = this

        if (undefined === this._optimizeForSpeed) {
          this._optimizeForSpeed = Array.isArray(props.children)

          this._sheet.setOptimizeForSpeed(this._optimizeForSpeed)

          this._optimizeForSpeed = this._sheet.isOptimizeForSpeed()
        }

        if (this._isBrowser && !this._fromServer) {
          this._fromServer = this.selectFromServer()
          this._instancesCounts = Object.keys(this._fromServer).reduce(
            function (acc, tagName) {
              acc[tagName] = 0
              return acc
            },
            {},
          )
        }

        var _this$getIdAndRules = this.getIdAndRules(props),
          styleId = _this$getIdAndRules.styleId,
          rules = _this$getIdAndRules.rules // Deduping: just increase the instances count.

        if (styleId in this._instancesCounts) {
          this._instancesCounts[styleId] += 1
          return
        }

        var indices = rules
          .map(function (rule) {
            return _this._sheet.insertRule(rule)
          }) // Filter out invalid rules
          .filter(function (index) {
            return index !== -1
          })
        this._indices[styleId] = indices
        this._instancesCounts[styleId] = 1
      }

      _proto.remove = function remove(props) {
        var _this2 = this

        var _this$getIdAndRules2 = this.getIdAndRules(props),
          styleId = _this$getIdAndRules2.styleId

        invariant(
          styleId in this._instancesCounts,
          'styleId: `' + styleId + '` not found',
        )
        this._instancesCounts[styleId] -= 1

        if (this._instancesCounts[styleId] < 1) {
          var tagFromServer = this._fromServer && this._fromServer[styleId]

          if (tagFromServer) {
            tagFromServer.parentNode.removeChild(tagFromServer)
            delete this._fromServer[styleId]
          } else {
            this._indices[styleId].forEach(function (index) {
              return _this2._sheet.deleteRule(index)
            })

            delete this._indices[styleId]
          }

          delete this._instancesCounts[styleId]
        }
      }

      _proto.update = function update(props, nextProps) {
        this.add(nextProps)
        this.remove(props)
      }

      _proto.flush = function flush() {
        this._sheet.flush()

        this._sheet.inject()

        this._fromServer = undefined
        this._indices = {}
        this._instancesCounts = {}
        this.computeId = this.createComputeId()
        this.computeSelector = this.createComputeSelector()
      }

      _proto.cssRules = function cssRules() {
        var _this3 = this

        var fromServer = this._fromServer
          ? Object.keys(this._fromServer).map(function (styleId) {
              return [styleId, _this3._fromServer[styleId]]
            })
          : []

        var cssRules = this._sheet.cssRules()

        return fromServer.concat(
          Object.keys(this._indices)
            .map(function (styleId) {
              return [
                styleId,
                _this3._indices[styleId]
                  .map(function (index) {
                    return cssRules[index].cssText
                  })
                  .join(_this3._optimizeForSpeed ? '' : '\n'),
              ]
            }) // filter out empty rules
            .filter(function (rule) {
              return Boolean(rule[1])
            }),
        )
      }
      /**
       * createComputeId
       *
       * Creates a function to compute and memoize a jsx id from a basedId and optionally props.
       */

      _proto.createComputeId = function createComputeId() {
        var cache = {}
        return function (baseId, props) {
          if (!props) {
            return 'jsx-' + baseId
          }

          var propsToString = String(props)
          var key = baseId + propsToString // return `jsx-${hashString(`${baseId}-${propsToString}`)}`

          if (!cache[key]) {
            cache[key] =
              'jsx-' + (0, _stringHash['default'])(baseId + '-' + propsToString)
          }

          return cache[key]
        }
      }
      /**
       * createComputeSelector
       *
       * Creates a function to compute and memoize dynamic selectors.
       */

      _proto.createComputeSelector = function createComputeSelector(
        selectoPlaceholderRegexp,
      ) {
        if (selectoPlaceholderRegexp === void 0) {
          selectoPlaceholderRegexp = /__jsx-style-dynamic-selector/g
        }

        var cache = {}
        return function (id, css) {
          // Sanitize SSR-ed CSS.
          // Client side code doesn't need to be sanitized since we use
          // document.createTextNode (dev) and the CSSOM api sheet.insertRule (prod).
          if (!this._isBrowser) {
            css = sanitize(css)
          }

          var idcss = id + css

          if (!cache[idcss]) {
            cache[idcss] = css.replace(selectoPlaceholderRegexp, id)
          }

          return cache[idcss]
        }
      }

      _proto.getIdAndRules = function getIdAndRules(props) {
        var _this4 = this

        var css = props.children,
          dynamic = props.dynamic,
          id = props.id

        if (dynamic) {
          var styleId = this.computeId(id, dynamic)
          return {
            styleId: styleId,
            rules: Array.isArray(css)
              ? css.map(function (rule) {
                  return _this4.computeSelector(styleId, rule)
                })
              : [this.computeSelector(styleId, css)],
          }
        }

        return {
          styleId: this.computeId(id),
          rules: Array.isArray(css) ? css : [css],
        }
      }
      /**
       * selectFromServer
       *
       * Collects style tags from the document with id __jsx-XXX
       */

      _proto.selectFromServer = function selectFromServer() {
        var elements = Array.prototype.slice.call(
          document.querySelectorAll('[id^="__jsx-"]'),
        )
        return elements.reduce(function (acc, element) {
          var id = element.id.slice(2)
          acc[id] = element
          return acc
        }, {})
      }

      return StyleSheetRegistry
    })()

    exports.default = StyleSheetRegistry

    function invariant(condition, message) {
      if (!condition) {
        throw new Error('StyleSheetRegistry: ' + message + '.')
      }
    }

    /***/
  },

  /***/ 8809: /***/ (module, __unused_webpack_exports, __webpack_require__) => {
    module.exports = __webpack_require__(1729)

    /***/
  },
}
