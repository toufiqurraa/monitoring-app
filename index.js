const http = require('http')
const { StringDecoder } = require('string_decoder')
const url = require('url')

const server = http.createServer(function (req, res) {
  // get the url and parse it
  const parseUrl = url.parse(req.url, true)

  // get the path
  const path = parseUrl.pathname

  // send the response

  // get the http method
  const method = req.method.toLowerCase()

  // parse query string
  const queryString = parseUrl.query

  // parse headers
  const headers = req.headers

  // parse payloads using utf-8 decoder
  const decoder = new StringDecoder('utf-8')

  let buffer = 'this is prewritten in buffer '

  req.on('data', function (data) {
    buffer += decoder.write(data)
  })

  req.on('end', function () {
    buffer += decoder.end()

    // chosen handler
    const chosen = typeof router[path] !== 'undefined' ? router[path] : handler.notFound

    // construct the data object to send to the handler
    const data = {
      path: path,
      queryString: queryString,
      method: method,
      headers: headers,
      payload: buffer
    }

    // route the request to the handler specified in the router
    chosen(data, function (statusCode, payload) {
      // use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == 'number' ? statusCode : 200

      // use the payload called back by the handler, or default to an empty object
      payload = typeof payload == 'object' ? payload : {}

      // convert the payload to a string
      const payloadString = JSON.stringify(payload)

      res.writeHead(statusCode)

      res.end(payloadString)

      console.log('status code & payload ' + statusCode, payloadString)
    })

    console.log(buffer)
  })
})

server.listen(3000, function () {
  console.log('The server is listening on port 3000 now')
})

// define the handlers
const handler = {}

// define the sample handler
handler.sample = function (data, callback) {
  // callback a http status code and a payload object
  callback(406, { name: 'sample handler' })
}

// define the not found handler
handler.notFound = function () {}

// define a request router
const router = {
  sample: handler.sample
}
