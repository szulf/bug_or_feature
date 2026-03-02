#!/bin/sh

URL="127.0.0.1:3000"

post_id=$(curl \
  -F 'message="another test msg"' \
  -F 'owners_post_choice="BUG"' \
  "$URL/add-post")

curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"UP\"}" "$URL/upvote"

curl -X POST -d "{\"id\":\"$post_id\", \"value\":\"DOWN\"}" "$URL/upvote"
