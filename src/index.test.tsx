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
})
