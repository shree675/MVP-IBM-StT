import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios-submit';
import fire from '../../firebase';
import '../HomePage/home-page.css';
import ServiceContainer from '../ServiceContainer/ServiceContainer';
import LoginPage from '../LoginPage/login-page';
import { PropTypes } from 'carbon-components-react';
var CryptoJS = require('crypto-js');

const History = () => {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    axios
      .get('/text.json')
      .then((res) => {
        const fetchedMessage = [];
        for (let key in res.data) {
          fetchedMessage.push({
            ...res.data[key],
            id: key,
          });
        }
        setMessage(fetchedMessage);
      })
      .catch((err) => console.log(err));
    authListener();
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState('wait');

  const handleLogin = (e) => {
    e.preventDefault();

    const pwd = CryptoJS.SHA3(password).toString();

    fire
      .auth()
      .signInWithEmailAndPassword(email, pwd)
      .catch((err) => {
        switch (err.code) {
          case 'auth/user-disabled':
          case 'auth/user-not-found':
            alert(err.message);
            break;
          case 'auth/wrong-password':
            alert(err.message);
        }
        clearAll();
      });

    authListener();
    clearAll();
  };

  const handleSignup = (e) => {
    e.preventDefault();

    const pwd = CryptoJS.SHA3(password).toString();

    fire
      .auth()
      .createUserWithEmailAndPassword(email, pwd)
      .catch((err) => {
        clearAll();
        switch (err.code) {
          case 'auth/email-already-in-use':
          case 'auth/invalid-email':
            alert(err.message);
            break;
        }
      });

    authListener();
    clearAll();
  };

  const handleLogout = (e) => {
    // e.preventDefault();
    fire.auth().signOut();
    authListener();
  };

  const authListener = (e) => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  };

  const clearAll = () => {
    setEmail('');
    setPassword('');
  };

  const onChangeUsername = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  return (
    <div>
      {user === 'wait' ? (
        <div>
          <h3 style={{ textAlign: `center` }}>Please wait...</h3>
        </div>
      ) : user !== null ? (
        <div>
          <h1>History</h1>
          <br></br>
          <button onClick={handleLogout}>Logout</button>
          <h3>List of translations</h3>
          <div>
            {message.map((item) => (
              <p key={item.id}>{item.message}</p>
            ))}
          </div>
          <br></br>
          <Link to="/servicecontainer">
            <button style={{ textDecoration: `none` }}>
              Create a new transcription
            </button>
          </Link>
        </div>
      ) : (
        <LoginPage
          login={login}
          setLogin={setLogin}
          setEmail={setEmail}
          setPassword={setPassword}
          setUser={setUser}
          onChangeUsername={onChangeUsername}
          onChangePassword={onChangePassword}
          handleLogout={handleLogout}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          email={email}
          password={password}
        />
      )}
    </div>
  );
};

export default History;
