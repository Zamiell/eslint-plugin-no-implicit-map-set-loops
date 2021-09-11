# eslint-plugin-no-implicit-map-set-loops

## What is this?

This is a rule that disallows implicitly iterating over Maps and Sets. For example:

```ts
const myMap = new Map();

// Bad
for (const [key, value] of myMap) {}

// Good
for (const [key, value] of myMap.entries()) {}
```

This is useful because implicit iteration does not work robustly with the TypeScriptToLua transpiler.

<br />

## How do I use it?

* `npm install --save-dev eslint-plugin-no-implicit-map-set-loops`
* Add  `"plugin:no-implicit-map-set-loops-fix/recommended"` to the `extends` section of your `.eslintrc.js` file.

<br />

## What rules does this plugin provide?

It only provides one rule: `"no-implicit-map-set-loops/no-implicit-map-set-loops"`

<br />
