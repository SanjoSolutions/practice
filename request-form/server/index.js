import express from 'express'

const app = express()

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.post('/submit', function (request, response) {
  console.log('request:', request.body.request)
  response.write('Received ;-).')
  response.end()
})

app.listen(8080)
