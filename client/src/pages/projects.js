import React, { useState, useEffect } from "react";
import SinglePage from './projects/single-page';
import './../App.css';

import {
  Switch,
  Route,
  Redirect,
  useRouteMatch
} from "react-router-dom";

import {
  isMobile
} from "react-device-detect";

function Projects(props) {
  //const [error, setError] = useState(null);
  //const [isLoaded, setIsLoaded] = useState(false);
  let { path, url } = useRouteMatch();

  
  useEffect(() => {
    /*
    const getData = async () => {
      await fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/projects", {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public'
        }
      }).then(response => response.text())
        .then((response) => {
          let parsedRes = JSON.parse(response);
          let items = parsedRes.count;
          setLastItem(items);
          if (items % 6 == 0)
            setLastPage(items/6);
          else
            setLastPage(Math.floor(items/6) + 1);

          
      }).then(
        (response) => {
          setIsLoaded(true);
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      ).catch((e) => {
        console.log(e);
      });     
    }
    
    getData();
*/
    props.setTxtColour('white');
    props.setBgColour('black');

    return () => {
      props.setTxtColour('white');
      props.setBgColour('transparent');   
    }
  }, [])

  /*
  const PageRoutes = () => {

    // array that contains all the page routes
    let routes = [];  

    // add every pages to the array
    for (let i = 1; i <= lastPage; i++) {
      let path = "/projects/page/" + i;
      routes.push(
        <Route path={path}>
          <SinglePage page={i} set={setPage}/>
        </Route>
      );
    }
    
    // don't ask me why this is here, but it works for whatever reason
      routes.push(
        <Route exact path="/projects">
          <SinglePage page="1" set={setPage}/>
        </Route>
      );

    return routes;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div style={{height: '1000px'}}></div>;
  } else*/ if (!isMobile) {
    console.log(path);
    return (
      <div className="projectWrapper">
          <Switch>
            <Route exact path={path}>
              <SinglePage num={1} />
            </Route>
            <Route path={`${path}/:pageNumber`}>
              <SinglePage />
            </Route>
            <Redirect from={path} exact to={`${path}/1`} />
          </Switch>
      </div>
    );
  } else {
    return (
      <div className="projectWrapperMobile">
          <Switch>              
          <Route path={`${path}/:pageNumber`}>
              <SinglePage />
            </Route>          
            <Redirect from="/projects" exact to="/projects/1" />
          </Switch>
      </div>
    );
  }
} 

  
export default Projects;