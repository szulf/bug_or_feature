import z from "zod"

export enum BugOrFeature {
    Bug = "BUG",
    Feature = "FEATURE"
}

export interface PostCreationData {
    message: string
    owners_post_choice: BugOrFeature | null
}

export const PostCreationDataSchema = z.object({
    message: z.string(),
    owners_post_choice: z.enum(BugOrFeature)
})