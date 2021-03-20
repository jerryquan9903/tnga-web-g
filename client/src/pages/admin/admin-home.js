import React, { useState, useEffect } from "react";
import {
  Switch,
  BrowserRouter as Router,
  Link,
  useLocation,
  Redirect
} from "react-router-dom";

import './../../styles/admin-home.css';

function AdminHome() {
  const [page, setPage] = useState("/");
  const [action, setAction] = useState("add");
  let location = useLocation();  

  if(!location.state) {
    return (
      <Redirect to="/admin" />
    );
  } else {
    
    switch(page) {
      case '/admin-about':
        return (
          <Redirect to={{pathname:'/admin-about', state: {auth: true}}} />
        );
      case '/admin-article':
        return (
          <Redirect to={{pathname:'/admin-article', state: {auth: true, action: action}}} />
        );
      default:        
        return (
          <div>
            <h1 style={{marginLeft: 50, color: 'black'}}>Welcome to the Admin Homepage.</h1>
            <button onClick={() => setPage('/admin-about')}>Edit: About</button>
            <button onClick={() => {setAction("add"); setPage('/admin-article')}}>Add new article</button>
            <button onClick={() => {setAction("delete"); setPage('/admin-article');}}>Delete an article</button>
          </div>
        );
    }    
  }
}

export default AdminHome;