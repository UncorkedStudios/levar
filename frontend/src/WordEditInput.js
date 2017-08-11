import React from 'react';
import PropTypes from 'prop-types';

import './WordEditInput.css';

const WordEditInput = (props) => {
  return (
    <span className="wordedit_input__container">
      <input disabled={!props.editEnabled} type="text" style={{width: `${props.wordArray[0].length + .5}ch`}} defaultValue={props.wordArray[0]} data-number={props.wordNumber} onChange={props.handleWordEdit} />
    </span>
  )
}

WordEditInput.propTypes = {
  wordArray: PropTypes.array.isRequired,
  wordNumber: PropTypes.number,
  handleWordEdit: PropTypes.func,
}

export default WordEditInput;
