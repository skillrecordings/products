export const getEmoji = (emotion: string) => {
  switch (emotion) {
    case ':heart_eyes:':
      return {image: '😍', label: 'smiling face with heart-eyes'}
    case ':sob:':
      return {image: '😭', label: 'loudly crying face'}
    default:
      return {image: '🦄', label: 'unicorn'}
  }
}
