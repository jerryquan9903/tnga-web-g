import React, { useState, useEffect } from "react";
import './../../App.css';
import LinesEllipsis from 'react-lines-ellipsis';
import PuffLoader from 'react-spinners/PuffLoader';
import {
  Link,
  useLocation,
  Redirect,
  useHistory
} from "react-router-dom";

import {
  isMobile
} from "react-device-detect";

function SinglePage(props) {
  let unchangedURL = useLocation();
  let history = useHistory();
  let page = 0;
  if (props.num) {
    page = props.num;
    console.log(page);
  } else {
    let url_array = unchangedURL.pathname.split("/");
    page = url_array[url_array.length-1];
    console.log(page);
  }

  let firstItem = ((page-1)*6)+1;

  const [lastPage, setLastPage] = useState(0);
  const [lastItem, setLastItem] = useState(0);

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getData(page);
  
  }, []);

  const getData = async (pageToGet) => {
    await fetch("https://immense-castle-37192.herokuapp.com/" + `https://tnga-web.herokuapp.com/projects/single-page?page=${pageToGet}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public',
      'Accept-Encoding': 'gzip'
    },
  }).then(response => response.text())
    .then((response) => {
      let parsedRes = JSON.parse(response);
      if (parsedRes.retry == "RETRY")
        window.location.reload();
      setData(parsedRes.data);
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
    }).catch((e) => {
      console.log(e);
    });
  }

  const ItemList = () => {
    let items = [];

      if ((lastItem - firstItem) < 6) {
        for (let i = firstItem; i <= lastItem; i++) { 
          items.push(<GridItem pageNumber={page} item={i} data={data[i - firstItem]} />);
        }
      } else {
        for (let i = firstItem; i < firstItem + 6; i++) {
          items.push(<GridItem pageNumber={page} item={i} data={data[i - firstItem]} />);
        }
      }
  
    return items;
  }

  const GridItem = (props) => {
    let gridItemData = props.data;
    let thumb = "";
    if (props.data) {
      thumb = props.data.thumbnail;
    }

    let path = "/article/" + gridItemData.article_url;

    if(!isMobile) {
      return (
        <Link to={path}>
          <div>
            <img src={thumb} className="imgArticleSinglePage" />
            <div className="txtArticleSinglePage">
            <LinesEllipsis
              className="txtArticleSinglePage"
              text={gridItemData.article_title}
              maxLine='3'
              ellipsis='...'
              trimRight
              basedOn='letters'/>
            <LinesEllipsis
              className="subArticleSinglePage"
              text={gridItemData.article_sub}
              maxLine='3'
              ellipsis='...'
              trimRight
              basedOn='letters'/>
            </div>
          </div>
        </Link>
    );          
    } else {
      return (
        <Link to={path}>
         <div style={{width: '100%'}}>
            <img src={thumb} className="imgMobileSinglePage" />
            <div className="txtArticleMobileSinglePage">
            <LinesEllipsis
              className="txtArticleMobileSinglePage"
              text={gridItemData.article_title}
              maxLine='3'
              ellipsis='...'
              trimRight
              basedOn='letters'/>
            <LinesEllipsis
              className="subArticleMobileSinglePage"
              text={gridItemData.article_sub}
              maxLine='4'
              ellipsis='...'
              trimRight
              basedOn='letters'/>
            </div>
          </div>
        </Link>
      );
    }

    
  }

  // render single button with number
  const PageButton = (props) => {
    let pageNumber = props.page;
    let path = "/projects/" + pageNumber;
  
    return (
      <button className="changePageButtonSinglePage" onClick={() => {setIsLoaded(false); history.push(path); getData(pageNumber);}}>
        {pageNumber}
      </button>
    );
  }
    
  // render directional buttons (go to first/last page)
  const ChangePageButton = (props) => {
    let direction = props.direction;
  
    // if the "Prev" button is clicked, go to 1st page
    if (direction === 'prev') {
 
      //button is only functional if the current page is not 1
      if (page !== 1) {
        let path = "/projects/1";
        return (
            <button onClick={() => {setIsLoaded(false); history.push(path); getData(1);}} className="changePageButtonSinglePage">&#60;</button>
        );
      } else {
        return (
            <button className="changePageButtonSinglePage">&#60;</button>
        );
      }
  
    // for the other button, go to the last page
    } else {
 
      // also only functional if the current page is not the last
      if (page !== lastPage) {
        let path = "/projects/" + lastPage;
        return (
            <button onClick={() => {setIsLoaded(false); history.push(path); getData(lastPage);}} className="changePageButtonSinglePage">&#62;</button>
        );
      } else {
        return (
          <button className="changePageButtonSinglePage">&#62;</button>
        );
      }
    }  
  }  
  
    // render all buttons
    const ButtonWrapper = () => {
      let buttonList = [];
    
      // push the "first" button
      buttonList.push(<ChangePageButton direction="prev" />);

      if (lastPage >= 5) {
        // if the current page is 1 or 2, render buttons from 1 to 5
        if (page < 3) {
          for (let i = 1; i <= 5; i++) {
            buttonList.push(<PageButton page={i} />);
          }
  
        // if the current page is the last/penultimate page, render buttons for the last 5 pages
        } else if (page > lastPage - 2) {
          for (let i = lastPage - 4; i <= lastPage; i++) {
            buttonList.push(<PageButton page={i} />);
          }
  
        // else, render 5 buttons with the current page in the middle (3rd position)
        } else {
          for (let i = page - 2; i <= page + 2; i++) {
            buttonList.push(<PageButton page={i} />);
          }
        }
      } else {
        for (let i = 1; i <= lastPage; i++)
          buttonList.push(<PageButton page={i} />);
      }
    
      // push the "last" button
      buttonList.push(<ChangePageButton direction="next" />);
    
      return buttonList;
    }
        
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div className="loader">
        <PuffLoader color="#FFFFFF" size="150" loading="true"/>
      </div>
    )
  } else if (!isMobile) {
    return (
      <div className="gridAndButtonWrapperSinglePage">
        <span className="gridWrapperSinglePage">
          <ItemList />
        </span>
        <div className="buttonContainerSinglePage">
          <ButtonWrapper />
        </div>
      </div>
    ); 
  } else {
    return (
      <div className="gridAndButtonWrapperMobileSinglePage">
        <span className="gridWrapperMobileSinglePage">
          <ItemList />
        </span>
        <div className="buttonContainerSinglePage">
          <ButtonWrapper />
        </div>
      </div>
    );
  }
}

export default SinglePage;