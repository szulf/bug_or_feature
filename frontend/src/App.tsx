import { Container, Heading } from "@chakra-ui/react"
import PageTabs from "./components/PageTabs"
import { BrowserRouter, Route, Routes } from "react-router"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index />
        <Route path="/create_new_post" />
        <Route path="/bug_of_the_week" />
      </Routes>
      <Container maxW={"3/4"} my={"8"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} gap={"8"}>
        <Heading size={"4xl"}>
          Bug or a Feature
        </Heading>
        <PageTabs /> 
      </Container>
    </BrowserRouter>
  )
}

export default App