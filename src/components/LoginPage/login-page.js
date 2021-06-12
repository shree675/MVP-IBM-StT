import { Component, useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { Link } from 'react-router-dom';
import fire from '../../firebase';
import firebase from 'firebase';
import { makeStyles } from '@material-ui/core/styles';
// const bcrypt = require("bcrypt");
import ReactEncrypt from 'react-encrypt';
// import wave from './wave.svg';
import './login-page.css';
import google from '../../assets/google.svg';
import twitter from '../../assets/twitter.svg';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),

    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginPage = (props) => {
  const [show, setShow] = useState('password');
  const [check, setCheck] = useState('');
  const classes = useStyles();

  const onSubmitGoogle = (e) => {
    e.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmitTwitter = (e) => {
    e.preventDefault();
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        var token = credential.accessToken;
        var secret = credential.secret;
        // The signed-in user info.
        var user = result.user;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return props.login === false ? (
    <>
      <div className="contain-login">
        <div className="design">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 320">
            <path
              fill="#0099ff"
              fill-opacity="1"
              d="M0,64L48,64C96,64,192,64,288,90.7C384,117,480,171,576,170.7C672,171,768,117,864,106.7C960,96,1056,128,1152,154.7C1248,181,1344,203,1392,213.3L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>
        <div className="design">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 320">
            <path
              fill="#5000ca"
              fill-opacity="1"
              d="M0,32L48,58.7C96,85,192,139,288,176C384,213,480,235,576,208C672,181,768,107,864,112C960,117,1056,203,1152,208C1248,213,1344,139,1392,101.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>

        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}></Avatar>
            <Typography className="head" component="h1" variant="h5">
              Create Account
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Enter Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={props.onChangeUsername}
                    value={props.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Enter Password"
                    type={show}
                    id="password"
                    autoComplete="current-password"
                    onChange={props.onChangePassword}
                    value={props.password}
                  />
                </Grid>
                <input
                  id="op"
                  type="checkbox"
                  onClick={() => {
                    if (show === 'password') {
                      setShow('text');
                      setCheck('checked');
                    } else {
                      setShow('password');
                      setCheck('');
                    }
                  }}
                  checked={check}
                />
                <label id="ok1">Show Password</label>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={props.handleSignup}
              >
                Sign Up
              </Button>
              <Grid container justify="center">
                <Grid item>
                  <button
                    className="signui-button"
                    onClick={(e) => {
                      e.preventDefault();
                      props.setLogin(true);
                    }}
                  >
                    Already have an account? Sign in
                  </button>
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Grid item>
                  <div id="exists">This mail ID already exists</div>
                </Grid>
              </Grid>
              <br></br>
              <p id="tag">Or create account using social media</p>
              <Grid container justify="center">
                <button className="socialui-button" onClick={onSubmitGoogle}>
                  <img src={google}></img>
                  Gmail
                </button>
                <button className="socialui-button" onClick={onSubmitTwitter}>
                  <img src={twitter}></img>
                  Twitter
                </button>
              </Grid>
            </form>
          </div>
        </Container>
        <div className="designb">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320">
            <path
              fill="#5000ca"
              fill-opacity="1"
              d="M0,160L30,144C60,128,120,96,180,112C240,128,300,192,360,218.7C420,245,480,235,540,213.3C600,192,660,160,720,154.7C780,149,840,171,900,181.3C960,192,1020,192,1080,208C1140,224,1200,256,1260,266.7C1320,277,1380,267,1410,261.3L1440,256L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="designb2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 320">
            <path
              fill="#0099ff"
              fill-opacity="1"
              d="M0,288L30,245.3C60,203,120,117,180,112C240,107,300,181,360,213.3C420,245,480,235,540,202.7C600,171,660,117,720,112C780,107,840,149,900,186.7C960,224,1020,256,1080,261.3C1140,267,1200,245,1260,245.3C1320,245,1380,267,1410,277.3L1440,288L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
    </>
  ) : (
    <div className="contain-login">
      <div className="design">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 320">
          <path
            fill="#0099ff"
            fill-opacity="1"
            d="M0,64L48,64C96,64,192,64,288,90.7C384,117,480,171,576,170.7C672,171,768,117,864,106.7C960,96,1056,128,1152,154.7C1248,181,1344,203,1392,213.3L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>
      <div className="design">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 320">
          <path
            fill="#5000ca"
            fill-opacity="1"
            d="M0,32L48,58.7C96,85,192,139,288,176C384,213,480,235,576,208C672,181,768,107,864,112C960,117,1056,203,1152,208C1248,213,1344,139,1392,101.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}></Avatar>
          <Typography className="head" component="h1" variant="h5">
            Sign in to your account
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={props.onChangeUsername}
                  value={props.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={show}
                  id="password"
                  autoComplete="current-password"
                  onChange={props.onChangePassword}
                  value={props.password}
                />
              </Grid>

              <input
                id="op"
                type="checkbox"
                onClick={() => {
                  if (show === 'password') {
                    setShow('text');
                    setCheck('checked');
                  } else {
                    setShow('password');
                    setCheck('');
                  }
                }}
                checked={check}
              />
              <label id="ok1">Show Password</label>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={props.handleLogin}
            >
              Login
            </Button>
            <Grid container justify="center">
              <Grid item>
                <button
                  className="signui-button"
                  onClick={(e) => {
                    e.preventDefault();
                    // this.setState({ login: false });
                    props.setLogin(false);
                  }}
                >
                  Don't have an account? Sign up
                </button>
              </Grid>
            </Grid>
            <br></br>
            <Grid container justify="center">
              <button className="socialui-button" onClick={onSubmitGoogle}>
                <img src={google}></img>
                Gmail
              </button>
              <button className="socialui-button" onClick={onSubmitTwitter}>
                <img src={twitter}></img>
                Twitter
              </button>
            </Grid>
          </form>
        </div>
      </Container>
      <div className="designb">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320">
          <path
            fill="#5000ca"
            fill-opacity="1"
            d="M0,160L30,144C60,128,120,96,180,112C240,128,300,192,360,218.7C420,245,480,235,540,213.3C600,192,660,160,720,154.7C780,149,840,171,900,181.3C960,192,1020,192,1080,208C1140,224,1200,256,1260,266.7C1320,277,1380,267,1410,261.3L1440,256L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="designb1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 320">
          <path
            fill="#0099ff"
            fill-opacity="1"
            d="M0,288L30,245.3C60,203,120,117,180,112C240,107,300,181,360,213.3C420,245,480,235,540,202.7C600,171,660,117,720,112C780,107,840,149,900,186.7C960,224,1020,256,1080,261.3C1140,267,1200,245,1260,245.3C1320,245,1380,267,1410,277.3L1440,288L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default LoginPage;
