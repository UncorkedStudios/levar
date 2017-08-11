import React from 'react';
import PropTypes from 'prop-types';

import './FileInputButton.css';

const FileInputButton = (props) => {
  let classes = "btn btn-big btn-accent";

  if (props.inverted) {
    classes += " btn-accent-inverted";
  }

  return (
    <div className="fileinput_button__container">
      <label className={classes} htmlFor={props.inputName}>{props.buttonText}</label>
      <input type="file" name={props.inputName} id={props.inputName} style={{display: 'none'}} onClick={props.buttonClickCallback} onChange={props.onChangeCallback} accept={props.acceptFiles} />
    </div>
  )
}

FileInputButton.propTypes = {
  inverted: PropTypes.bool,
  inputName: PropTypes.string,
  acceptFiles: PropTypes.string,
  buttonText: PropTypes.string,
  buttonClickCallback: PropTypes.func,
  onChangeCallback : PropTypes.func,
};

FileInputButton.defaultProps = {
  inverted: false,
  inputName: "",
  acceptFiles: "*",
  buttonText: "Upload File",
  buttonClickCallback: () => {},
  onChangeCallback: () => {},
};

export default FileInputButton;
