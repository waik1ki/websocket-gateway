import { createServer } from './server';

const PORT = process.env.PORT ?? 3000;
const server = createServer();

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Server listening on wss://localhost:${PORT}`);
});