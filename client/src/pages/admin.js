import React, { useState, useEffect } from "react";
import {useForm} from "react-hook-form";

import {
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";

import './../App.css';

function Admin() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const {register, handleSubmit} = useForm();
  const [loginFailed, setLoginFailed] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const onSubmit = (data) => {
    fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/admin", {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }).then(response => response.text())
      .then((response) => {
        console.log(response);
        let parsedRes = JSON.parse(response);
        if (parsedRes.result == "Failed") {
          setLoginFailed("Login failed. Please check whether your username and password are correct.");
        } else {
          setLoginSuccess(true);
        }
      }).catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/admin", {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }).then(res => res.text())
      .then(
        (result) => {
          setIsLoaded(true);
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )    
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div></div>;
  } else if (!loginSuccess) {
    return (
      <div className="loginWrapper">
        <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
          <label style={{marginRight: 10, color: 'black'}}>ID: <input type="text" name="id" ref={register}/></label>
          <label style={{marginLeft: 10, marginRight: 10, color: 'black'}}>Password: <input type="password" name="pass" ref={register}/></label>
          <input style={{marginLeft: 10}} type="submit" value="Login" />
        </form>
        <p className="failedText">{loginFailed}</p>
      </div>
    );
  } else {
    return (
      <Redirect to={{pathname:'/admin-home', state: {auth: true}}} />
    );
  }
}

export default Admin;