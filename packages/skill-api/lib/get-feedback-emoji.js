

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.getEmoji = void 0

const getEmoji = (emotion) => {
  switch (emotion) {
    case ':heart_eyes:':
      return {
        image: '😍',
        label: 'smiling face with heart-eyes',
      }

    case ':sob:':
      return {
        image: '😭',
        label: 'loudly crying face',
      }

    default:
      return {
        image: '🦄',
        label: 'unicorn',
      }
  }
}

exports.getEmoji = getEmoji
