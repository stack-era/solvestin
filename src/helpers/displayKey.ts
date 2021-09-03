export const displayKey = (key: string) => {
  return key.length > 20
    ? `${key.substring(0, 7)}.....${key.substring(key.length - 7, key.length)}`
    : key;
};
