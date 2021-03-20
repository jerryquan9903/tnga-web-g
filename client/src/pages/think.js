import React from "react";
import './../App.css';
import sample from "./../styles/images/think-video.mp4";

import {
  isMobile
} from "react-device-detect";

function Think() {

  if (!isMobile) {
    return (
      <div className="mainThink">
        <video autoPlay={true} loop muted={true} playsInline>      
          <source src={sample} type='video/mp4' />
            Your browser does not support the video tag.
        </video>      
      </div>
  );
  } else {
    return (
      <div className="mainThink">
        <div className="allTextThink">
          <h1 className="bigTextThink">VIETNAM POLICY FORUM</h1>
          <h2 className="smallTextThink">A FORUM BETWEEN PROFESSIONALS, SCIENTISTS, RESEARCHERS, BUSINESSES, THE GOVERNMENT, AND THE CITIZENS.</h2>
        </div>         
      </div>
    );
  }
}  
  
export default Think;

/*

<div className="allText"> 
                <h2 className="bigText">VIETNAM POLICY FORUM</h2>
                <h3 className="smallText">A FORUM BETWEEN PROFESSIONALS, SCIENTISTS, RESEARCHERS, BUSINESSES, THE GOVERNMENT, AND THE CITIZENS.</h3>
            </div>  

            */