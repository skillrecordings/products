async function canLike() {
  await new Promise((r) => setTimeout(r, 3000))
  return true
}

export {canLike}
