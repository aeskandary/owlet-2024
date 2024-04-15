import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import { useNavigate } from 'react-router-dom';

function CodePage() {
  const [friendCode, setFriendCode] = useState('');
  const [ownCode, setOwnCode] = useState('');
  const [codeSelected, setCodeSelected] = useState(false); // New state
  const navigate = useNavigate();

  const handleOwnCodeSubmit = (event) => {
    event.preventDefault();
    console.log(`Own Code: ${ownCode}`);
    setCodeSelected(true); // Set codeSelected to true when a code is selected
  };

  const handleFriendCodeSubmit = (event) => {
    event.preventDefault();
    console.log(`Friend Code: ${friendCode}`);
    navigate('/survey');
  };

  return (
    <div className="section" style={{ backgroundImage: `url(/rrrainbow.svg)`, backgroundSize: 'cover', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third" style={{ backdropFilter: 'blur(10px) brightness(90%)', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '10px' }}>
            <form onSubmit={handleOwnCodeSubmit}>
              <div className="field">
                <label className="label">Your Code:</label>
                <div className="control">
                  <input className="input" type="text" maxLength="4" placeholder="Create a 4-letter friend code" value={ownCode} onChange={e => setOwnCode(e.target.value)} />
                </div>
                <p className='is-size-7'>Share this with your taste bud or input their code below!</p>
                <br/>
                <div className="control">
                  <button className="button is-link" type="submit">{codeSelected ? 'Select New Code' : 'Select Code'}</button>
                </div>
                <br/>
              </div>
            </form>
            <form onSubmit={handleFriendCodeSubmit}>
              <div className="field">
                <label className="label">Friend Code</label>
                <div className="control">
                  <input className="input" type="text" maxLength="4" placeholder="Enter your bud's friend code" value={friendCode} onChange={e => setFriendCode(e.target.value)} />
                </div>
                <br/>
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

export default CodePage;