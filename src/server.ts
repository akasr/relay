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

function newConnection(socket: net.Socket) {
    console.log('Client connected');

    socket.on('end', () => {
        console.log('EOF');
    });

    socket.on('data', (data: Buffer) => {
        console.log('Received:', data.toString());
        socket.write('Message Received!\n');

        if (data.includes('exit')) {
            console.log('closing connection');
            socket.end();
        }
    });
}