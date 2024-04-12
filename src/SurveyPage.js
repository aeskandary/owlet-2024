import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

function SurveyPage() {
  const [likes, setLikes] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [avoid, setAvoid] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log(`Likes: ${likes}, Dislikes: ${dislikes}, Avoid: ${avoid}`);
  };

  return (
    <div className="section" style={{ backgroundImage: `url(/rrrainbow.svg)`, backgroundSize: 'cover', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third" style={{ backdropFilter: 'blur(10px) brightness(90%)', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '10px' }}>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">What foods do you like?</label>
                <div className="control">
                  <input className="input" type="text" value={likes} onChange={e => setLikes(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label className="label">What foods do you dislike?</label>
                <div className="control">
                  <input className="input" type="text" value={dislikes} onChange={e => setDislikes(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label className="label">What restaurants do you want to avoid?</label>
                <div className="control">
                  <input className="input" type="text" value={avoid} onChange={e => setAvoid(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button className="button is-link" type="submit">Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyPage;