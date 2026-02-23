import { Box, Field, Textarea, FileUpload, Icon, Button } from "@chakra-ui/react"
import type React from "react"
import { useState } from "react"
import { LuUpload } from "react-icons/lu"
import { Spinner } from "@chakra-ui/react"
import { BugOrFeature, PostCreationDataSchema, type PostCreationData } from "../types/PostCreationData"
import { toaster } from "./ui/toaster"
import { ZodError} from "zod"

function Form() {
  const [formData, setFormData] = useState<PostCreationData>({
    message: "",
    owners_post_choice: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    setIsSubmitting(true)
    e.preventDefault()

    try {
      const postCreationData = PostCreationDataSchema.parse(formData)
      const body = new FormData()

      body.append("message", postCreationData.message)
      body.append("owners_post_choice", postCreationData.owners_post_choice)
      // TODO: append image to form data

      const response = await fetch("https://glowing-space-carnival-v4jgrwp4vqq2x44q-3000.app.github.dev/add-post", {
        body: body,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })

      const postId = await response.json() as string
      // TODO: create a request to post image data

      toaster.create({
        type: "success",
        title: "Post created successfully"
      })

      setIsSubmitting(false)
      } catch(err) {
        // TODO: handle error
        setIsSubmitting(false)
        let toastTitle = ""

        if (err instanceof ZodError) {
          toastTitle = "Cannot submit invalid values!" 
        }

        toaster.create({
          type: "error",
          title: toastTitle
        })
    }
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
              <Box w={"full"} display={"flex"} justifyContent={"center"} alignItems={"center"} gap={"8"}>
                <Button w={"40"} h={"40"} fontSize={"4xl"}
                scale={0.85}
                variant={formData.owners_post_choice === BugOrFeature.Bug ? "solid": "outline"} onClick={() => setFormData({
                  ...formData,
                  owners_post_choice: BugOrFeature.Bug
                })}>BUG</Button>
                <Button w={"40"} h={"40"} fontSize={"4xl"}
                scale={0.85}
                variant={formData.owners_post_choice === BugOrFeature.Feature ? "solid": "outline"} onClick={() => setFormData({
                  ...formData,
                  owners_post_choice: BugOrFeature.Feature
                })}>FEATURE</Button>
              </Box>
            </Field.Root>

            <Button type="submit" disabled={isSubmitting} w={"full"}>
              {isSubmitting ? <Spinner />: "Upload your invention"}
            </Button>
          </Box>
        </form>
    </Box>
  )
}

export default Form