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

const History = (props) => {
  const [message, setMessage] = useState([]);
  const [editText, setEditText] = useState('');
  const [showHide, setShowHide] = useState(false);
  const [id1, setId1] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState('wait');

  useEffect(() => {
    authListener();
    // if (fire.auth().currentUser !== null) {
    //   console.log(fire.auth().currentUser.uid);
    // }
    if (user !== null && user.uid !== undefined && user.uid !== null) {
      var username = user.uid;
    }
    axios
      .get(`/text/${username}.json`)
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
  }, [user]);

  const deleteRow = (id, e) => {
    if (user !== null && user.uid !== undefined && user.uid !== null) {
      var username = user.uid;
    }
    const textRef = fire.database().ref(`text/${username}`).child(id);
    textRef.remove();
    const textMessage = message.filter((item) => item.id !== id);
    setMessage(textMessage);
  };

  const textUpdateHandler = (id, e) => {
    if (user !== null && user.uid !== undefined && user.uid !== null) {
      var username = user.uid;
    }
    e.preventDefault();
    const textRef = fire.database().ref(`text/${username}`).child(id);
    var timeDuration, timestamps, name, t1, t2, c1, c2, imageurl, audiourl;
    textRef.on('value', (snapshot) => {
      var i = 0;
      snapshot.forEach((data) => {
        if (i == 0) {
          audiourl = data.val();
        } else if (i == 1) {
          c1 = data.val();
        } else if (i == 2) {
          c2 = data.val();
        } else if (i == 4) {
          imageurl = data.val();
        } else if (i == 6) {
          name = data.val();
        } else if (i == 9) {
          t1 = data.val();
        } else if (i == 10) {
          t2 = data.val();
        } else if (i == 7) {
          timeDuration = data.val();
        } else if (i == 8) {
          timestamps = data.val();
        }
        i++;
      });
      textRef.set({
        message: editText,
        timeDurartion: timeDuration,
        timestamps: timestamps,
        edited: true,
        name: name,
        title1: t1,
        title2: t2,
        color1: c1,
        color2: c2,
        imageurl: imageurl,
        audiourl: audiourl,
      });
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

  const [audio, setAudio] = useState(null);

  return (
    <div>
      {user === 'wait' ? (
        <div></div>
      ) : user !== null ? (
        <div style={{ position: 'relative' }}>
          <h1>Dashboard</h1>
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
                    <p key={item.id}>
                      <div>NAME:</div>
                      <div>{item.name === '' ? '(not filled)' : item.name}</div>
                      <hr></hr>
                      <div>TITLE 1:</div>
                      <div>
                        {item.title1 === '' ? '(not filled)' : item.title1}
                      </div>
                      <hr></hr>
                      <div>TITLE 2:</div>
                      <div>
                        {item.title2 === '' ? '(not filled)' : item.title2}
                      </div>
                      <hr></hr>
                      <div>COLOR 1:</div>
                      <div>
                        {item.color1 === '' ? '(not filled)' : item.color1}
                      </div>
                      <hr></hr>
                      <div>COLOR 2:</div>
                      <div>
                        {item.color2 === '' ? '(not filled)' : item.color2}
                      </div>
                      <hr></hr>
                      <div>TRANSCRIPT:</div>
                      <div>{item.message}</div>
                      <button
                        className="edit"
                        onClick={() => showHideHandler(item.message, item.id)}
                      >
                        EDIT
                      </button>
                      <hr></hr>
                      <div>LAST TIMESTAMP:</div>
                      <div>
                        <div>
                          Word: {item.timestamps[item.timestamps.length - 1][0]}
                        </div>
                        <div>
                          Start Time:
                          {item.timestamps[item.timestamps.length - 1][1]}
                        </div>
                        <div>
                          End Time:
                          {item.timestamps[item.timestamps.length - 1][2]}
                        </div>
                      </div>
                      <hr></hr>
                      <div>AUDIO FILE:</div>
                      <p>
                        <button
                          onClick={() => {
                            if (audio) {
                              audio.pause();
                            }
                            var audio2 = new Audio(item.audiourl);
                            setAudio(audio2);
                            audio2.play();
                          }}
                        >
                          Play
                        </button>
                        <button
                          onClick={() => {
                            audio.pause();
                            setAudio(null);
                          }}
                        >
                          Stop
                        </button>
                      </p>
                      <div>IMAGE:</div>
                      <div>
                        <img src={item.imageurl} width="200"></img>
                      </div>
                    </p>
                  </div>

                  <div className="historyButtons">
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
          <div style={{ height: `50px` }}></div>
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
