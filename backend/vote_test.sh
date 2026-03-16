#!/bin/sh

URL="127.0.0.1:3000"

# test 1:
post_id=$(curl \
  -F 'message="vote test message 1"' \
  -F 'owners_post_choice="BUG"' \
  "$URL/add-post")
curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"FEATURE\"}" "$URL/vote"
curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"BUG\"}" "$URL/vote"

# test 2:
post_id=$(curl \
  -F 'message="vote test message 2"' \
  -F 'owners_post_choice="FEATURE"' \
  "$URL/add-post")
curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"FEATURE\"}" "$URL/vote"
curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"NONE\"}" "$URL/vote"

# test 3:
post_id=$(curl \
  -F 'message="vote test message 3"' \
  -F 'owners_post_choice="BUG"' \
  "$URL/add-post")
curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"NONE\"}" "$URL/vote"
