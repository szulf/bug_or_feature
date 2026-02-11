export enum BugOrFeature {
    Bug = "BUG",
    Feature = "FEATURE"
}

export interface PostCreationData {
    message: string
    owners_post_choice: BugOrFeature | null
}