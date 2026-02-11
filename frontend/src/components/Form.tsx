import { Box, Field, Textarea, FileUpload, Icon, Button } from "@chakra-ui/react"
import type React from "react"
import { useState } from "react"
import { LuUpload } from "react-icons/lu"
import { BugOrFeature, type PostCreationData } from "../types/PostCreationData"

function Form() {
  const [formData, setFormData] = useState<PostCreationData>({
    message: "",
    owners_post_choice: null
  })

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    console.log(formData)
    console.log("send data")
  }

  return (
    <Box p={"8"} border={"1px solid #ddd"} borderRadius={"sm"} minW={"400px"}>
        <form action="" onSubmit={onSubmit}>
          <Box display={"flex"} justifyContent={"center"} alignItems={"start"} gap={"8"} flexDir={"column"}>
            <Field.Root>
                <Field.Label>
                    Bug or a feature
                </Field.Label>
                <Textarea placeholder="Describe your bug (or a feature)..." value={formData.message} onChange={(e) => setFormData({
                  ...formData,
                  message: e.target.value
                })} />
            </Field.Root>

            <FileUpload.Root maxFiles={1} alignItems={"stretch"} accept={["image/png", "image/jpeg", "image/webp"]}>
              <FileUpload.Label>
                Image of bug or a feature
              </FileUpload.Label>
              <FileUpload.HiddenInput />
              <FileUpload.Dropzone>
                <Icon size="md" color="fg.muted">
                  <LuUpload />
                </Icon>
                <FileUpload.DropzoneContent>
                  <Box>Drag and drop files here</Box>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
              <FileUpload.List />
            </FileUpload.Root>

            <Field.Root>
              <Field.Label>
                Is your invention a bug or a feature?
              </Field.Label>
              <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={"8"}>
                <Button w={"40"} h={"40"} fontSize={"4xl"} disabled={formData.owners_post_choice === BugOrFeature.Bug}
                variant={formData.owners_post_choice === BugOrFeature.Bug ? "solid": "outline"} onClick={() => setFormData({
                  ...formData,
                  owners_post_choice: BugOrFeature.Bug
                })}>BUG</Button>
                <Button w={"40"} h={"40"} fontSize={"4xl"} disabled={formData.owners_post_choice === BugOrFeature.Feature}
                variant={formData.owners_post_choice === BugOrFeature.Feature ? "solid": "outline"} onClick={() => setFormData({
                  ...formData,
                  owners_post_choice: BugOrFeature.Feature
                })}>FEATURE</Button>
              </Box>
            </Field.Root>

            <Button alignSelf={"flex-end"} type="submit">Submit your invention</Button>
          </Box>
        </form>
    </Box>
  )
}

export default Form