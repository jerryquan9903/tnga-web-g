import './../App.css';
import React, {useState, useEffect} from "react";
import portrait from './../styles/images/portrait.jpg';
import PuffLoader from 'react-spinners/PuffLoader';

import {
  isMobile
} from "react-device-detect";

import { useHistory } from "react-router-dom";

function About(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [headText, setHeadText] = useState("");
  const [subText, setSubText] = useState("");
  const [bodyText, setBodyText] = useState("");

  let history = useHistory();
  
  useEffect(() => {
    const getData = () => {
      fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/about", {
        method: 'get',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public',
          'Cache-Control': 'max-age=3600'
        }
      }).then(response => response.text())
        .then((response) => {
          let parsedRes = JSON.parse(response);
          console.log(parsedRes);
          if (parsedRes.retry) {
            window.location.reload();
          } else {
            setHeadText(parsedRes.headText);
            setSubText(parsedRes.subText);
            setBodyText(parsedRes.bodyText);
          }
      }).then(
        (response) => {
          console.log('Connected!');
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

    props.setTxtColour('black');
    props.setBgColour('white');
    getData();

    history.push("/about");

    return () => {
      props.setTxtColour('white');
      props.setBgColour('transparent');
    }
  }, []);

  /*
  const splitText = () => {
    let unsplittedText = bodyText;
  }
  */

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div className="loader">
      <PuffLoader color="#000000" size="150" loading="true"/>
    </div>
    );
  } else if (!isMobile) {
    return (
      <div className="background">
      <div className="container">
        <div className="imgWrapper">
          <img src={portrait} className="portrait" alt="some stuff"/> 
        </div>
        <div className="textBox">
          <h1 className="title">{headText}</h1>
          <h2 className="titleSmall">{subText}</h2>
          <SplitText bText={bodyText} />
        </div>
      </div>
    </div>
    );
  } else {
    return (
    <div className="backgroundMobile">
      <div className="containerMobile">
        <img src={portrait} className="portraitMobile" alt="some stuff"/>
        <div className="textBoxMobile">
          <h1 className="title">{headText}</h1>
          <h2 className="titleSmall">{subText}</h2>
          <SplitText bText={bodyText} />
        </div>
      </div>
    </div>
    );
  }
  /*
          <h1 className="title">Host NGUY???N THY NGA</h1>
          <h2 className="titleSmall">T???ng Gi??m ?????c V-startup & Chuy??n gia chi???n l?????c ch??nh s??ch</h2>
          <p className="aboutText">T???t nghi???p khoa Marketing, Tr?????ng ?????i h???c Kinh t??? Qu???c d??n, Nguy???n Thy Nga t???ng kh???ng ?????nh m??nh trong l??nh v???c truy???n th??ng ch??nh s??ch, tham gia t??? ch???c c??c ch????ng tr??nh l???n c???a Vi???t Nam v?? khu v???c. Sau ????, ch??? tr??? th??nh BTV, d???n ch????ng tr??nh c???a Ban Th???i s??? VTV1.</p>
          <p className="aboutText">N??m 2017, Thy Nga r???i nh?? ????i v?? s??ng l???p V-Startup.</p>
          <p className="aboutText">Ch??? t???ch m???ng l?????i h??? tr??? kh???i nghi???p Vi???t Nam Startup Ecosystem, x??y d???ng v?? ph??t tri???n l??nh v???c c??ng ngh??? 4.0 trong ch????ng tr??nh kh???i nghi???p ?????i m???i s??ng t???o Qu???c gia. ??? g??c ????? chuy??n m??n, ch??? l?? ch??? nhi???m c??c nhi???m v??? truy???n th??ng ch??nh s??ch v?? chuy??n gia ph??t tri???n th??? tr?????ng cho v??? kh???i nghi???p ?????i m???i s??ng t???o, h??? tr??? chi???n l?????c, ph??t tri???n quan h??? ch??nh ph??? v?? truy???n th??ng cho c??c doanh nghi???p, t???p ??o??n Vi???t Nam.</p>
          <p className="aboutText">N??m 2020, Nguy???n Thy Nga ???????c m???i l??m c??? v???n v?? ??i???u ph???i vi??n qu???c gia cho Stevie Awards ??? gi???i th?????ng danh gi?? 18 n??m tu???i ???????c v?? nh?? Oscar d??nh cho doanh nh??n v?? doanh nghi???p qu???c t???.</p>

 
          */
}

function SplitText(props) {
  let splittedText = props.bText.split('\n');
  console.log(splittedText);
  let textRows = [];
  for (var i = 0; i < splittedText.length; i++) {
    textRows.push(<p className="aboutText">{splittedText[i]}</p>);
  }

  return textRows;
}

export default About;
