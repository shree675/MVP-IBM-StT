import React, { useEffect, useReducer, useRef, useState } from 'react';
import recognizeFile from 'watson-speech/speech-to-text/recognize-file';
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import ControlContainer from '../ControlContainer';
import OutputContainer from '../OutputContainer';
import Toast from '../Toast';
import { actionTypes, initialState, reducer } from './reducer';
import { convertAudioBlobToVisualizationData, formatStreamData } from './utils';
import { createError } from '../../utils';
import { Link } from 'react-router-dom';

const FILE_UPLOAD_ERROR_TITLE = 'File upload error';
const FILE_UPLOAD_ERROR_DESCRIPTION =
  'There was a problem trying to read the file.';
const NO_MICROPHONE_TITLE = 'No microphone detected';
const NO_MICROPHONE_DESCRIPTION = 'Cannot transcribe from microphone.';
const AUDIO_TRANSCRIPTION_ERROR_TITLE = 'Audio transcription error';
const AUDIO_TRANSCRIPTION_ERROR_DESCRIPTION =
  'There was an error trying to read the audio data. Please try again.';
const GDPR_DISCLAIMER =
  'This system is for demonstration purposes only and is not intended to process Personal Data. No Personal Data is to be entered into this system as it may not have the necessary controls in place to meet the requirements of the General Data Protection Regulation (EU) 2016/679.';

export const ServiceContainer = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audioWaveContainerRef = useRef(null);
  const [time, setTime] = useState(0);
  // const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioAnalyzer = audioContext.createAnalyser();

    dispatch({
      audioAnalyzer,
      type: actionTypes.setAudioAnalyzer,
    });
    dispatch({
      audioContext,
      type: actionTypes.setAudioContext,
    });
  }, []);

  const parseResults = (data) => {
    if (data.speaker_labels) {
      dispatch({
        speakerLabels: data.speaker_labels,
        type: actionTypes.setSpeakerLabels,
      });
    } else {
      const {
        transcript,
        keywordInfo,
        resultIndex,
        timestamps,
      } = formatStreamData(data);

      // console.log(data.results[0].alternatives[0].timestamps);

      // console.log(timestamps);

      // tmst = data.results[0].alternatives[0].timestamps;
      // setTimestamps(tmst);

      // setTimestamps(data.results[0].alternatives[0].timestamps);
      // console.log(timestamps);

      dispatch({
        keywordInfo,
        resultIndex,
        transcript,
        timestamps,
        type: actionTypes.updateResults,
      });
    }
  };

  const handleStreamEnd = () => {
    if (state.audioStream) {
      state.audioStream.stop();
    }

    dispatch({
      isTranscribing: false,
      type: actionTypes.setIsTranscribing,
    });
    dispatch({
      isUploadPlaying: false,
      type: actionTypes.setIsUploadPlaying,
    });
    dispatch({
      isSamplePlaying: false,
      type: actionTypes.setIsSamplePlaying,
    });
    dispatch({
      isRecording: false,
      type: actionTypes.setIsRecording,
    });
  };

  const readAudioFileForVisualization = async (filename) => {
    let containerClientWidth = null;
    if (
      audioWaveContainerRef &&
      audioWaveContainerRef.current &&
      audioWaveContainerRef.current.clientWidth
    ) {
      containerClientWidth = audioWaveContainerRef.current.clientWidth;
    }
    const audioVisualizationWidth = containerClientWidth || 300;

    const isFileType = filename instanceof File;
    try {
      let audioBlob = null;

      if (isFileType) {
        audioBlob = filename;
      } else {
        const audioRequest = await fetch(filename);
        audioBlob = await audioRequest.blob();
      }
      const {
        reducedFloatArray,
        duration,
      } = await convertAudioBlobToVisualizationData(
        audioBlob,
        state.audioContext,
        audioVisualizationWidth,
      );

      if (duration > 120) {
        setTimeout(() => {
          // stopPlay();
          document.getElementById('st').click();
          alert(
            'Audio file length exceeds 2 minutes. Please upload audio files shorter than 2 minutes in duration.',
          );
        }, 1);
      }
      // setTime(duration);

      dispatch({
        audioDataArray: reducedFloatArray,
        audioDurationInMs: duration * 1000,
        type: actionTypes.setAudioVisualizationData,
      });
    } catch (err) {
      dispatch({
        error: createError(
          FILE_UPLOAD_ERROR_TITLE,
          FILE_UPLOAD_ERROR_DESCRIPTION,
        ),
        type: actionTypes.setError,
      });
    }
  };

  const captureAudioFromMicrophone = async (recognizeOptions) => {
    let mediaStream = null;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
    } catch (err) {
      dispatch({
        error: createError(NO_MICROPHONE_TITLE, NO_MICROPHONE_DESCRIPTION),
        type: actionTypes.setError,
      });
    }

    const recognizeMicrophoneStream = recognizeMicrophone({
      ...recognizeOptions,
      mediaStream,
      keepMic: true,
    });

    if (mediaStream) {
      const updatedAudioAnalyzer = state.audioAnalyzer;
      updatedAudioAnalyzer.fttSize = 2048;
      dispatch({
        audioAnalyzer: updatedAudioAnalyzer,
        type: actionTypes.setAudioAnalyzer,
      });
      const mediaStreamSource = state.audioContext.createMediaStreamSource(
        mediaStream,
      );
      mediaStreamSource.connect(state.audioAnalyzer);
    }

    return recognizeMicrophoneStream;
  };

  const onSubmit = (stream) => {
    stream
      .on('data', (data) => {
        parseResults(data);
        // console.log(state.timestamp);
        // console.log(tmst);
      })
      .on('end', () => {
        handleStreamEnd();
        // setTimestamps(tmst);
        // console.log(timestamps);
      })
      .on('error', () => {
        dispatch({
          error: createError(
            AUDIO_TRANSCRIPTION_ERROR_TITLE,
            AUDIO_TRANSCRIPTION_ERROR_DESCRIPTION,
          ),
          type: actionTypes.setError,
        });

        handleStreamEnd();
      });

    dispatch({
      isTranscribing: true,
      type: actionTypes.setIsTranscribing,
    });
  };

  const cleanUpOldStreamIfNecessary = () => {
    if (state.audioStream) {
      state.audioStream.stop();
      state.audioStream.removeAllListeners();
      state.audioStream.recognizeStream.removeAllListeners();
    }

    if (state.audioContext && state.audioContext.state === 'suspended') {
      state.audioContext.resume();
    }
  };

  const onSelectNewModel = () => {
    dispatch({
      audioDataArray: [],
      audioDurationInMs: 0,
      type: actionTypes.setAudioVisualizationData,
    });
    dispatch({
      keywordInfo: [],
      resultIndex: 0,
      transcript: [],
      type: actionTypes.updateResults,
    });
  };

  const onStartPlayingFileUpload = async (recognizeConfig) => {
    cleanUpOldStreamIfNecessary();

    const stream = recognizeFile(recognizeConfig);
    // console.log(stream);
    await readAudioFileForVisualization(recognizeConfig.file);
    dispatch({
      isUploadPlaying: true,
      type: actionTypes.setIsUploadPlaying,
    });
    dispatch({
      isSamplePlaying: false,
      type: actionTypes.setIsSamplePlaying,
    });
    dispatch({
      isRecording: false,
      type: actionTypes.setIsRecording,
    });
    dispatch({
      audioSource: 'upload',
      type: actionTypes.setAudioSource,
    });
    dispatch({
      audioStream: stream,
      type: actionTypes.setAudioStream,
    });

    onSubmit(stream);
  };

  const onStopPlayingFileUpload = () => {
    handleStreamEnd();
    dispatch({
      isUploadPlaying: false,
      type: actionTypes.setIsUploadPlaying,
    });
  };

  const onStartPlayingSample = async (recognizeConfig) => {
    cleanUpOldStreamIfNecessary();

    const stream = recognizeFile(recognizeConfig);
    await readAudioFileForVisualization(recognizeConfig.file);
    dispatch({
      isSamplePlaying: true,
      type: actionTypes.setIsSamplePlaying,
    });
    dispatch({
      isUploadPlaying: false,
      type: actionTypes.setIsUploadPlaying,
    });
    dispatch({
      isRecording: false,
      type: actionTypes.setIsRecording,
    });
    dispatch({
      audioSource: 'sample',
      type: actionTypes.setAudioSource,
    });
    dispatch({
      audioStream: stream,
      type: actionTypes.setAudioStream,
    });

    onSubmit(stream);
  };

  const stopPlay = () => {
    onStopPlayingSample();
    onStopPlayingFileUpload();
  };

  const onStopPlayingSample = () => {
    handleStreamEnd();
    dispatch({
      isSamplePlaying: false,
      type: actionTypes.setIsSamplePlaying,
    });
  };

  const onError = (error) => {
    dispatch({
      error,
      type: actionTypes.setError,
    });
  };

  window.onpopstate = function () {
    stopPlay();
  };

  // window.onload = (e) => {
  //   // e.preventDefault();
  //   console.log('load');
  //   // window.stop();

  //   // window.location = '/';
  // window.location.href = '/';
  // document.getElementById('stop').click();

  //   // document.getElementById('stop').click();
  // };
  window.onbeforeunload = function (event) {
    event.returnValue =
      'Dude, are you sure you want to leave? Think of the kittens!';
    // document.getElementById('stop').click();
    window.location.href = '/';
  };

  window.addEventListener('beforeunload', function (e) {
    e.preventDefault(); // firefox
    e.returnValue = ''; // Chrome
    // document.getElementById('stop').click();
    window.location.href = '/';
  });

  // window.onbeforeunload = (e) => {
  //   // e.preventDefault();
  //   e.returnValue = 'hello';
  //   // e.stopImmediatePropagation();
  //   console.log('before unload');
  //   // window.stop();
  //   document.getElementById('stop').click();

  //   window.onbeforeunload = false;
  //   return null;
  //   window.location.href = '/';
  //   window.stop();
  // };

  // window.onloadeddata = (e) => {
  //   document.getElementById('stop').click();
  // };

  // window.onunload = (e) => {
  //   e.preventDefault();
  //   console.log('r');
  //   alert('hello');

  //   // window.location = '/';
  //   document.getElementById('stop').click();
  //   window.location.href = '/';
  // };

  return (
    <div>
      <button
        onClick={() => {
          stopPlay();
          props.handleLogout();
        }}
      >
        Logout
      </button>
      <button
        id="st"
        onClick={() => {
          stopPlay();
        }}
      >
        Stop Playing
      </button>
      <Link to="/">
        <button
          id="stop"
          onClick={() => {
            stopPlay();
          }}
          style={{ textDecoration: `none` }}
        >
          List of translations
        </button>
      </Link>
      <div className="service-container">
        <Toast kind="info" subtitle={GDPR_DISCLAIMER} />
        {state.error && (
          <Toast
            kind="error"
            title={state.error.title}
            subtitle={state.error.description}
            hideAfterFirstDisplay={false}
            timeout={5000}
            onCloseButtonClick={() =>
              dispatch({ error: null, type: actionTypes.setError })
            }
          />
        )}
        <ControlContainer
          isSamplePlaying={state.isSamplePlaying}
          isUploadPlaying={state.isUploadPlaying}
          onError={onError}
          onSelectNewModel={onSelectNewModel}
          onStartPlayingFileUpload={onStartPlayingFileUpload}
          onStopPlayingFileUpload={onStopPlayingFileUpload}
          onStartPlayingSample={onStartPlayingSample}
          onStopPlayingSample={onStopPlayingSample}
          time={time}
        />
        <OutputContainer
          audioAnalyzer={state.audioAnalyzer}
          audioDataArray={state.audioDataArray}
          audioDuration={state.audioDurationInMs}
          audioSource={state.audioSource}
          audioWaveContainerRef={audioWaveContainerRef}
          isTranscribing={state.isTranscribing}
          keywordInfo={state.keywordInfo}
          transcriptArray={state.transcript}
          onStartPlayingSample={onStartPlayingSample}
          onStopPlayingSample={onStopPlayingSample}
          timestamps={state.timestamps}
          username={props.username}
        />
      </div>
    </div>
  );
};

export default ServiceContainer;
