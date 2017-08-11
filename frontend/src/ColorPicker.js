import React from 'react';
import PropTypes from 'prop-types';

import './ColorPicker.css';

const ColorPicker = (props) => {
  const selectedColor = props.selectedColor;
  const colors = [
    "19BC9C",
    "2ECC71",
    "3398DB",
    "9B59B6",
    "34495E",
    "F1C40E",
    "E67E21",
    "E74C3C",
    "ECF0F1",
    "94A5A6",
  ];

  function validHexColor(color) {
    return /^([A-F0-9]{6}|[A-F0-9]{3})$/i.test(color);
  }

  const swatches = colors.map((elem, idx) => {
    let setClass = elem === selectedColor ? "colorpicker__swatch active" : "colorpicker__swatch";

    return (
      <div key={idx} className={setClass} onClick={(e) => {props.handleColorSelection(e.target.dataset.color, props.changingProperty)}} data-color={elem} style={{background: `#${elem}`}}>
        <svg className="colorpicker__check" viewBox="0 0 94.9 68.7">
          <path d="M36.5,68.7L36.5,68.7c-2.7,0-5.4-1.1-7.3-3L3,39.5c-4-4-4-10.6,0-14.6s10.6-4,14.6,0l18.9,18.9L77.3,3c4-4,10.6-4,14.6,0 s4,10.6,0,14.6L43.8,65.7C41.9,67.6,39.3,68.7,36.5,68.7z"/>
        </svg>
      </div>
    )
  });

  let swatchGroups = [];
  for (let i = 0; i < swatches.length; i += 5) {
    swatchGroups.push(swatches.slice(i, i + 5));
  }
  swatchGroups = swatchGroups.map((elem, idx) => {
    return <div key={idx} className="flex-wrap">{elem}</div>
  })

  let inputSwatchBackground = validHexColor(selectedColor) ? `#${selectedColor}` : "transparent";

  let inputSwatch = "";
  if (validHexColor(selectedColor) && colors.indexOf(selectedColor.toUpperCase()) === -1) {
    inputSwatch = (
      <div className="colorpicker_input__swatch" style={{"backgroundColor": inputSwatchBackground}}>
        <svg className="colorpicker__check" viewBox="0 0 94.9 68.7">
          <path d="M36.5,68.7L36.5,68.7c-2.7,0-5.4-1.1-7.3-3L3,39.5c-4-4-4-10.6,0-14.6s10.6-4,14.6,0l18.9,18.9L77.3,3c4-4,10.6-4,14.6,0 s4,10.6,0,14.6L43.8,65.7C41.9,67.6,39.3,68.7,36.5,68.7z"/>
        </svg>
      </div>
    )
  }

  return (
    <div style={props.style}>
      {swatchGroups}
      <div className="colorpicker_input__container">
        <p className="colorpicker_input__label">HEX #</p>
        {inputSwatch}
        <input className="colorpicker__input" size="6" maxLength="6" value={selectedColor || ""} onChange={(e) => {props.handleColorSelection(e.target.value, props.changingProperty)}} type="text" />
      </div>
    </div>
  )
}

ColorPicker.propTypes = {
  handleColorSelection: PropTypes.func,
  changingProperty: PropTypes.string,
  selectedColor: PropTypes.string,
}

ColorPicker.defaultProps = {
  changingProperty: ""
};

export default ColorPicker;
