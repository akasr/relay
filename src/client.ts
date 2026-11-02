import net from 'node:net';

const client = net.createConnection({
    port: 3000,
    host: '127.0.0.1'
});