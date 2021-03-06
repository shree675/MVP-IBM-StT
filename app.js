const { Cp4dTokenManager, IamTokenManager } = require('ibm-watson/auth');
const path = require('path');
const express = require('express');
const vcapServices = require('vcap_services');
var cors = require('cors');
const app = express();
require('./config/express')(app);

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.join((__dirname = 'build/index.html')));
//   });
// }

// For starter kit env.
require('dotenv').config({
  silent: true,
});
const skitJson = JSON.parse(process.env.service_watson_speech_to_text || '{}');
const vcapCredentials = vcapServices.getCredentials('speech_to_text');

// Look for credentials in all the possible places
const apikey =
  process.env.SPEECH_TO_TEXT_APIKEY || process.env.SPEECHTOTEXT_APIKEY;
// vcapCredentials?.apikey ||
// skitJson?.apikey;
const url = process.env.SPEECH_TO_TEXT_URL || process.env.SPEECHTOTEXT_URL;
// vcapCredentials?.url ||
// skitJson?.url;

let bearerToken = process.env.SPEECH_TO_TEXT_BEARER_TOKEN;

// Ensure we have a SPEECH_TO_TEXT_AUTH_TYPE so we can get a token for the UI.
let sttAuthType = process.env.SPEECH_TO_TEXT_AUTH_TYPE;
if (!sttAuthType) {
  sttAuthType = 'iam';
} else {
  sttAuthType = sttAuthType.toLowerCase();
}
// Get a token manager for IAM or CP4D.
let tokenManager = false;
if (sttAuthType === 'cp4d') {
  tokenManager = new Cp4dTokenManager({
    username: process.env.SPEECH_TO_TEXT_USERNAME,
    password: process.env.SPEECH_TO_TEXT_PASSWORD,
    url: process.env.SPEECH_TO_TEXT_AUTH_URL,
    disableSslVerification: true,
  });
} else if (sttAuthType === 'iam') {
  try {
    tokenManager = new IamTokenManager({
      apikey,
      disableSslVerification: true,
    });
  } catch (err) {
    console.log('Error: ', err);
  }
} else if (sttAuthType === 'bearertoken') {
  console.log('SPEECH_TO_TEXT_AUTH_TYPE=bearertoken is for dev use only.');
} else {
  console.log('SPEECH_TO_TEXT_AUTH_TYPE =', sttAuthType);
  console.log('SPEECH_TO_TEXT_AUTH_TYPE is not recognized.');
}

const getToken = async () => {
  let tokenResponse = {};

  try {
    if (tokenManager) {
      const token = await tokenManager.getToken({
        disableSslVerification: true,
        // rejectUnauthorized: false,
      });
      tokenResponse = {
        ...tokenResponse,
        accessToken: token,
        url,
      };
    } else if (bearerToken && url) {
      tokenResponse = {
        ...tokenResponse,
        accessToken: bearerToken,
        url,
      };
    } else {
      tokenResponse = {
        ...tokenResponse,
        error: {
          title: 'No valid credentials found',
          description:
            'Could not find valid credentials for the Speech to Text service.',
          statusCode: 401,
        },
      };
    }
  } catch (err) {
    console.log('Error: ', err);
    tokenResponse = {
      ...tokenResponse,
      error: {
        title: 'Authentication error',
        description:
          'There was a problem authenticating with the Speech to Text service.',
        statusCode: 400,
      },
    };
  }

  return tokenResponse;
};

// app.get('/', (_, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.get('/', (_, res) => {
  app.use(express.static('src/index.js'));
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/servicecontainer', (req, res) => {
  app.use(express.static('src/index.js'));
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/details', (req, res) => {
  app.use(express.static('src/index.js'));
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(cors());

// app.use(express.static('src/index.js'));

app.get('/health', (_, res) => {
  res.json({ status: 'UP' });
});

app.get('/api/auth', async (_, res, next) => {
  const token = await getToken({
    disableSslVerification: true,
    // rejectUnauthorized: false,
  });

  if (token.error) {
    console.error(token.error);
    next(token.error);
  } else {
    return res.json(token);
  }
});

// error-handler settings for all other routes
require('./config/error-handler')(app);

module.exports = app;
