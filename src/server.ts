import net from "node:net";

const server = net.createServer();

server.on("connection", newConnection);
server.on("error", (err) => {
    throw err;
});

server.listen({
    host: "127.0.0.1",
    port: 3000,
});

const connections: Set<net.Socket> = new Set();
const clients: Map<net.Socket, string> = new Map();
const nicknames: Set<string> = new Set();

function newConnection(socket: net.Socket) {
    connections.add(socket);
    socket.write("Enter your nickname: ");

    console.log("No. of connected clients:", connections.size);

    const removeClient = () => {
        const nickname = clients.get(socket);

        connections.delete(socket);
        if (nickname) {
            clients.delete(socket);
            nicknames.delete(nickname);
        }

        console.log("Client disconnected");
        console.log("Connected clients:", connections.size);
    };

    socket.on("close", removeClient);

    let buffer = "";

    socket.on("data", (chunk: Buffer) => {
        buffer += chunk.toString();

        while (true) {
            const newlineIndex = buffer.indexOf("\n");
            if (newlineIndex === -1) return;

            const rawMessage = buffer.slice(0, newlineIndex).replace(/\r$/, "");
            buffer = buffer.slice(newlineIndex + 1);

            const message = rawMessage.trim();

            if (message === "exit") {
                socket.end();
                return;
            }

            if (clients.has(socket)) {
                const nickname = clients.get(socket)!;
                broadcast(`[${nickname}]: ${message}\n`);
                continue;
            }

            if (!message) {
                socket.write("nickname cannot be empty. Try again: ");
                continue;
            }

            const normalized = message.toLowerCase();

            if (nicknames.has(normalized)) {
                socket.write("Nickname already in use. Choose another: ");
                continue;
            }

            clients.set(socket, normalized);
            nicknames.add(normalized);

            socket.write(`Welcome, ${message}\n`);
            broadcast(`[Server]: ${message} joined.\n`);
        }
    });
}

function broadcast(message: string) {
    for (const client of clients.keys()) {
        client.write(message);
    }
}
