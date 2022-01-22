export function unique<T>(array: T[]) {
  return array.filter((item, index) => array.indexOf(item) === index);
}

export function random<T>(array: T[]) {
  const index = Math.floor(array.length * Math.random());
  return array[index];
}