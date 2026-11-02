import net from 'node:net';

const server = net.createServer();

server.on('connection', newConnection);
server.on('error', (err) => {
    throw err;
});

server.listen({
    host: '127.0.0.1',
    port: 3000,
});

const connections: Set<net.Socket> = new Set();

function newConnection(socket: net.Socket) {
    connections.add(socket);
    console.log('No. of connected clients:', connections.size);

    socket.on('end', () => {
        console.log('EOF');
    });

    socket.on('close', () => {
        connections.delete(socket);
        console.log('Client disconnected');
        console.log('Connected clients:', connections.size);
    });

    let buffer = "";
    socket.on('data', (data: Buffer) => {
        buffer += data.toString();
        const socketId = `${socket.remoteAddress}:${socket.remotePort}`;

        let newlineIndex: number;
        while((newlineIndex = buffer.indexOf('\n')) !== -1) {
            const message = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);

            if (message.trim() === 'exit') {
                socket.end();
                return;
            }

            for (const connection of connections) {
                if (connection != socket) {
                    connection.write(`${socketId}: ${message}\n`);
                }
            }
        }
    });
}