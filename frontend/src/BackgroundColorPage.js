import React from 'react';
import PropTypes from 'prop-types';
import history from './History.js';

import IconAccentButton from './IconAccentButton.js';
import ColorPicker from './ColorPicker.js';

import './StyleEditPage.css';

const BackgroundColorPage = (props) => {

  function validHexColor(color) {
    return /^([A-F0-9]{6}|[A-F0-9]{3})$/i.test(color);
  }

  return (
    <div>
      <h3>Pick your background color:</h3>
      <div className="flex-wrap">
        <ColorPicker handleColorSelection={props.handleColorSelection} selectedColor={props.backgroundColor} changingProperty="background" />
      </div>
      <div>
        <IconAccentButton type="button" buttonText="&larr;" buttonClickCallback={history.goBack} />
        <IconAccentButton buttonClickCallback={() => {history.push('/font-style')}} buttonText="&rarr;" disabledState={!validHexColor(props.backgroundColor)}/>
      </div>
    </div>
  )
}

BackgroundColorPage.propTypes = {
  backgroundColor: PropTypes.string,
  handleColorSelection: PropTypes.func,
}

BackgroundColorPage.defaultProps = {
  backgroundColor: '',
  handleColorSelection: () => {},
}

export default BackgroundColorPage;
