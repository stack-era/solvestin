export const fixedSizeStringArray = (str: string, size: number) => {
  return str.length < size
    ? [
        ...str.split(""),
        ...Array.from<string>({ length: size - str.length }).fill(""),
      ]
    : [...str.slice(0, size).split("")];
};
