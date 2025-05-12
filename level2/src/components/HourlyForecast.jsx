import React, { useState } from 'react';
import RightNav from "../assets/images/right-nav.svg";
import LeftNav from "../assets/images/left-nav.svg";
import RightNavGray from "../assets/images/right-nav-gray.svg";
import LeftNavGray from "../assets/images/left-nav-gray.svg";
import CardLayout from './ui/CardLayout';
import HourComp from './HourComp';

export default function HourlyForecast({hourlyData}) {

  const [disableLeftNavigation, setDisableLeftNavigation ] = useState(true);
  const [disableRightNavigation, setDisableRightNavigation] = useState(false);

  const scrollRight = () =>{
    if(disableRightNavigation){ 
      return;
    }
    const scrollVariable = document.querySelector(".hourly-forecast-card-layout");
    // console.dir(scrollVariable);
    
    setDisableLeftNavigation(false);
    scrollVariable.scrollBy({left:720, behaviour: "smooth"}); // OR-> scrollVariable.scrollLeft += 720
    
    console.log({scrollLeft: scrollVariable.scrollLeft, 
                 scrollWidth: scrollVariable.scrollWidth, 
                 clientWidth: scrollVariable.clientWidth});

    // Another Logic -> for Different display size(14inch, 17inch) & zoom size(100%, 80%)
    // if(Math.floor(scrollVariable.scrollLeft) + scrollVariable.clientWidth + 1 >= scrollVariable.scrollWidth)
      
    if(scrollVariable.scrollLeft >= scrollVariable.scrollWidth - scrollVariable.clientWidth) // 1605.333 >= 2375 - 770  -> 1605.33 >= 1605
    {
      setDisableRightNavigation(true);
    }
  };

  const scrollLeft = () =>{
    if(disableLeftNavigation){
      return;
    }
    const scrollVariable = document.querySelector(".hourly-forecast-card-layout");
    setDisableRightNavigation(false);
    scrollVariable.scrollBy({left:-720, behaviour: "smooth"});

    console.log({scrollLeft: scrollVariable.scrollLeft, 
      scrollWidth: scrollVariable.scrollWidth, 
      clientWidth: scrollVariable.clientWidth});

    if(scrollVariable.scrollLeft === 0){
      setDisableLeftNavigation(true);
    }
  };

  // if the users want to scroll with trackpad and touch screen, so the behaviour of arrows should be same
  document.querySelector(".hourly-forecast-card-layout")?.addEventListener("scroll", () => {
    let scrollVariable = document.querySelector(".hourly-forecast-card-layout");
    if (scrollVariable.scrollLeft === 0)
    { 
        setDisableLeftNavigation(true); 
    } 
    else
    {
      setDisableLeftNavigation(false); 
    }

    if ( Math.floor(scrollVariable.scrollLeft) + scrollVariable.clientWidth >= scrollVariable.scrollWidth ) 
    { 
        setDisableRightNavigation(true); 
    }
    else
    { 
      setDisableRightNavigation(false);
    }

  });
  
  return (
    <div className="hourly-forecast-container">
      <div className="hourly-title-container">
        <p className="forecast-title">Hourly Weather</p>
        <div className="hourly-navigation-arrow">
          <img src={disableLeftNavigation ? LeftNavGray : LeftNav} alt="" id="left-nav-btn"  onClick={scrollLeft}/> 
          <img src={disableRightNavigation ? RightNavGray : RightNav} alt="" id="right-nav-btn" onClick={scrollRight}/>
        </div>
      </div>

      <CardLayout className="p-0 hourly-forecast-card-layout">
        <div className="hourly-card-main-div">
          {
            hourlyData?.length > 0 && hourlyData.map((elem, elemIndex) => {
              return (
                <HourComp key={elemIndex} 
                          currentTime={elem.isClosetTime} //its for highlight current time for weather
                          data={elem}
                />
              );
            })
          }
        </div>
      </CardLayout>
    </div>
  );
}
