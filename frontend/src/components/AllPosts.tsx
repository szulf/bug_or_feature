import { Card, Box, Text, Grid, Badge, Button, IconButton, Spinner, Center, Separator, Stack, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TbArrowBigDown, TbArrowBigDownFilled, TbArrowBigUp, TbArrowBigUpFilled, TbLock } from "react-icons/tb";
import { BugOrFeature } from "../types/PostCreationData";
import type { Post, UpvoteValue } from "../types/Post";

type SortOption = "score" | "newest";

function AllPosts() {
  const [userIp, setUserIp] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("score");
  
  const [sortedIds, setSortedIds] = useState<string[]>([]);

  const [postsData, setPostsData] = useState<Post[]>([
    {
      id: "65e0f1a2b3c4d5e6f7a8b901",
      owner_ip: "192.168.1.15",
      message: "Should coffee be sweetened?",
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
      message: "Is it better to work in the morning or at night?",
      image_path: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?q=80&w=500",
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
      message: "Mountains or sea for holidays?",
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
      message: "iOS or Android?",
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
      message: "Pineapple on pizza – yes or no?",
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

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        setUserIp(data.ip);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getScore = (post: Post) => {
    let score = 0;
    post.upvote_values.forEach(val => score += (val === "UP" ? 1 : -1));
    return score;
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    const dataToSort = [...postsData];
    
    if (newSortBy === "score") {
      dataToSort.sort((a, b) => getScore(b) - getScore(a));
    } else {
      dataToSort.sort((a, b) => b.creation_date.getTime() - a.creation_date.getTime());
    }
    
    setSortedIds(dataToSort.map(post => post.id));
  };

  useEffect(() => {
    handleSortChange(sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRankingVote = (postId: string, voteType: UpvoteValue) => {
    setPostsData(prev => prev.map(post => {
      if (post.id !== postId) return post;
      const newMap = new Map(post.upvote_values);
      newMap.get(userIp) === voteType ? newMap.delete(userIp) : newMap.set(userIp, voteType);
      return { ...post, upvote_values: newMap };
    }));
  };

  const handleTypeVote = (postId: string, type: BugOrFeature) => {
    setPostsData(prev => prev.map(post => {
      if (post.id !== postId) return post;
      const newVotes = new Map(post.vote_values);
      newVotes.get(userIp) === type ? newVotes.delete(userIp) : newVotes.set(userIp, type);
      return { ...post, vote_values: newVotes };
    }));
  };

  if (loading) return <Center h="100vh"><Spinner size="xl" color="blue.500" /></Center>;

  return (
    <Stack gap="10" p="8" align="center" minH="100vh">
      <Box width="full" maxW="xl" bg="white" p="4" borderRadius="2xl" boxShadow="md">
        <Text fontSize="xs" fontWeight="bold" color="gray.500" mb="3" textAlign="center" letterSpacing="widest">
          SORTING
        </Text>
        <Grid templateColumns="1fr 1fr" gap="4">
          <Button 
            variant={sortBy === "score" ? "solid" : "outline"} 
            colorPalette="blue"
            onClick={() => handleSortChange("score")}
          >
            Top Score
          </Button>
          <Button 
            variant={sortBy === "newest" ? "solid" : "outline"} 
            colorPalette="blue"
            onClick={() => handleSortChange("newest")}
          >
            Newest
          </Button>
        </Grid>
      </Box>

      {sortedIds.map(id => {
        const post = postsData.find(p => p.id === id);
    
        if (!post) return null;

        const userRankVote = post.upvote_values.get(userIp);
        const userTypeVote = post.vote_values.get(userIp);
        const score = getScore(post);
        const hasVotedType = userTypeVote !== undefined;

        return (
          <Card.Root key={post.id} width="full" maxW="xl" boxShadow="xl" borderRadius="2xl" bg="white" border="none" overflow="hidden">
            <Card.Header p="5">
              <Grid templateColumns="1fr auto" alignItems="center" gap={4}>
                {hasVotedType ? (
                  <Badge size="lg" variant="solid" colorPalette={post.owners_post_choice === BugOrFeature.Bug ? "red" : "green"}>
                    Author's choice: {post.owners_post_choice}
                  </Badge>
                ) : (
                  <Badge size="lg" variant="subtle" colorPalette="gray" fontStyle="italic">
                    <TbLock style={{ marginRight: '4px', display: 'inline' }} />
                    Vote to reveal the author's choice
                  </Badge>
                )}
                <Text fontSize="xs" color="gray.400">{post.creation_date.toLocaleDateString()}</Text>
              </Grid>

              <Card.Title mt="4" fontSize="2xl" fontWeight="bold" textAlign="center" lineHeight="shorter">
                {post.message}
              </Card.Title>
            </Card.Header>

            {post.image_path && (
              <Box px="5">
                <Image src={post.image_path} alt="post" borderRadius="xl" maxH="250px" w="full" objectFit="cover" />
              </Box>
            )}

            <Card.Body p="5">
              <Text mb="4" fontWeight="bold" fontSize="xs" color="gray.400" textAlign="center" letterSpacing="widest">
                WHAT DO YOU THINK IT IS?
              </Text>
              
              <Grid templateColumns="1fr 1fr" gap="4">
                <Button 
                  size="lg" 
                  height="70px"
                  variant={userTypeVote === BugOrFeature.Bug ? "solid" : "outline"}
                  colorPalette="red"
                  onClick={() => handleTypeVote(post.id, BugOrFeature.Bug)}>
                  It's a BUG
                </Button>
                <Button 
                  size="lg"
                  height="70px"
                  variant={userTypeVote === BugOrFeature.Feature ? "solid" : "outline"}
                  colorPalette="green"
                  onClick={() => handleTypeVote(post.id, BugOrFeature.Feature)}>
                  It's a FEATURE
                </Button>
              </Grid>
            </Card.Body>

            <Separator />

            <Card.Footer bg="gray.50" p="4">                
                <Grid templateColumns="auto 50px auto" alignItems="center" bg="white" borderRadius="full" p="1" shadow="inner" border="1px solid" borderColor="gray.200">
                  <IconButton
                    aria-label="Down"
                    variant="ghost"
                    rounded="full"
                    color={userRankVote === "DOWN" ? "blue.500" : "gray.300"}
                    onClick={() => handleRankingVote(post.id, "DOWN")}>
                    {userRankVote === "DOWN" ? <TbArrowBigDownFilled size={28} /> : <TbArrowBigDown size={28} />}
                  </IconButton>

                  <Text fontWeight="black" textAlign="center" fontSize="xl" color={score >= 0 ? "orange.600" : "blue.600"}>
                    {score}
                  </Text>

                  <IconButton
                    aria-label="Up"
                    variant="ghost"
                    rounded="full"
                    color={userRankVote === "UP" ? "orange.500" : "gray.300"}
                    onClick={() => handleRankingVote(post.id, "UP")}>
                    {userRankVote === "UP" ? <TbArrowBigUpFilled size={28} /> : <TbArrowBigUp size={28} />}
                  </IconButton>
                </Grid>
            </Card.Footer>
          </Card.Root>
        );
      })}
    </Stack>
  );
}

export default AllPosts;