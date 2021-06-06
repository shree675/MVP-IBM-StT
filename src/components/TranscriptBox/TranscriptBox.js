import React from 'react';
import PropTypes from 'prop-types';
import { TooltipDefinition } from 'carbon-components-react';
import KeywordTooltip from '../KeywordTooltip';
import { createWordRegex } from './utils';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import axios from '../../axios-submit'

const mapTranscriptTextToElements = (text, keywordInfo, totalIndex) => {
  let finalSentenceArray = [];
  let matches = [];
 

  if (keywordInfo.length > 0) {
    const regex = createWordRegex(keywordInfo);
    matches = text.split(regex);
  }

  // If we don't have words to find yet, just return the interim text.
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
    // Use lowercased version when searching through keyword map.
    const fragmentToSearch = sentenceFragment.toLowerCase();

    if (index % 2 === 0) {
      return {
        text: sentenceFragment,
        type: 'normal',
      };
    }

    // Find keyword info object to use based on text from sentenceFragment and
    // current index in wordOccurences.
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

    // Bail in case we can't get the keyword info for whatever reason.
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

export const TranscriptBox = ({ keywordInfo, transcriptArray }) => {

  let content="";

  const textSubmitHandler = () => {
    const inputText = {
        message:content
    }
    axios.post('/text.json', inputText)
    .then(response => console.log(response))
    .catch(error => console.log(error));
}

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
                  >{`${element.text}`}
                  {content = element.text}</span>
                );
              } else if (element.type === 'keyword') {
                return (
                  <TooltipDefinition
                    align="center"
                    direction="top"
                    key={`transcript-keyword-${overallIndex}-${elementIndex}`}
                    tooltipText={
                      <KeywordTooltip
                        confidence={element.confidence}
                        startTime={element.startTime}
                        endTime={element.endTime}
                      />
                    }
                    triggerClassName="keyword-info-trigger"
                  >
                    {element.text}
                    {content = element.text}
                  </TooltipDefinition>
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
      <Link to='/history'><button>history</button></Link>
    </div>
    </div>
  );
};

TranscriptBox.propTypes = {
  keywordInfo: PropTypes.arrayOf(PropTypes.object),
  transcriptArray: PropTypes.arrayOf(PropTypes.object),
};

TranscriptBox.defaultProps = {
  keywordInfo: [],
  transcriptArray: [],
};

export default TranscriptBox;
