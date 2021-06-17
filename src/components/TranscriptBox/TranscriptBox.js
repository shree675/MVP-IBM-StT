import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TooltipDefinition } from 'carbon-components-react';
import KeywordTooltip from '../KeywordTooltip';
import { createWordRegex } from './utils';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from '../../axios-submit';

var list = [];
var t = 0;

const mapTranscriptTextToElements = (text, keywordInfo, totalIndex) => {
  // var d = new Date();
  // if (list.length === 0) {
  //   t = d.getTime();
  // }
  // console.log(text);
  // list.push(d.getTime() - t);
  // console.log(list);

  // console.log(keywordInfo);
  let finalSentenceArray = [];
  let matches = [];

  if (keywordInfo.length > 0) {
    const regex = createWordRegex(keywordInfo);
    matches = text.split(regex);
  }
  // else {
  //   var str = '';
  //   for (var i = 0; i < text.length; i++) {
  //     str += text[i];
  //   }
  //   // const regex = createWordRegex(keywordInfo);
  //   matches = str.split(' ');
  //   keywordInfo = matches;
  //   // console.log(matches);
  // }

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
    // console.log(fragmentToSearch);

    if (index % 2 === 0) {
      return {
        text: sentenceFragment,
        type: 'normal',
      };
    }

    // console.log(totalIndex);

    const keywordInfoMatch =
      keywordInfo[totalIndex] && keywordInfo[totalIndex][fragmentToSearch];

    // console.log(keywordInfoMatch);

    let keywordOccurenceIndex = 0;
    if (wordOccurences[fragmentToSearch]) {
      keywordOccurenceIndex = wordOccurences[fragmentToSearch];
      wordOccurences[fragmentToSearch] += 1;
    } else {
      wordOccurences[fragmentToSearch] = 1;
    }
    const infoForOccurence =
      keywordInfoMatch && keywordInfoMatch[keywordOccurenceIndex];

    // console.log(infoForOccurence.start_time);
    // console.log(infoForOccurence.end_time);

    // const keywordInfoMatch = keywordInfo;

    // console.log(keywordInfo);

    // let keywordOccurenceIndex = 0;
    // if (wordOccurences[fragmentToSearch]) {
    //   keywordOccurenceIndex = wordOccurences[fragmentToSearch];
    //   wordOccurences[fragmentToSearch] += 1;
    // } else {
    //   wordOccurences[fragmentToSearch] = 1;
    // }
    // const infoForOccurence =
    //   keywordInfoMatch && keywordInfoMatch[keywordOccurenceIndex];

    // console.log(keywordInfoMatch[keywordOccurenceIndex]);

    // console.log(infoForOccurence.start_time);
    // console.log(infoForOccurence.end_time);

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
  timestamps,
}) => {
  let content = '';
  let textTimeDuration = '';

  const textSubmitHandler = () => {
    const inputText = {
      message: content,
      timeDurartion: textTimeDuration,
      timestamps: transcriptArray[0].timestamps,
    };

    console.log(transcriptArray[0].timestamps);

    axios
      .post('/text.json', inputText)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
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
                      key={`transcript-text-${overallIndex}-${elementIndex}`}
                    >
                      {
                        ((textTimeDuration = audioDuration),
                        (`${element.text[element.text.length / 2]}` ===
                        undefined
                          ? null
                          : `${element.text[element.text.length / 2]}`,
                        (content = element.text)))
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
      <div className="buttonBox">
        <button onClick={textSubmitHandler}>Save</button>
      </div>
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
