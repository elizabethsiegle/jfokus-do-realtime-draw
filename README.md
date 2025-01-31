### Real-Time Collaborative Stateful Drawing

This project is a real-time collaborative drawing application built using Cloudflare Workers and Durable Objects using Cursor. It enables multiple users to draw on a shared canvas simultaneously, with state synchronization across all participants.

Features
✅ Real-time Collaboration – Users can draw together on the same canvas, with updates reflecting instantly.
✅ Durable Objects for State Management – Ensures consistent state across users by managing drawing data centrally.
✅ Cloudflare Workers for Scalability – Serverless backend handles requests efficiently at the edge.
✅ Low Latency Updates – Fast communication using WebSockets or other real-time mechanisms.
✅ Persistent Canvas State – Drawings remain even if users disconnect and reconnect.

#### Tech Stack
 🔥 Cloudflare Workers – Serverless execution environment.
 🔥 Cloudflare Durable Objects – Manages shared state across multiple users.
 🔥 WebSockets (or HTTP streaming) – Enables real-time updates.
 🔥 HTML, CSS, JavaScript – Frontend for drawing interaction.

#### How It Works
User Joins a Session → Each drawing session is assigned to a Durable Object.
Real-time Updates → Draw events are sent via WebSockets and stored in the Durable Object.
State Persistence → If a user disconnects, they can rejoin and see the existing drawing.

#### Setup & Deployment
1. Prerequisites
- Cloudflare account with Workers & Durable Objects enabled.
- Node.js & Wrangler CLI installed (npm install -g wrangler).
2. Clone the Repository
```bash
git clone https://github.com/elizabethsiegle/jfokus-do-realtime-draw.git
cd drawtest
```
3. Configure Durable Objects
Modify wrangler.json to define the Durable Object binding:

```json
"durable_objects": {
    "bindings": [{
      "name": "DRAWING_ROOM",
      "class_name": "DrawingDO"
    }]
  },
  "migrations": [{
    "tag": "v1",
    "new_classes": ["DrawingDO"]
  }]
```
4. Test locally 
```bash
npx wrangler dev --remote
```
5. Deploy to Cloudflare
```bash
npx wrangler deploy
```

#### Usage
- Open the deployed URL in a browser.
- Start drawing on the shared canvas.
- Invite others to collaborate in real time!

####Future Improvements
🚀 Multi-room support – Allow users to create and join different drawing sessions.
🚀 Undo/Redo functionality – Track and revert actions.
🚀 Mobile optimization – Improve touch interactions for mobile users.

