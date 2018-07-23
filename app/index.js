/*
 * A simple Node HTTP server that has a Hello World API
 */

const http = require('http');
const url = require('url');
const config = require('./config');
const StringDecoder = require('string_decoder').StringDecoder;

const httpServer = http.createServer((req, res) => {

  // get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let payload = '';
  req.on('data', data => {
    payload += decoder.write(data);
  });
  req.on('end', () => {
    payload += decoder.end();

    // Choose the handler this request should go to
    // If one is not found, use the notfound handler
    const chosenHandler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handlers.notfound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or use default 200
      statusCode = typeof statusCode == 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or use default {}
      payload = typeof payload == 'object' ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log('Request this response', statusCode, payload);
    });
  });

});

httpServer.listen(config.port, () => {
  console.log(`Server is in ${config.mode} mode listening on ${config.host}:${config.port}`);
});

// Define the handlers
const handlers = {};

// Hello handler
handlers.hello = (data, callback) => {
  callback(200, {
    message: 'Welcome to Hello World API'
  });
};

// Not found handler
handlers.notfound = (data, callback) => {
  // Callback a http status code, and a payload object
  callback(404);
};

// Define a request router
const router = {
  hello: handlers.hello
};
