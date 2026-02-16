import { Container, Heading } from "@chakra-ui/react"
import PageTabs from "./components/PageTabs"

function App() {
  return (
    <Container maxW={"3/4"} my={"8"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} gap={"8"}>
      <Heading size={"4xl"}>
        Bug or a Feature
      </Heading>
      <PageTabs /> 
    </Container>
  )
}

export default App