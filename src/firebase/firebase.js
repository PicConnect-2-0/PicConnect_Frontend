import { initializeApp } from "firebase/app";
//prettier-ignore
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,} from "firebase/auth";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { getStorage } from "firebase/storage";
//web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.WEB_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.API_ID ,
  measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
//const facebookProvider = new FacebookAuthProvider();

//send firebase id token to backend server
export const sendTokenToBackend = async (idToken) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + idToken,
        },
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
export const signInWithGoogle = (dispatch) => {
  signInWithPopup(auth, googleProvider)
    .then(async (result) => {
      //get the user token right after auth
      const token = await auth.currentUser.getIdToken(true);
      sendTokenToBackend(token);
      console.log("User Data:", auth.currentUser);
      // Dispatch only necessary properties
      dispatch(
        setUserData({
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName,
          email: auth.currentUser.email,
        })
      );
    })
    .catch((error) => {
      console.log(error);
    });
};

export const signInWithFacebook = (dispatch) => {
  const facebookProvider = new FacebookAuthProvider();

  signInWithPopup(auth, facebookProvider)
    .then(async (result) => {
      // The signed-in user info.
      const user = result.user;
      console.log(user);

      const token = await user.getIdToken(true);
      sendTokenToBackend(token);
      // Dispatch only necessary properties
      dispatch(
        setUserData({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        })
      );
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);
    });
};
export const signUpWithEmail = async (
  email,
  password,
  displayName,
  dispatch
) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(user, { displayName });
    // await sendEmailVerification(user);
    const token = await user.getIdToken(true);
    sendTokenToBackend(token);
    // Dispatch only necessary properties
    dispatch(
      setUserData({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
      })
    );
  } catch (error) {
    console.error("Error signing up:", error);
  }
};
export const signInWithEmail = async (email, password, dispatch) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    const user = response.user;

    const token = await user.getIdToken(true);
    sendTokenToBackend(token);
    // Dispatch only necessary properties
    dispatch(
      setUserData({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
      })
    );
  } catch (error) {
    //console.error("Error:", error);
    let errorMessage = error.message;
    if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password. Please try again.";
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "No user found with this email. Please try again or sign up.";
    }

    throw errorMessage;
  }
};
