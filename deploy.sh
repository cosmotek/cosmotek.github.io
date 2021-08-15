#!/bin/sh

set -e

# build the project
rm -r docs
hugo -t showfolio

# commit changes
mkdir -p docs
mv public/* docs/
rm -r public
cd docs
git add .

msg="deploying site $(date)"
if [-n "$*"]; then
	msg="$*"
fi

git commit -m "$msg"

# push source to repo
git push origin master
