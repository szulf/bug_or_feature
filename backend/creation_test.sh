#!/bin/sh

URL="127.0.0.1:3000"

# test 1:
curl \
  -F 'message="creation test message 1"' \
  -F 'owners_post_choice="FEATURE"' \
  -F 'image=@/mnt/c/Users/s113/Downloads/test.jpg' \
  "$URL/add-post"

# test 2:
curl \
  -F 'message="creation test message 2"' \
  -F 'owners_post_choice="BUG"' \
  "$URL/add-post"

# test 3:
post_id=$(curl \
  -F 'message="creation test message 3"' \
  -F 'owners_post_choice="NONE"' \
  "$URL/add-post")
if [ "$post_id" != "Bad Request" ]; then
  echo "creation test 3 failed"
fi
