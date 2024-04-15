import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';

function ResultsPage() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = 'poop';
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

    let user1Likes = "pizza, burgers";
    let user1Dislikes = "pasta, indian food";
    let user1Avoid = "Fame Pizza, McDonalds";

    let user2Likes = "salads, burgers";
    let user2Dislikes = "indian food, fruit";
    let user2Avoid = "Playa Bowls";

    let availableChoices = "Eddie's Pizza, Fame Pizza, Playa Bowls, Dev's Indian Food Truck, Mexican Grill Stand, Five Guys Burgers and Fries, McDonalds, Wendy's, Taco Bell";
  
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `You are a restaurant recommendation machine. You will recieve a list of available restaurants and two separate user's preferences, and then recommend them 5 restaurants that they may both agree on. Give the restaurants in a simple list, numbered, with no reasoning. Avoid the restaurants that the users marked as "avoid". {User 1| Likes: ${user1Likes} | Dislikes: ${user1Dislikes} | Avoid: ${user1Avoid}} {User 2| Likes: ${user2Likes} | Dislikes: ${user2Dislikes}| Avoid: ${user2Avoid}} {Available Choices: ${availableChoices}}.` }]
        }
      ]
    };
  
    console.log('Sending request to Gemini API...'); // Log before sending the request
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        console.log('Received response from Gemini API:', response); // Log the response
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data from Gemini API:', data);
        data.candidates.forEach((candidate, index) => {
          console.log(`Candidate ${index}:`, candidate);
        });
        setResults(data);
      })
      .catch(error => {
        console.error('Error occurred while fetching from Gemini API:', error); // Log the error
        setError(error.toString());
      });
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("Latitude: " + latitude + ", Longitude: " + longitude);
    
      const apiKey = 'poop'; 
      const keyword = 'food';
      const type = 'restaurant';
    
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${keyword}&location=${latitude},${longitude}&rankby=distance&type=${type}&key=${apiKey}`;
    
      console.log(url);
    }

    function showError(error) {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for Geolocation.")
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.")
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.")
          break;
        case error.UNKNOWN_ERROR:
          console.log("An unknown error occurred.")
          break;
        default:
          console.log("An unexpected error occurred.")
          break;
      }
    }
  }, []);
  
  return (
    <div className="section" style={{ backgroundImage: `url(/rrrainbow.svg)`, backgroundSize: 'cover', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third" style={{ backdropFilter: 'blur(10px) brightness(90%)', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '10px' }}>
            <h1 className="title has-text-centered">Your Results:</h1>
            {error && <p>Error: {error}</p>}
            {results && results.candidates[0].content.parts[0].text.split('\n').map((line, index) => (
              <p key={index}>{line}<br /></p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;