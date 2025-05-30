import React from 'react'
import CardLayout from './CardLayout'
import moment from 'moment'
import { weatherCodesMapping } from '../../utils'

export default function DayForeCastCard({date, data}) {
  return  <CardLayout>
    <div className="day-forecast-container">
        <p className='label-18'>{moment(date).format("dddd")}</p>
        <p className="text-blue">{moment(date).format("MMM DD")}</p>
        <img src={weatherCodesMapping[data.weatherCode].img}
             width={48}
             height={48} />
        <p className='label-18'>{data.weatherCondition}</p>
        <p className='temp-range'>
           
            {Math.floor(data.temperature2mMin)} - {" "} 
            {Math.floor(data.temperature2mMax)} ℃
        </p>
    </div>
  </CardLayout>
}
