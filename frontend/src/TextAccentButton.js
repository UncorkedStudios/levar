import React from 'react';
import PropTypes from 'prop-types';

import './TextAccentButton.css';

const TextAccentButton = (props) => {
  let classes = "btn btn-big btn-accent";

  if (props.inverted) {
    classes += " btn-accent-inverted";
  }

  return (
    <div className="textaccent_button__container">
      <button className={classes} disabled={props.disabledState} onClick={props.buttonClickCallback}>{props.buttonText}</button>
    </div>
  )
}

TextAccentButton.propTypes = {
  disabledState: PropTypes.bool,
  inverted: PropTypes.bool,
  buttonClickCallback: PropTypes.func,
  buttonText: PropTypes.string,
};

TextAccentButton.defaultProps = {
  disabledState: false,
  inverted: false,
  buttonClickCallback: () => {},
  buttonText: () => {},
};

export default TextAccentButton;
