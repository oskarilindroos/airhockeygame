# Airhockeygame

> Multiplayer air hockey game

## Contributors

- [Oskari Lindroos](https://github.com/oskarilindroos)
- [Juuso Finne](https://github.com/juuso-finne)
- [Vertti Keski-Säntti](https://github.com/VerttiKS)
- [Janne Salovaara](https://github.com/Jondels21)
- [Eero Savukoski](https://github.com/Erskari)

## Project information

This project is a multiplayer 1v1 air hockey browser game. The online component is implemented using websockets.

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

## Development instructions

1. Clone the repository
2. Run `npm install` in both the client and server directories to install dependencies
3. Run `npm run dev` in the server directory to start the server
4. Run `npm run dev` in the client directory to start the client
5. The client should now be running on `localhost:5147` and the server on `localhost:5000` (or the ports specified in the `.env.development` files)

**NOTE:** The socket.io admin panel can be accessed at [admin.socket.io](https://admin.socket.io) when the server is running. This can be used to monitor the server's socket connections.

## Build instructions

TBD

### Deployment

TBD
