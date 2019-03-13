# react-intl-enhanced-message

[![Build Status](https://travis-ci.org/dan-lee/react-intl-enhanced-message.svg?branch=master)](https://travis-ci.org/dan-lee/react-intl-enhanced-message)
[![npm](https://img.shields.io/npm/v/react-intl-enhanced-message.svg?branch=master)](https://travis-ci.org/dan-lee/react-intl-enhanced-message.svg)

## Installation

```
yarn add react-intl-enhanced-message
```

Following peer depepencies are required to be installed in your app:

- `react >= 16.3.2`
- `react-intl >= 2.0.0`

### 👉 Note:

If you need this to be picked up by [`babel-plugin-react-intl`](https://github.com/yahoo/babel-plugin-react-intl) I suggest to install the fork [`@allthings/babel-plugin-react-intl`](https://github.com/allthings/babel-plugin-react-intl) as the  original seems not to be maintained anymore.

With this you can use it like:

**`.babelrc`**
```json
{
  "plugins": [
    ["@allthings/babel-plugin-react-intl", {
      "additionalComponentNames": {
        "react-intl-enhanced-message": ["FormattedEnhancedMessage"],
      },
    }]
  ]
}

```

## Example

Here's a simple example on CodeSandbox:

[![Edit Simple FormattedEnhancedMessage example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ll3o45jq97?fontsize=14)

## Why?

This aims to solve this ongoing issue for react-intl: [Rich text formatting and translations](https://github.com/yahoo/react-intl/issues/513)

> The translator shouldn't need to worry about "email" is a hyperlink in the UI, and I don't want to limit support to just HTML

So…

- do you use [`react-intl`](https://github.com/yahoo/react-intl)?
- do you like rich text formatting for translated messages?
- do you want this to be as easy as possible for the developer and the translator?

→ Then this library might be just right for you 🥳

**However** it's as simple as it gets and only makes simplest replacements of values. So there's no support for nested elements or other fancy stuff. (_yet?_)

## Usage

```jsx harmony
import { FormattedEnhancedMessage } from 'react-intl-enhanced-message'

const Component = () => (
  <FormattedEnhancedMessage
    id="greeting"
    defaultMessage="Hello <x:strong>{user}</x:strong>!"
    values={{ user: 'Dan' }}

    // enhancements in: 3, 2, 1…
    enhancers={{
      strong: user => <strong>{user}</strong>
    }}
  >
)
```

This will result in following HTML:

```html
Hello <strong>Dan</strong>!
```

### FormattedEnhancedMessage

This component accepts all properties as [`FormattedMessage`](https://github.com/yahoo/react-intl/wiki/Components#formattedmessage) from [`react-intl`](https://github.com/yahoo/react-intl) with the following exceptions:

- `children`: Has no effect
- `tagName`: Has no effect

However it adds following property:

- `enhancers`: Expects an object

The translated messages can have HTML/JSX like 'tags' to indicate that the content should be replaced by an enhancer function.

As suggested in [the linked issue](https://github.com/yahoo/react-intl/issues/513#issuecomment-252114827), every tag starts with the namespace 'x', e.g. like `<x:sth>`.

To illustrate this, see the following example:

```js
const enhancers = {
  // Will replace anything between <x:em> and </x:em>
  em: emphasized => <strong>{emphasized}</strong>,
  // Will replace anything between <x:italic> and </x:italic>
  italic: italic => <i>{italic}</i>,
}

const translation = `
Good <x:em>morning</x:em> <x:italic>Dan</x:italic>!
We hope you have a <x:em>beautiful</x:em> day so far.

<x:em><x:italic>Only the outer 'tag' would be replace correctly here.</x:italic></x:em>

<x:unknown>This will be left untouched as there is no enhancer registered for unknown.</x:unknown>
`
```
