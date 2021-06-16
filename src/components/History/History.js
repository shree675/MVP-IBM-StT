import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios-submit';
import fire from '../../firebase';
import '../HomePage/home-page.css';
import ServiceContainer from '../ServiceContainer/ServiceContainer';
import LoginPage from '../LoginPage/login-page';
import { PropTypes } from 'carbon-components-react';
import './History.css';
import Edit from '../Edit/Edit';
var CryptoJS = require('crypto-js');

const History = () => {
  const [message, setMessage] = useState([]);
  const [editText, setEditText] = useState('');
  const [showHide, setShowHide] = useState(false);
  const [id1, setId1] = useState('');

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

  const deleteRow = (id, e) => {
    const textRef = fire.database().ref('text').child(id);
    textRef.remove();
    const textMessage = message.filter((item) => item.id !== id);
    setMessage(textMessage);
  };

  const textUpdateHandler = (id, e) => {
    e.preventDefault();
    const textRef = fire.database().ref('text').child(id1);
    // console.log(textRef);
    textRef.set({
      message: editText,
    });
    setEditText(editText);
    setShowHide(false);
  };

  const showHideHandler = (newMessage, id) => {
    setEditText(newMessage);
    setId1(id);
    setShowHide(true);
  };

  // const handleInputChange = event => {
  //   const { name, value } = event.target;
  //   setEditText( ...editText, {[name]: value} );
  // };

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
        <div></div>
      ) : user !== null ? (
        <div style={{ position: 'relative' }}>
          <h1>History</h1>
          <br></br>
          <button onClick={handleLogout}>Logout</button>
          <h3>List of translations</h3>
          <div>
            {message.map((item) => (
              <div>
                <Edit show={showHide}>
                  <textarea
                    rows="10"
                    cols="50"
                    name="textarea"
                    value={editText}
                    onChange={(event) => setEditText(event.target.value)}
                  />
                  <button onClick={(e) => textUpdateHandler(item.id, e)}>
                    save
                  </button>
                  <button onClick={() => setShowHide(false)}>close</button>
                </Edit>
                <div className="historySection">
                  <div className="historyText">
                    <p key={item.id}>{item.message}</p>
                  </div>
                  <div className="historyButtons">
                    <button
                      className="edit"
                      onClick={() => showHideHandler(item.message, item.id)}
                    >
                      EDIT
                    </button>
                    <button
                      className="delete"
                      onClick={(e) => deleteRow(item.id, e)}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
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
