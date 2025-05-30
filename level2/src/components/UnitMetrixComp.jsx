import React from 'react'
import CardLayout from './ui/CardLayout';
import SunMini from "../assets/images/sun-mini.svg";

export default function UnitMetrixComp({ label, value, unit}) {
  return (
    <CardLayout className="unit-metrix-main-div flex items-start">
        <img src={SunMini} style={{paddingTop: "2px"}} />
        <div>
            <p className="label-18 uppercase">
                {label}
            </p>
            <p className="label-18 font-30">
                {value} {unit}
            </p>
        </div>
    </CardLayout>

  )
}
