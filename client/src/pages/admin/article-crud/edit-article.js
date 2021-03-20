import React, {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import ImageUploading from 'react-images-uploading';
import NumericInput from 'react-numeric-input'; 

import './../../../App.css';

function EditArticle() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({});

  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/admin-article/delete", {
      method: 'get',
    }).then(response => response.text())
    .then((response) => {
      let parsedRes = JSON.parse(response);
      setDataArray(parsedRes);
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

  const ReturnDataArray = () => {
    let resultArray = [];
    for (let i = 0; i < dataArray.length; i++) {
      resultArray.push(
        <div className="singleEditArticleWrapperEdit">
          <p>{dataArray[i].title}</p>
          <p>{dataArray[i].date.replace("T", " ").replace("Z", " ")}</p>
          <button className="editButtonEdit" onClick={() => HandleEdit({id: dataArray[i].id})}>Edit</button>
        </div>
      )
    }

    return resultArray;
  }

  const HandleEdit = (data) => {
    fetch("https://immense-castle-37192.herokuapp.com/" + 'https://tnga-web.herokuapp.com/admin-article/edit', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({id: data.id})
    }).then(response => response.text())
    .then((response) => {
      let parsedRes = JSON.parse(response);
      setEditData(parsedRes);
    }).then(() => {
      setShowEdit(true);
    });
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div></div>;
  } else if (!showEdit) {
    return (
      <div className="editArticleWrapperEdit">
        <ReturnDataArray />
      </div>
    )
  } else {
    return (
      <div className="editArticleWrapperEdit">
        <EditPrompt visibility={showEdit} data={editData}/>
        <ReturnDataArray />
      </div>
    )
  }
}

function getBase64Image(urlImg) {
  var img = new Image();
  img.src = require(process.env.PUBLIC_URL + urlImg);
  img.crossOrigin = 'Anonymous';

  var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

  canvas.height = img.naturalHeight;
  canvas.width = img.naturalWidth;
  ctx.drawImage(img, 0, 0);

  var b64 = canvas.toDataURL('image/png').replace(/^data:image.+;base64,/, '');
  return b64;
}

function EditPrompt(props) {
  let visibility = props.visibility;
  let article = props.data;
  let defaultNum = article.data.length;
    
  const [title, setTitle] = useState("");
  const [sub, setSub] = useState("");
  const [image, setImage] = useState([]);
  const [text, setText] = useState([]);
  const [resultText, setResultText] = useState("");
  const [imageNum, setImageNum] = useState(defaultNum);
  const [missing, setMissing] = useState("");

  const {register: registerHead, handleSubmit: handleSubmitHead} = useForm();
  const {register: registerSub, handleSubmit: handleSubmitSub} = useForm();
  const {register: registerBody, handleSubmit: handleSubmitBody} = useForm();

  useEffect(() => {
    let textArray = [];
    let imageArray = [];
    for (let i = 0; i < defaultNum; i++) {
      textArray.push(article.data[i].article_text);
      imageArray.push("");
    }

    setText(textArray);
    setImage(imageArray);
    setTitle(article.index[0].article_title);
    setSub(article.index[0].article_sub);
  }, []);

  const onImageUp = (ulPicture) => {
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
    let submitData = new FormData();
    submitData.append('id', article.index[0].article_id);
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
    submitData.append('date', currentDate);

    return submitData;
  }

  const saveData = () => {
    let validationResults = validation();
    if (!validationResults.validated) {
      setMissing("Missing: " + validationResults.missing);
    } else {
    let submitData = appendToForm();

    fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/admin-article/saveedit", {
      method: 'post',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: submitData
    }).then(response => response.text())
      .then((response) => {
        let parsedRes = JSON.parse(response);
        if (parsedRes.result == 'OK') {
          setResultText('Edited article successfully!');
        } else {
          setResultText('Editing article failed.');
        }
    }, (error) => {
      console.log(error);
    });
    }
  }

  const handleImageNum = (value) => {
    setImageNum(value);
    let textArray = [];
    for (let i = 0; i < value; i++) {
      if (text[i])
        textArray.push(text[i]);
      else
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
      <form className="formGrid" onSubmit={handleSubmitBody(onBodySave)}>
        <label style={{fontFamily: 'Roboto'}}>Text {i}:</label>
        <textarea className="textAreaEdit" type="text" name={name} defaultValue={text[number]} ref={registerBody}/>
        <input type="submit" value="Save"/>
      </form>
      )
    }

    return results;
  }

  if (!visibility) {
    return <div></div>;
  } else if (!article.data) {
    return <div><p>No data received. Please go back to admin-home.</p></div>;
  } else {
  return (
    <div>
      <p style={{color: 'red'}}>{missing}</p>
      <form className="formGridEdit" onSubmit={handleSubmitHead(onHeadSave)}>
        <label>Title:</label>
        <textarea className="titleEdit" type="text" name="text" defaultValue={title} ref={registerHead}/>
        <input type="submit" value="Save"/>
      </form>
      <form className="formGridEdit" onSubmit={handleSubmitSub(onSubSave)}>
        <label>Subtitle:</label>
        <textarea className="titleEdit" type="text" name="text" defaultValue={sub} ref={registerSub}/>
        <input type="submit" value="Save"/>
      </form>
      <p>Number of images (minimum 1, maximum 10):</p>
      <NumericInput min={1} max={10} defaultValue={imageNum} onChange={(value) => handleImageNum(value)}/>
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
      <h3>{resultText}</h3>
    </div>
  )
  }
}

export default EditArticle;