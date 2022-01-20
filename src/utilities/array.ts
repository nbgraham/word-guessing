export function unique<T>(array: T[]) {
  return array.filter((item, index) => array.indexOf(item) === index)
}
