import CardLayout from "./ui/CardLayout";
import {weatherCodesMapping} from "../utils";
import moment from "moment";

export default function SevenDayForecast({dailyForecast}) {
  return (
    <CardLayout className={`seven-day-forecast-card-layout`}>
      <p className="label-18">7 Day Forecast</p>
      {/* Object.keys -> to make it as an array */}
      {Object.keys(dailyForecast)?.length > 0 && Object.keys(dailyForecast).map((day, dayInd) => {
          return ( <DayForecast day={day} 
                              key={day} 
                              dayData={dailyForecast[day]} 
                              lastDay={dayInd === 6 ? true : false}/>
                  );
      })}
    </CardLayout>
  );
}

function DayForecast({day, dayData, lastDay}){
  return (
    <div className={`flex items-center single-day justify-between ${lastDay ? "border-0" : ""}`}>
        <p style={{width: "27%"}}>{moment(day).format("dddd")}</p>
        <img src={weatherCodesMapping[dayData.weatherCode].img} 
             height={48} 
             width={48} />
        <p className="capitalize">{dayData.weatherCondition}</p>
        <p>
          {Math.floor(dayData.temperature2mMin)} -{" "}
          {Math.floor(dayData.temperature2mMax)} ℃
        </p>
    </div>

  )
}