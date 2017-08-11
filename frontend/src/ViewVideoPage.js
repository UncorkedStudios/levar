import React from 'react';
import history from './History.js';
import PropTypes from 'prop-types';

import IconAccentButton from './IconAccentButton.js';

import './ViewVideoPage.css';

const ViewVideoPage = (props) => {
  return (
    <div className="viewvideo_container">
      <h3>Your video is ready to go. Download below.</h3>
      <video controls preload src={props.outputFile}></video>
      <a className="btn btn-accent block" href={props.outputFile} download>Download Video</a>
      <IconAccentButton type="button" buttonText="&larr;" buttonClickCallback={history.goBack} />
    </div>
  )
}

ViewVideoPage.propTypes = {
  outputFile: PropTypes.string,
}

ViewVideoPage.defaultProps = {
  outputFile: '',
}

export default ViewVideoPage;
