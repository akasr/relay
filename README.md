# Terminal Chat Server

A multi-client terminal chat server built with **Node.js, TypeScript, and TCP socket programming**. Clients connect through command-line tools such as `nc` (Netcat), register nicknames, exchange messages, and execute server commands.

## Features

- **TCP server:** Accepts multiple simultaneous client connections.
- **Nickname registration:** Assigns unique nicknames to connected clients.
- **Message broadcasting:** Distributes messages to other connected clients.
- **Command handling:**
  - `/who` — List connected users.
  - `/help` — Display available commands.
  - `/quit` — Disconnect from the server.
- **Connection management:** Tracks connected sockets and removes disconnected clients.
- **TCP message framing:** Uses newline-delimited messages to handle TCP's byte-stream nature.

## Tech Stack

- Node.js
- TypeScript
- `node:net` — Built-in TCP networking module
- Netcat (`nc`) — Terminal TCP client

No external runtime dependencies are required.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/akasr/relay
cd relay
```

### 2. Install dependencies

This project uses pnpm (pinned in `package.json`), so use pnpm rather than npm:

```bash
corepack enable
pnpm install
```

### 3. Start the server

The start script builds the project and starts the server:

```bash
pnpm start
```

The server listens on `127.0.0.1:3000`.

## Connecting Clients

Open separate terminal windows and connect using Netcat:

```bash
nc 127.0.0.1 3000
```

Each client will be prompted to enter a nickname.

Once connected, clients can exchange messages.

### Available Commands

| Command | Description |
|---|---|
| `/who` | List connected users |
| `/help` | Show available commands |
| `/quit` | Disconnect from the server |

## Concepts Explored

This project was built to gain practical experience with networking and concurrent I/O.

- TCP connection establishment and lifecycle
- TCP streams and message framing
- Socket programming with Node.js
- Event-driven, non-blocking I/O
- Managing multiple client connections
- Broadcasting data across sockets
- Connection cleanup and resource management
- TCP half-close and graceful disconnection

## Project Status

**Version 1.0.0 — Basic chat server implemented.**

The current version provides core multi-client chat functionality. Future development will focus on robustness, backpressure handling, improved protocol design, graceful server shutdown, and testing.

## License

MIT