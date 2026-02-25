import { Card } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { TbArrowBigDown, TbArrowBigDownLine, TbArrowBigDownFilled, TbArrowBigUp, TbArrowBigUpLine,  TbArrowBigUpFilled } from "react-icons/tb";

// "id": "post_001",
// "message": "Czy kawa powinna być słodzona?",
// "image_path": "",
// "creation_date": "2026-02-23T09:15:00Z",
// "owners_post_choice": "BUG",
// "vote_counts": {
//   "BUG": 34,
//   "FEATURE": 21
// },
// "upvote_count": 56

function AllPosts() {
  const [postsData, setPostsData] = useState([
    {
      "id": "post_001",
      "message": "Czy kawa powinna być słodzona?",
      "image_path": "",
      "creation_date": "2026-02-23T09:15:00Z",
      "owners_post_choice": "BUG",
      "vote_counts": {
        "BUG": 34,
        "FEATURE": 21
      },
      "upvote_count": 56
    },
    {
      "id": "post_002",
      "message": "Lepiej pracować rano czy w nocy?",
      "image_path": "",
      "creation_date": "2026-02-22T18:42:00Z",
      "owners_post_choice": "FEATURE",
      "vote_counts": {
        "BUG": 12,
        "FEATURE": 47
      },
      "upvote_count": 73
    },
    {
      "id": "post_003",
      "message": "Góry czy morze na wakacje?",
      "image_path": "",
      "creation_date": "2026-02-21T14:05:00Z",
      "owners_post_choice": "BUG",
      "vote_counts": {
        "BUG": 58,
        "FEATURE": 44
      },
      "upvote_count": 102
    },
    {
      "id": "post_004",
      "message": "iOS czy Android?",
      "image_path": "",
      "creation_date": "2026-02-20T11:30:00Z",
      "owners_post_choice": "FEATURE",
      "vote_counts": {
        "BUG": 39,
        "FEATURE": 41
      },
      "upvote_count": 65
    },
    {
      "id": "post_005",
      "message": "Pizza z ananasem – tak czy nie?",
      "image_path": "",
      "creation_date": "2026-02-19T20:10:00Z",
      "owners_post_choice": "BUG",
      "vote_counts": {
        "BUG": 27,
        "FEATURE": 68
      },
      "upvote_count": 89
    }
  ])
  const handleVoteCount = (postId: string, type: string) => () => {
    /*
      sprawdzanie czy uzytkownik juz zagłosował
    */
    setPostsData(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const newUpvoteCount = type === "Up" ? post.upvote_count + 1 : post.upvote_count - 1;
        return { ...post, upvote_count: newUpvoteCount };
      }
      return post;
    }))

  }

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => console.log("Your IP is:", data.ip));
  }, [])

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
                  onClick={handleVoteCount(post.id,"Down")}>
                  <TbArrowBigDown size={22} className="hover:text-neutral-400 transition-all"/>
                </button>
                <span style={{ margin: "2px"}}>
                  {post.upvote_count}
                </span>
                <button className="cursor-pointer"
                  onClick={handleVoteCount(post.id, "Up")}>
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