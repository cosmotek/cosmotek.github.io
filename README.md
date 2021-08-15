# cosmotek.github.io (Resume Website)
Source of my hugo blog

### Requirements

- Hugo 0.68 or higher `brew install hugo`
- Bash or a compatible shell
- Git
- Autoprefixer `sudo npm i -g autoprefixer`
- PostCSS-CLI `sudo npm i -g postcss-cli`

### Project Layout

All files relating to the content itself reside in `content/`. Please see the docs for Hugo and the Terminal theme (links below) for more info on how to edit this site. The `docs/` directory is where the built version of this site lives. This directory is tied to the Github Pages config (see the settings) and really shouldn't be edited (for the most part) as the content is purely generated. With the exception of `README.md`, `deploy.sh` and any Git-specific files, all other files and directories and files are related to/controlled-by Hugo. Please see Hugo documentation for more info.

- Sam Theme Docs https://themes.gohugo.io/themes/hugo-theme-sam/
- Hugo Docs https://gohugo.io/documentation/

### Testing

For those looking to make modifications to this site, it may be helpful to know how to build the website, and how to run it locally. Executing `hugo -t book` will build the site and store all resulting files in `public/`. If you're looking to deploy the site, see build instructions in the `Deployment` section below.
To run a dev server locally (with hot reloading), execute `hugo server --minify --theme showfolio`.

### Deployment

Deployment is as simple as executing `./deploy.sh`. This script will build the Hugo site, move files to the necessary directories, commit the built website to the repo and push said commit to Github. Github Pages automatically detects changes and will serve the static files as they are updated in this repo.
