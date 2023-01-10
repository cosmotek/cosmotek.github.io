#!/bin/sh

set -e

# build the project
rm -r docs
hugo -t showfolio
python3 $HOME/code/sandbox/hugo_encryptor/hugo-encryptor.py

# commit changes
mkdir -p docs
mv public/* docs/
rm -r public
cd docs
git add .

msg="deploying site $(date)"
git commit -m "$msg"

# push source to repo
git push origin master
