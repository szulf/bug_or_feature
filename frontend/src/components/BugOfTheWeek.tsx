import { Card } from '@chakra-ui/react'
import React, { useState } from 'react'
import type { Post } from '../types/Post'

function BugOfTheWeek() {
    const [post, setPost] = useState<Post | null>(null)

    async function getBugOfTheWeek() {
        try {
            const response = await fetch("http://localhost:3000/post-of-the-week", {
                method: "GET"
            })

            let fetchedPost: Post | null = await response.json()

            setPost(fetchedPost)
        } catch (error) {
            console.error(error)    
        }
    }

    React.useEffect(() => {
        getBugOfTheWeek()
    }, [])

  return (
    <Card.Root className='h-96'>
        <Card.Header>
            <Card.Title>
                Bug of the week
            </Card.Title>
        </Card.Header>
        <Card.Body className='h-full'>
            <Card.Description>
                {post ? (
                    <pre>
                        {JSON.stringify(post, undefined, 4)}
                    </pre>
                ) : (
                    <span>
                        Currently there isn't any bug of the week
                    </span>
                )}
            </Card.Description>
        </Card.Body>
    </Card.Root>
  )
}

export default BugOfTheWeek