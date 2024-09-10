const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the port and the directory for static files
const port = 3330;
const staticDirectory = path.join(__dirname, './');

// Helper function to get the content type based on the file extension
const getContentType = (filePath) => {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
      return 'image/jpg';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'text/plain';
  }
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow GET, POST, OPTIONS methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header

  // Handle OPTIONS method for preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No content
    res.end();
    return;
  }

  let filePath = path.join(staticDirectory, req.url === '/' ? 'index.html' : req.url);

  // Set default content type and status code
  const contentType = getContentType(filePath);
  let statusCode = 200;

  // Read and serve the requested file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found, serve 404 page
        fs.readFile(path.join(staticDirectory, '404.html'), (err404, content404) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content404 || '404 Not Found', 'utf-8');
        });
      } else {
        // Other server errors
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Serve the file
      res.writeHead(statusCode, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

