import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, FileUploaderButton } from 'carbon-components-react';
import fetch from 'isomorphic-fetch';
import models from '../../data/models.json';
// const toWav = require('audiobuffer-to-wav');
// const audioContext = new AudioContext();
// var audioCtx = new AudioContext();
// var ffmpeg = require('fluent-ffmpeg');
// var xhr = require('xhr');
// const { getAudioDurationInSeconds } = require('get-audio-duration');
// import { save } from 'save-file';

export const SubmitContainer = ({
  isSamplePlaying,
  isUploadPlaying,
  keywordText,
  modelName,
  onError,
  onStartPlayingFileUpload,
  onStopPlayingFileUpload,
  onStartPlayingSample,
  onStopPlayingSample,
  useSpeakerLabels,
  time,
}) => {
  const [keywordList, setKeywordList] = useState([]);
  const [audiofile, setAudioFile] = useState(null);
  useEffect(() => {
    let newKeywordList = [];
    if (keywordText.length > 0) {
      newKeywordList = keywordText.split(',').map((k) => k.trim());
    }
    setKeywordList(newKeywordList);
  }, [keywordText, audiofile]);

  const sampleModelInfo = models.find((model) => model.name === modelName);
  const sampleModelFilename = sampleModelInfo ? sampleModelInfo.filename : null;

  const getBaseAudioConfig = async () => {
    let authResponse;
    let authJson;
    authResponse = await fetch('/api/auth');
    authJson = await authResponse.json();
    if (!authResponse.ok) {
      onError(authJson);
      return {
        error: authJson,
      };
    }

    let options = {};

    const lowerCasedKeywords = keywordList.map((keyword) =>
      keyword.toLowerCase(),
    );

    options = {
      ...options,
      url: authJson.url || undefined,
      accessToken: authJson.accessToken,
      format: true,
      keywords: keywordList.length > 0 ? lowerCasedKeywords : undefined,
      keywordsThreshold: keywordList.length > 0 ? 0.01 : undefined,
      model: modelName,
      objectMode: true,
      play: true,
      realtime: true,
      resultsBySpeaker: useSpeakerLabels,
      speakerlessInterim: true,
      timestamps: true,
    };

    return options;
  };

  const getSampleAudioConfig = async () => {
    const baseConfig = await getBaseAudioConfig();
    return {
      ...baseConfig,
      file: `audio/${sampleModelFilename}`,
    };
  };

  const getUploadAudioConfig = async (file) => {
    const baseConfig = await getBaseAudioConfig();
    return {
      ...baseConfig,
      file,
      resultsBySpeaker: false,
    };
  };

  return (
    <div className="submit-container">
      {isSamplePlaying ? (
        <Button
          className="submit-button"
          kind="tertiary"
          onClick={onStopPlayingSample}
        >
          Stop audio sample
        </Button>
      ) : (
        <Button
          className="submit-button"
          disabled={!modelName}
          kind="tertiary"
          onClick={async () => {
            const config = await getSampleAudioConfig();
            if (!config.error) {
              // setAudioFile()
              onStartPlayingSample(config);
            }
          }}
        >
          Play audio sample
        </Button>
      )}
      {isUploadPlaying ? (
        <Button
          className="submit-button"
          kind="tertiary"
          onClick={onStopPlayingFileUpload}
        >
          Stop playing
        </Button>
      ) : (
        <FileUploaderButton
          accept={[
            'audio/mpeg',
            'audio/ogg',
            'audio/wav',
            'audio/flac',
            'audio/opus',
            'audio/mp3',
          ]}
          buttonKind="tertiary"
          className="submit-button"
          disabled={!modelName}
          disableLabelChanges
          labelText="Upload file"
          onChange={async (evt) => {
            const uploadedFile = evt.currentTarget.files[0];
            const config = await getUploadAudioConfig(uploadedFile);

            if (!config.error) {
              setAudioFile(uploadedFile);
              window.audio = uploadedFile;
              onStartPlayingFileUpload(config);
            }
          }}
        />
      )}
    </div>
  );
};

SubmitContainer.propTypes = {
  isRecording: PropTypes.bool,
  isSamplePlaying: PropTypes.bool,
  isUploadPlaying: PropTypes.bool,
  keywordText: PropTypes.string,
  modelName: PropTypes.string,
  onError: PropTypes.func,
  onStartPlayingFileUpload: PropTypes.func,
  onStopPlayingFileUpload: PropTypes.func,
  onStartPlayingSample: PropTypes.func,
  onStopPlayingSample: PropTypes.func,
  onStartRecording: PropTypes.func,
  onStopRecording: PropTypes.func,
  useSpeakerLabels: PropTypes.bool,
};

SubmitContainer.defaultProps = {
  isRecording: false,
  isSamplePlaying: false,
  isUploadPlaying: false,
  keywordText: '',
  modelName: null,
  onError: () => {},
  onStartPlayingFileUpload: () => {},
  onStopPlayingFileUpload: () => {},
  onStartPlayingSample: () => {},
  onStopPlayingSample: () => {},
  onStartRecording: () => {},
  onStopRecording: () => {},
  useSpeakerLabels: false,
};

export default SubmitContainer;
