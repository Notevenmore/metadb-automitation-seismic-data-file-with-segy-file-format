export function omitID(key: string, value: string) {
  if (key == 'id') {
    return undefined;
  } else {
    return value;
  }
}
