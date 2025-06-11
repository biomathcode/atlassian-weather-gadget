import Resolver from '@forge/resolver';
import { fetch } from '@forge/api'


const resolver = new Resolver();


resolver.define('getCurrentWeather', async (req) => {

  console.log(req.context.extension.gadgetConfiguration)

  if (req.context.extension.gadgetConfiguration) {
    const coord = req.context.extension.gadgetConfiguration;
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + coord.lat + "&lon=" + coord.lon + "&units=metric&appid=" + process.env.OPENWEATHER_KEY;
    const response = await fetch(url)
    if (!response.ok) {
      const errmsg = `Error from Open Weather Map Current Weather API: ${response.status} ${await response.text()}`;
      console.error(errmsg)
      throw new Error(errmsg)
    }
    const weather = await response.json()
    return weather;
  } else {
    return null;
  }

});


resolver.define('getLocationCoordinates', async (req) => {
  if (req.payload.location) {
    const config = req.payload.location;
    const url = "https://api.openweathermap.org/geo/1.0/direct?q=" + config.city + "," +
      config.country + "&limit=5&appid=" + process.env.OPENWEATHER_KEY;
    const response = await fetch(url)

    if (!response.ok) {
      const errmsg = `Error from Open Weather Map Geolocation API: ${response.status} ${await response.text()}`;
      console.error(errmsg)
      throw new Error(errmsg)
    }

    const locations = await response.json()

    return locations;
  } else {
    return null;
  }
});



export const handler = resolver.getDefinitions();