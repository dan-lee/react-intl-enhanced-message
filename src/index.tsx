import React, {
  Fragment,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react'
import { FormattedMessage } from 'react-intl'

type ReplaceCallback = (content: string) => ReactNode
type Enhancers = { [key: string]: ReplaceCallback }

interface IFormattedEnhancedMessageProps {
  enhancers: Enhancers
}

const processMessage = (message: string, enhancers: Enhancers) => {
  const regex = /<(x:([\da-z_-]+))>(.*?)<\/\1>/gi
  const output: ReactNode[] = []
  let result
  let key = 0

  while ((result = regex.exec(message)) !== null) {
    const index = result.index
    const [match, , label, value] = result

    output.push(message.substring(0, index))

    if (label in enhancers) {
      output.push(<Fragment key={key++}>{enhancers[label](value)}</Fragment>)
    } else {
      output.push(match)
    }

    message = message.substring(index + match.length, message.length + 1)
    regex.lastIndex = 0
  }

  output.push(message)

  return output
}

export const FormattedEnhancedMessage: FunctionComponent<
  IFormattedEnhancedMessageProps & FormattedMessage.Props
> = ({ enhancers, ...props }): ReactElement<FormattedMessage> => {
  return (
    <FormattedMessage {...props}>
      {message => processMessage(message as string, enhancers)}
    </FormattedMessage>
  )
}
