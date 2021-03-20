import React, { useState, useEffect } from "react";
import Think from "./pages/think";
import About from "./pages/about";
import Work from "./pages/work";
import Projects from "./pages/projects";
import Contact from "./pages/contact";
import Admin from "./pages/admin";
import AdminHome from "./pages/admin/admin-home";
import AdminAbout from "./pages/admin/admin-about";
import AdminArticle from "./pages/admin/admin-article"
import Article from './pages/projects/article';
import './App.css';

import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from "react-router-dom";

import {
  isMobile
} from "react-device-detect";

function App() {
  const [txtColour, setTxtColour] = useState('white');
  const [bgColour, setBgColour] = useState('black');

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  
  useEffect(() => {
    fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/")
    .then(response => response.text())
      .then(
        (response) => {
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );

    setTxtColour('white');

    if (!isMobile)
      setBgColour('transparent');
    else
      setBgColour('black');
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div></div>;
  } else {

    return (
      <body style={{backgroundColor: bgColour}}>     
      <HashRouter>
        <div>
          <div className="menu" style={{backgroundColor: bgColour}}>
              <h3>
                <Link className="menuItem" style={{color: txtColour}} to="/think">THINK</Link>
              </h3>
              <h3>
                <Link className="menuItem" style={{color: txtColour}} to="/about">ABOUT</Link>
              </h3>
              <h3>
                <Link className="menuItem" style={{color: txtColour}} to="/work">WORK</Link>
              </h3>
              <h3>
                <Link className="menuItem" style={{color: txtColour}} to="/projects">PROJECTS</Link>
              </h3>
              <h3>
                <Link className="menuItem" style={{color: txtColour}} to="/contact">CONTACTS</Link>
              </h3>
          </div>

          <Switch>
            <Route path="/think">
              <Think />
            </Route>
            <Route path="/about">
              <About setTxtColour={setTxtColour} setBgColour={setBgColour}/>
            </Route>
            <Route path="/work">
              <Work setTxtColour={setTxtColour} setBgColour={setBgColour}/>
            </Route>
            <Route path="/article">
              <Article setTxtColour={setTxtColour} setBgColour={setBgColour}/>
            </Route>
            <Route path="/projects">
              <Projects setTxtColour={setTxtColour} setBgColour={setBgColour}/>
            </Route>
            <Route path="/contact">
              <Contact setTxtColour={setTxtColour} setBgColour={setBgColour}/>
            </Route>
            <Route exact path="/admin">
              <Admin />
            </Route>
            <Route exact path="/admin-home">
              <AdminHome />
            </Route>
            <Route exact path="/admin-about">
              <AdminAbout />
            </Route>
            <Route exact path="/admin-article">
              <AdminArticle />
            </Route>
            <Redirect exact from="/" to="/think" />

            <Route path="/">

            </Route>


          </Switch>
        </div>
        </HashRouter> 
      </body>

    );
  }
}
 
export default App;
