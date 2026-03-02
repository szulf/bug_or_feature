import { Tabs } from '@chakra-ui/react'
import { LuLibraryBig, LuFilePlus, LuTrophy } from "react-icons/lu"
import Form from './Form'
import { useNavigate } from 'react-router'

function PageTabs() {
  const navigate = useNavigate()

  function navigateTo(href: string) {
    navigate(href)
  }

  let defaultValue = window.location.pathname.slice(1)
  if (!defaultValue) {
    defaultValue = "all_posts"
  }
  

  return (
    <Tabs.Root defaultValue={defaultValue} w={"75%"}>
      <Tabs.List>
        <Tabs.Trigger value="all_posts" onClick={() => navigateTo("/")}>
          <LuLibraryBig />
          All posts
        </Tabs.Trigger>
        <Tabs.Trigger value="create_new_post" onClick={() => navigateTo("/create_new_post")}>
          <LuFilePlus />
          Create new post
        </Tabs.Trigger>
        <Tabs.Trigger value="bug_of_the_week" onClick={() => navigateTo("/bug_of_the_week")}>
          <LuTrophy />
          Bug of the week
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="all_posts">
        {/* TODO: create all posts component*/}
        All posts will go here
      </Tabs.Content>
      <Tabs.Content value="create_new_post">
        <Form />
      </Tabs.Content>
      <Tabs.Content value="bug_of_the_week">
        {/* TODO: create all posts component*/}
        Bug of the week will go here
      </Tabs.Content>
    </Tabs.Root>
  )
}

export default PageTabs