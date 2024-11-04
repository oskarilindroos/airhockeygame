# Airhockeygame

> Multiplayer air hockey game

## Contributors

<a href="https://github.com/oskarilindroos/airhockeygame/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=oskarilindroos/airhockeygame" />
</a>

## Project information

This project is a multiplayer 1v1 air hockey browser game built with TypeScript. The online component is implemented using websockets (socket.io).

### Technologies

#### Client

- Vite
- HTML
- CSS
- TypeScript
- Socket.io

#### Server

- Node.js
- Express
- Socket.io
- MySQL

## Deployment

The project is deployed on Oracle Cloud on a VPS running Ubuntu. The server hosts three services:

- **Client**: The game client is accessible at [www.airhockey.live](https://www.airhockey.live)
- **Server**: The game API is available at [api.airhockey.live](https://api.airhockey.live/healthcheck)
- **Nginx Proxy Manager**: Used for reverse proxy and SSL certificate management, accessible at [nginx.airhockey.live](https://nginx.airhockey.live)

## Development instructions

1. Clone the repository
2. Run `npm install` in both the client and server directories to install dependencies
3. Run `npm run dev` in the server directory to start the server
4. Run `npm run dev` in the client directory to start the client
5. The client should now be running on `localhost:5147` and the server on `localhost:5000` (or the ports specified in the `.env.development` files)

**NOTE:** The socket.io admin panel can be accessed at [admin.socket.io](https://admin.socket.io) when the server is running. This can be used to monitor the server's socket connections.

## Build instructions

1. Run `npm run build` in the client directory to build the client
2. Run `npm run build` in the server directory to build the server
