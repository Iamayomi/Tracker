const express = require('express');
const app = express();
const axios = require('axios');

app.set('trust proxy', true);

app.use(express.json());

app.get('/tracker/api/hello?visitor_name=Mark',  async function (req, res) {
	try {
const getIp = await axios.get(`https://api.ipify.org?format=json`);
       const ip = getIp.data.ip;

       const getLocation = await axios.get(`http://ip-api.com/json/${ip}`);

       const { status, lat, lon, city } = getLocation.data;

       if(status !== 'success'){
       	  return res.status(400).json({ error: 'could not fetch location data'});
       };

       const getWeather = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_KEY}&q=${lat},${lon}`);

       const clientData = { };

       clientData.client_ip = ip;
       clientData.location = city;
       clientData.greeting = `Hello, ${req.query.visitor_name}, the temperature is ${getWeather.data.current.temp_c} degrees Calcius in ${city}`;

       res.status(200).json({
       	  status: "success",
       	  data: clientData
       })

	} catch(err){
		res.status(500).send(err.message)
	}
});

module.exports = app;
