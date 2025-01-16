import type { Serve } from "bun";

const server = Bun.serve({
  port: 4000,
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/") return new Response(await Bun.file("./index.html").bytes(), {
      headers: {
        "Content-Type": "text/html",
      },
    })
  },
  websocket: {
    message(ws, message) { 
      ws.send(message as string | Bun.BufferSource);
    },
    open(ws) { },
    close(ws, code, message) { },
    drain(ws) { },
  },
} satisfies Serve); 

console.log(`Listening on ${server.hostname}:${server.port}`);
