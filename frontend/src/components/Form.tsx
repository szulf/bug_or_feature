import { Box, Field, Textarea } from "@chakra-ui/react"

function Form() {
  return (
    <Box p={"8"} border={"1px solid #ddd"} borderRadius={"sm"} minW={"400px"}>
        <form action="">
            <Field.Root>
                <Field.Label>
                    Bug or a feature
                    <Field.RequiredIndicator />
                </Field.Label>
                <Textarea placeholder="Describe your bug (or a feature)..." />
            </Field.Root>
        </form>
    </Box>
  )
}

export default Form