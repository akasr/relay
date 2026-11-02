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
            broadcast(`[Server]: ${nickname} left.\n`, socket);
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

            if (message.startsWith('/')) {
                let command = message.slice(1);
                runCommand(socket, command);
                continue;
            }

            if (clients.has(socket)) {
                const nickname = clients.get(socket)!;
                broadcast(`[${nickname}]: ${message}\n`, socket);
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
            broadcast(`[Server]: ${message} joined.\n`, socket);
        }
    });
}

function broadcast(message: string, exceptSocket?: net.Socket) {
    for (const client of clients.keys()) {
        if (client !== exceptSocket) {
            client.write(message);
        }
    }
}

function runCommand(socket: net.Socket, command: string) {
    const listConnectedUsers = () => {
        let message = "Connected users:\n";
        for (const [_, nickname] of clients) {
            message += ` - ${nickname}\n`;
        }
        socket.write(message);
    }

    const listHelp = () => {
        const message = `Available commands:

/who - List connected users
/help - Show this help message
/quit - Disconnect from the server
`;
        socket.write(message);
    }

    switch(command) {
        case 'who':
            listConnectedUsers();
            break;
        case 'help':
            listHelp();
            break;
        case 'quit':
            socket.destroy();
            break;
        default:
            socket.write(`Unknown command: ${command}\n`);
            break;
    }
}