import React from 'react';
import history from './History.js';
import PropTypes from 'prop-types';

import IconAccentButton from './IconAccentButton.js';
import TextAccentButton from './TextAccentButton.js';
import FontConstants from './FontConstants.js';
import FontSlider from './FontSlider.js';

import './FontStylePage.css';

class FontStylePage extends React.Component {

  constructor(props) {
    super(props);

    let fontStyle = this.props.fontStyleSelection;
    let fontIndex = FontConstants.indexOf(fontStyle);

    this.state = {
      fontIndex: fontIndex,
      index: 0
    }

    this.handleChangeSlide = this.handleChangeSlide.bind(this);
    this.handleFontStyleSelection = this.handleFontStyleSelection.bind(this);
    this.handleFontProceed = this.handleFontProceed.bind(this);
  }

  handleChangeSlide(i){
    this.setState({index: i});
  }

  handleFontStyleSelection(){
    this.setState({fontIndex: this.state.index});
  }

  handleFontProceed(){
    let fontStyle = FontConstants[this.state.fontIndex];
    this.props.handleFontProceed(fontStyle);
  }

  render() {
    return (
      <div>
        <h3>Select a font for text on your video.</h3>

        <FontSlider fontStyleSelection={this.fontStyleSelection} handleChangeSlide={this.handleChangeSlide}/>
        <br />
        <TextAccentButton inverted={this.state.index === this.state.fontIndex} buttonText="Use this font" buttonClickCallback={() => {this.handleFontStyleSelection()}} />

        <div>
          <IconAccentButton type="button" buttonText="&larr;" buttonClickCallback={history.goBack} />
          <IconAccentButton buttonClickCallback={this.handleFontProceed} buttonText="&rarr;" disabledState={this.state.fontIndex === -1}/>
        </div>

      </div>
    )
  }
}

FontStylePage.propTypes = {
  handleFontProceed: PropTypes.func
};

FontStylePage.defaultProps = {
  handleFontProceed: () => {}
};

export default FontStylePage;
