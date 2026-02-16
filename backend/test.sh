#!/bin/sh

URL="127.0.0.1:3000"

curl \
  -F 'message="test message"' \
  -F 'owners_post_choice="FEATURE"' \
  -F 'image=@/mnt/c/Users/s113/Downloads/test.jpg' \
  "$URL/add-post"
