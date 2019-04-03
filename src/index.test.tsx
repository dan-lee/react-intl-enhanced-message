import React, { ReactNode } from 'react'
import { render } from 'react-testing-library'
import { FormattedEnhancedMessage } from './'
import { addLocaleData, IntlProvider } from 'react-intl'

import en from 'react-intl/locale-data/en'

addLocaleData(en)

const wrappedRender = (tree: ReactNode, messages = {}) =>
  render(
    <IntlProvider locale="en" messages={messages}>
      {tree}
    </IntlProvider>
  )

describe('FormattedEnhancedMessage', () => {
  it('should replace enhancers correctly', () => {
    const { container } = wrappedRender(
      <FormattedEnhancedMessage
        enhancers={{
          strong: name => <strong>{name}</strong>,
          italic: dayTime => <i>{dayTime}</i>,
        }}
        id="greeting"
        defaultMessage="Hi <x:strong>Daniel</x:strong>, good <x:italic>morning</x:italic>!"
      />
    )

    expect(container.innerHTML).toMatchInlineSnapshot(
      `"Hi <strong>Daniel</strong>, good <i>morning</i>!"`
    )
  })

  it('should replace enhancers without a value correctly', () => {
    const { container } = wrappedRender(
      <FormattedEnhancedMessage
        enhancers={{
          strong: name => <strong>{name}</strong>,
          newline: () => <br />,
        }}
        id="greeting"
        defaultMessage="Hi <x:strong>Daniel</x:strong>, <x:newline></x:newline>good morning!"
      />
    )

    expect(container.innerHTML).toMatchInlineSnapshot(
      `"Hi <strong>Daniel</strong>, <br>good morning!"`
    )
  })

  it('should not fail with no enhancers provided', () => {
    const defaultMessage = 'Hi <0>Daniel</0>'
    const { container } = wrappedRender(
      <FormattedEnhancedMessage
        enhancers={{}}
        id="greeting"
        defaultMessage={defaultMessage}
      />
    )
    expect(container.innerHTML).toMatchInlineSnapshot(
      `"Hi &lt;0&gt;Daniel&lt;/0&gt;"`
    )
  })

  it('should work in combination with other values', () => {
    const { container } = wrappedRender(
      <FormattedEnhancedMessage
        id="greeting"
        defaultMessage="Hi <x:strong>Daniel</x:strong>, good {dayTime}!"
        enhancers={{ strong: name => <strong>{name}</strong> }}
        values={{
          dayTime: 'morning',
        }}
      />
    )
    expect(container.innerHTML).toMatchInlineSnapshot(
      `"Hi <strong>Daniel</strong>, good morning!"`
    )
  })

  it('should ignore non-existent enhancers', () => {
    const { container } = wrappedRender(
      <FormattedEnhancedMessage
        enhancers={{ strong: name => <strong>{name}</strong> }}
        id="greeting"
        defaultMessage="Hi <x:strong>Daniel</x:strong>, good <x:no>{dayTime}</x:no>!"
        values={{
          dayTime: 'morning',
        }}
      />
    )

    expect(container.innerHTML).toMatchInlineSnapshot(
      `"Hi <strong>Daniel</strong>, good &lt;x:no&gt;morning&lt;/x:no&gt;!"`
    )
  })

  it('should handle nested enhancers', () => {
    const { container } = wrappedRender(
      <FormattedEnhancedMessage
        id="greeting"
        defaultMessage="<x:em>Hi <x:strong>Daniel</x:strong>, good day!</x:em>"
        enhancers={{ strong: name => <strong>{name}</strong>, em: children => <em>{children}</em> }}
      />
    )
    expect(container.innerHTML).toMatchInlineSnapshot(
      `"<em>Hi <strong>Daniel</strong>, good day!</em>"`
    )
  })

  it('should handle nested enhancers where outer is not found', () => {
    const { container } = wrappedRender(
      <FormattedEnhancedMessage
        id="greeting"
        defaultMessage="<x:em>Hi <x:strong>Daniel</x:strong>, good day!</x:em>"
        enhancers={{ strong: name => <strong>{name}</strong> }}
      />
    )
    expect(container.innerHTML).toMatchInlineSnapshot(
      `"&lt;x:em&gt;Hi <strong>Daniel</strong>, good day!&lt;/x:em&gt;"`
    )
  })
})
