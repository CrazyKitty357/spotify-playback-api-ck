import { io } from "socket.io-client";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  await sleep(200);
  const socket = io("http://127.0.0.1:8443");

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
  });

  socket.on("connect", () => {
    const engine = socket.io.engine;
    console.log("Transport name:", engine.transport.name);
    // Send initial track info on connect
    const currentTrack = Spicetify.Queue.track;
    if (currentTrack?.contextTrack?.metadata?.title) {
      socket.emit("command", currentTrack.contextTrack.metadata.title);
    } else {
      socket.emit("command", "No track playing");
    }
  });

  socket.on("input", async (data) => {
    console.log("Received input:", data);
    switch (data) {
      case "PlayPause":
        Spicetify.Player.togglePlay();
        // Send updated track info after action
        const playPauseTrack = Spicetify.Queue.track;
        if (playPauseTrack?.contextTrack?.metadata?.title) {
          socket.emit("command", playPauseTrack.contextTrack.metadata.title);
        } else {
          socket.emit("command", "No track playing");
        }
        break;
      case "Next":
        Spicetify.Player.next();
        // Send updated track info after action
        const nextTrack = Spicetify.Queue.nextTracks;
        if (
          nextTrack &&
          nextTrack.length > 0 &&
          nextTrack[0]?.contextTrack?.metadata?.title
        ) {
          socket.emit("command", nextTrack[0].contextTrack.metadata.title);
        } else if (Spicetify.Queue.track?.contextTrack?.metadata?.title) {
          socket.emit(
            "command",
            Spicetify.Queue.track.contextTrack.metadata.title,
          ); // Send current track if no next track
        } else {
          socket.emit("command", "No next track");
        }
        break;
      case "Prev":
        Spicetify.Player.back();
        // Send updated track info after action
        const prevTrack = Spicetify.Queue.prevTracks;
        if (
          prevTrack &&
          prevTrack.length > 0 &&
          prevTrack.at(-1)?.contextTrack?.metadata?.title
        ) {
          socket.emit("command", prevTrack.at(-1).contextTrack.metadata.title);
        } else if (Spicetify.Queue.track?.contextTrack?.metadata?.title) {
          socket.emit(
            "command",
            Spicetify.Queue.track.contextTrack.metadata.title,
          ); // Send current track if no prev track
        } else {
          socket.emit("command", "No previous track");
        }
        break;
      case "Shuffle":
        Spicetify.Player.toggleShuffle();
        // Send updated track info after action
        const shuffleTrack = Spicetify.Queue.track;
        if (shuffleTrack?.contextTrack?.metadata?.title) {
          socket.emit("command", shuffleTrack.contextTrack.metadata.title);
        } else {
          socket.emit("command", "No track playing");
        }
        break;
      case "Repeat":
        Spicetify.Player.toggleRepeat();
        // Send updated track info after action
        const repeatTrack = Spicetify.Queue.track;
        if (repeatTrack?.contextTrack?.metadata?.title) {
          socket.emit("command", repeatTrack.contextTrack.metadata.title);
        } else {
          socket.emit("command", "No track playing");
        }
        break;
      case "getdata":
        // Send current track context data
        const dataTrack = Spicetify.Queue.track?.contextTrack;
        if (dataTrack) {
          socket.emit("command", dataTrack);
        } else {
          socket.emit("command", "No track data available");
        }
        break;
      // Modified case for "request"
      case data.startsWith("request ") ? data : undefined: // Check if data starts with "request "
        // Parse URL and add to queue
        console.log("Request received:", data);
        try {
          // Extract URL from data string
          const urlToParse = data.substring("request ".length).trim();

          // Remove si=... tracking parameters
          const urlWithoutSi = urlToParse.split("?")[0];

          let trackId = "";
          let uri = "";

          // Handle different URL formats (open.spotify.com and spotify:track:)
          if (urlWithoutSi.includes("open.spotify.com/track/")) {
            const match = urlWithoutSi.match(/track\/([a-zA-Z0-9]+)/);
            if (match && match[1]) {
              trackId = match[1];
              uri = `spotify:track:${trackId}`;
            } else {
              console.error(
                "Could not extract track ID from URL:",
                urlWithoutSi,
              );
              socket.emit("command", "Error: Could not parse track URL");
              break; // Exit case if URL parsing fails
            }
          } else if (urlWithoutSi.startsWith("spotify:track:")) {
            uri = urlWithoutSi;
          } else {
            console.error("Unsupported URL format:", urlWithoutSi);
            socket.emit("command", "Error: Unsupported URL format");
            break; // Exit case for unsupported URL format
          }

          if (uri) {
            Spicetify.addToQueue([{ uri: uri }]);
            socket.emit("command", `Added track to queue: ${uri}`);
          } else {
            socket.emit("command", "Error: Could not determine track URI");
          }
        } catch (error) {
          console.error("Error processing request:", error);
          socket.emit("command", "Error processing request");
        }
        break;
      default:
        console.log("Unknown command:", data);
        socket.emit("command", "Unknown command received");
    }
  });
}

export default main;
