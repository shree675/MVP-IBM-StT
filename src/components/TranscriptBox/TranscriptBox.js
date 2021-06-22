import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TooltipDefinition } from 'carbon-components-react';
import KeywordTooltip from '../KeywordTooltip';
import { createWordRegex } from './utils';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from '../../axios-submit';
import fire from '../../firebase';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const mapTranscriptTextToElements = (text, keywordInfo, totalIndex) => {
  let finalSentenceArray = [];
  let matches = [];

  if (keywordInfo.length > 0) {
    const regex = createWordRegex(keywordInfo);
    matches = text.split(regex);
  }

  if (matches.length === 0) {
    return [
      {
        text,
        type: 'normal',
      },
    ];
  }

  const wordOccurences = {};
  finalSentenceArray = matches.map((sentenceFragment, index) => {
    const fragmentToSearch = sentenceFragment.toLowerCase();

    if (index % 2 === 0) {
      return {
        text: sentenceFragment,
        type: 'normal',
      };
    }

    const keywordInfoMatch =
      keywordInfo[totalIndex] && keywordInfo[totalIndex][fragmentToSearch];

    let keywordOccurenceIndex = 0;
    if (wordOccurences[fragmentToSearch]) {
      keywordOccurenceIndex = wordOccurences[fragmentToSearch];
      wordOccurences[fragmentToSearch] += 1;
    } else {
      wordOccurences[fragmentToSearch] = 1;
    }
    const infoForOccurence =
      keywordInfoMatch && keywordInfoMatch[keywordOccurenceIndex];

    if (!infoForOccurence) {
      return {};
    }

    return {
      text: sentenceFragment,
      type: 'keyword',
      startTime: infoForOccurence.start_time,
      endTime: infoForOccurence.end_time,
      confidence: infoForOccurence.confidence,
    };
  });

  return finalSentenceArray;
};

export const TranscriptBox = ({
  keywordInfo,
  transcriptArray,
  audioDuration,
  onStartPlayingSample,
  onStopPlayingSample,
  onStopPlayingFileUpload,
  timestamps,
  username,
}) => {
  let content = [];
  let textTimeDuration = '';

  const [title1, setTitle1] = useState('');
  const [title2, setTitle2] = useState('');
  const [color1, setColor1] = useState('');
  const [color2, setColor2] = useState('');
  const [name, setName] = useState('');
  const [imageurl, setImageURL] = useState('');
  const [image, setImage] = useState('');
  const [lastTimestamp, setLastTimestamp] = useState([]);

  const onChangeT1 = (e) => {
    setTitle1(e.target.value);
  };

  const onChangeT2 = (e) => {
    setTitle2(e.target.value);
  };

  const onChangeC1 = (e) => {
    setColor1(e.target.value);
  };

  const onChangeC2 = (e) => {
    setColor2(e.target.value);
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeImage = (e) => {
    // console.log(e.target.files[0]);
    setImage(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (ev) {
        setImageURL(ev.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (transcriptArray[0] !== null && transcriptArray[0] !== undefined) {
    console.log(transcriptArray[0].timestamps);
  }

  const stopAudio = () => {
    onStopPlayingSample();
    onStopPlayingFileUpload();
  };

  const textSubmitHandler = () => {
    // console.log(window.audio);

    if (transcriptArray[0] === null || transcriptArray[0] === undefined) {
      alert('No transcript provided');
      window.location.href = '/servicecontainer';
    }

    const inputText = {
      message: transcriptArray[0].text,
      timeDurartion: textTimeDuration,
      timestamps: transcriptArray[0].timestamps,
      edited: false,
      name: name,
      title1: title1,
      title2: title2,
      color1: color1,
      color2: color2,
      imageurl: imageurl,
      // audioFile: window.audio,           // not working
    };

    axios
      .post(`/text/${fire.auth().currentUser.uid}.json`, inputText)
      .then((response) => {
        window.location.href = '/';
        // console.log()
      })
      .catch((error) => console.log(error));
  };

  const newTo = {
    pathname: '/details',
    name: name,
    title1: title1,
    title2: title2,
    color1: color1,
    color2: color2,
    imageurl: imageurl,
    image: image,
    textSubmitHandler: textSubmitHandler,
  };

  return (
    <div>
      <div className="transcript-box">
        {transcriptArray.map((transcriptItem, overallIndex) => {
          const { speaker, text } = transcriptItem;
          const parsedTextElements = mapTranscriptTextToElements(
            text,
            keywordInfo,
            overallIndex,
          );

          return (
            <div key={`transcript-${overallIndex}`}>
              {speaker !== null && (
                <span className={`speaker-label--${speaker}`}>
                  {`Speaker ${speaker}: `}
                </span>
              )}
              {parsedTextElements.map((element, elementIndex) => {
                if (!element) {
                  return null;
                }

                if (element.type === 'normal') {
                  return (
                    <span
                      id="content-box"
                      key={`transcript-text-${overallIndex}-${elementIndex}`}
                    >
                      {
                        ((textTimeDuration = audioDuration),
                        `${element.text[element.text.length / 2]}` === undefined
                          ? null
                          : `${element.text[element.text.length / 2]}`,
                        (content = element.text))
                      }
                    </span>
                  );
                }

                return null;
              })}
            </div>
          );
        })}
      </div>

      <br></br>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="Name"
              label="Enter Name"
              name="name"
              onChange={onChangeName}
              value={name}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="Title 1"
              label="Enter Title 1"
              name="title1"
              onChange={onChangeT1}
              value={title1}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="Title 2"
              label="Enter Title 2"
              name="title2"
              onChange={onChangeT2}
              value={title2}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="Color 1"
              label="Enter Color 1"
              name="color1"
              onChange={onChangeC1}
              value={color1}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="Color 2"
              label="Enter Color 2"
              name="color2"
              onChange={onChangeC2}
              value={color2}
            />
          </Grid>
        </Grid>
      </div>
      <p>
        <label htmlFor="file">Upload Image</label>
      </p>
      <p>
        <input
          type="file"
          accept="image/*"
          name="image"
          id="file"
          onChange={onChangeImage}
        />
      </p>

      <Link to={newTo} style={{ width: `fit-content` }}>
        <div className="buttonBox">
          <button onClick={stopAudio}>Preview and Save</button>
        </div>
      </Link>
    </div>
  );
};

TranscriptBox.propTypes = {
  keywordInfo: PropTypes.arrayOf(PropTypes.object),
  transcriptArray: PropTypes.arrayOf(PropTypes.object),
  timestamps: PropTypes.arrayOf(PropTypes.object),
};

TranscriptBox.defaultProps = {
  keywordInfo: [],
  transcriptArray: [],
  timestamps: [],
};

export default TranscriptBox;
