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

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(cors());

// app.use(express.static('src/index.js'));

// var fs = require('fs'),
//   cloudconvert = new (require('cloudconvert'))(
//     'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjhmOTJmMTdmYWU4MTllNTc3Yjk3MDJjNDU1NTdhZDA3OGYzNGRiMjNhYjNiY2E5MDA5ZDlkNzM4MzY3MDY4MjI0ZDcwZWJkZjNlNzI5NWIiLCJpYXQiOjE2MjM3NTU4NDMuMDg1NjI1LCJuYmYiOjE2MjM3NTU4NDMuMDg1NjI4LCJleHAiOjQ3Nzk0Mjk0NDMuMDE5MDYzLCJzdWIiOiI1MTc3MTk4MSIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.QZGE08LV9uXXI3icNYDsvjxY-ctPJtUzciOpfLF4vz9uW0Z4NlJhXeod2090y4uKwt3lEqa7sqXD8NLfnf9ipwyoz4fx9Y_dv9PCoB_gFN0NJAGn11Oi82-P8baGRstv36bwWiMQ4K-ErCuT18IZCbJDoNgHPulqwia18Dkm8gFtkLscurmjot9wy-PNSJDTMWVQcfWrJ2Z1Nk3Ra6GFYH7AjYEXZs6dUfbPXRjImqZqpVPxpMPtMvML1WS817zcaHUZYeiK6uApjo1l9umOy1Et2dArhR_jCksnSTlcRBZV4tT8glDZYBwpCVxVL6Fnn4fB5xL-HJxmdGJ3K2BvZ-B44nTypgziwKNj8UDgAMKK2-ijTnn1o5TAvrvbtSRSqHTxwAu69XoetfZmFCO8mbnzkRNhnmTUiMOUGLyQjgQPdjQej8V-IzO6Qs03Mmvn4xTLy9gA2HuR-l5WjDi9BaGGuKoREdLbKcYhquCcpN2FcYjFzhZWNWdT5huvszvNJ-xDBeG28EuGLQ-FaZOrFRCPOX0z1Ibosa4CNwjt3CphQx48AjzUfSOHUzXm9-W5vd4UftOKbMFGhm3BdsF6NywieJLNQKvpKG4xjlJwIfePYYSI48OExtlm2tsOxBBJItP0fM5D1vL2FEShdIDQxPw_3mDvB94kqdux2tbKiKU',
//   );

// app.post('/convert', (req, res) => {
//   fs.createReadStream(req.body)
//     .pipe(
//       cloudconvert.convert({
//         inputformat: 'm4a',
//         outputformat: 'wav',
//         input: 'upload',
//       }),
//     )
//     .pipe(fs.createWriteStream('src/uploads/outputaudio.wav'));
// });

app.get('/getfile', (_, res) => {
  fs.readFile('src/uploads/outputaudio.wav', (err, data) => {
    console.log(data);
    res.send(data);
  });
});

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
