import React, { Component, useState, useEffect } from 'react';
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
      </div>
    </>
  ) : (
    <div className="contain-login">
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
    </div>
  );
};

export default LoginPage;
