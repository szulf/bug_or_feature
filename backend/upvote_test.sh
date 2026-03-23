#!/bin/sh

URL="127.0.0.1:3000"

# test 1:
post_id=$(curl \
  -F 'message="upvote test message 1"' \
  -F 'owners_post_choice="BUG"' \
  "$URL/add-post")
curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"UP\"}" "$URL/upvote"
curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"DOWN\"}" "$URL/upvote"

# test 2:
post_id=$(curl \
  -F 'message="upvote test message 2"' \
  -F 'owners_post_choice="BUG"' \
  "$URL/add-post")
curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"UP\"}" "$URL/upvote"
curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"UP\"}" "$URL/upvote"

# test 3:
post_id=$(curl \
  -F 'message="upvote test message 3"' \
  -F 'owners_post_choice="BUG"' \
  "$URL/add-post")
curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"NONE\"}" "$URL/upvote"
