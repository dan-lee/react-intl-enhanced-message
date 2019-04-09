import React, {
  Fragment,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react'
import { FormattedMessage } from 'react-intl'

type ReplaceCallback = (content: string | ReactNode | ReactNode[]) => ReactNode
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
      output.push(<Fragment key={key++}>{enhancers[label](processMessage(value, enhancers))}</Fragment>)
    } else {
      output.push(<Fragment key={key++}>{`<x:${label}>`}{processMessage(value, enhancers)}{`</x:${label}>`}</Fragment>);
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
