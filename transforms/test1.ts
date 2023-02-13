import { JSCodeshift } from 'jscodeshift';
import {
  getDefaultImportByIdentifier,
  getImportBySourceName,
  getMemberExpressionsByName,
  specifierComparator,
} from './utils';

export default function (file, { jscodeshift: j }: JSCodeshift) {
  const source = j(file.source);

  // remove all instances of React default imports
  // from: import React, { useState } from 'react'
  // to:   import { useState } from 'react'
  //
  // from: import React from 'react'
  // to:   <gone>
  getDefaultImportByIdentifier(source, j, 'React').remove();

  // find all usages of React.property
  // example: find all instances of React.lazy or React.useRef
  const reactDefaultUses = getMemberExpressionsByName(source, j, 'React');

  // This replaces instances of React.property with property
  // example: React.lazy(..) -> lazy(..)
  reactDefaultUses.replaceWith((node) => {
    return node.value.property;
  });

  // Get the names of the identifiers used from React
  // ie ['lazy', 'useRef']
  const identifiers = Array.from(
    new Set(reactDefaultUses.nodes().map((node) => node.name))
  );

  // the below logic assumes there is only one react import per file

  // find all import statements sourced from react, should only be 1 per file
  // import React, { useRef, useState } from 'react' <---- finds this
  const reactImports = getImportBySourceName(source, j, 'react');

  // create the import specifier
  // this means create an individual named import such as: { useEffect }
  // { useState, useRef } is an array of import specifiers
  const importSpecifiers = identifiers.map((id) =>
    j.importSpecifier(j.identifier(id))
  );

  // take the import line we find and replace it with a new
  // one we create with all the imports we need
  reactImports.forEach((reactImport) => {
    const newSpecifiers = [...reactImport.node.specifiers, ...importSpecifiers];
    newSpecifiers.sort(specifierComparator);
    // Replace the existing node with a new one
    j(reactImport).replaceWith(
      // Build a new import declaration node based on the existing one
      j.importDeclaration(
        newSpecifiers, // Insert our new import specificer
        reactImport.node.source
      )
    );
  });

  // if the above process removed all specifiers from 'react' import, then delete the import
  reactImports.filter((node) => node.value.specifiers.length === 0).remove();

  return source.toSource();
}

export const parser = 'tsx';
