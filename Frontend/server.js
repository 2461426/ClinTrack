// This file is deprecated. Please use services.js instead.
// Run: node services.js to start the JSON Server

const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'data.json'));
const middlewares = jsonServer.defaults();

const PORT = 5000;

server.use(middlewares);

server.use(jsonServer.rewriter({
  '/api/trails': '/trailDetails',
  '/api/trails/:id': '/trailDetails/:id',
  '/api/participants': '/participantData',
  '/api/participants/:id': '/participantData/:id',
  '/api/pharma': '/pharmaDetails',
  '/api/pharma/:id': '/pharmaDetails/:id'
}));

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
