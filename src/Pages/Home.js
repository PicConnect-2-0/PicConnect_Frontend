import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import axios from 'axios';

export default function Home() {
  const [postCardList, setPostCardList] = useState([]);

  const fetchPostCardList = async () => {
    try {
      await axios.get("http://localhost:8000/api/photos").then((response) => {
        setPostCardList(response.data);
        console.log(postCardList)
      })
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPostCardList();
    
  },[])
  return postCardList.length > 0? (
    <div style={{marginBottom: '5%'}}>
      <div className="cards">
        {postCardList?.map((item) => (
          <PostCard key={item.id} url={item.urls} title={item.title} postId={item.id} likeButton={true}/>
        ))}
      </div>
    </div>
  ):(
  <div>
    <h1 className="heading">No Post</h1>  
  </div>

  )
}
