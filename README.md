# Mint club

Mint Snipe (✿ ❛‿❛)︻デ═一

See IPFS-hosted frontend here: https://ipfs.io/ipfs/bafkreigcbptjv5a6zfu5qhqd7jl5wlwgwdhhzsbxvlfvsvgge42vjg5334

# About the Project

The NFT community uses free NFT minting as a way to kick-start the market and create some initial hype. 

Mint Snipe XYZ does:
* scrapes Twitter for free minting opportunities
* mints free NFTs
* fairly sends the NFT to someone who's bought a raffle ticket, using Chainlink VRF

This is a project by Hugo & Konrad from Prophet 💙

https://www.tella.tv/video/cl7e741wb00000hij3pe830kc/view

# Instructions

(Assuming linux terminal. If on windows consider using [WSL](https://docs.microsoft.com/en-us/windows/wsl/install))

1. create local python installation, activate it, and install libraries

```
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
```

2. go to app/ and install npm packages

```
        cd app/src
        npm install
```

<br>

That's it! Now you can run the server, or push to github (autodeploys to render).

<br>

### Useful commands:

(have to be run from within ```app/src/```)

```
npm run build-css
```

⬆️ This will run a script that builds all the tailwind css files once.⬆️ 

```
npm run build-css-forever
```

⬆️ Same thing, just does it continuosly whenever there's ANY change.


```
npm run start:dev
```

⬆️ This will run the server in development mode.⬆️ 

```
npm run start:prod
```

⬆️ This will run the server in production mode.⬆️ 

```
npm run yeet-it
```

⬆️ This says fuck it, builds the css, adds all files to a git commit, and pushes to github. It then gets autodeployed to the web!⬆️ 

