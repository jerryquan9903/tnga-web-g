import React, {useState} from 'react';

import { useLocation, Redirect, useRouteMatch } from 'react-router-dom';
import { useForm } from "react-hook-form";
import ImageUploading from 'react-images-uploading';
import NumericInput from 'react-numeric-input';
import imageCompression from 'browser-image-compression';

import DeleteArticle from './article-crud/delete-article';
import EditArticle from './article-crud/edit-article';

import './../../App.css';

function AdminArticle() {
  let location = useLocation();
  const [goBack, setGoBack] = useState(false);

  /*
  useEffect(() => {
    const getData = async () => {
      await fetch("http://localhost:9000/admin-article", {
        method: 'get',
        headers: {
              
        }
      }).then()
    }

    getData();
  });
*/

  if (!location.state) {
    return (
      <Redirect to="/admin" />
    );
  } else if (goBack) {
    return <Redirect to={{pathname:'/admin-home', state: {auth: true}}} />;
  } else {
    switch(location.state.action) {
      case 'add':
        return (
          <div>
            <AddArticle />
            <button onClick={() => setGoBack(true)}>Back</button>
          </div>
        );
      case 'delete':
        return (
          <div>
            <DeleteArticle />
            <button onClick={() => setGoBack(true)}>Back</button>
          </div>
        );
      case 'edit':
        return (
          <div>
            <EditArticle />
            <button onClick={() => setGoBack(true)}>Back</button>
          </div>
        );
    }
  }
}

function AddArticle() {
  const [title, setTitle] = useState("");
  const [sub, setSub] = useState("");
  const [image, setImage] = useState([]);
  const [image64, setImage64] = useState([]);
  const [text, setText] = useState([]);
  const [resultText, setResultText] = useState("");
  const [imageNum, setImageNum] = useState(1);
  const [missing, setMissing] = useState("");

  const {register: registerHead, handleSubmit: handleSubmitHead} = useForm();
  const {register: registerSub, handleSubmit: handleSubmitSub} = useForm();
  const {register: registerBody, handleSubmit: handleSubmitBody} = useForm();

  const onImageUp = async (ulPicture) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 600,
      useWebWorker: true
    }

    let compressedArray = [];

    if (ulPicture) {
      for (let i = 0; i < ulPicture.length; i++) {
        const compressed = await imageCompression(ulPicture[i].file, options);
    
        let reader = new FileReader();
        reader.readAsDataURL(compressed);
        reader.onloadend = function() {
          var b64 = reader.result;
          compressedArray.push(b64);
        };
      }      
    }

    console.log(compressedArray);
    setImage64(compressedArray);
    
    console.log(ulPicture);
    setImage(ulPicture);

  };

  const onHeadSave = (data) => {
    setTitle(data.text);
  }

  const onSubSave = (data) => {
    setSub(data.text);
  }

  const onBodySave = (data) => {
    let textArray = [];
    for (let i = 1; i <= imageNum; i++) {
      let field = "text" + i;
      textArray.push(data[field]);
    }
    
    setText(textArray);
  }

  // on pressing the big button, validate whether any required fields are missing; alert the user if there are missing stuff
  const validation = () => {
    let result = {validated: true, missing: ""};
    let missingFields = "";
    if (!title)
      missingFields += "Title, ";
    if (!sub)
      missingFields += "Subtitle, ";
    for (let i = 0; i < imageNum; i++) {
      let number = i + 1;
      if (!image[i])
        missingFields += "Image " + number + ", ";
      if (text[i] == "" || text[i] == undefined || text[i] == null)
        missingFields += "Text " + number + ", ";
    }

    if (missingFields != "")
      result.validated = false;
      result.missing = missingFields.slice(0, -2);

    return result;
  }
  
  // add all data to a FormData() object to be sent to backend
  const appendToForm = () => {
    /*
    let submitData = new FormData();
    submitData.append('title', title);
    submitData.append('sub', sub);
    for (let i = 0; i < image.length; i ++) {
      let key = 'image' + (i+1);
      submitData.append(key, image[i].data_url);
    }
    for (let i = 0; i < text.length; i++) {
      let key = 'text' + (i+1);
      submitData.append(key, text[i]);
    }
    submitData.append('num', imageNum);
    let currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(currentDate);
    submitData.append('date', currentDate);

    return submitData;
*/
    let submitData = {};
    submitData.title = title;
    submitData.sub = sub;
    for (let i = 0; i < image.length; i ++) {
      let key = 'image' + (i+1);
      submitData[key] = image64[i];
    }
    for (let i = 0; i < text.length; i++) {
      let key = 'text' + (i+1);
      submitData[key] = text[i];
    }
    submitData.num = imageNum;
    let currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    submitData.date = currentDate;
    

    return submitData;
  }

  const saveData = () => {
    setResultText("");
    let validationResults = validation();
    if (!validationResults.validated) {
      setMissing("Missing: " + validationResults.missing);
    } else {
    let submitData = appendToForm();
    console.log(submitData);
    fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/admin-article/add", {
      method: 'post',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submitData)
    }).then(response => response.text())
      .then((response) => {
        let parsedRes = JSON.parse(response);
        console.log(parsedRes);
        if (parsedRes.retry == "RETRY") {
          saveData();
        } else {
          setResultText('Added article successfully!');
        }
      })
    }
  }

  const handleImageNum = (value) => {
    setImageNum(value);
    let textArray = [];
    for (let i = 0; i < value; i++) {
      textArray.push("");
    }
    setText(textArray);
  }

  const RenderTextFields = () => {
    let results = [];
    for (let i = 1; i <= imageNum; i++) {
      let name = "text" + i;
      let number = i - 1;
      results.push(
      <form className="formGridAddAdminArticle" onSubmit={handleSubmitBody(onBodySave)}>
        <label style={{color: 'black', fontFamily: 'Roboto'}}>Text {i}:</label>
        <textarea className="textAreaAddAdminArticle" type="text" name={name} defaultValue={text[number]} ref={registerBody}/>
        <input type="submit" value="Save"/>
      </form>
      )
    }

    return results;
  }

  return (
    <div>
      <p style={{color: 'red'}}>{missing}</p>
      <form className="formGridAddAdminArticle" onSubmit={handleSubmitHead(onHeadSave)}>
        <label style={{color: 'black', fontFamily: 'Roboto'}}>Title:</label>
        <textarea className="titleAddAdminArticle" type="text" name="text" ref={registerHead}/>
        <input type="submit" value="Save"/>
      </form>
      <form className="formGridAddAdminArticle" onSubmit={handleSubmitSub(onSubSave)}>
        <label style={{color: 'black', fontFamily: 'Roboto'}}>Subtitle:</label>
        <textarea className="titleAddAdminArticle" type="text" name="text" ref={registerSub}/>
        <input type="submit" value="Save"/>
      </form>
      <p style={{color: 'black', fontFamily: 'Roboto'}}>Number of images (minimum 1, maximum 10):</p>
      <NumericInput min={1} max={10} onChange={(value) => handleImageNum(value)}/>
      <div>
        <p>Images:</p>
      <ImageUploading
        multiple
        value={image}
        onChange={onImageUp}
        maxNumber={imageNum}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
      </div>

      <RenderTextFields />      
      <div>
        <button type="button" onClick={() => saveData()}>
          <p>SAVE</p>
        </button>
      </div>
      <h3 style={{color: 'black'}}>{resultText}</h3>
    </div>
  )
}


function decodeBase64ImageArray(dataString) {
  let result = [];
  console.log(dataString);
  if (dataString != undefined || dataString != null) {
    for (let i = 0; i < dataString.length; i++) {
      if(dataString[i] != 'undefined') {
        var matches = dataString[i].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};
  
        if (matches.length !== 3) {
          return new Error('Invalid input string');
        }
  
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], 'base64');
        result.push(response);
      } else {
        result.push(null);
      }

    }
  }

  return result;
}

function decodeBase64Image(dataString) {
  console.log(dataString);

  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
  response = {};
  
  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }
  
  response.type = matches[1];
  response.data = new Buffer.from(matches[2], 'base64');
  
  return response;
}

export default AdminArticle;