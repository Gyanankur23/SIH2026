import axios from 'axios';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
  }

  async getCurrentWeather(location: string) {
    try {
      if (!this.apiKey) {
        console.log('OpenWeather API key not configured, using mock data');
        return this.getMockWeatherData(location);
      }

      // Geocode location to get coordinates
      const geoResponse = await axios.get(
        `${OPENWEATHER_BASE_URL}/weather`,
        {
          params: {
            q: location,
            appid: this.apiKey,
            units: 'metric'
          }
        }
      );

      const weather = geoResponse.data;

      return {
        location: weather.name,
        temperature: weather.main.temp,
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        windSpeed: weather.wind.speed,
        windDirection: weather.wind.deg,
        visibility: weather.visibility,
        weather: {
          main: weather.weather[0].main,
          description: weather.weather[0].description,
          icon: weather.weather[0].icon
        },
        clouds: weather.clouds.all,
        timestamp: new Date().toISOString(),
        coordinates: {
          lat: weather.coord.lat,
          lon: weather.coord.lon
        }
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return this.getMockWeatherData(location);
    }
  }

  async getForecast(location: string, days: number = 5) {
    try {
      if (!this.apiKey) {
        return this.getMockForecastData(location, days);
      }

      const response = await axios.get(
        `${OPENWEATHER_BASE_URL}/forecast`,
        {
          params: {
            q: location,
            appid: this.apiKey,
            units: 'metric',
            cnt: days * 8 // 8 forecasts per day (3-hour intervals)
          }
        }
      );

      const forecasts = response.data.list.map((item: any) => ({
        datetime: new Date(item.dt * 1000).toISOString(),
        temperature: item.main.temp,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        windSpeed: item.wind.speed,
        windDirection: item.wind.deg,
        weather: {
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        },
        clouds: item.clouds.all,
        precipitation: item.rain?.['3h'] || item.snow?.['3h'] || 0
      }));

      // Group by day and get daily averages/summaries
      const dailyForecasts = this.groupForecastsByDay(forecasts);

      return {
        location: response.data.city.name,
        forecasts: dailyForecasts,
        extremeWeather: this.detectExtremeWeather(dailyForecasts),
        droughtRisk: this.assessDroughtRisk(dailyForecasts),
        floodRisk: this.assessFloodRisk(dailyForecasts)
      };
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return this.getMockForecastData(location, days);
    }
  }

  private groupForecastsByDay(forecasts: any[]): any[] {
    const grouped = new Map();

    forecasts.forEach(forecast => {
      const date = forecast.datetime.split('T')[0];
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date).push(forecast);
    });

    return Array.from(grouped.entries()).map(([date, dayForecasts]) => {
      const temps = dayForecasts.map((f: any) => f.temperature);
      const precip = dayForecasts.reduce((sum: number, f: any) => sum + f.precipitation, 0);

      return {
        date,
        temperature: {
          min: Math.min(...temps),
          max: Math.max(...temps),
          avg: temps.reduce((sum: number, t: number) => sum + t, 0) / temps.length
        },
        humidity: dayForecasts[0].humidity,
        precipitation: precip,
        weather: dayForecasts[0].weather,
        windSpeed: dayForecasts[0].windSpeed
      };
    });
  }

  private detectExtremeWeather(forecasts: any[]): boolean {
    return forecasts.some(f => 
      f.temperature.max > 40 || // Extreme heat
      f.temperature.min < 5 ||  // Extreme cold
      f.precipitation > 50 ||   // Heavy rain
      f.weather.main === 'Storm' ||
      f.weather.main === 'Hurricane'
    );
  }

  private assessDroughtRisk(forecasts: any[]): boolean {
    const recentPrecip = forecasts.slice(0, 7).reduce((sum, f) => sum + f.precipitation, 0);
    const forecastPrecip = forecasts.reduce((sum, f) => sum + f.precipitation, 0);
    
    return recentPrecip < 10 && forecastPrecip < 20;
  }

  private assessFloodRisk(forecasts: any[]): boolean {
    return forecasts.some(f => f.precipitation > 80); // Very heavy rainfall
  }

  private getMockWeatherData(location: string) {
    // Generate realistic mock weather data
    const baseTemp = 25 + Math.random() * 10;
    
    return {
      location,
      temperature: parseFloat(baseTemp.toFixed(1)),
      humidity: Math.floor(50 + Math.random() * 30),
      pressure: Math.floor(1000 + Math.random() * 20),
      windSpeed: parseFloat((Math.random() * 15).toFixed(1)),
      windDirection: Math.floor(Math.random() * 360),
      visibility: 10000,
      weather: {
        main: ['Clear', 'Clouds', 'Rain', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        description: 'Mock weather data - configure API key for real data',
        icon: '01d'
      },
      clouds: Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString(),
      coordinates: {
        lat: 19.0 + Math.random() * 2,
        lon: 73.0 + Math.random() * 2
      },
      note: 'This is mock weather data. Configure OpenWeather API key for real data.'
    };
  }

  private getMockForecastData(location: string, days: number) {
    const forecasts = [];
    const currentDate = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);

      const baseTemp = 25 + Math.random() * 10;
      const precip = Math.random() > 0.7 ? Math.random() * 30 : 0;

      forecasts.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          min: parseFloat((baseTemp - 5).toFixed(1)),
          max: parseFloat((baseTemp + 5).toFixed(1)),
          avg: parseFloat(baseTemp.toFixed(1))
        },
        humidity: Math.floor(50 + Math.random() * 30),
        precipitation: parseFloat(precip.toFixed(1)),
        weather: {
          main: precip > 10 ? 'Rain' : ['Clear', 'Clouds', 'Partly Cloudy'][Math.floor(Math.random() * 3)],
          description: 'Mock forecast data'
        },
        windSpeed: parseFloat((Math.random() * 15).toFixed(1))
      });
    }

    return {
      location,
      forecasts,
      extremeWeather: false,
      droughtRisk: false,
      floodRisk: false,
      note: 'This is mock forecast data. Configure OpenWeather API key for real data.'
    };
  }
}
