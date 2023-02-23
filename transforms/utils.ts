import { JSCodeshift } from 'jscodeshift';

// find all instances of React default imports
// ie find all instances of React from `import React from 'react'`
const getDefaultImportByIdentifier = (
  source: unknown,
  j: JSCodeshift,
  id: string
) => {
  return source.find(j.ImportDefaultSpecifier).filter((path) => {
    return path.value.local.name === id;
  });
};

const findJsxElementType = (source: unknown, j: JSCodeshift, name: string) => {
  return source.find(j.JSXOpeningElement).filter((path) => {
    return path.value.name.name === name;
  });
};

const getJsxOpeningElementAttributes = (j: JSCodeshift, coll: unknown) => {
  return coll.find(j.JSXAttribute);
};

const getMemberExpressionsByName = (
  source: unknown,
  j: JSCodeshift,
  name: string
) => {
  return source.find(j.MemberExpression, {
    object: {
      name,
    },
  });
};

const getImportBySourceName = (
  source: unknown,
  j: JSCodeshift,
  name: string
) => {
  return source
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === name);
};

const specifierComparator = (a, b) => {
  const name1 = a.imported.name;
  const name2 = b.imported.name;
  if (name1 === name2) {
    return 0;
  }
  return name1 > name2 ? 1 : -1;
};

export {
  getDefaultImportByIdentifier,
  getMemberExpressionsByName,
  getImportBySourceName,
  specifierComparator,
  findJsxElementType,
  getJsxOpeningElementAttributes,
};
