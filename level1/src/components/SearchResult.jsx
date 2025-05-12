import { weatherCodesMapping } from "../utils";
import CardLayout from "./ui/CardLayout";
import Location from "../assets/images/location.svg";
import Temperature from "../assets/images/temperature.svg";
import moment from "moment";
import Eye from "../assets/images/eye.svg";
import ThermoMini from "..//assets/images/temperature-mini.svg";
import Windy from "../assets/images/windy.svg";
import Water from "../assets/images/water.svg";
import DayForeCastCard from "./ui/DayForeCastCard";

export default function SearchResult({
                dailyForeCast,
                currentWeatherData,
                foreCastLocation,
}) {

  console.log(dailyForeCast, currentWeatherData, foreCastLocation);
  
  return (
    <div className="search-result-container-div">
      <p className="forecast-title text-capitalize">
        {currentWeatherData[0]?.values?.weatherCondition}
      </p>
      <CardLayout>
        <div className="flex items-center justify-between">
          <div style={{ width: "30%" }}>
            <img  src={weatherCodesMapping[currentWeatherData[0].values.weatherCode].img} 
                  alt="Weather Image" 
                  width={48}
                  height={48}
            />
            <div className="flex items-center">
              <img src={Location} alt="map mark" />
              <p className="city-name">{foreCastLocation?.label}</p>
            </div>
            <p className="text-blue" style={{paddingLeft:"30px"}}>
              Today {moment(currentWeatherData[0].date).format("MMM DD")}
            </p>
          </div>

          {/* Center, temp */}
          <div className="temp-container" style={{width: "auto"}}>
            <img src={Temperature} className="thermometer-img" />
            <div>
              <p style={{fontSize: "144px"}}> 
                {parseFloat(currentWeatherData[0].values?.temperature2m).toFixed(0)} 
              </p>
              <p>
              {currentWeatherData[0]?.values?.weatherCondition}
              </p>
            </div>
            <p style={{fontSize: "24px", alignSelf: "start", paddingTop: "45px"}}>℃</p>
          </div>

          <div>
            <div style={{display: "flex", alignItems: "center", width: "100%", columnGap: "16px",}}>
                <div className="weather-info-subtitle">
                  <div className="flex">
                    <img src={Eye} alt="eye" />
                    <p className="weather-params-label">Visibility</p>
                  </div>
                
                  <p>{Math.floor(currentWeatherData[0].values?.visibility / 1000)} km</p>
                </div>
                <p>|</p>
                <div className="weather-info-subtitle">
                  <div className="flex">
                    <img src={ThermoMini}  />
                    <p className="weather-params-label">Feels like</p>
                  </div>
                  <p>{Math.floor(currentWeatherData[0].values?.apparentTemperature)} ℃</p>
                </div>
            </div>


            <div style={{display: "flex", alignItems: "center", width: "100%", columnGap: "16px", marginTop: "24px"}}>
                  <div className="weather-info-subtitle">
                    <div className="flex">
                      <img src={Water} alt="water" />
                      <p className="weather-params-label">Humidity</p>
                    </div>
                  
                    <p>{Math.floor(currentWeatherData[0].values?.humidity)}{" "} %</p>
                  </div>
                  <p>|</p>
                  <div className="weather-info-subtitle">
                    <div className="flex">
                      <img src={Windy}  />
                      <p className="weather-params-label">Wind </p>
                    </div>
                    <p>{Math.floor(currentWeatherData[0].values?.windSpeed)}{" "} km/hr</p>
                  </div>
            </div>
          </div>
        </div>
      </CardLayout>

      {/* 7 Cards -> Day ForeCast Card */}
      <div className="flex justify-between daily-forecast-section"
            style={{marginTop:"24px", columnGap: "12px"}}
      >
        {/* Converting Objects into Arrays */}
          {Object.keys(dailyForeCast)?.length > 0 
            && Object.keys(dailyForeCast).map((day) => (
              <DayForeCastCard keys={day}
                                data={dailyForeCast[day]}
                                date={day}/>
           ))}
      </div>      
    </div>
  )
}
