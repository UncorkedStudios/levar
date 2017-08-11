import React from 'react';
import PropTypes from 'prop-types';

import './IconAccentButton.css';

const IconAccentButton = (props) => {
  return (
    <span className="iconaccent_button__container">
      <button className="btn btn-accent btn-icon" disabled={props.disabledState} onClick={props.buttonClickCallback}>{props.buttonText}</button>
    </span>
  )
}

IconAccentButton.propTypes = {
  disabled: PropTypes.bool,
  buttonClickCallback: PropTypes.func,
  buttonText: PropTypes.string,
}

IconAccentButton.defaultProps = {
  disabled: false,
  buttonClickCallback: () => {},
  buttonText: ""
};

export default IconAccentButton;
