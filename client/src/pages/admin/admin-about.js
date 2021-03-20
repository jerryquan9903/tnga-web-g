import './../../App.css';
import React, {useState, useEffect} from "react";
import portrait from './../../styles/images/portrait.jpg';
import editButton from './../../styles/images/edit-white.png';
import { useLocation, Redirect } from 'react-router-dom';
import { useForm } from "react-hook-form";

function AdminAbout() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [headText, setHeadText] = useState("");
  const [subText, setSubText] = useState("");
  const [bodyText, setBodyText] = useState("");

  const [tempHead, setTempHead] = useState("");
  const [tempSub, setTempSub] = useState("");
  const [tempBody, setTempBody] = useState("");

  const [editHead, setEditHead] = useState(false);
  const [editSub, setEditSub] = useState(false);
  const [editBody, setEditBody] = useState(false);

  const [redirect, setRedirect] = useState(false);

  const {register: registerHead, handleSubmit: handleSubmitHead} = useForm();
  const {register: registerSub, handleSubmit: handleSubmitSub} = useForm();
  const {register: registerBody, handleSubmit: handleSubmitBody} = useForm();

  let location = useLocation();
  
  useEffect(() => {
    const getData = async () => {
      await fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/admin-about", {
        method: 'get',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }).then(response => response.text())
        .then((response) => {
          console.log(response);
          let parsedRes = JSON.parse(response);
          setHeadText(parsedRes.headText);
          setSubText(parsedRes.subText);
          setBodyText(parsedRes.bodyText);
          setTempHead(parsedRes.headText);
          setTempSub(parsedRes.subText);
          setTempBody(parsedRes.bodyText);
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
  }, [])

  const onSubmitHead = (data) => {
    console.log(data);
    setTempHead(headText);
    setHeadText(data.text);
    setEditHead(false);
  }

  const onSubmitSub = (data) => {
    console.log(data);
    setTempSub(subText);
    setSubText(data.text);
    setEditSub(false);
  }

  const onSubmitBody = (data) => {
    console.log(data);
    setTempBody(bodyText);
    setBodyText(data.text);
    setEditBody(false);
  }

  const saveData = () => {
    fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/admin-about", {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({headText: headText, subText: subText, bodyText: bodyText})
    }).then(response => response.text())
      .then((response) => {
        console.log(response);
        let parsedRes = JSON.parse(response);
        if (parsedRes.result == 'OK')
          setRedirect(true);
      });
  }

  const handleDiscard = () => {
    setHeadText(tempHead);
    setSubText(tempSub);
    setBodyText(tempBody);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div></div>;
  } else if (!location.state) {
    return <Redirect to="/admin" />;
  } else if (redirect) {
    return <Redirect to={{pathname:'/admin-home', state: {auth: true}}} />;
  } else {
    return (
      <div className="backgroundAdminAbout">
      <div className="containerEditAdminAbout">
        <div className="imgwrapperAdminAbout">
          <img src={portrait} className="portrait" alt="some stuff"/> 
        </div>
        <div className="textBoxEditAdminAbout">
          {editHead
          ?
            <form className="editDivAdminAbout" onSubmit={handleSubmitHead(onSubmitHead)}>
              <label style={{margin: '40px'}}><input type="text" name="text" className="editHeadAdminAbout" ref={registerHead}/></label>
            </form>
          :
            <div className="editDivAdminAbout">
              <button className="ebuttonAdminAbout">
                <img src={editButton} style={{width: '20px', height: '20px'}} onClick={() => setEditHead(true)} alt='Edit'/>
              </button>    
              <h1 className="headTitleAdminAbout">{headText}</h1>
            </div>
          }

          {editSub
          ?
            <form className="editDivAdminAbout" onSubmit={handleSubmitSub(onSubmitSub)}>
              <label style={{margin: '40px'}}><input type="text" name="text" className="editHeadAdminAbout" ref={registerSub}/></label>
            </form>
          :
            <div className="editDivAdminAbout">
              <button className="ebuttonAdminAbout">
                <img src={editButton} style={{width: '20px', height: '20px'}} onClick={() => setEditSub(true)} alt='Edit'/>
              </button>
              <h2 className="subTitleAdminAbout">{subText}</h2>
            </div>
          }
          
          {editBody
          ?
            <form onSubmit={handleSubmitBody(onSubmitBody)}>
              <label style={{margin: '40px'}}><textarea type="text" name="text" className="editBodyAdminAbout" ref={registerBody}>{bodyText}</textarea></label>
              <input style={{marginLeft: 10}} type="submit" value="Save" />
            </form>
          :
            <div className="editDivAdminAbout">
              <button className="ebuttonAdminAbout">
                <img src={editButton} style={{width: '20px', height: '20px'}} onClick={() => setEditBody(true)} alt='Edit'/>
              </button>
              <div className="editDivBodyAdminAbout">
                <SplitText bText={bodyText} />
              </div>
            </div>
          }

          <div className="buttonWrapperAdminAbout">
            <button className="saveButtonAdminAbout" type="button" onClick={() => saveData()}>
              <p className="saveTextAdminAbout">SAVE</p>
            </button>
            <button className="saveButtonAdminAbout" type="button" onClick={() => handleDiscard()}>
              <p className="saveTextAdminAbout">DISCARD</p>
            </button>
          </div>
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

//split body text into multiple paragraphs
function SplitText(props) {
  let splittedText = props.bText.split('\n');
  let textRows = [];
  for (var i = 0; i < splittedText.length; i++) {
    textRows.push(<p key={i} className="aboutTextAdminAbout">{splittedText[i]}</p>);
  }

  return textRows;
}

export default AdminAbout;
