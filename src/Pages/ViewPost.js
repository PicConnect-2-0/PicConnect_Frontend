import React, { useEffect, useState } from "react";
import SingleView from "../components/SingleView";
import { useIfNotAuthenticated } from "../hooks/useIfNotAuthenticated";
import Footer from "../components/Footer";
import axios from "axios";
axios.defaults.withCredentials = true;

export default function ViewPost() {
  const [postCardData, setPostCardData] = useState([]);
  const currentPath = window.location.pathname;
  const currentId = currentPath.substring(currentPath.lastIndexOf("/") + 1);

  const fetchPostCardData = async () => {
    try {
      await axios
        .get(`http://localhost:8000/api/photos/${currentId}`)
        .then((response) => {
          setPostCardData(response.data);
          console.log(postCardData);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostCardData();
  }, []);

    // Check if the user is authenticated
    const RedirectMessage = useIfNotAuthenticated("SingleView");
    if (RedirectMessage) {
      return RedirectMessage;
    }
  

  return (
    <div>
      <h1 className="heading font-merriweather text-xl">{postCardData.title}</h1>
      <SingleView
        url={postCardData.urls}
        author={postCardData?.user?.name}
        description={postCardData.description}
        postId={currentId}
        userId={postCardData?.user?.id}
      />
      <Footer />
    </div>
  );
}
