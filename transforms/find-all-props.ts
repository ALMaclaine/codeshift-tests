import { JSCodeshift } from 'jscodeshift';
import { findJsxElementType, getJsxOpeningElementAttributes } from './utils';

export default function (file, { jscodeshift: j }: JSCodeshift) {
  const source = j(file.source);
  const elms = findJsxElementType(source, j, 'EnderModal');
  const attrs = getJsxOpeningElementAttributes(j, elms);
  const totalElements = elms.length;
  const attrMap: Record<string, number> = {};
  attrs.forEach((elm) => {
    const attrName = elm.value.name.name;
    if (!attrMap[attrName]) {
      attrMap[attrName] = 0;
    }
    attrMap[attrName]++;
  });
  const required = [];
  const optional = [];
  for (const [key, count] of Object.entries(attrMap)) {
    if (count === totalElements) {
      required.push(key);
    } else {
      optional.push(key);
    }
  }
  console.log(`Required Props: ${required.join(', ')}`);
  console.log(`Optional Props: ${optional.join(', ')}`);
  return source.toSource();
}

export const parser = 'tsx';
