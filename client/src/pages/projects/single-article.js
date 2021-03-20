import React, { useState, useEffect } from "react";
import './../../App.css';
import PuffLoader from 'react-spinners/PuffLoader';

import {
  useLocation
} from "react-router-dom";

import {
  isMobile
} from "react-device-detect";


function SingleArticle() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageArray, setImageArray] = useState([]);
  const [textArray, setTextArray] = useState([]);

  let unchangedURL = useLocation();
  let url_array = unchangedURL.pathname.split("/article/");
  let article_url = url_array[1];

  useEffect(() => {
    fetch("https://immense-castle-37192.herokuapp.com/" + `https://tnga-web.herokuapp.com/article?url=${article_url}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public'
        }
      }).then(response => response.text())
        .then((response) => {
          let parsedRes = JSON.parse(response);
          console.log(parsedRes);
          if (parsedRes.retry == "RETRY")
            window.location.reload();
          setTitle(parsedRes.data[0].article_title);
          setSubtitle(parsedRes.data[0].article_sub);

          for (let i = 0; i < parsedRes.data.length; i++) {
            setImageArray((imageArray) => [...imageArray, parsedRes.data[i].article_image]);
            setTextArray((textArray) => [...textArray, parsedRes.data[i].article_text]);
          }
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

  }, []);

  const FullBody = () => {    
    let pars = [];
    for (let i = 0; i < imageArray.length; i++) {
      pars.push(<BodyPart img={imageArray[i]} txt={textArray[i]} />);
    }

    return pars;
  }

  const BodyPart = (props) => {
    let img = props.img;
    let txt = props.txt;

    if (img == "") {
      if (!isMobile) {
        return (
          <div className="bodyWrapperArticle">
            <div style={{paddingTop: '50px', paddingBottom: '50px'}}>
              <TextParagraphs txt={txt}/>
            </div>
          </div>
        );
        } else {
          return (
            <div className="bodyWrapperArticle">
              <div style={{paddingTop: '50px', paddingBottom: '50px'}}>
                <TextParagraphs txt={txt}/>
              </div>
            </div>
          );
        }
    } else {
      if (!isMobile) {
        return (
          <div className="bodyWrapperArticle">
            <img src={img} className="artcImgArticle" alt="placeholder" />
            <div style={{paddingTop: '50px', paddingBottom: '50px'}}>
              <TextParagraphs txt={txt}/>
            </div>
          </div>
        );
        } else {
          return (
            <div className="bodyWrapperArticle">
              <img src={img} className="artcImgMobileArticle" alt="placeholder" />
              <div style={{paddingTop: '50px', paddingBottom: '50px'}}>
                <TextParagraphs txt={txt}/>
              </div>
            </div>
          );
        }
    }
    
  }

  const SubParagraphs = () => {
    let txtArray = subtitle.split('\n\n');
    let styledArray = [];

    for (let i = 0; i < txtArray.length; i++) {
      if (!isMobile) {
        styledArray.push(
          <p className="artcTextArticle">{txtArray[i]}</p>
        );
      } else {
        styledArray.push(
          <p className="artcTextMobileArticle">{txtArray[i]}</p>
        );
      }
    }

    return styledArray;
  }

  const TextParagraphs = (props) => {
    let txt = props.txt;
    let txtArray = [];
    let styledArray = [];
    if (txt) {
      txtArray = txt.split('\n\n');

      for (let i = 0; i < txtArray.length; i++) {
        if (!isMobile) {
          styledArray.push(
            <p className="artcTextArticle">{txtArray[i]}</p>
          );
        } else {
          styledArray.push(
            <p className="artcTextMobileArticle">{txtArray[i]}</p>
          );
        }
      }
    }
    
    return styledArray;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div className="loader">
        <PuffLoader color="#FFFFFF" size="150" loading="true"/>
      </div>
    );
  } else if (!isMobile) {
  return (
    <div className="artcWrapperArticle">
      <h1 className="artcTitleArticle">{title}</h1>
      <SubParagraphs />
      <FullBody /> 
    </div>
  );
  } else {
    return (
      <div className="artcWrapperMobileArticle">
        <h1 className="artcTitleMobileArticle">{title}</h1>
        <SubParagraphs />
        <FullBody /> 
      </div>
    );
  }
}

export default SingleArticle;