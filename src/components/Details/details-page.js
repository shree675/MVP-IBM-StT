import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios-submit';
import fire from '../../firebase';
import LoginPage from '../LoginPage/login-page';
import { PropTypes } from 'carbon-components-react';
var CryptoJS = require('crypto-js');

const Details = (props) => {
  const [message, setMessage] = useState([]);
  const [editText, setEditText] = useState('');
  const [showHide, setShowHide] = useState(false);
  const [id1, setId1] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState('wait');

  const [title1, setTitle1] = useState('');
  const [title2, setTitle2] = useState('');
  const [color1, setColor1] = useState('');
  const [color2, setColor2] = useState('');
  const [name, setName] = useState('');
  const [imageurl, setImageURL] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    authListener();

    setTitle1(props.location.title1);
    setTitle2(props.location.title2);
    setColor1(props.location.color1);
    setColor2(props.location.color2);
    setName(props.location.name);
    setImageURL(props.location.imageurl);
    setImage(props.location.image);
  }, [user]);

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
        <div>
          <h5>Name</h5>
          <p>{name}</p>
          <h5>Title1</h5>
          <p>{title1}</p>
          <h5>Title2</h5>
          <p>{title2}</p>
          <h5>Color1</h5>
          <p>{color1}</p>
          <h5>Color2</h5>
          <p>{color2}</p>
          <h5>Image</h5>
          <p id="output">
            <img width="200" src={imageurl}></img>
          </p>
          <br></br>
          <div className="buttonBox">
            <button onClick={props.location.textSubmitHandler}>Save</button>
          </div>
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

export default Details;
