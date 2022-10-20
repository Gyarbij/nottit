[![CodeQL](https://github.com/Gyarbij/nottit/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Gyarbij/nottit/actions/workflows/codeql-analysis.yml)[![Docker-Buildx](https://github.com/Gyarbij/nottit/actions/workflows/image.yml/badge.svg)](https://github.com/Gyarbij/nottit/actions/workflows/image.yml)[![pages-build-deployment](https://github.com/Gyarbij/nottit/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/Gyarbij/nottit/actions/workflows/pages/pages-build-deployment)

# nottit
A progressive web app and client for Reddit with authenticated logins via the reddit API and a variety of browsing options based on [Troddit](https://hub.docker.com/r/bsyed/troddit/). It also

## Features

- No trackers like those on reddit.com 
- No ads.... like no effing ads, that was the whole point of this.
- Secure by design with constantly updated packages and dependencies, this is specifically security focused, therefore functionality may be lost in the interest of security due to breaking changes in package updates.
- Simple to deploy and host yourself if you're of the super paranoid variety (you're on reddit so probably)
- Secure logins with Reddit to enable voting, commenting, managing your subreddits and multireddits (aka feeds), and access to your personal front page. 
- 'Offline mode' to follow subreddits and manage multiredditss locally without login. Autogenerates a personal front page. 
  - Visit your [multireddit](https://www.reddit.com/subreddits) and copy the multireddit link. Replace 'reddit' with 'nottit' in the URL and then use the 'Join All' option to quickly follow all subs locally. 
- Search Reddit for posts or subreddits quickly with auto-complete. 
- Filter posts by type (Images, Video/GIFs, Links, Self)  
- View posts in single column, custom multi-column with a grid-masonry layout, or a simple row mode. All with infinite-scrolling. 
- Choose your card style: Original for full post text in card, compact to exclude post text, or Media to hide all text and card padding. 
- Gallery view: Click on a post and navigate through the feed with on-screen buttons or your arrow keys. Shows the post content as well as its comments from Reddit. Smart portrait mode to automatically arrange vertical photos and videos side by side with comments. 
- Hover mouse over Reddit videos to play. Enable the autoplay option to play videos automatically when entering the viewport. Enable the Audio option to play sound on hover as well.
- Responsive desktop and mobile layouts.  
- PWA to download to your computer or phone. 
- Docker support

# Deploying

### Environment Variables
To use login functionality the following environment variables need to be defined in your compose file, cloud host settings or a .env.local file placed in the root directory for non docker deployments: 

CLIENT_ID=\<ID of your Reddit app>\
CLIENT_SECRET=\<Secret from your Reddit app>\
REDDIT_REDIRECT=http://localhost:3000/api/auth/callback/reddit  
NEXTAUTH_SECRET=\<See [https://next-auth.js.org/configuration/options#secret](https://next-auth.js.org/configuration/options#secret)>\
NEXTAUTH_URL=http://localhost:3000

## Docker

### To Deploy the [Docker Image](https://hub.docker.com/r/gyarbij/nottit)

```sh
docker pull gyarbij/nottit
docker run -d --name nottit -p 3000:3000 gyarbij/nottit
```

Alternatively for arm64: 

```sh
docker pull gyarbij/nottit:arm64
```

### Deploy as an Azure Web App

To deploy as an azure web app, always use the :latest tag or specify :amd64 as the arm64 image will not run on the linux ASP!

<img width="573" alt="Screenshot 2022-07-10 at 11 31 10" src="https://user-images.githubusercontent.com/49493993/178139457-c36f5ef4-3090-4013-96f4-07573285217a.png">

```sh
gyarbij/nottit:latest
```

Alternatively specify amd64: 

```sh
gyarbij/nottit:amd64
```
Enter the environment variables in 

```sh
YourWebApp > Settings > Configuration > Application settings
```
<img width="1284" alt="Screenshot 2022-07-10 at 11 39 20" src="https://user-images.githubusercontent.com/49493993/178139465-50114a82-bb3d-4342-a892-629ee732e72b.png">

### Deploy as an AWS Lightsale Container

To deploy on lightsail, always use the <:latest tag> or specify <:amd64>

<img width="737" alt="Screenshot 2022-07-10 at 11 49 21" src="https://user-images.githubusercontent.com/49493993/178139925-de5fbb1f-c96d-4646-b62d-cbafa618a4e6.png">

Additionally, open port 3000 in the deployment setup

<img width="734" alt="Screenshot 2022-07-10 at 11 56 05" src="https://user-images.githubusercontent.com/49493993/178139991-ffbeb5ee-ed2f-48f6-a0d2-726cc359d3bd.png">

Ensure to select the nottit container as the public endpoint!


### To Build the Image Yourself 

By default, the Docker will expose port 3000, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
git clone https://github.com/gyarbij/nottit
cd nottit
docker build . -t nottit
```

This will create the nottit image and pull in the necessary dependencies. To run:

```sh
docker run -p 3000:3000 nottit
```
## Developing/Running without Docker

Clone the repo and install all packages with npm or yarn. Then to run development server: 

```sh
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To contribute, create a branch and submit a PR!


### Environment Variables
To use login functionality, the following environment variables need to be defined in a .env.local file placed in the root directory: 

CLIENT_ID=\<ID of your Reddit app>\
CLIENT_SECRET=\<Secret from your Reddit app>\
REDDIT_REDIRECT=http://localhost:3000/api/auth/callback/reddit  
NEXTAUTH_SECRET=\<See [https://next-auth.js.org/configuration/options#secret](https://next-auth.js.org/configuration/options#secret)>\
NEXTAUTH_URL=http://localhost:3000

To create a Reddit app visit [https://old.reddit.com/prefs/apps/](https://old.reddit.com/prefs/apps/). 
The redirect uri should match the REDDIT_REDIRECT variable. 