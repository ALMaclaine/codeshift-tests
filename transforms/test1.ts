import { JSCodeshift } from 'jscodeshift';

// export default function (file, { jscodeshift: j }: JSCodeshift, options) {
//     const source = j(file.source);
//
//     const imports = source.find(j.ImportDeclaration).filter((path) => path.node.source.value === "react");
//     const hasImportNamespaceReactSpecifier = imports.find(j.ImportNamespaceSpecifier).length > 0;
//
//     if (hasImportNamespaceReactSpecifier) {
//         return source.toSource();
//     }
//
//     const hasImportDefaultSpecifier = imports.find(j.ImportDefaultSpecifier).length > 0;
//
//     if (hasImportDefaultSpecifier) {
//         const newImport = j.importDeclaration(
//             [j.importNamespaceSpecifier(j.identifier("React"))],
//             j.stringLiteral("react")
//         );
//         source.get().node.program.body.unshift(newImport);
//         imports.find(j.ImportDefaultSpecifier).remove();
//     }
//
//     return source.toSource();
// }

export default function (file, { jscodeshift: j }: JSCodeshift, options) {
  const source = j(file.source);
  //
  // // console.log( source.find);
  // const calls = source.find(j.MemberExpression).filter((node) => {
  //   const isReact = node.value.object.name === 'React';
  //   return isReact;
  // });
  //
  // if (calls.length) {
  //   const identifiers = calls.nodes().map((node) => node.property.name);
  //   identifiers.map((identifier) => {
  //     const collection = source.find(j.MemberExpression, {
  //       object: {
  //         name: 'React',
  //       },
  //       property: {
  //         name: 'circleArea',
  //       },
  //     });
  //     const instance = collection.filter((node) => {
  //       return node.value.property.name === identifier;
  //     });
  //
  //     instance.replaceWith(instance.get(0));
  //     console.log(instance);
  //   });
  //
  //   // calls.forEach((node) => {
  //   //   console.log(node, node.replaceWith);
  //   // });
  //   // const imports = source
  //   //   .find(j.ImportDeclaration)
  //   //   .filter((path) => path.node.source.value === 'react');
  //   //
  //   // imports.find(j.ImportDefaultSpecifier).remove();
  //   // imports.forEach((node) => {
  //   //   console.log(node.value.specifiers);
  //   // });
  // }

  source
    .find(j.ImportDefaultSpecifier)
    .filter((path) => {
      return path.value.local.name === 'React';
    })
    .remove();

  // imports.find(j.ImportDefaultSpecifier).remove();

  const reactDefaultUses = source.find(j.MemberExpression, {
    object: {
      name: 'React',
    },
  });

  reactDefaultUses.replaceWith((node) => {
    return node.value.property;
  });

  const identifiers = Array.from(
    new Set(reactDefaultUses.nodes().map((node) => node.name))
  );

  const reactImports = source
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === 'react');

  const importSpecifiers = identifiers.map((id) =>
    j.importSpecifier(j.identifier(id))
  );

  reactImports.forEach((reactImport) =>
    // Replace the existing node with a new one
    j(reactImport).replaceWith(
      // Build a new import declaration node based on the existing one
      j.importDeclaration(
        [...reactImport.node.specifiers, ...importSpecifiers], // Insert our new import specificer
        reactImport.node.source
      )
    )
  );

  // reactDefaultUses.forEach(console.log);

  return source.toSource();
}
