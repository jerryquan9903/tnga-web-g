import React, { useState, useEffect } from "react";
import './../App.css';

function Contact(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
      sessionStorage.setItem('path', 'contact');

      fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/contact")
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
        
      props.setTxtColour('black');
      props.setBgColour('white');

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
        <div style={{justifyContent: 'center'}}>
          <p style={{alignSelf: 'center'}}>In construction</p>
        </div>
      );
    }
}  
  
export default Contact;