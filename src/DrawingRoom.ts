export class DrawingRoom implements DurableObject {
  private sessions: WebSocket[] = [];
  private strokes: any[] = [];
  state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async initialize() {
    // Load existing strokes from storage
    const storedStrokes = await this.state.storage.get('strokes');
    if (storedStrokes && Array.isArray(storedStrokes)) {
      this.strokes = storedStrokes;
    }
  }

  async fetch(request: Request) {
    // Handle WebSocket upgrades
    if (request.headers.get("Upgrade") === "websocket") {
      const { 0: client, 1: server } = new WebSocketPair();
      await this.handleSession(server);
      return new Response(null, { status: 101, webSocket: client });
    }
    return new Response("Expected WebSocket", { status: 400 });
  }

  async handleSession(webSocket: WebSocket) {
    // Accept the WebSocket connection
    webSocket.accept();

    // Add this session to our list
    this.sessions.push(webSocket);

    // Send the current state to the new client
    webSocket.send(JSON.stringify({
      type: 'init',
      strokes: this.strokes
    }));

    // Handle messages from this WebSocket
    webSocket.addEventListener('message', async msg => {
      try {
        const data = JSON.parse(msg.data as string);

        switch (data.type) {
          case 'draw':
            // Save the stroke
            this.strokes.push({
              x0: data.x0,
              y0: data.y0,
              x1: data.x1,
              y1: data.y1,
              color: data.color,
              size: data.size
            });
            // Save to durable storage periodically
            await this.state.storage.put('strokes', [...this.strokes]);
            break;
          case 'clear':
            this.strokes = [];
            await this.state.storage.put('strokes', []);
            break;
        }

        // Broadcast the message to all connected clients
        this.broadcast(msg.data as string);
      } catch (err) {
        // Handle any errors
        webSocket.send(JSON.stringify({ error: err }));
      }
    });

    // Remove session on close
    webSocket.addEventListener('close', () => {
      this.sessions = this.sessions.filter(session => session !== webSocket);
    });
  }

  broadcast(message: string) {
    // Send the message to all connected clients
    this.sessions = this.sessions.filter(session => {
      try {
        session.send(message);
        return true;
      } catch (err) {
        return false;
      }
    });
  }
}