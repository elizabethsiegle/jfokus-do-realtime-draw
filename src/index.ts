import { DrawingRoom } from './DrawingRoom';
export { DrawingRoom as DrawingDO };
import HTML_CONTENT from "../static/index.html";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle requests to /draw
    if (new URL(request.url).pathname === "/draw") {
      // Get the drawing room Durable Object
      const id = env.DRAWING_ROOM.idFromName('default-room');
      const room = env.DRAWING_ROOM.get(id);
      return room.fetch(request);
    }

    // Serve the HTML for all other requests
    return new Response(HTML_CONTENT, {
      headers: { "Content-Type": "text/html" }
    });
  }
};

export interface Env {
  DRAWING_ROOM: DurableObjectNamespace;
}
