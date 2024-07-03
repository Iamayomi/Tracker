const express = require('express');
const app = express();
const axios = require('axios');

app.set('trust proxy', true);

app.use(express.json());

app.get('/getclientData/api/hello',  async function (req, res) {
	try {
       const ip = req.headers['x-forwarded-for'].split(',')[0] || req.connection.remoteAddress;

       const getLocation = await axios.get(`http://ip-api.com/json/${ip}`);

       const { status, lat, lon, city } = getLocation.data;

       if(status !== 'success'){
       	  return res.status(400).json({ error: 'could not fetch location data'});
       };

       const getWeather = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_KEY}&q=${lat},${lon}`);

      
       res.status(200).json({
       	  client_ip: ip,
          location: city,
          greeting: `Hello, ${req.query.visitor_name}, the temperature is ${getWeather.data.current.temp_c} degrees Calcius in ${city}`
       })

	} catch(err){
		res.status(500).send(err.message)
	}
});

module.exports = app;
