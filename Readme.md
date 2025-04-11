# Spotify Playback Api (CK fork)
this fork is supposed to be used in tandem with [Unoffical Spotify Playback HTTP Server (Less Compatible with Normal Unoffical Spotify Playback api version)](https://github.com/CrazyKitty357/spotify-playback-http/tree/less-compat-version)

### New Features/Differences over the original
- it's hosted on an alternate port `8443` so sudo on linux for every step of the process (opening spotify, firefox, and python) is no longer a requirement to run.
- A different nameId to not conflict with the original in case if you wanted to use it with the original
- The ability to add a song to spotify's built-in song queue system.
# How to setup and use for youself
### Compiling the code from source
0. `git clone https://github.com/CrazyKitty357/spotify-playback-api-ck`
1. `npm install`
2. `npm run build`
3. `spicetify config extensions playbackapick.js`
4. `spicetify apply`
5. hook into it via any webhook software (idk any off the top of my head besides maybe godot and the custom python script you can find at the top of the readme)
### Installing the precompiled binary
1. download the `playbackapick.js` found in `dist/`
2. move the file to the `Extensions` folder to where `spicetify config-dir` takes you.
3. if `Extensions` isn't found make the folder
4. `spicetify config extensions playbackapick.js`
5. `spicetify apply`
6. hook into it via any webhook software (idk any off the top of my head besides maybe godot and the custom python script you can find at the top of the readme)
# How to remove the extension
1. `spicetify config extensions playbackapick.js-`
2. `spicetify apply`
3. that's it
---
# Original Readme  
# Spotify Playback Api 📻

### ⚠️ under development

The Spotify api is currently paywalled hence I decided to create an alternative one with the help of [Spicetify](https://spicetify.app/),  
by injecting Javascript we are able to expose the api with a websocket,  
which can be accessed by starting a server on `localhost:443`  
Visit [Terminal Spotify](https://github.com/Om-Thorat/Term-Spotify) for a simple demo.

> With 💖 by Om