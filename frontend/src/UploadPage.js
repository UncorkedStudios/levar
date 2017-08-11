import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import TextAccentButton from './TextAccentButton.js';
import FileInputButton from './FileInputButton.js';

const UploadPage = (props) => {
  return (
    <div>

      <h2>Upload your video file to add a custom caption</h2>

      <Dropzone className="uploadpage_dropzone" onDrop={props.onDrop.bind(this)}></Dropzone>

      <div style={{height: '48px'}}>
        <p>{props.fileInput[0].name}</p>
      </div>

      <FileInputButton inverted={props.fileInput[0].name !== ""} buttonText="Add Video File" buttonClickCallback={props.chooseFile} inputName="videoFile" acceptFiles="video" />

      <TextAccentButton disabledState={props.fileInput[0].name === ""} buttonText="Continue &rarr;" buttonClickCallback={props.handleVideoSubmission}/>
    </div>
  )
}

UploadPage.propTypes = {
  fileInput: PropTypes.array.isRequired,
  onDrop: PropTypes.func,
  chooseFile: PropTypes.func,
  handleVideoSubmission: PropTypes.func,
};

UploadPage.defaultProps = {
  onDrop: () => {},
  chooseFile: () => {},
  handleVideoSubmission: () => {},
};

export default UploadPage;
