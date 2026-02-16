import { Tabs } from '@chakra-ui/react'
import { LuLibraryBig, LuFilePlus } from "react-icons/lu"
import Form from './Form'

function PageTabs() {
  return (
    <Tabs.Root defaultValue="all_posts" minW={"2xl"}>
      <Tabs.List>
        <Tabs.Trigger value="all_posts">
          <LuLibraryBig />
          All posts
        </Tabs.Trigger>
        <Tabs.Trigger value="create_new_post">
          <LuFilePlus />
          Create new post
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="all_posts">
        {/* Todo: create all posts component*/}
        All posts will go here
      </Tabs.Content>
      <Tabs.Content value="create_new_post">
        <Form />
      </Tabs.Content>
    </Tabs.Root>
  )
}

export default PageTabs