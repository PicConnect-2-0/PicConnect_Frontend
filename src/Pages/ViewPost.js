import React, { useEffect, useState } from 'react';
import SingleView from '../components/SingleView';
import axios from 'axios';
export default function ViewPost() {
  const [postCardData, setPostCardData] = useState([]);
  const currentPath = window.location.pathname;
  const currentId = currentPath.substring(currentPath.lastIndexOf("/") + 1);
  
  const fetchPostCardList = async () => {
    try {
      await axios.get(`http://localhost:8000/api/photos/${currentId}`).then((response) => {
        setPostCardData(response.data);
        console.log(postCardData)
      })
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPostCardList();
    console.log("this is th eid", currentId);
  },[])
  return (
    <div>
      <h1 className="heading">ViewPost</h1>
      <SingleView url={postCardData.urls}/>
    </div>
  )
}
