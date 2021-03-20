import React, { useEffect} from "react";
import SingleArticle from "./single-article";

import {
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";

function Article(props) {
  let { path, url } = useRouteMatch();

  useEffect(() => {       
    props.setTxtColour('white');
    props.setBgColour('black');

    return () => {
      props.setTxtColour('white');
      props.setBgColour('transparent');   
    }
  }, [])

  return (
    <div>
      <Switch>
        <Route path={`${path}/:articleId`}>
          <SingleArticle />
        </Route>
      </Switch>
    </div>
  )
}
  
export default Article;