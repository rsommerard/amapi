const express = require('express')
const app = express()

const port = process.env.PORT || 3000

const axios = require('axios')
const cheerio = require('cheerio')

// https://play.google.com/store/apps/details?id=com.google.android.finsky
app.get('/details/:id', (req, res) => {
  const id = req.params.id

  axios.get(`https://play.google.com/store/apps/details?id=${id}`).then(response => {
    const $ = cheerio.load(response.data)
    const category = $('a.category span[itemprop=genre]').text()

    res.status(response.status)
    res.json({id: id, category: category})
  }).catch(error => {
    console.log({error})
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status)
      res.send('Response error ' + error.message)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      res.status(500)
      res.send('Request error ' + error.message)
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500)
      res.send('Error ' + error.message)
    }
  })
})

app.get('/status', function (req, res) {
  res.sendStatus(200)
})

app.listen(port, function () {
  console.log('Example app listening on http://localhost:' + port + '/')
})
