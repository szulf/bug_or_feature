import { Card, Box, Text, Grid, Badge, Button, IconButton, Spinner, Center, Separator, Stack, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TbArrowBigDown, TbArrowBigDownFilled, TbArrowBigUp, TbArrowBigUpFilled, TbLock } from "react-icons/tb";
import { BugOrFeature } from "../types/PostCreationData";
import type { Post, UpvoteValue } from "../types/Post";
import { toaster } from "./ui/toaster";

type SortOption = "score" | "newest";

function AllPosts() {
  const [userIp, setUserIp] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("score");
  const [postsData, setPostsData] = useState<Post[]>([]);

  const API_BASE = import.meta.env.VITE_FRONTEND_URL as string;

  
  useEffect(() => {
    const initData = async () => {
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        setUserIp(ipData.ip);

        const postsRes = await fetch(`${API_BASE}/get-posts`);
        const posts = await postsRes.json();
        
        
        const formattedPosts = posts.map((p: any) => ({
          ...p,
          creation_date: new Date(p.creation_date),
          
          upvote_values: new Map(Object.entries(p.upvote_values || {})),
          vote_values: new Map(Object.entries(p.vote_values || {}))
        }));
        
        setPostsData(formattedPosts);
      } catch (error) {
        toaster.create({ type: "error", title: "Failed to load posts" });
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const getScore = (post: any) => {
    // Pobieramy same wartości ("UP", "DOWN") z obiektu upvote_count
    const votes = Object.values(post.upvote_count);
    
    let score = 0;
    votes.forEach((val) => {
      score += val === "UP" ? 1 : -1;
    });
    
    return score;
  };

  
  const sortedPosts = [...postsData].sort((a, b) => {
    if (sortBy === "score") {
      return getScore(b) - getScore(a);
    }
    return b.creation_date.getTime() - a.creation_date.getTime();
  });

  
  const handleRankingVote = async (postId: string, voteType: UpvoteValue) => {
    try {
      const response = await fetch(`${API_BASE}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId, value: voteType }), 
      });

      if (!response.ok) throw new Error();

      setPostsData(prev => prev.map(post => {
        if (post.id !== postId) return post;
        const newMap = new Map(post.upvote_values);
        newMap.get(userIp) === voteType ? newMap.delete(userIp) : newMap.set(userIp, voteType);
        return { ...post, upvote_values: newMap };
      }));
    } catch (err) {
      toaster.create({ type: "error", title: "Voting failed" });
    }
  };

  
  const handleTypeVote = async (postId: string, type: BugOrFeature) => {
    try {
      const response = await fetch(`${API_BASE}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Zmieniono: post_id -> id, type -> value
        body: JSON.stringify({ id: postId, value: type }), 
      });

      if (!response.ok) throw new Error();

      setPostsData(prev => prev.map(post => {
        if (post.id !== postId) return post;
        const newVotes = new Map(post.vote_values);
        newVotes.get(userIp) === type ? newVotes.delete(userIp) : newVotes.set(userIp, type);
        return { ...post, vote_values: newVotes };
      }));
    } catch (err) {
      toaster.create({ type: "error", title: "Submission failed" });
    }
  };

  if (loading) return <Center h="100vh"><Spinner size="xl" color="blue.500" /></Center>;

  return (
    <Stack gap="10" p="8" align="center" minH="100vh">
      {/* SORTING CONTROLS */}
      <Box width="full" maxW="xl" bg="white" p="4" borderRadius="2xl" boxShadow="md" border="1px solid" borderColor="gray.100">
        <Text fontSize="xs" fontWeight="bold" color="gray.500" mb="3" textAlign="center" letterSpacing="widest">
          SORTING
        </Text>
        <Grid templateColumns="1fr 1fr" gap="4">
          <Button 
            variant={sortBy === "score" ? "solid" : "outline"} 
            colorPalette="blue"
            onClick={() => setSortBy("score")}
          >
            Top Score
          </Button>
          <Button 
            variant={sortBy === "newest" ? "solid" : "outline"} 
            colorPalette="blue"
            onClick={() => setSortBy("newest")}
          >
            Newest
          </Button>
        </Grid>
      </Box>

      {/* POST LIST */}
      {sortedPosts.map((post) => {
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
                <Image 
                  src={`${API_BASE}/${post.image_path}`} 
                  alt="post" 
                  borderRadius="xl" 
                  maxH="300px" 
                  w="full" 
                  objectFit="cover"
                />
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

            <Card.Footer bg="gray.50" p="4" justifyContent="center">                
                <Grid templateColumns="auto 60px auto" alignItems="center" bg="white" borderRadius="full" p="1" shadow="inner" border="1px solid" borderColor="gray.200">
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