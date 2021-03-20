import './../App.css';
import React, {useState, useEffect} from "react";
import placeholder from './../styles/images/work-banner.jpg';


function Work(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    sessionStorage.setItem('path', 'work');

    fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/work")
      .then(res => res.text())
      .then(
        (result) => {
          setIsLoaded(true);
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
    
    props.setTxtColour('white');
    props.setBgColour('black');

    return () => {
      props.setTxtColour('white');
      props.setBgColour('transparent');   
    }
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div></div>;
  } else {
    return (
      <div>
        <div className="mainLogoWork">
          <div className="clientsWork">
            <img src={placeholder} className="logoWork" alt="some stuff"/>
          </div>      
        </div>
      </div>
    );
  }
}

export default Work;