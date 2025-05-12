import Header  from "./components/Header";
import DefaultScreen from "./components/DefaultScreen";
import "./style/index.css";
import {fetchWeatherApi} from "openmeteo";
import { useEffect, useState } from "react";
import {weatherCodesMapping} from "./utils.js";
import SearchResult from "./components/SearchResult.jsx";

export default function App() {

  const [dailyForeCast, setDailyForeCast] = useState(null)
  const [hourlyForeCast, setHourlyForeCast] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [showResultScreen, setShowResultScreen] = useState();
  const [foreCastLocation, setForeCastLocation] = useState({
    label: "ladakh",
    lat: 34.194,
    long: 75.894,
  })

  // Filter the Closet Time
  function filterAndFlagClosetTime(data){
  
    const currentDate = new Date();
    // console.log(currentDate);

    const entries = Object.entries(data);
    // console.log(entries);
    const todayData = entries.filter(([dateString]) => {

      // Converting the date from String format to Date format
      const date = new Date(dateString); 

      return(
        date.getDate() === currentDate.getDate() && 
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    });
    console.log(todayData);

    // Initialization of the time with the first array element
    let closetTimeIndex = 0;
    let closetTimeDiff = Math.abs(currentDate - new Date(todayData[0][0]));
    console.log("check ",closetTimeDiff);

    // Lets find the closet time
    todayData.forEach(([dateString], index) => {
      const timeDiff = Math.abs(currentDate - new Date(dateString));

      if(timeDiff < closetTimeDiff){
        closetTimeDiff = timeDiff;
        closetTimeIndex = index;
      }
    });

    const result = todayData.map(([dateString, values], index) => ({
      date: dateString,
      values, 
      isClosetTime: index === closetTimeIndex,
    }));
    console.log(result);
    
    return result;
  }
  // Data Fetching

  function processData(hourly, daily){

    function convertTimeToObjectArray(times, values){
      // console.log(times);
      // console.log(values);

      // Early return if no data
      if(!times || !values || !values.weatherCode){
        return {};
      }

      // creating this empty obj -> to add new data inside this
      const obj = {};

      // times is an array, so we want to distribute the data inside 1 object according to the time
      times.forEach((time, timeIndex) => {

        if(!time) return;

        // everytime forEach() runs this weatherProperties changes -> it'll take, arrange & push the data towards object
        // object will take data & weatherCode mapping
        const weatherProperties = {};

        // it'll have each 1 property
        Object.keys(values).forEach((property) =>{  
          //this is Gaurd Clause-> if i'm clearing the items, before it should ask YES or NO
          if(values[property] && values[property][timeIndex] !== undefined){ 
              weatherProperties[property] = values[property][timeIndex];
          }
        });

        //if this (values.weatherCode) is undefined then it'll search for this [timeIndex]
        const weatherCode = values.weatherCode?.[timeIndex];

        //if this [weatherCodeMapping[weatherCode] is undefined then it'll search for this [label]
        const weatherCondition = weatherCodesMapping[weatherCode]?.label;

        obj[time] = {...weatherProperties, weatherCondition};
      });      
      // console.log(obj);      
      return obj;
    }

    const dailyData = convertTimeToObjectArray(daily.time,{
      weatherCode: daily.weatherCode,
      temperature2mMax: daily.temperature2mMax,
      temperature2mMin: daily.temperature2mMin,
      apparentTemperatureMax: daily.apparentTemperatureMax,
      apparentTemperatureMin: daily.apparentTemperatureMin,
      sunset: daily.sunset,
      sunrise: daily.sunrise,
      uvIndexMax: daily.uvIndexMax,
      precipitationSum: daily.precipitationSum,
      windSpeed10mMax: daily.windSpeed10mMax,
      windDirection10mDominant: daily.windDirection10mDominant,
    });

    // console.log(dailyData);
    

    const hourlyFormatted = convertTimeToObjectArray(hourly.time, {
      temperature2m: hourly.temperature2m, 
      visibility: hourly.visibility, 
      windDirection10m: hourly.windDirection10m, 
      apparentTemperature: hourly.apparentTemperature, 
      precipitationSum: hourly.precipitation_probability, 
      humidity: hourly.humidity, 
      windSpeed: hourly.windSpeed, 
      weatherCode: hourly.weatherCode,
    });
    
     console.log(hourlyFormatted);

     const hourlyData = filterAndFlagClosetTime(hourlyFormatted);
    return{
      dailyData,
      hourlyData,
    };
  }

  const fetchWeather = async (lat, lon, switchResultScreen) => {
    const params = {
      // ?? -> Nullish Operator -> returns its right-hand side operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand.
      latitude: lat ?? 34.194, // if lat is not there, consider 34.194 as constant/static value
      longitude: lon ?? 75.894,
      hourly:["temperature_2m", 
              "weather_code", 
              "visibility", 
              "wind_direction_10m", 
              "apparent_temperature", 
              "precipitation_probability", 
              "relative_humidity_2m", 
              "wind_speed_10m",],
      daily: ["weather_code", 
              "temperature_2m_max", 
              "temperature_2m_min", 
              "apparent_temperature_max", 
              "apparent_temperature_min", 
              "sunset", 
              "sunrise", 
              "uv_index_max",
              "precipitation_sum",
              "wind_speed_10m_max",
              "wind_direction_10m_dominant",
            ], 
            timezone: "auto"
    };

    const url = 'https://api.open-meteo.com/v1/forecast';
    // fetching the data according to the parameter we are setting
    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges -> it's for hourly data
    const range = (start, stop, step) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
    
    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    // console.log(response);
    
    
    // Attributes for timezone and location -> It'll De-buffer the code
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly();
    const daily = response.daily();  

    // console.log(hourly, daily);
    

    const weatherData={
      hourly:{
              time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(t => new Date((t + utcOffsetSeconds) * 1000)),
              temperature2m: hourly.variables(0).valuesArray(), 
              weatherCode: hourly.variables(1).valuesArray(),       
              visibility: hourly.variables(2).valuesArray(), 
              windDirection10m: hourly.variables(3).valuesArray(), 
              apparentTemperature: hourly.variables(4).valuesArray(), 
              precipitationProbability: hourly.variables(5).valuesArray  (), 
              humidity: hourly.variables(6).valuesArray(), 
              windSpeed: hourly.variables(7).valuesArray(),
      },
      
      daily:{
        time: range( Number(daily.time()), Number(daily.timeEnd()), daily.interval() ).map((t) => new Date((t + utcOffsetSeconds) * 1000)), 
        weatherCode: daily.variables(0).valuesArray(), 
        temperature2mMax: daily.variables(1).valuesArray(), 
        temperature2mMin: daily.variables(2).valuesArray(), 
        apparentTemperatureMax: daily.variables(3).valuesArray(), 
        apparentTemperatureMin: daily.variables(4).valuesArray(), 
        sunset: daily.variables(5).valuesArray(), 
        uvIndexMax: daily.variables(6).valuesArray(), 
        precipitationSum: daily.variables(7).valuesArray(), 
        windSpeed10mMax: daily.variables(8).valuesArray(), 
        windDirection10mDominant: daily.variables(9).valuesArray(), 
        sunrise: daily.variables(10).valuesArray(),
      },
    };


    // console.log(weatherData);

    const {hourlyData, dailyData} = processData(weatherData.hourly, weatherData.daily);

    setHourlyForeCast(hourlyData);
    setDailyForeCast(dailyData);
    setDataLoading(false);

    if(switchResultScreen){
      setShowResultScreen(true);
    }
  
  };

  useEffect(() => {
    setDataLoading(true);
    fetchWeather();
  }, []);

  // function passed to child and called when any option from the suggestions is clicked
  const clickHandler = (searchItem) =>{
    setDataLoading(true);
    setForeCastLocation({
      label: searchItem.label,
      lat: searchItem.lat,
      lon: searchItem.lon,
    });

    fetchWeather(searchItem.lat, searchItem.lon, true);
  }

  return (
    <div className="app">
        <Header /> 
        {
          !dataLoading && !showResultScreen && (
            <DefaultScreen currentWeatherData={
                                hourlyForeCast?.length 
                                ? hourlyForeCast.filter((hour) => hour.isClosetTime)
                                : []
                            }
              foreCastLocation={foreCastLocation}
              onHandleClick = {clickHandler}
              />
          )
        }
        {showResultScreen && !dataLoading && (
          <SearchResult dailyForeCast={dailyForeCast} 
                        foreCastLocation={foreCastLocation}
                        currentWeatherData={
                            hourlyForeCast?.length 
                            ? hourlyForeCast.filter((hour) => hour.isClosetTime)
                            : []                          
                          }                        
          />
        )}
        <p className="copyright-text">&copy; 2025 WSA. All Rights Reserved</p>
    </div>
  )
}
 