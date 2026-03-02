import { BugOrFeature } from "./PostCreationData"

export type UpvoteValue = "UP" | "DOWN";

export interface Post {
    owner_ip: string
    id: string
    message: string
    image_path: string
    creation_date: Date
    owners_post_choice: BugOrFeature
    upvote_values: Map<string, UpvoteValue>
    vote_values: Map<string, BugOrFeature>
}