import React, {useState, useEffect} from 'react';

import './../../../App.css';

function DeleteArticle() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    FetchData();
    console.log('Fetched');
  }, []);

  const FetchData = () => {
    fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/admin-article/delete", {
      method: 'get',
    }).then(response => response.text())
    .then((response) => {
      let parsedRes = JSON.parse(response);
      if (parsedRes.retry == 'RETRY') {
        window.location.reload();
      }
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
  }

  const ReturnDataArray = () => {
    let resultArray = [];
    console.log(dataArray);
    for (let i = 0; i < dataArray.length; i++) {
      resultArray.push(
        <div className="singleArticleWrapperDelete">
          <p>{dataArray[i].title}</p>
          <p>{dataArray[i].date.replace("T", " ").replace("Z", " ")}</p>
          <button className="deleteButtonDelete" onClick={() => HandleDelete({id: dataArray[i].id})}>Delete</button>
        </div>
      )
    }

    return resultArray;
  }

  const HandleDelete = (data) => {
    console.log(data);
    fetch("https://immense-castle-37192.herokuapp.com/" + "https://tnga-web.herokuapp.com/admin-article/delete", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }).then(response => response.text())
    .then((response) => {
      let parsedRes = JSON.parse(response);
      console.log(parsedRes);
      if (parsedRes.result == "OK")
        FetchData();
    });    
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div></div>;
  } else {
    return (
      <div className="deleteArticleWrapperDelete">
        <ReturnDataArray />
      </div>
    )
  }
}

export default DeleteArticle;