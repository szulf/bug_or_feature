#!/bin/sh

URL="127.0.0.1:3000"

post_id=$(curl \
  -F 'message="vote test message"' \
  -F 'owners_post_choice="BUG"' \
  "$URL/add-post")

curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"FEATURE\"}" "$URL/vote"

curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"BUG\"}" "$URL/vote"
