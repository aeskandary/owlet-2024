import React from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../config/firebase";
import "bulma/css/bulma.min.css";

function LoginPage() {
  //useNavigate is a hook that allows navigation between pages
  const navigate = useNavigate();
  //google authentication
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User:", user);
      //navigates to survey/preferences page if login was successful
      navigate("/survey");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div
      className="section background-section"
    >
      <div className="container">
        <div className="columns is-centered">
          <div
            className="column is-one-third blur-box"
          >
            <div className="field">
              <div className="control has-text-centered">
                <figure className="image is-1by1">
                  <img src="logo_transparent.png" alt="Logo" />
                </figure>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button className="button is-link" onClick={signInWithGoogle}>
                  Sign in with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
