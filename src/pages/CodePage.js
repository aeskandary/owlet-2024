import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import "bulma/css/bulma.min.css";

function CodePage() {
  //store the user's id
  const [userId, setUserId] = useState(null);
  //store the friend's code and user's code
  const [friendCode, setFriendCode] = useState("");
  const [ownCode, setOwnCode] = useState("");
  //store whether the user has selected a code
  const [codeSelected, setCodeSelected] = useState(false);
  //the "error" message should be initially blank
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleGoToSurvey = () => {
    navigate("/survey");
  };

  //ensuring user is signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        //send the user to the login page if they're not logged in
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(doc(db, `users/${userId}`), (doc) => {
        const data = doc.data();
        setOwnCode(data.code);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const handleOwnCodeSubmit = async (event) => {
    event.preventDefault();
    //getting current user's document path
    const docRef = doc(db, `users/${userId}`);
    const docSnap = await getDoc(docRef);
    //if the user's code matches the code in the database, let them know it is active
    if (docSnap.exists() && docSnap.data() && docSnap.data().code && docSnap.data().code.toLowerCase() === ownCode.toLowerCase()) {
      setErrorMessage("Your friend code is active");
      setCodeSelected(true);
      return;
    }
  
    //check if the code is in use by another user
    const q = query(
      collection(db, "users"), 
      where("code", "==", ownCode.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userWithSameCode = querySnapshot.docs[0];
      if (userWithSameCode.id !== userId) {
        //if the code is detected under another user's document, ask the user to retry with another code
        setErrorMessage("Code is already in use, try again");
        return;
      }
    }
  
    //if the code was not in use, update the document
    const userCode = { code: ownCode };
    //clears any error message
    setErrorMessage("Your friend code is active");
    await updateDoc(docRef, userCode);
    //refresh the code page to show the updated code
    navigate("/code");
  };

  //finding the user associated with the submitted friend code
  const handleFriendCodeSubmit = async (event) => {
    event.preventDefault();

    //query the database and find the user that has the matching code in their document
    const q = query(collection(db, "users"), where("code", "==", friendCode));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(`User ID associated with code ${friendCode}: ${doc.id}`);
      //navigate to the /results page and pass the friend's userId
      navigate("/results", { state: { friendUserId: doc.id } });
    });
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
            <form onSubmit={handleOwnCodeSubmit}>
              <div className="field">
                <label className="label">Your Code:</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    maxLength="4"
                    minLength="4"
                    placeholder="Create a 4-letter friend code"
                    value={ownCode}
                    onChange={(e) => setOwnCode(e.target.value)}
                  />
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <p className="is-size-7">
                  Share this with your taste bud or input their code below!
                </p>
                <br />
                <div className="control">
                  <button className="button is-link" type="submit">
                    {codeSelected ? "Select New Code" : "Select Code"}
                  </button>
                </div>
                <br />
              </div>
            </form>
            <form onSubmit={handleFriendCodeSubmit}>
              <div className="field">
                <label className="label">Friend Code</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    maxLength="4"
                    placeholder="Enter your bud's friend code"
                    value={friendCode}
                    onChange={(e) => setFriendCode(e.target.value)}
                  />
                </div>
                <br />
                <div className="control">
                  <button className="button is-link" type="submit">
                    Submit
                  </button>
                  <br /> <br />
                  <button
                    className="button is-danger"
                    onClick={handleGoToSurvey}
                  >
                    Edit Preferences
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodePage;
