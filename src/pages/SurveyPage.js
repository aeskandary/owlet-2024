import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import "bulma/css/bulma.min.css";

function SurveyPage() {
  //grab the user's id
  const userId = auth.currentUser.uid;
  //useState to store the user's likes, dislikes, and avoid
  const [likes, setLikes] = useState("");
  const [dislikes, setDislikes] = useState("");
  const [avoid, setAvoid] = useState("");
  const navigate = useNavigate();

  //grabbing user preferences from the database if they exist
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, `users/${userId}`), (doc) => {
      const data = doc.data();
      if (data) {
        setLikes(data.likes || "");
        setDislikes(data.dislikes || "");
        setAvoid(data.avoid || "");
      }
    });

    //cleaning up subscription on unmount
    return () => unsubscribe();
  }, [userId]);

  //signing out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("User signed out");
      //navigate back to login page if the user has successfully signed out
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleSubmit = async (event) => {
    //prevents page refresh
    event.preventDefault();
    //userPreferences object that will be stored in the database
    const userPreferences = {
      likes: likes,
      dislikes: dislikes,
      avoid: avoid,
    };

    try {
      await setDoc(doc(db, `users/${userId}`), userPreferences, {
        //using merge avoids overwriting the entire document (so that the friend code is not changed)
        merge: true,
      });
      console.log("User preferences updated");
      //navigating to the code page after a successful submission
      navigate("/code");
    } catch (error) {
      console.error("Error updating document: ", error);
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
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">What foods do you like?</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">What foods do you dislike?</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={dislikes}
                    onChange={(e) => setDislikes(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">
                  What restaurants do you want to avoid?
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={avoid}
                    onChange={(e) => setAvoid(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button className="button is-link" type="submit">
                    Submit
                  </button>
                </div>
                <br />
                <button className="button is-danger" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyPage;
