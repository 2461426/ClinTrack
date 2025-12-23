const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'data.json'));
const middlewares = jsonServer.defaults();

const PORT = 5000;

// Use default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.use(jsonServer.rewriter({
  '/api/trails': '/trailDetails',
  '/api/trails/:id': '/trailDetails/:id',
  '/api/participants': '/participantData',
  '/api/participants/:id': '/participantData/:id',
  '/api/pharma': '/pharmaDetails',
  '/api/pharma/:id': '/pharmaDetails/:id'
}));

// Use JSON Server router
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET    /api/trails - Get all trails`);
  console.log(`  GET    /api/trails/:id - Get trail by ID`);
  console.log(`  POST   /api/trails - Create new trail`);
  console.log(`  PUT    /api/trails/:id - Update trail`);
  console.log(`  PATCH  /api/trails/:id - Partially update trail`);
  console.log(`  DELETE /api/trails/:id - Delete trail`);
  console.log(`  GET    /api/participants - Get all participants`);
  console.log(`  GET    /api/participants/:id - Get participant by ID`);
  console.log(`  GET    /api/pharma - Get all pharma details`);
  console.log(`  GET    /api/pharma/:id - Get pharma by ID`);
});
