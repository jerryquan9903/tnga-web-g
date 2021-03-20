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
          <h1 className="title">Host NGUYỄN THY NGA</h1>
          <h2 className="titleSmall">Tổng Giám đốc V-startup & Chuyên gia chiến lược chính sách</h2>
          <p className="aboutText">Tốt nghiệp khoa Marketing, Trường Đại học Kinh tế Quốc dân, Nguyễn Thy Nga từng khẳng định mình trong lĩnh vực truyền thông chính sách, tham gia tổ chức các chương trình lớn của Việt Nam và khu vực. Sau đó, chị trở thành BTV, dẫn chương trình của Ban Thời sự VTV1.</p>
          <p className="aboutText">Năm 2017, Thy Nga rời nhà Đài và sáng lập V-Startup.</p>
          <p className="aboutText">Chủ tịch mạng lưới hỗ trợ khởi nghiệp Việt Nam Startup Ecosystem, xây dựng và phát triển lĩnh vực công nghệ 4.0 trong chương trình khởi nghiệp Đổi mới sáng tạo Quốc gia. Ở góc độ chuyên môn, chị là chủ nhiệm các nhiệm vụ truyền thông chính sách và chuyên gia phát triển thị trường cho về khởi nghiệp đổi mới sáng tạo, hỗ trợ chiến lược, phát triển quan hệ chính phủ và truyền thông cho các doanh nghiệp, tập đoàn Việt Nam.</p>
          <p className="aboutText">Năm 2020, Nguyễn Thy Nga được mời làm cố vấn và điều phối viên quốc gia cho Stevie Awards – giải thưởng danh giá 18 năm tuổi được ví như Oscar dành cho doanh nhân và doanh nghiệp quốc tế.</p>

 
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
