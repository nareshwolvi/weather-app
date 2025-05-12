import CardLayout from "./ui/CardLayout";
import Cloud from "../assets/images/cloud.svg";
import Search from "../assets/images/search.svg";
import Sun from "../assets/images/sun.svg";
import Temperature from "../assets/images/temperature.svg"
import Eye from "../assets/images/eye.svg";
import Thermomini from "../assets/images/temperature-mini.svg";
import Water from "../assets/images/water.svg";
import Windy from "../assets/images/windy.svg";
import { weatherCodesMapping } from "../utils";
import moment from "moment";
import { useEffect, useState } from "react";

export default function DefaultScreen({ currentWeatherData, foreCastLocation, onHandleClick}) {
    
    const [searchCity, setSearchCity] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const fetchSuggestions = async function(label) {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search.php?q=${label}&accept-language=en-US%2Cen&format=jsonv2`
        );
        const datas = await response.json();
        // console.log(datas[1].display_name);
        const tempSuggestions = [];
        datas.forEach(data =>{
            tempSuggestions.push({
                    label: data?.display_name,
                    lat: data.lat,
                    lon: data.lon,
                });
        })

        setSuggestions(tempSuggestions);
    };

    useEffect(() => {
        // fetchSuggestions(searchCity);

        // TO HANDLE RACE CONDITION -> write timeOut function 
        const timeout = setTimeout(() => {
            fetchSuggestions(searchCity);
        }, 500);
        
        // Clear the timeOut
        return () => {
            clearTimeout(timeout);
        }
    }, [searchCity]);

//   console.dir(weatherCodesMapping[currentWeatherData[0].values.weatherCode]);
    
  return (
    <div className="home-main-div">
      <div className="default-home-container">
        <CardLayout>
        {/* Gaurd Clause */}
         {currentWeatherData?.length && currentWeatherData[0] && (
               <>
               {/* Place, Sunny, Day, Date */}
               <div className="default-card-city">
                   <img src={Sun} alt="Sunny" />
                   <div>
                       <p className="city-name">{foreCastLocation?.label}</p>
                       <p className="date-today">{moment(currentWeatherData[0]?.date).format("ddd DD/MM/YYYY")}</p>
                   </div>
               </div>
   
               {/* Temperatur Container */}
               <div className="temp-container">
                   <img src={Temperature} className="thermometer-img" />
                   <div>
                       <p style={{fontSize: "144px"}}>{parseFloat(currentWeatherData[0]?.values?.temperature2m).toFixed(0)}</p>
                       <p className="text-capitalize">{currentWeatherData[0]?.values?.weatherCondition}</p>
                   </div>
                   <p style={{fontSize:"24px",
                               alignSelf:"start",
                               paddingTop:"45px",
                   }}>℃</p>
               </div>
   
               {/* Visibility and Feels Like */}
               <div style={{
                   display:"flex",
                   alignItems:"center",
                   marginTop:"60px",
                   width:"100%",
                   columnGap:"16px"
               }}>
                       <div className="weather-info-subtitle">
                           <div className="flex">
                               <img src={Eye} alt="" />
                               <p className="weather-params-label">Visibility</p>
                           </div>
                           <p>{Math.floor(currentWeatherData[0]?.values?.visibility / 1000)} {" "}km</p>
                       </div>
                       <p> | </p>
                       <div className="weather-info-subtitle">
                           <div className="flex">
                               <img src={Thermomini} alt="" />
                               <p className="weather-params-label">Feels Like</p>
                           </div>
                           <p>{Math.floor(currentWeatherData[0]?.values?.apparentTemperature)}℃</p>
                       </div>
               </div>
   
               {/* Humidity and Wind */}
               <div style={{
                   display:"flex",
                   alignItems:"center",
                   marginTop:"60px",
                   width:"100%",
                   columnGap:"16px"
               }}>
                       <div className="weather-info-subtitle">
                           <div className="flex">
                               <img src={Water} alt="" />
                               <p className="weather-params-label">Humidity</p>
                           </div>
                           <p>{Math.floor(currentWeatherData[0]?.values?.humidity)}%</p>
                       </div>
                       <p> | </p>
                       <div className="weather-info-subtitle">
                           <div className="flex">
                               <img src={Windy} alt="" />
                               <p className="weather-params-label">Wind</p>
                           </div>
                           <p>{Math.floor(currentWeatherData[0]?.values?.windSpeed)}km/h</p>
                       </div>
               </div>
               </>
         )}
        </CardLayout>

        {/* Search Card Layout */}
        <CardLayout>
            <div className="search-card">

                {/* Cloud Image */}
                <div className="flex justify-center">
                    <img src={Cloud} alt="cloud image" />
                </div>
                 {/* Search Icon and input tag */}
            <div className="search-city-container city-results">
                <img src={Search} className="search-icon" />
                {/* controlled element */}
                <input  type="text" 
                        className="city-input" 
                        placeholder="Search City"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        />
            </div>
             {/* Suggestions */}
             <div className="search-city-suggestions">
                {suggestions?.length > 0 && suggestions.map((suggestion, suggestionIndex) => 
                    suggestionIndex < 4 
                    ?   (<p    className="suggested-label" 
                            key={suggestionIndex}
                            onClick={() => onHandleClick(suggestion)}
                         >
                        {suggestion.label}
                        </p>) 

                    : null
                )}
            </div>
            </div>           
        </CardLayout>
      </div>
    </div>
  )
}
