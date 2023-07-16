import "./App.css";
import "./../index.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./../Pages/Home";
import Following from "./../Pages/Following";
import Upload from "./../Pages/Upload";
import Profile from "./../Pages/Profile";
import SignIn from "./../Pages/SignIn";
import SignUp from "./../Pages/SignUp";
import ViewPost from "../Pages/ViewPost";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="p-4">
          <ul className="flex justify-between font-bold">
            <li>
              <Link to="/" className="home-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/Following" className="following-link">
                Following
              </Link>
            </li>
            <li>
              <Link to="/Upload" className="upload-link">
                Upload
              </Link>
            </li>
            <li>
              <Link to="/Profile" className="profile-link">
                Profile
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/Following" element={<Following></Following>}></Route>
          <Route path="/Upload" element={<Upload></Upload>}></Route>
          <Route path="/Profile" element={<Profile></Profile>}></Route>
          <Route path="/SignIn" element={<SignIn />}></Route>
          <Route path="/SignUp" element={<SignUp />}></Route>
          <Route path="/viewPost/" element={<ViewPost />}></Route>
          {/* Delete line 40 uncomment line 42 when backend is working */}
          {/* <Route path="/viewPost/:postID" element={<ViewPost />}></Route> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
