"use strict";

module.exports = {
  configs: {
    recommended: {
      plugins: ["no-implicit-map-set-loops"],

      rules: {
        "no-implicit-map-set-loops/no-implicit-map-set-loops": "warn",
      },
    },
  },

  rules: {
    "no-implicit-map-set-loops": {
      create: noImplicitMapSetLoops,

      meta: {
        type: "suggestion",

        docs: {
          description: "prevent implicit iteration for Maps and Sets",
        },

        fixable: "code",

        messages: {
          unexpected: "Expected 'foo' and instead saw 'bar'.",
        },
      },
    },
  },
};

function noImplicitMapSetLoops(context) {
  if (
    !context.parserServices ||
    !context.parserServices.program ||
    !context.parserServices.esTreeNodeToTSNodeMap
  ) {
    /**
     * The user needs to have configured "project" in their parserOptions
     * for @typescript-eslint/parser
     */
    throw new Error(
      'You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.'
    );
  }

  return {
    ForOfStatement(node) {
      const thingToIterateOver = node.right;

      // From: https://github.com/typescript-eslint/typescript-eslint/issues/781
      const typeChecker = context.parserServices.program.getTypeChecker();
      const typescriptNode =
        context.parserServices.esTreeNodeToTSNodeMap.get(thingToIterateOver);
      const type = typeChecker.getTypeAtLocation(typescriptNode);

      if (type.symbol === undefined || type.symbol.escapedName === undefined) {
        return;
      }

      const nameOfType = type.symbol.escapedName;
      if (nameOfType !== "Map" && nameOfType !== "Set") {
        return;
      }

      context.report({
        node,
        message:
          "Implicit iteration over Maps and Sets is disallowed since it does not work robustly in TSTL.",
        fix(fixer) {
          if (nameOfType === "Map") {
            return fixer.insertTextAfter(thingToIterateOver, ".entries()");
          } else if (nameOfType === "Set") {
            return fixer.insertTextAfter(thingToIterateOver, ".values()");
          }
        },
      });
    },
  };
}
