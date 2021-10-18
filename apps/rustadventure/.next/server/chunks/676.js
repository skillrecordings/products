exports.id = 676
exports.ids = [676]
exports.modules = {
  /***/ 102: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    'use strict'
    var __webpack_unused_export__

    __webpack_unused_export__ = {
      value: true,
    }
    exports.default = void 0

    var _react = _interopRequireDefault(__webpack_require__(9297))

    var _router = __webpack_require__(2520)

    var _router1 = __webpack_require__(1469)

    var _useIntersection = __webpack_require__(5345)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule
        ? obj
        : {
            default: obj,
          }
    }

    const prefetched = {}

    function prefetch(router, href, as, options) {
      if (true) return
      if (!(0, _router).isLocalURL(href)) return // Prefetch the JSON page if asked (only in the client)
      // We need to handle a prefetch error here since we may be
      // loading with priority which can reject but we don't
      // want to force navigation since this is only a prefetch

      router.prefetch(href, as, options).catch((err) => {
        if (false) {
        }
      })
      const curLocale =
        options && typeof options.locale !== 'undefined'
          ? options.locale
          : router && router.locale // Join on an invalid URI character

      prefetched[href + '%' + as + (curLocale ? '%' + curLocale : '')] = true
    }

    function isModifiedEvent(event) {
      const {target} = event.currentTarget
      return (
        (target && target !== '_self') ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        (event.nativeEvent && event.nativeEvent.which === 2)
      )
    }

    function linkClicked(
      e,
      router,
      href,
      as,
      replace,
      shallow,
      scroll,
      locale,
    ) {
      const {nodeName} = e.currentTarget

      if (
        nodeName === 'A' &&
        (isModifiedEvent(e) || !(0, _router).isLocalURL(href))
      ) {
        // ignore click for browser’s default behavior
        return
      }

      e.preventDefault() //  avoid scroll for urls with anchor refs

      if (scroll == null && as.indexOf('#') >= 0) {
        scroll = false
      } // replace state instead of push if prop is present

      router[replace ? 'replace' : 'push'](href, as, {
        shallow,
        locale,
        scroll,
      })
    }

    function Link(props) {
      if (false) {
      }

      const p = props.prefetch !== false
      const router = (0, _router1).useRouter()

      const {href, as} = _react.default.useMemo(() => {
        const [resolvedHref, resolvedAs] = (0, _router).resolveHref(
          router,
          props.href,
          true,
        )
        return {
          href: resolvedHref,
          as: props.as
            ? (0, _router).resolveHref(router, props.as)
            : resolvedAs || resolvedHref,
        }
      }, [router, props.href, props.as])

      let {children, replace, shallow, scroll, locale} = props // Deprecated. Warning shown by propType check. If the children provided is a string (<Link>example</Link>) we wrap it in an <a> tag

      if (typeof children === 'string') {
        children = /*#__PURE__*/ _react.default.createElement(
          'a',
          null,
          children,
        )
      } // This will return the first child, if multiple are provided it will throw an error

      let child

      if (false) {
      } else {
        child = _react.default.Children.only(children)
      }

      const childRef = child && typeof child === 'object' && child.ref
      const [setIntersectionRef, isVisible] = (0,
      _useIntersection).useIntersection({
        rootMargin: '200px',
      })

      const setRef = _react.default.useCallback(
        (el) => {
          setIntersectionRef(el)

          if (childRef) {
            if (typeof childRef === 'function') childRef(el)
            else if (typeof childRef === 'object') {
              childRef.current = el
            }
          }
        },
        [childRef, setIntersectionRef],
      )

      _react.default.useEffect(() => {
        const shouldPrefetch = isVisible && p && (0, _router).isLocalURL(href)
        const curLocale =
          typeof locale !== 'undefined' ? locale : router && router.locale
        const isPrefetched =
          prefetched[href + '%' + as + (curLocale ? '%' + curLocale : '')]

        if (shouldPrefetch && !isPrefetched) {
          prefetch(router, href, as, {
            locale: curLocale,
          })
        }
      }, [as, href, isVisible, locale, p, router])

      const childProps = {
        ref: setRef,
        onClick: (e) => {
          if (child.props && typeof child.props.onClick === 'function') {
            child.props.onClick(e)
          }

          if (!e.defaultPrevented) {
            linkClicked(e, router, href, as, replace, shallow, scroll, locale)
          }
        },
      }

      childProps.onMouseEnter = (e) => {
        if (!(0, _router).isLocalURL(href)) return

        if (child.props && typeof child.props.onMouseEnter === 'function') {
          child.props.onMouseEnter(e)
        }

        prefetch(router, href, as, {
          priority: true,
        })
      } // If child is an <a> tag and doesn't have a href attribute, or if the 'passHref' property is
      // defined, we specify the current 'href', so that repetition is not needed by the user

      if (props.passHref || (child.type === 'a' && !('href' in child.props))) {
        const curLocale =
          typeof locale !== 'undefined' ? locale : router && router.locale // we only render domain locales if we are currently on a domain locale
        // so that locale links are still visitable in development/preview envs

        const localeDomain =
          router &&
          router.isLocaleDomain &&
          (0, _router).getDomainLocale(
            as,
            curLocale,
            router && router.locales,
            router && router.domainLocales,
          )
        childProps.href =
          localeDomain ||
          (0, _router).addBasePath(
            (0, _router).addLocale(
              as,
              curLocale,
              router && router.defaultLocale,
            ),
          )
      }

      return /*#__PURE__*/ _react.default.cloneElement(child, childProps)
    }

    var _default = Link
    exports.default = _default

    /***/
  },

  /***/ 5457: /***/ (__unused_webpack_module, exports) => {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.removePathTrailingSlash = removePathTrailingSlash
    exports.normalizePathTrailingSlash = void 0

    function removePathTrailingSlash(path) {
      return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path
    }

    const normalizePathTrailingSlash = false ? 0 : removePathTrailingSlash
    exports.normalizePathTrailingSlash = normalizePathTrailingSlash

    /***/
  },

  /***/ 4711: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.markAssetError = markAssetError
    exports.isAssetError = isAssetError
    exports.getClientBuildManifest = getClientBuildManifest
    exports.createRouteLoader = createRouteLoader

    var _getAssetPathFromRoute = _interopRequireDefault(
      __webpack_require__(2248),
    )

    var _requestIdleCallback = __webpack_require__(5842)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule
        ? obj
        : {
            default: obj,
          }
    } // 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
    // considers as "Good" time-to-interactive. We must assume something went
    // wrong beyond this point, and then fall-back to a full page transition to
    // show the user something of value.

    const MS_MAX_IDLE_DELAY = 3800

    function withFuture(key, map, generator) {
      let entry = map.get(key)

      if (entry) {
        if ('future' in entry) {
          return entry.future
        }

        return Promise.resolve(entry)
      }

      let resolver
      const prom = new Promise((resolve) => {
        resolver = resolve
      })
      map.set(
        key,
        (entry = {
          resolve: resolver,
          future: prom,
        }),
      )
      return generator
        ? generator().then((value) => (resolver(value), value))
        : prom
    }

    function hasPrefetch(link) {
      try {
        link = document.createElement('link')
        return (
          // detect IE11 since it supports prefetch but isn't detected
          // with relList.support
          (!!window.MSInputMethodContext && !!document.documentMode) ||
          link.relList.supports('prefetch')
        )
      } catch (e) {
        return false
      }
    }

    const canPrefetch = hasPrefetch()

    function prefetchViaDom(href, as, link) {
      return new Promise((res, rej) => {
        if (document.querySelector(`link[rel="prefetch"][href^="${href}"]`)) {
          return res()
        }

        link = document.createElement('link') // The order of property assignment here is intentional:

        if (as) link.as = as
        link.rel = `prefetch`
        link.crossOrigin = undefined
        link.onload = res
        link.onerror = rej // `href` should always be last:

        link.href = href
        document.head.appendChild(link)
      })
    }

    const ASSET_LOAD_ERROR = Symbol('ASSET_LOAD_ERROR')

    function markAssetError(err) {
      return Object.defineProperty(err, ASSET_LOAD_ERROR, {})
    }

    function isAssetError(err) {
      return err && ASSET_LOAD_ERROR in err
    }

    function appendScript(src, script) {
      return new Promise((resolve, reject) => {
        script = document.createElement('script') // The order of property assignment here is intentional.
        // 1. Setup success/failure hooks in case the browser synchronously
        //    executes when `src` is set.

        script.onload = resolve

        script.onerror = () =>
          reject(markAssetError(new Error(`Failed to load script: ${src}`))) // 2. Configure the cross-origin attribute before setting `src` in case the
        //    browser begins to fetch.

        script.crossOrigin = undefined // 3. Finally, set the source and inject into the DOM in case the child
        //    must be appended for fetching to start.

        script.src = src
        document.body.appendChild(script)
      })
    } // We wait for pages to be built in dev before we start the route transition
    // timeout to prevent an un-necessary hard navigation in development.

    let devBuildPromise // Resolve a promise that times out after given amount of milliseconds.

    function resolvePromiseWithTimeout(p, ms, err) {
      return new Promise((resolve, reject) => {
        let cancelled = false
        p.then((r) => {
          // Resolved, cancel the timeout
          cancelled = true
          resolve(r)
        }).catch(reject) // We wrap these checks separately for better dead-code elimination in
        // production bundles.

        if (false) {
        }

        if (true) {
          ;(0, _requestIdleCallback).requestIdleCallback(() =>
            setTimeout(() => {
              if (!cancelled) {
                reject(err)
              }
            }, ms),
          )
        }
      })
    }

    function getClientBuildManifest() {
      if (self.__BUILD_MANIFEST) {
        return Promise.resolve(self.__BUILD_MANIFEST)
      }

      const onBuildManifest = new Promise((resolve) => {
        // Mandatory because this is not concurrent safe:
        const cb = self.__BUILD_MANIFEST_CB

        self.__BUILD_MANIFEST_CB = () => {
          resolve(self.__BUILD_MANIFEST)
          cb && cb()
        }
      })
      return resolvePromiseWithTimeout(
        onBuildManifest,
        MS_MAX_IDLE_DELAY,
        markAssetError(new Error('Failed to load client build manifest')),
      )
    }

    function getFilesForRoute(assetPrefix, route) {
      if (false) {
      }

      return getClientBuildManifest().then((manifest) => {
        if (!(route in manifest)) {
          throw markAssetError(new Error(`Failed to lookup route: ${route}`))
        }

        const allFiles = manifest[route].map(
          (entry) => assetPrefix + '/_next/' + encodeURI(entry),
        )
        return {
          scripts: allFiles.filter((v) => v.endsWith('.js')),
          css: allFiles.filter((v) => v.endsWith('.css')),
        }
      })
    }

    function createRouteLoader(assetPrefix) {
      const entrypoints = new Map()
      const loadedScripts = new Map()
      const styleSheets = new Map()
      const routes = new Map()

      function maybeExecuteScript(src) {
        let prom = loadedScripts.get(src)

        if (prom) {
          return prom
        } // Skip executing script if it's already in the DOM:

        if (document.querySelector(`script[src^="${src}"]`)) {
          return Promise.resolve()
        }

        loadedScripts.set(src, (prom = appendScript(src)))
        return prom
      }

      function fetchStyleSheet(href) {
        let prom = styleSheets.get(href)

        if (prom) {
          return prom
        }

        styleSheets.set(
          href,
          (prom = fetch(href)
            .then((res) => {
              if (!res.ok) {
                throw new Error(`Failed to load stylesheet: ${href}`)
              }

              return res.text().then((text) => ({
                href: href,
                content: text,
              }))
            })
            .catch((err) => {
              throw markAssetError(err)
            })),
        )
        return prom
      }

      return {
        whenEntrypoint(route) {
          return withFuture(route, entrypoints)
        },

        onEntrypoint(route, execute) {
          Promise.resolve(execute)
            .then((fn) => fn())
            .then(
              (exports) => ({
                component: (exports && exports.default) || exports,
                exports: exports,
              }),
              (err) => ({
                error: err,
              }),
            )
            .then((input) => {
              const old = entrypoints.get(route)
              entrypoints.set(route, input)
              if (old && 'resolve' in old) old.resolve(input)
            })
        },

        loadRoute(route, prefetch) {
          return withFuture(route, routes, () => {
            const routeFilesPromise = getFilesForRoute(assetPrefix, route)
              .then(({scripts, css}) => {
                return Promise.all([
                  entrypoints.has(route)
                    ? []
                    : Promise.all(scripts.map(maybeExecuteScript)),
                  Promise.all(css.map(fetchStyleSheet)),
                ])
              })
              .then((res) => {
                return this.whenEntrypoint(route).then((entrypoint) => ({
                  entrypoint,
                  styles: res[1],
                }))
              })

            if (false) {
            }

            return resolvePromiseWithTimeout(
              routeFilesPromise,
              MS_MAX_IDLE_DELAY,
              markAssetError(
                new Error(`Route did not complete loading: ${route}`),
              ),
            )
              .then(({entrypoint, styles}) => {
                const res = Object.assign(
                  {
                    styles: styles,
                  },
                  entrypoint,
                )
                return 'error' in entrypoint ? entrypoint : res
              })
              .catch((err) => {
                if (prefetch) {
                  // we don't want to cache errors during prefetch
                  throw err
                }

                return {
                  error: err,
                }
              })
          })
        },

        prefetch(route) {
          // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
          // License: Apache 2.0
          let cn

          if ((cn = navigator.connection)) {
            // Don't prefetch if using 2G or if Save-Data is enabled.
            if (cn.saveData || /2g/.test(cn.effectiveType))
              return Promise.resolve()
          }

          return getFilesForRoute(assetPrefix, route)
            .then((output) =>
              Promise.all(
                canPrefetch
                  ? output.scripts.map((script) =>
                      prefetchViaDom(script, 'script'),
                    )
                  : [],
              ),
            )
            .then(() => {
              ;(0, _requestIdleCallback).requestIdleCallback(() =>
                this.loadRoute(route, true).catch(() => {}),
              )
            })
            .catch(
              // swallow prefetch errors
              () => {},
            )
        },
      }
    }

    /***/
  },

  /***/ 1469: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    Object.defineProperty(exports, 'Router', {
      enumerable: true,
      get: function () {
        return _router.default
      },
    })
    Object.defineProperty(exports, 'withRouter', {
      enumerable: true,
      get: function () {
        return _withRouter.default
      },
    })
    exports.useRouter = useRouter
    exports.createRouter = createRouter
    exports.makePublicRouterInstance = makePublicRouterInstance
    exports.default = void 0

    var _react = _interopRequireDefault(__webpack_require__(9297))

    var _router = _interopRequireDefault(__webpack_require__(2520))

    var _routerContext = __webpack_require__(8773)

    var _withRouter = _interopRequireDefault(__webpack_require__(4761))

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule
        ? obj
        : {
            default: obj,
          }
    }

    const singletonRouter = {
      router: null,
      readyCallbacks: [],

      ready(cb) {
        if (this.router) return cb()

        if (false) {
        }
      },
    } // Create public properties and methods of the router in the singletonRouter

    const urlPropertyFields = [
      'pathname',
      'route',
      'query',
      'asPath',
      'components',
      'isFallback',
      'basePath',
      'locale',
      'locales',
      'defaultLocale',
      'isReady',
      'isPreview',
      'isLocaleDomain',
      'domainLocales',
    ]
    const routerEvents = [
      'routeChangeStart',
      'beforeHistoryChange',
      'routeChangeComplete',
      'routeChangeError',
      'hashChangeStart',
      'hashChangeComplete',
    ]
    const coreMethodFields = [
      'push',
      'replace',
      'reload',
      'back',
      'prefetch',
      'beforePopState',
    ] // Events is a static property on the router, the router doesn't have to be initialized to use it

    Object.defineProperty(singletonRouter, 'events', {
      get() {
        return _router.default.events
      },
    })
    urlPropertyFields.forEach((field) => {
      // Here we need to use Object.defineProperty because we need to return
      // the property assigned to the actual router
      // The value might get changed as we change routes and this is the
      // proper way to access it
      Object.defineProperty(singletonRouter, field, {
        get() {
          const router = getRouter()
          return router[field]
        },
      })
    })
    coreMethodFields.forEach((field) => {
      singletonRouter[field] = (...args) => {
        const router = getRouter()
        return router[field](...args)
      }
    })
    routerEvents.forEach((event) => {
      singletonRouter.ready(() => {
        _router.default.events.on(event, (...args) => {
          const eventField = `on${event
            .charAt(0)
            .toUpperCase()}${event.substring(1)}`
          const _singletonRouter = singletonRouter

          if (_singletonRouter[eventField]) {
            try {
              _singletonRouter[eventField](...args)
            } catch (err) {
              console.error(
                `Error when running the Router event: ${eventField}`,
              )
              console.error(`${err.message}\n${err.stack}`)
            }
          }
        })
      })
    })

    function getRouter() {
      if (!singletonRouter.router) {
        const message =
          'No router instance found.\n' +
          'You should only use "next/router" on the client side of your app.\n'
        throw new Error(message)
      }

      return singletonRouter.router
    }

    var _default = singletonRouter
    exports.default = _default

    function useRouter() {
      return _react.default.useContext(_routerContext.RouterContext)
    }

    function createRouter(...args) {
      singletonRouter.router = new _router.default(...args)
      singletonRouter.readyCallbacks.forEach((cb) => cb())
      singletonRouter.readyCallbacks = []
      return singletonRouter.router
    }

    function makePublicRouterInstance(router) {
      const _router1 = router
      const instance = {}

      for (const property of urlPropertyFields) {
        if (typeof _router1[property] === 'object') {
          instance[property] = Object.assign(
            Array.isArray(_router1[property]) ? [] : {},
            _router1[property],
          ) // makes sure query is not stateful
          continue
        }

        instance[property] = _router1[property]
      } // Events is a static property on the router, the router doesn't have to be initialized to use it

      instance.events = _router.default.events
      coreMethodFields.forEach((field) => {
        instance[field] = (...args) => {
          return _router1[field](...args)
        }
      })
      return instance
    }

    /***/
  },

  /***/ 4761: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.default = withRouter

    var _react = _interopRequireDefault(__webpack_require__(9297))

    var _router = __webpack_require__(1469)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule
        ? obj
        : {
            default: obj,
          }
    }

    function withRouter(ComposedComponent) {
      function WithRouterWrapper(props) {
        return /*#__PURE__*/ _react.default.createElement(
          ComposedComponent,
          Object.assign(
            {
              router: (0, _router).useRouter(),
            },
            props,
          ),
        )
      }

      WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps
      WithRouterWrapper.origGetInitialProps =
        ComposedComponent.origGetInitialProps

      if (false) {
      }

      return WithRouterWrapper
    }

    /***/
  },

  /***/ 2520: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.getDomainLocale = getDomainLocale
    exports.addLocale = addLocale
    exports.delLocale = delLocale
    exports.hasBasePath = hasBasePath
    exports.addBasePath = addBasePath
    exports.delBasePath = delBasePath
    exports.isLocalURL = isLocalURL
    exports.interpolateAs = interpolateAs
    exports.resolveHref = resolveHref
    exports.default = void 0

    var _normalizeTrailingSlash = __webpack_require__(5457)

    var _routeLoader = __webpack_require__(4711)

    var _denormalizePagePath = __webpack_require__(9325)

    var _normalizeLocalePath = __webpack_require__(5378)

    var _mitt = _interopRequireDefault(__webpack_require__(7162))

    var _utils = __webpack_require__(7620)

    var _isDynamic = __webpack_require__(9372)

    var _parseRelativeUrl = __webpack_require__(665)

    var _querystring = __webpack_require__(2747)

    var _resolveRewrites = _interopRequireDefault(__webpack_require__(7246))

    var _routeMatcher = __webpack_require__(333)

    var _routeRegex = __webpack_require__(3456)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule
        ? obj
        : {
            default: obj,
          }
    }

    let detectDomainLocale

    if (false) {
    }

    const basePath = false || ''

    function buildCancellationError() {
      return Object.assign(new Error('Route Cancelled'), {
        cancelled: true,
      })
    }

    function addPathPrefix(path, prefix) {
      return prefix && path.startsWith('/')
        ? path === '/'
          ? (0, _normalizeTrailingSlash).normalizePathTrailingSlash(prefix)
          : `${prefix}${
              pathNoQueryHash(path) === '/' ? path.substring(1) : path
            }`
        : path
    }

    function getDomainLocale(path, locale, locales, domainLocales) {
      if (false) {
      } else {
        return false
      }
    }

    function addLocale(path, locale, defaultLocale) {
      if (false) {
      }

      return path
    }

    function delLocale(path, locale) {
      if (false) {
      }

      return path
    }

    function pathNoQueryHash(path) {
      const queryIndex = path.indexOf('?')
      const hashIndex = path.indexOf('#')

      if (queryIndex > -1 || hashIndex > -1) {
        path = path.substring(0, queryIndex > -1 ? queryIndex : hashIndex)
      }

      return path
    }

    function hasBasePath(path) {
      path = pathNoQueryHash(path)
      return path === basePath || path.startsWith(basePath + '/')
    }

    function addBasePath(path) {
      // we only add the basepath on relative urls
      return addPathPrefix(path, basePath)
    }

    function delBasePath(path) {
      path = path.slice(basePath.length)
      if (!path.startsWith('/')) path = `/${path}`
      return path
    }

    function isLocalURL(url) {
      // prevent a hydration mismatch on href for url with anchor refs
      if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?'))
        return true

      try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils).getLocationOrigin()
        const resolved = new URL(url, locationOrigin)
        return (
          resolved.origin === locationOrigin && hasBasePath(resolved.pathname)
        )
      } catch (_) {
        return false
      }
    }

    function interpolateAs(route, asPathname, query) {
      let interpolatedRoute = ''
      const dynamicRegex = (0, _routeRegex).getRouteRegex(route)
      const dynamicGroups = dynamicRegex.groups
      const dynamicMatches = // Try to match the dynamic route against the asPath
        (asPathname !== route
          ? (0, _routeMatcher).getRouteMatcher(dynamicRegex)(asPathname)
          : '') || // Fall back to reading the values from the href
        // TODO: should this take priority; also need to change in the router.
        query
      interpolatedRoute = route
      const params = Object.keys(dynamicGroups)

      if (
        !params.every((param) => {
          let value = dynamicMatches[param] || ''
          const {repeat, optional} = dynamicGroups[param] // support single-level catch-all
          // TODO: more robust handling for user-error (passing `/`)

          let replaced = `[${repeat ? '...' : ''}${param}]`

          if (optional) {
            replaced = `${!value ? '/' : ''}[${replaced}]`
          }

          if (repeat && !Array.isArray(value)) value = [value]
          return (
            (optional || param in dynamicMatches) &&
            (interpolatedRoute =
              interpolatedRoute.replace(
                replaced,
                repeat
                  ? value
                      .map(
                        // these values should be fully encoded instead of just
                        // path delimiter escaped since they are being inserted
                        // into the URL and we expect URL encoded segments
                        // when parsing dynamic route params
                        (segment) => encodeURIComponent(segment),
                      )
                      .join('/')
                  : encodeURIComponent(value),
              ) || '/')
          )
        })
      ) {
        interpolatedRoute = '' // did not satisfy all requirements // n.b. We ignore this error because we handle warning for this case in
        // development in the `<Link>` component directly.
      }

      return {
        params,
        result: interpolatedRoute,
      }
    }

    function omitParmsFromQuery(query, params) {
      const filteredQuery = {}
      Object.keys(query).forEach((key) => {
        if (!params.includes(key)) {
          filteredQuery[key] = query[key]
        }
      })
      return filteredQuery
    }

    function resolveHref(router, href, resolveAs) {
      // we use a dummy base url for relative urls
      let base
      let urlAsString =
        typeof href === 'string' ? href : (0, _utils).formatWithValidation(href) // repeated slashes and backslashes in the URL are considered
      // invalid and will never match a Next.js page/file

      const urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//)
      const urlAsStringNoProto = urlProtoMatch
        ? urlAsString.substr(urlProtoMatch[0].length)
        : urlAsString
      const urlParts = urlAsStringNoProto.split('?')

      if ((urlParts[0] || '').match(/(\/\/|\\)/)) {
        console.error(
          `Invalid href passed to next/router: ${urlAsString}, repeated forward-slashes (//) or backslashes \\ are not valid in the href`,
        )
        const normalizedUrl = (0, _utils).normalizeRepeatedSlashes(
          urlAsStringNoProto,
        )
        urlAsString = (urlProtoMatch ? urlProtoMatch[0] : '') + normalizedUrl
      } // Return because it cannot be routed by the Next.js router

      if (!isLocalURL(urlAsString)) {
        return resolveAs ? [urlAsString] : urlAsString
      }

      try {
        base = new URL(
          urlAsString.startsWith('#') ? router.asPath : router.pathname,
          'http://n',
        )
      } catch (_) {
        // fallback to / for invalid asPath values e.g. //
        base = new URL('/', 'http://n')
      }

      try {
        const finalUrl = new URL(urlAsString, base)
        finalUrl.pathname = (0,
        _normalizeTrailingSlash).normalizePathTrailingSlash(finalUrl.pathname)
        let interpolatedAs = ''

        if (
          (0, _isDynamic).isDynamicRoute(finalUrl.pathname) &&
          finalUrl.searchParams &&
          resolveAs
        ) {
          const query = (0, _querystring).searchParamsToUrlQuery(
            finalUrl.searchParams,
          )
          const {result, params} = interpolateAs(
            finalUrl.pathname,
            finalUrl.pathname,
            query,
          )

          if (result) {
            interpolatedAs = (0, _utils).formatWithValidation({
              pathname: result,
              hash: finalUrl.hash,
              query: omitParmsFromQuery(query, params),
            })
          }
        } // if the origin didn't change, it means we received a relative href

        const resolvedHref =
          finalUrl.origin === base.origin
            ? finalUrl.href.slice(finalUrl.origin.length)
            : finalUrl.href
        return resolveAs
          ? [resolvedHref, interpolatedAs || resolvedHref]
          : resolvedHref
      } catch (_) {
        return resolveAs ? [urlAsString] : urlAsString
      }
    }

    function stripOrigin(url) {
      const origin = (0, _utils).getLocationOrigin()
      return url.startsWith(origin) ? url.substring(origin.length) : url
    }

    function prepareUrlAs(router, url, as) {
      // If url and as provided as an object representation,
      // we'll format them into the string version here.
      let [resolvedHref, resolvedAs] = resolveHref(router, url, true)
      const origin = (0, _utils).getLocationOrigin()
      const hrefHadOrigin = resolvedHref.startsWith(origin)
      const asHadOrigin = resolvedAs && resolvedAs.startsWith(origin)
      resolvedHref = stripOrigin(resolvedHref)
      resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs
      const preparedUrl = hrefHadOrigin
        ? resolvedHref
        : addBasePath(resolvedHref)
      const preparedAs = as
        ? stripOrigin(resolveHref(router, as))
        : resolvedAs || resolvedHref
      return {
        url: preparedUrl,
        as: asHadOrigin ? preparedAs : addBasePath(preparedAs),
      }
    }

    function resolveDynamicRoute(pathname, pages) {
      const cleanPathname = (0,
      _normalizeTrailingSlash).removePathTrailingSlash(
        (0, _denormalizePagePath).denormalizePagePath(pathname),
      )

      if (cleanPathname === '/404' || cleanPathname === '/_error') {
        return pathname
      } // handle resolving href for dynamic routes

      if (!pages.includes(cleanPathname)) {
        // eslint-disable-next-line array-callback-return
        pages.some((page) => {
          if (
            (0, _isDynamic).isDynamicRoute(page) &&
            (0, _routeRegex).getRouteRegex(page).re.test(cleanPathname)
          ) {
            pathname = page
            return true
          }
        })
      }

      return (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname)
    }

    const manualScrollRestoration =
      /* unused pure expression or super */ null && false && 0
    const SSG_DATA_NOT_FOUND = Symbol('SSG_DATA_NOT_FOUND')

    function fetchRetry(url, attempts) {
      return fetch(url, {
        // Cookies are required to be present for Next.js' SSG "Preview Mode".
        // Cookies may also be required for `getServerSideProps`.
        //
        // > `fetch` won’t send cookies, unless you set the credentials init
        // > option.
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        //
        // > For maximum browser compatibility when it comes to sending &
        // > receiving cookies, always supply the `credentials: 'same-origin'`
        // > option instead of relying on the default.
        // https://github.com/github/fetch#caveats
        credentials: 'same-origin',
      }).then((res) => {
        if (!res.ok) {
          if (attempts > 1 && res.status >= 500) {
            return fetchRetry(url, attempts - 1)
          }

          if (res.status === 404) {
            return res.json().then((data) => {
              if (data.notFound) {
                return {
                  notFound: SSG_DATA_NOT_FOUND,
                }
              }

              throw new Error(`Failed to load static props`)
            })
          }

          throw new Error(`Failed to load static props`)
        }

        return res.json()
      })
    }

    function fetchNextData(dataHref, isServerRender) {
      return fetchRetry(dataHref, isServerRender ? 3 : 1).catch((err) => {
        // We should only trigger a server-side transition if this was caused
        // on a client-side transition. Otherwise, we'd get into an infinite
        // loop.
        if (!isServerRender) {
          ;(0, _routeLoader).markAssetError(err)
        }

        throw err
      })
    }

    class Router {
      constructor(
        pathname1,
        query1,
        as1,
        {
          initialProps,
          pageLoader,
          App,
          wrapApp,
          Component: Component1,
          err: err1,
          subscription,
          isFallback,
          locale,
          locales,
          defaultLocale,
          domainLocales,
          isPreview,
        },
      ) {
        // Static Data Cache
        this.sdc = {} // In-flight Server Data Requests, for deduping

        this.sdr = {}
        this._idx = 0

        this.onPopState = (e) => {
          const state = e.state

          if (!state) {
            // We get state as undefined for two reasons.
            //  1. With older safari (< 8) and older chrome (< 34)
            //  2. When the URL changed with #
            //
            // In the both cases, we don't need to proceed and change the route.
            // (as it's already changed)
            // But we can simply replace the state with the new changes.
            // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
            // So, doing the following for (1) does no harm.
            const {pathname: pathname1, query: query1} = this
            this.changeState(
              'replaceState',
              (0, _utils).formatWithValidation({
                pathname: addBasePath(pathname1),
                query: query1,
              }),
              (0, _utils).getURL(),
            )
            return
          }

          if (!state.__N) {
            return
          }

          let forcedScroll
          const {url, as: as1, options, idx} = state

          if (false) {
          }

          this._idx = idx
          const {pathname: pathname1} = (0, _parseRelativeUrl).parseRelativeUrl(
            url,
          ) // Make sure we don't re-render on initial load,
          // can be caused by navigating back from an external site

          if (
            this.isSsr &&
            as1 === this.asPath &&
            pathname1 === this.pathname
          ) {
            return
          } // If the downstream application returns falsy, return.
          // They will then be responsible for handling the event.

          if (this._bps && !this._bps(state)) {
            return
          }

          this.change(
            'replaceState',
            url,
            as1,
            Object.assign({}, options, {
              shallow: options.shallow && this._shallow,
              locale: options.locale || this.defaultLocale,
            }),
            forcedScroll,
          )
        } // represents the current component key

        this.route = (0, _normalizeTrailingSlash).removePathTrailingSlash(
          pathname1,
        ) // set up the component cache (by route keys)

        this.components = {} // We should not keep the cache, if there's an error
        // Otherwise, this cause issues when when going back and
        // come again to the errored page.

        if (pathname1 !== '/_error') {
          this.components[this.route] = {
            Component: Component1,
            initial: true,
            props: initialProps,
            err: err1,
            __N_SSG: initialProps && initialProps.__N_SSG,
            __N_SSP: initialProps && initialProps.__N_SSP,
          }
        }

        this.components['/_app'] = {
          Component: App,
          styleSheets: [],
        } // Backwards compat for Router.router.events
        // TODO: Should be remove the following major version as it was never documented

        this.events = Router.events
        this.pageLoader = pageLoader
        this.pathname = pathname1
        this.query = query1 // if auto prerendered and dynamic route wait to update asPath
        // until after mount to prevent hydration mismatch

        const autoExportDynamic =
          (0, _isDynamic).isDynamicRoute(pathname1) &&
          self.__NEXT_DATA__.autoExport

        this.asPath = autoExportDynamic ? pathname1 : as1
        this.basePath = basePath
        this.sub = subscription
        this.clc = null
        this._wrapApp = wrapApp // make sure to ignore extra popState in safari on navigating
        // back from external site

        this.isSsr = true
        this.isFallback = isFallback
        this.isReady = !!(
          self.__NEXT_DATA__.gssp ||
          self.__NEXT_DATA__.gip ||
          (self.__NEXT_DATA__.appGip && !self.__NEXT_DATA__.gsp) ||
          (!autoExportDynamic && !self.location.search && !false)
        )
        this.isPreview = !!isPreview
        this.isLocaleDomain = false

        if (false) {
        }

        if (false) {
        }
      }

      reload() {
        window.location.reload()
      }
      /**
       * Go back in history
       */

      back() {
        window.history.back()
      }
      /**
       * Performs a `pushState` with arguments
       * @param url of the route
       * @param as masks `url` for the browser
       * @param options object you can define `shallow` and other options
       */

      push(url, as, options = {}) {
        if (false) {
        }

        ;({url, as} = prepareUrlAs(this, url, as))
        return this.change('pushState', url, as, options)
      }
      /**
       * Performs a `replaceState` with arguments
       * @param url of the route
       * @param as masks `url` for the browser
       * @param options object you can define `shallow` and other options
       */

      replace(url, as, options = {}) {
        ;({url, as} = prepareUrlAs(this, url, as))
        return this.change('replaceState', url, as, options)
      }

      async change(method, url, as, options, forcedScroll) {
        if (!isLocalURL(url)) {
          window.location.href = url
          return false
        }

        const shouldResolveHref =
          url === as || options._h || options._shouldResolveHref // for static pages with query params in the URL we delay
        // marking the router ready until after the query is updated

        if (options._h) {
          this.isReady = true
        }

        const prevLocale = this.locale

        if (false) {
          var ref
        }

        if (!options._h) {
          this.isSsr = false
        } // marking route changes as a navigation start entry

        if (_utils.ST) {
          performance.mark('routeChange')
        }

        const {shallow = false} = options
        const routeProps = {
          shallow,
        }

        if (this._inFlightRoute) {
          this.abortComponentLoad(this._inFlightRoute, routeProps)
        }

        as = addBasePath(
          addLocale(
            hasBasePath(as) ? delBasePath(as) : as,
            options.locale,
            this.defaultLocale,
          ),
        )
        const cleanedAs = delLocale(
          hasBasePath(as) ? delBasePath(as) : as,
          this.locale,
        )
        this._inFlightRoute = as
        let localeChange = prevLocale !== this.locale // If the url change is only related to a hash change
        // We should not proceed. We should only change the state.
        // WARNING: `_h` is an internal option for handing Next.js client-side
        // hydration. Your app should _never_ use this property. It may change at
        // any time without notice.

        if (!options._h && this.onlyAHashChange(cleanedAs) && !localeChange) {
          this.asPath = cleanedAs
          Router.events.emit('hashChangeStart', as, routeProps) // TODO: do we need the resolved href when only a hash change?

          this.changeState(method, url, as, options)
          this.scrollToHash(cleanedAs)
          this.notify(this.components[this.route], null)
          Router.events.emit('hashChangeComplete', as, routeProps)
          return true
        }

        let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url)
        let {pathname: pathname1, query: query1} = parsed // The build manifest needs to be loaded before auto-static dynamic pages
        // get their query parameters to allow ensuring they can be parsed properly
        // when rewritten to

        let pages, rewrites

        try {
          pages = await this.pageLoader.getPageList()
          ;({__rewrites: rewrites} = await (0,
          _routeLoader).getClientBuildManifest())
        } catch (err1) {
          // If we fail to resolve the page list or client-build manifest, we must
          // do a server-side transition:
          window.location.href = as
          return false
        } // If asked to change the current URL we should reload the current page
        // (not location.reload() but reload getInitialProps and other Next.js stuffs)
        // We also need to set the method = replaceState always
        // as this should not go into the history (That's how browsers work)
        // We should compare the new asPath to the current asPath, not the url

        if (!this.urlIsNew(cleanedAs) && !localeChange) {
          method = 'replaceState'
        } // we need to resolve the as value using rewrites for dynamic SSG
        // pages to allow building the data URL correctly

        let resolvedAs = as // url and as should always be prefixed with basePath by this
        // point by either next/link or router.push/replace so strip the
        // basePath from the pathname to match the pages dir 1-to-1

        pathname1 = pathname1
          ? (0, _normalizeTrailingSlash).removePathTrailingSlash(
              delBasePath(pathname1),
            )
          : pathname1

        if (shouldResolveHref && pathname1 !== '/_error') {
          options._shouldResolveHref = true

          if (false) {
          } else {
            parsed.pathname = resolveDynamicRoute(pathname1, pages)

            if (parsed.pathname !== pathname1) {
              pathname1 = parsed.pathname
              parsed.pathname = addBasePath(pathname1)
              url = (0, _utils).formatWithValidation(parsed)
            }
          }
        }

        const route = (0, _normalizeTrailingSlash).removePathTrailingSlash(
          pathname1,
        )

        if (!isLocalURL(as)) {
          if (false) {
          }

          window.location.href = as
          return false
        }

        resolvedAs = delLocale(delBasePath(resolvedAs), this.locale)

        if ((0, _isDynamic).isDynamicRoute(route)) {
          const parsedAs = (0, _parseRelativeUrl).parseRelativeUrl(resolvedAs)
          const asPathname = parsedAs.pathname
          const routeRegex = (0, _routeRegex).getRouteRegex(route)
          const routeMatch = (0, _routeMatcher).getRouteMatcher(routeRegex)(
            asPathname,
          )
          const shouldInterpolate = route === asPathname
          const interpolatedAs = shouldInterpolate
            ? interpolateAs(route, asPathname, query1)
            : {}

          if (!routeMatch || (shouldInterpolate && !interpolatedAs.result)) {
            const missingParams = Object.keys(routeRegex.groups).filter(
              (param) => !query1[param],
            )

            if (missingParams.length > 0) {
              if (false) {
              }

              throw new Error(
                (shouldInterpolate
                  ? `The provided \`href\` (${url}) value is missing query values (${missingParams.join(
                      ', ',
                    )}) to be interpolated properly. `
                  : `The provided \`as\` value (${asPathname}) is incompatible with the \`href\` value (${route}). `) +
                  `Read more: https://nextjs.org/docs/messages/${
                    shouldInterpolate
                      ? 'href-interpolation-failed'
                      : 'incompatible-href-as'
                  }`,
              )
            }
          } else if (shouldInterpolate) {
            as = (0, _utils).formatWithValidation(
              Object.assign({}, parsedAs, {
                pathname: interpolatedAs.result,
                query: omitParmsFromQuery(query1, interpolatedAs.params),
              }),
            )
          } else {
            // Merge params into `query`, overwriting any specified in search
            Object.assign(query1, routeMatch)
          }
        }

        Router.events.emit('routeChangeStart', as, routeProps)

        try {
          var ref, ref1
          let routeInfo = await this.getRouteInfo(
            route,
            pathname1,
            query1,
            as,
            resolvedAs,
            routeProps,
          )
          let {error, props, __N_SSG, __N_SSP} = routeInfo // handle redirect on client-transition

          if ((__N_SSG || __N_SSP) && props) {
            if (props.pageProps && props.pageProps.__N_REDIRECT) {
              const destination = props.pageProps.__N_REDIRECT // check if destination is internal (resolves to a page) and attempt
              // client-navigation if it is falling back to hard navigation if
              // it's not

              if (destination.startsWith('/')) {
                const parsedHref = (0, _parseRelativeUrl).parseRelativeUrl(
                  destination,
                )
                parsedHref.pathname = resolveDynamicRoute(
                  parsedHref.pathname,
                  pages,
                )
                const {url: newUrl, as: newAs} = prepareUrlAs(
                  this,
                  destination,
                  destination,
                )
                return this.change(method, newUrl, newAs, options)
              }

              window.location.href = destination
              return new Promise(() => {})
            }

            this.isPreview = !!props.__N_PREVIEW // handle SSG data 404

            if (props.notFound === SSG_DATA_NOT_FOUND) {
              let notFoundRoute

              try {
                await this.fetchComponent('/404')
                notFoundRoute = '/404'
              } catch (_) {
                notFoundRoute = '/_error'
              }

              routeInfo = await this.getRouteInfo(
                notFoundRoute,
                notFoundRoute,
                query1,
                as,
                resolvedAs,
                {
                  shallow: false,
                },
              )
            }
          }

          Router.events.emit('beforeHistoryChange', as, routeProps)
          this.changeState(method, url, as, options)

          if (false) {
          }

          if (
            options._h &&
            pathname1 === '/_error' &&
            ((ref = self.__NEXT_DATA__.props) === null || ref === void 0
              ? void 0
              : (ref1 = ref.pageProps) === null || ref1 === void 0
              ? void 0
              : ref1.statusCode) === 500 &&
            (props === null || props === void 0 ? void 0 : props.pageProps)
          ) {
            // ensure statusCode is still correct for static 500 page
            // when updating query information
            props.pageProps.statusCode = 500
          } // shallow routing is only allowed for same page URL changes.

          const isValidShallowRoute = options.shallow && this.route === route

          var _scroll

          const shouldScroll =
            (_scroll = options.scroll) !== null && _scroll !== void 0
              ? _scroll
              : !isValidShallowRoute
          const resetScroll = shouldScroll
            ? {
                x: 0,
                y: 0,
              }
            : null
          await this.set(
            route,
            pathname1,
            query1,
            cleanedAs,
            routeInfo,
            forcedScroll !== null && forcedScroll !== void 0
              ? forcedScroll
              : resetScroll,
          ).catch((e) => {
            if (e.cancelled) error = error || e
            else throw e
          })

          if (error) {
            Router.events.emit('routeChangeError', error, cleanedAs, routeProps)
            throw error
          }

          if (false) {
          }

          Router.events.emit('routeChangeComplete', as, routeProps)
          return true
        } catch (err1) {
          if (err1.cancelled) {
            return false
          }

          throw err1
        }
      }

      changeState(method, url, as, options = {}) {
        if (false) {
        }

        if (method !== 'pushState' || (0, _utils).getURL() !== as) {
          this._shallow = options.shallow
          window.history[method](
            {
              url,
              as,
              options,
              __N: true,
              idx: (this._idx =
                method !== 'pushState' ? this._idx : this._idx + 1),
            }, // Most browsers currently ignores this parameter, although they may use it in the future.
            // Passing the empty string here should be safe against future changes to the method.
            // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
            '',
            as,
          )
        }
      }

      async handleRouteInfoError(
        err,
        pathname,
        query,
        as,
        routeProps,
        loadErrorFail,
      ) {
        if (err.cancelled) {
          // bubble up cancellation errors
          throw err
        }

        if ((0, _routeLoader).isAssetError(err) || loadErrorFail) {
          Router.events.emit('routeChangeError', err, as, routeProps) // If we can't load the page it could be one of following reasons
          //  1. Page doesn't exists
          //  2. Page does exist in a different zone
          //  3. Internal error while loading the page
          // So, doing a hard reload is the proper way to deal with this.

          window.location.href = as // Changing the URL doesn't block executing the current code path.
          // So let's throw a cancellation error stop the routing logic.

          throw buildCancellationError()
        }

        try {
          let Component1
          let styleSheets
          let props

          if (
            typeof Component1 === 'undefined' ||
            typeof styleSheets === 'undefined'
          ) {
            ;({page: Component1, styleSheets} = await this.fetchComponent(
              '/_error',
            ))
          }

          const routeInfo = {
            props,
            Component: Component1,
            styleSheets,
            err,
            error: err,
          }

          if (!routeInfo.props) {
            try {
              routeInfo.props = await this.getInitialProps(Component1, {
                err,
                pathname,
                query,
              })
            } catch (gipErr) {
              console.error('Error in error page `getInitialProps`: ', gipErr)
              routeInfo.props = {}
            }
          }

          return routeInfo
        } catch (routeInfoErr) {
          return this.handleRouteInfoError(
            routeInfoErr,
            pathname,
            query,
            as,
            routeProps,
            true,
          )
        }
      }

      async getRouteInfo(route, pathname, query, as, resolvedAs, routeProps) {
        try {
          const existingRouteInfo = this.components[route]

          if (routeProps.shallow && existingRouteInfo && this.route === route) {
            return existingRouteInfo
          }

          const cachedRouteInfo =
            existingRouteInfo && 'initial' in existingRouteInfo
              ? undefined
              : existingRouteInfo
          const routeInfo = cachedRouteInfo
            ? cachedRouteInfo
            : await this.fetchComponent(route).then((res) => ({
                Component: res.page,
                styleSheets: res.styleSheets,
                __N_SSG: res.mod.__N_SSG,
                __N_SSP: res.mod.__N_SSP,
              }))
          const {Component: Component1, __N_SSG, __N_SSP} = routeInfo

          if (false) {
          }

          let dataHref

          if (__N_SSG || __N_SSP) {
            dataHref = this.pageLoader.getDataHref(
              (0, _utils).formatWithValidation({
                pathname,
                query,
              }),
              resolvedAs,
              __N_SSG,
              this.locale,
            )
          }

          const props = await this._getData(() =>
            __N_SSG
              ? this._getStaticData(dataHref)
              : __N_SSP
              ? this._getServerData(dataHref)
              : this.getInitialProps(
                  Component1, // we provide AppTree later so this needs to be `any`
                  {
                    pathname,
                    query,
                    asPath: as,
                    locale: this.locale,
                    locales: this.locales,
                    defaultLocale: this.defaultLocale,
                  },
                ),
          )
          routeInfo.props = props
          this.components[route] = routeInfo
          return routeInfo
        } catch (err2) {
          return this.handleRouteInfoError(
            err2,
            pathname,
            query,
            as,
            routeProps,
          )
        }
      }

      set(route, pathname, query, as, data, resetScroll) {
        this.isFallback = false
        this.route = route
        this.pathname = pathname
        this.query = query
        this.asPath = as
        return this.notify(data, resetScroll)
      }
      /**
       * Callback to execute before replacing router state
       * @param cb callback to be executed
       */

      beforePopState(cb) {
        this._bps = cb
      }

      onlyAHashChange(as) {
        if (!this.asPath) return false
        const [oldUrlNoHash, oldHash] = this.asPath.split('#')
        const [newUrlNoHash, newHash] = as.split('#') // Makes sure we scroll to the provided hash if the url/hash are the same

        if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
          return true
        } // If the urls are change, there's more than a hash change

        if (oldUrlNoHash !== newUrlNoHash) {
          return false
        } // If the hash has changed, then it's a hash only change.
        // This check is necessary to handle both the enter and
        // leave hash === '' cases. The identity case falls through
        // and is treated as a next reload.

        return oldHash !== newHash
      }

      scrollToHash(as) {
        const [, hash] = as.split('#') // Scroll to top if the hash is just `#` with no value or `#top`
        // To mirror browsers

        if (hash === '' || hash === 'top') {
          window.scrollTo(0, 0)
          return
        } // First we check if the element by id is found

        const idEl = document.getElementById(hash)

        if (idEl) {
          idEl.scrollIntoView()
          return
        } // If there's no element with the id, we check the `name` property
        // To mirror browsers

        const nameEl = document.getElementsByName(hash)[0]

        if (nameEl) {
          nameEl.scrollIntoView()
        }
      }

      urlIsNew(asPath) {
        return this.asPath !== asPath
      }
      /**
       * Prefetch page code, you may wait for the data during page rendering.
       * This feature only works in production!
       * @param url the href of prefetched page
       * @param asPath the as path of the prefetched page
       */

      async prefetch(url, asPath = url, options = {}) {
        let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url)
        let {pathname: pathname2} = parsed

        if (false) {
        }

        const pages = await this.pageLoader.getPageList()
        let resolvedAs = asPath

        if (false) {
        } else {
          parsed.pathname = resolveDynamicRoute(parsed.pathname, pages)

          if (parsed.pathname !== pathname2) {
            pathname2 = parsed.pathname
            parsed.pathname = pathname2
            url = (0, _utils).formatWithValidation(parsed)
          }
        }

        const route = (0, _normalizeTrailingSlash).removePathTrailingSlash(
          pathname2,
        ) // Prefetch is not supported in development mode because it would trigger on-demand-entries

        if (false) {
        }

        await Promise.all([
          this.pageLoader._isSsg(route).then((isSsg) => {
            return isSsg
              ? this._getStaticData(
                  this.pageLoader.getDataHref(
                    url,
                    resolvedAs,
                    true,
                    typeof options.locale !== 'undefined'
                      ? options.locale
                      : this.locale,
                  ),
                )
              : false
          }),
          this.pageLoader[options.priority ? 'loadPage' : 'prefetch'](route),
        ])
      }

      async fetchComponent(route) {
        let cancelled = false

        const cancel = (this.clc = () => {
          cancelled = true
        })

        const componentResult = await this.pageLoader.loadPage(route)

        if (cancelled) {
          const error = new Error(
            `Abort fetching component for route: "${route}"`,
          )
          error.cancelled = true
          throw error
        }

        if (cancel === this.clc) {
          this.clc = null
        }

        return componentResult
      }

      _getData(fn) {
        let cancelled = false

        const cancel = () => {
          cancelled = true
        }

        this.clc = cancel
        return fn().then((data) => {
          if (cancel === this.clc) {
            this.clc = null
          }

          if (cancelled) {
            const err2 = new Error('Loading initial props cancelled')
            err2.cancelled = true
            throw err2
          }

          return data
        })
      }

      _getStaticData(dataHref) {
        const {href: cacheKey} = new URL(dataHref, window.location.href)

        if (true && !this.isPreview && this.sdc[cacheKey]) {
          return Promise.resolve(this.sdc[cacheKey])
        }

        return fetchNextData(dataHref, this.isSsr).then((data) => {
          this.sdc[cacheKey] = data
          return data
        })
      }

      _getServerData(dataHref) {
        const {href: resourceKey} = new URL(dataHref, window.location.href)

        if (this.sdr[resourceKey]) {
          return this.sdr[resourceKey]
        }

        return (this.sdr[resourceKey] = fetchNextData(dataHref, this.isSsr)
          .then((data) => {
            delete this.sdr[resourceKey]
            return data
          })
          .catch((err2) => {
            delete this.sdr[resourceKey]
            throw err2
          }))
      }

      getInitialProps(Component, ctx) {
        const {Component: App1} = this.components['/_app']

        const AppTree = this._wrapApp(App1)

        ctx.AppTree = AppTree
        return (0, _utils).loadGetInitialProps(App1, {
          AppTree,
          Component,
          router: this,
          ctx,
        })
      }

      abortComponentLoad(as, routeProps) {
        if (this.clc) {
          Router.events.emit(
            'routeChangeError',
            buildCancellationError(),
            as,
            routeProps,
          )
          this.clc()
          this.clc = null
        }
      }

      notify(data, resetScroll) {
        return this.sub(data, this.components['/_app'].Component, resetScroll)
      }
    }

    Router.events = (0, _mitt).default()
    exports.default = Router

    /***/
  },

  /***/ 3676: /***/ (module, __unused_webpack_exports, __webpack_require__) => {
    module.exports = __webpack_require__(102)

    /***/
  },
}
