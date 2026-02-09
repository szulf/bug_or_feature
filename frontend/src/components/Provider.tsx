import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import  { type ReactNode } from 'react'

function Provider(props: {children: ReactNode | ReactNode[]}) {
  return (
    <ChakraProvider value={defaultSystem}>
        {props.children}
    </ChakraProvider>
  )
}

export default Provider