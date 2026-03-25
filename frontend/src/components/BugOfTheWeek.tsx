import { Card } from '@chakra-ui/react'
import React from 'react'

function BugOfTheWeek() {
    async function getBugOfTheWeek() {
        try {
        const response = await fetch("http://localhost:3000/post-of-the-week", {
            method: "GET"
        })

        console.log(response.body)
        const post = await response.json()

        console.log(post)
        } catch (error) {
            console.error(error)    
        }
    }

    React.useEffect(() => {
        getBugOfTheWeek()
    }, [])

  return (
    <Card.Root>
        <Card.Header>
            Bug of the week
        </Card.Header>
    </Card.Root>
  )
}

export default BugOfTheWeek