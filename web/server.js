const axios = require('axios');
const express = require('express');
const cors = require('cors');
const Redis = require('redis');

const DEFAULT_EXPIRATION = 3600;

const client = Redis.createClient({
  legacyMode: true,
  url: process.env.REDIS_URL
});

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  return res.json({ message: "Hello World" })
})

app.get('/photos', async (req,res) => {
  const albumId = req.query.albumId;
  try {
    client.get('photos'+albumId.toString(), async (error, photos) => {
      if(error) {
        throw error;
      }
      if(photos) {
        res.json(JSON.parse(photos));
      } else {
        const { data } = await axios.get('https://jsonplaceholder.typicode.com/photos',
        { params: { albumId }})
        
        client.hset('photos'+albumId.toString(), DEFAULT_EXPIRATION, JSON.stringify(data));
        res.json(data);
      }
    })
  } catch (error) {
    console.log(error, 'ERROR!!!')
  }
})

app.get('/photos/:id', async (req,res) => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/photos/' + req.params.id);
  res.json(data);
})

app.listen(3000, () => {
  console.log('server running on port 3000!!!');
  client.connect().then(() => {
    console.log('connected to redis')
  }).catch((error) => {
    console.log('could not connect', error)
  })
})