import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log(`Username: ${username}, Password: ${password}`);
    navigate('/survey');
  };

  return (
    <div className="section" style={{ backgroundImage: `url(/rrrainbow.svg)`, backgroundSize: 'cover', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third" style={{ backdropFilter: 'blur(10px) brightness(90%)', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '10px' }}>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <div className="control has-text-centered">
                <figure className="image is-1by1">
                  <img src="logo_transparent.png" alt="Logo" />
                </figure>
                </div>
              </div>
              <div className="field">
                <label className="label">Username</label>
                <div className="control">
                  <input className="input" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button className="button is-link" type="submit">Log In</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;