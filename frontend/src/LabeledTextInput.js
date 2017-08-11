import React from 'react';
import PropTypes from 'prop-types';

import './LabeledTextInput.css';

const LabeledTextInput = (props) => {
  return (
    <div className="labeledtext_input__container">
      <label htmlFor={props.inputID}>{props.labelText}</label>
      <br />
      <input type="text" name={props.inputID} id={props.inputID} value={props.inputValue} onChange={props.inputOnChangeCallback} />
    </div>
  )
}

LabeledTextInput.propTypes = {
  inputID: PropTypes.string,
  inputValue: PropTypes.string,
  labelText: PropTypes.string,
  inputOnChangeCallback: PropTypes.func,
};

LabeledTextInput.defaultProps = {
  inputID: '',
  inputValue: '',
  labelText: '',
  inputOnChangeCallback: () => {},
};

export default LabeledTextInput;
