# Nottit
A progressive web app and client for Reddit with authenticated logins via the reddit API and a variety of browsing options based on [Troddit](https://hub.docker.com/r/bsyed/troddit/).

## Features

- Secure logins with Reddit to enable voting, commenting, managing your subreddits and multireddits (aka feeds), and access to your personal front page. 
- No ads.... like no effing ads, that was the whole point of this.
- 'Offline mode' to follow subreddits and manage multis locally without login. Autogenerates a personal front page. 
  - Visit your [multireddit](https://www.reddit.com/subreddits) and copy the multireddit link. Replace 'reddit' with 'nottit' in the URL and then use the 'Join All' option to quickly follow all subs locally. 
- Search Reddit for posts or subreddits quickly with auto-complete. 
- Filter posts by type (Images, Video/GIFs, Links, Self)  
- View posts in single column, custom multi-column with a grid-masonry layout, or a simple row mode. All with infinite-scrolling. 
- Choose your card style: Original for full post text in card, Compact to exclude post text, or Media to hide all text and card padding. 
- Gallery view: Click on a post and navigate through the feed with on screen buttons or your arrow keys. Shows the post content as well as its comments from Reddit. Smart portrait mode to automatically arrange vertical photos and videos side by side with comments. 
- Hover mouse over Reddit videos to play. Enable to Autoplay option to play videos automatically when entering the viewport. Enable the Audio option to play sound on hover as well.
- Responsive desktop and mobile layouts.  
- PWA to download to your computer or phone. 
- Docker support


## Developing

Clone the repo and install all packages with npm or yarn. Then to run development server: 

```sh
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To contribute create a branch and submit a PR!


### Environment Variables
To use login functionality the following environment variables need to be defined in a .env.local file placed in the root directory: 

CLIENT_ID=\<ID of your Reddit app>\
CLIENT_SECRET=\<Secret from your Reddit app>\
REDDIT_REDIRECT=http://localhost:3000/api/auth/callback/reddit  
NEXTAUTH_SECRET=\<See [https://next-auth.js.org/configuration/options#secret](https://next-auth.js.org/configuration/options#secret)>\
NEXTAUTH_URL=http://localhost:3000

To create a Reddit app visit [https://old.reddit.com/prefs/apps/](https://old.reddit.com/prefs/apps/). 
The redirect uri should match the REDDIT_REDIRECT variable. 


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

```sh
docker pull gyarbij/nottit
docker run -d --name nottit -p 3000:3000 gyarbij/nottit
```

Alternatively for arm64: 

```sh
docker pull gyarbij/nottit:arm64
```

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