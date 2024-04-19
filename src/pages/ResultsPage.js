import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import "bulma/css/bulma.min.css";

function ResultsPage() {
  //this is where the gemini response will be stored in order to be displayed
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [availableChoices, setAvailableChoices] = useState([]);
  const [generateSuggestions, setGenerateSuggestions] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  //extracting friend's userId from location state
  const friendUserId = location.state.friendUserId;

  const handleGoToSurvey = () => {
    navigate("/survey");
  };

  const handleGenerateSuggestions = () => {
    setGenerateSuggestions(true);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        //navigating to login if user is not signed in
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  //fetching a user's preference data from the database
  useEffect(() => {
    const fetchUserData = async (userId) => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    };

    const fetchData = async () => {
      //fetch data for both users
      const user1Data = await fetchUserData(userId);
      const user2Data = await fetchUserData(friendUserId);
      //if both exist, send a request to the Gemini API
      if ((user1Data && user2Data) && generateSuggestions === true) {
        const apiKey = "AIzaSyC69R-bwFvqpvSBj2A7yhWVUV0i5ZXVaZ0";
        //request url
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
        const body = {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a restaurant recommendation machine. You will recieve a list of available restaurants and two separate user's preferences, and then recommend them 5 restaurants that they may both agree on. Give the restaurants in a simple list, numbered, with no reasoning. Avoid the restaurants that the users marked as "avoid". The restauraunts will be given to you in this format: {cuisine: 'pizza', name: 'Blaze Pizza', distance: 0.04746433934006063}. Please list the distance of the restauraunt as well, right after the name. Round the distance to the nearest tenth place. Your return format should look like: 1. <name>, <x.xx miles>. Here is the user data: {User 1| Likes: ${user1Data.likes} | Dislikes: ${user1Data.dislikes} | Avoid: ${user1Data.avoid}} {User 2| Likes: ${user2Data.likes} | Dislikes: ${user2Data.dislikes}| Avoid: ${user2Data.avoid}} {Available Choices: ${availableChoices}}.`,
                },
              ],
            },
          ],
        };

        console.log("Sending request to Gemini API..."); 
        console.log("Request body:", body);
        //fetching data from the Gemini API
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((response) => {
            console.log("Received response from Gemini API:", response); 

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Received data from Gemini API:", data);
            data.candidates.forEach((candidate, index) => {
              console.log(`Candidate ${index}:`, candidate);
            });
            setResults(data);
          })
          .catch((error) => {
            console.error(
              "Error occurred while fetching from Gemini API:",
              error
            ); 
            setError(error.toString());
          });
      }
    };

    if (userId && friendUserId) {
      //only attempt to fetch the user's data if both ids exist
      fetchData();
    }
  }, [userId, friendUserId, availableChoices, generateSuggestions]); 

  //grabbing the user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
      //saving the lat/long coordinates of the user
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("Latitude: " + latitude + ", Longitude: " + longitude);

      function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in kilometers
        const dLat = deg2rad(lat2 - lat1);  // deg2rad below
        const dLon = deg2rad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in kilometers
        return d;
      }
      
      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }

      function searchRestaurants(latitude, longitude) {
        //only fetch data if availablechoices is empty
        if (availableChoices.length === 0) {
        
        const apiUrl = `https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=rect:${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&limit=30&apiKey=bfee25549945496f93d4a4046732a749`;

        const requestOptions = {
          method: 'GET'
        };

        fetch(apiUrl, requestOptions)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            data.features.forEach(feature => {
              const restaurantLatitude = feature.geometry.coordinates[1];
              const restaurantLongitude = feature.geometry.coordinates[0];
              const distance = calculateDistance(latitude, longitude, restaurantLatitude, restaurantLongitude);
              feature.distance = distance;

              data.features.sort((a, b) => a.distance - b.distance);
              setHasFetched(true);
            });
              //creating new array to hold available choices
              const newAvailableChoices = data.features.map(feature => {
                const cuisine = feature.properties.catering?.cuisine;
                const name = feature.properties.name;
                const distance = feature.distance;
  
                //returning new choice as object
                return { cuisine, name, distance };
              });
              setAvailableChoices(newAvailableChoices);
              console.log(newAvailableChoices);
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
      }
    }

      // Call the searchRestaurants function with the user's latitude and longitude
      searchRestaurants(latitude, longitude);
    }

    //geolocation error handling
    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          console.log("An unknown error occurred.");
          break;
        default:
          console.log("An unexpected error occurred.");
          break;
      }
    }
  }, [hasFetched, setHasFetched]);

  return (
    <div
      className="section background-section"
    >
      <div className="container">
        <div className="columns is-centered">
          <div
            className="column is-one-third blur-box"
          >
            <h1 className="title has-text-centered">Your Results:</h1>
            {error && <p>Error: {error}</p>}
            {results &&
              results.candidates[0].content.parts[0].text
                .split("\n")
                .map((line, index) => (
                  <p key={index}>
                    {line}
                    <br />
                  </p>
                ))}
            <div>
              <br />
              <button className="button is-link" type="submit" onClick={handleGenerateSuggestions}>
                Generate Suggestions
              </button>
              <br />
              <br />
              <button className="button is-danger" onClick={handleGoToSurvey}>
                Edit Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;