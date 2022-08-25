export function hmsToSeconds(str: any) {
  let p = str.split(':'),
    s = 0,
    m = 1

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10)
    m *= 60
  }
  return s
}
