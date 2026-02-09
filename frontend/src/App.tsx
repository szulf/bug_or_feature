import { Container, Heading } from "@chakra-ui/react"
import Form from "./components/Form"

function App() {
  return (
    <Container maxW={"3/4"} my={"8"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
      <Heading size={"4xl"}>
        Bug or a Feature
      </Heading>
      <Form />
    </Container>
  )
}

export default App