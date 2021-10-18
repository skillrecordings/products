'use strict'
exports.id = 345
exports.ids = [345]
exports.modules = {
  /***/ 5842: /***/ (__unused_webpack_module, exports) => {
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

  /***/ 5345: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.useIntersection = useIntersection

    var _react = __webpack_require__(9297)

    var _requestIdleCallback = __webpack_require__(5842)

    const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined'

    function useIntersection({rootMargin, disabled}) {
      const isDisabled = disabled || !hasIntersectionObserver
      const unobserve = (0, _react).useRef()
      const [visible, setVisible] = (0, _react).useState(false)
      const setRef = (0, _react).useCallback(
        (el) => {
          if (unobserve.current) {
            unobserve.current()
            unobserve.current = undefined
          }

          if (isDisabled || visible) return

          if (el && el.tagName) {
            unobserve.current = observe(
              el,
              (isVisible) => isVisible && setVisible(isVisible),
              {
                rootMargin,
              },
            )
          }
        },
        [isDisabled, rootMargin, visible],
      )
      ;(0, _react).useEffect(() => {
        if (!hasIntersectionObserver) {
          if (!visible) {
            const idleCallback = (0, _requestIdleCallback).requestIdleCallback(
              () => setVisible(true),
            )
            return () =>
              (0, _requestIdleCallback).cancelIdleCallback(idleCallback)
          }
        }
      }, [visible])
      return [setRef, visible]
    }

    function observe(element, callback, options) {
      const {id, observer, elements} = createObserver(options)
      elements.set(element, callback)
      observer.observe(element)
      return function unobserve() {
        elements.delete(element)
        observer.unobserve(element) // Destroy observer when there's nothing left to watch:

        if (elements.size === 0) {
          observer.disconnect()
          observers.delete(id)
        }
      }
    }

    const observers = new Map()

    function createObserver(options) {
      const id = options.rootMargin || ''
      let instance = observers.get(id)

      if (instance) {
        return instance
      }

      const elements = new Map()
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const callback = elements.get(entry.target)
          const isVisible = entry.isIntersecting || entry.intersectionRatio > 0

          if (callback && isVisible) {
            callback(isVisible)
          }
        })
      }, options)
      observers.set(
        id,
        (instance = {
          id,
          observer,
          elements,
        }),
      )
      return instance
    }

    /***/
  },
}
