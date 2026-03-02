import { Card } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { TbArrowBigDown, TbArrowBigDownLine, TbArrowBigDownFilled, TbArrowBigUp, TbArrowBigUpLine,  TbArrowBigUpFilled } from "react-icons/tb";
import { BugOrFeature } from "../types/PostCreationData";
import type { Post, UpvoteValue } from "../types/Post";

function AllPosts() {
  const [userIp, setUserIp] = useState<string>("");
   
  const [postsData, setPostsData] = useState<Post[]>([
    {
      id: "65e0f1a2b3c4d5e6f7a8b901",
      owner_ip: "192.168.1.15",
      message: "Czy kawa powinna być słodzona?",
      image_path: "",
      creation_date: new Date("2026-02-23T09:15:00Z"),
      owners_post_choice: BugOrFeature.Bug,
      upvote_values: new Map<string, UpvoteValue>([
        ["192.168.1.20", "UP"],
        ["89.12.43.121", "UP"],
        ["172.20.10.5", "DOWN"]
      ]),
      vote_values: new Map<string, BugOrFeature>([
        ["192.168.1.20", BugOrFeature.Bug],
        ["89.12.43.121", BugOrFeature.Feature]
      ])
    },
    {
      id: "65e0f1a2b3c4d5e6f7a8b902",
      owner_ip: "85.202.10.44",
      message: "Lepiej pracować rano czy w nocy?",
      image_path: "images/work_cycle.jpg",
      creation_date: new Date("2026-02-22T18:42:00Z"),
      owners_post_choice: BugOrFeature.Feature,
      upvote_values: new Map<string, UpvoteValue>([
        ["5.173.90.112", "UP"],
        ["31.0.124.5", "UP"]
      ]),
      vote_values: new Map<string, BugOrFeature>([
        ["5.173.90.112", BugOrFeature.Feature],
        ["46.242.11.202", BugOrFeature.Bug]
      ])
    },
    {
      id: "65e0f1a2b3c4d5e6f7a8b903",
      owner_ip: "172.16.254.1",
      message: "Góry czy morze na wakacje?",
      image_path: "",
      creation_date: new Date("2026-02-21T14:05:00Z"),
      owners_post_choice: BugOrFeature.Bug,
      upvote_values: new Map<string, UpvoteValue>([
        ["83.21.4.156", "DOWN"]
      ]),
      vote_values: new Map<string, BugOrFeature>([
        ["83.21.4.156", BugOrFeature.Bug],
        ["194.181.100.2", BugOrFeature.Bug]
      ])
    },
    {
      id: "65e0f1a2b3c4d5e6f7a8b904",
      owner_ip: "93.184.216.34",
      message: "iOS czy Android?",
      image_path: "",
      creation_date: new Date("2026-02-20T11:30:00Z"),
      owners_post_choice: BugOrFeature.Feature,
      upvote_values: new Map<string, UpvoteValue>(),
      vote_values: new Map<string, BugOrFeature>([
        ["212.77.100.101", BugOrFeature.Feature]
      ])
    },
    {
      id: "65e0f1a2b3c4d5e6f7a8b905",
      owner_ip: "10.0.0.1",
      message: "Pizza z ananasem – tak czy nie?",
      image_path: "",
      creation_date: new Date("2026-02-19T20:10:00Z"),
      owners_post_choice: BugOrFeature.Bug,
      upvote_values: new Map<string, UpvoteValue>([
        ["185.20.104.33", "UP"],
        ["79.110.201.2", "DOWN"],
        ["37.47.15.88", "UP"]
      ]),
      vote_values: new Map<string, BugOrFeature>([
        ["185.20.104.33", BugOrFeature.Feature],
        ["91.231.14.5", BugOrFeature.Feature]
      ])
    }
  ]);
  
  //zmienic to na setPostsData
  const handleVoteCountChange = (postId: string, voteValue: UpvoteValue) => () => {
    postsData.forEach((post) => {
      if(post.id === postId){
        if(post.upvote_values.has(userIp)){
          if(post.upvote_values.get(userIp) === voteValue){
            post.upvote_values.delete(userIp)
            console.log("1")
          } else {
            post.upvote_values.set(userIp, voteValue)
            console.log("2")
          }          
        } else {
          post.upvote_values.set(userIp, voteValue)
            console.log("3")
        }
        console.log(post)
      }
    })
  }

  const handleVoteValue = (post: Post) => {
    let value = 0;

    post.upvote_values.forEach((vote_value) => {
      value += vote_value == "UP" ? 1 : -1;
    })

    return value
  }

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    setUserIp(data.ip)
    console.log("Your IP is:", data.ip)
  })}, [])

  return (
    <>
      {postsData.map(post => 
        <Card.Root key={post.id}>
          <Card.Header>
            <Card.Title>{post.message}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Description>
              {post.owners_post_choice}
            </Card.Description>
          </Card.Body>
          <Card.Footer>
            <div className="flex justify-center items-center bg-gray-200 rounded-3xl !p-1">
                <button className="cursor-pointer"
                  onClick={handleVoteCountChange(post.id,"DOWN")}>
                  <TbArrowBigDown size={22} className="hover:text-neutral-400 transition-all"/>
                </button>
                <span style={{ margin: "2px"}}>
                {handleVoteValue(post)}
                </span>
                <button className="cursor-pointer"
                  onClick={handleVoteCountChange(post.id, "UP")}>
                  <TbArrowBigUp size={22} className="hover:text-neutral-400 transition-all"/>
                </button>
            </div>
          </Card.Footer>
        </Card.Root>
      )}
    </>
  )
}

export default AllPosts