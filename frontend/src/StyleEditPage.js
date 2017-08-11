import React, { Component } from 'react';
import history from './History.js';
import PropTypes from 'prop-types';

import IconAccentButton from './IconAccentButton.js';
import ColorPicker from './ColorPicker.js';
import LoadingSpinner from './LoadingSpinner.js';

import './StyleEditPage.css';

class StyleEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedTab: "unspoken"};

    this.handleChangeTab = this.handleChangeTab.bind(this);
  }

  handleChangeTab(tab) {
    if (tab !== this.state.selectedTab) {
      this.setState({selectedTab: tab});
    }
  }

  validHexColor(color) {
    return /^([A-F0-9]{6}|[A-F0-9]{3})$/i.test(color);
  }



  render() {
    const props = this.props;
    const selectedTab = this.state.selectedTab;
    const unspokenFontColor = props.titleStyles.unspokenFontColor;
    const spokenFontColor = props.titleStyles.spokenFontColor;

    return (
      <div>
        <h3>Customize your caption text.</h3>

        <div className="style_edit__tab_container">
          <div className={selectedTab === "unspoken" ? "style_edit__tab active" : "style_edit__tab"} onClick={() => {this.handleChangeTab("unspoken")}}>Text Color</div>
          <div className={selectedTab === "spoken" ? "style_edit__tab active" : "style_edit__tab"} onClick={() => {this.handleChangeTab("spoken")}}>Highlight Color</div>
        </div>
        <ColorPicker handleColorSelection={props.handleColorSelection} selectedColor={unspokenFontColor} changingProperty="unspokenFontColor" style={{display: selectedTab === "unspoken" ? "initial" : "none"}} />
        <ColorPicker handleColorSelection={props.handleColorSelection} selectedColor={spokenFontColor} changingProperty="spokenFontColor" style={{display: selectedTab === "spoken" ? "initial" : "none"}} />
        <div>
          <IconAccentButton type="button" buttonText="&larr;" buttonClickCallback={history.goBack} />
          <IconAccentButton buttonClickCallback={() => { history.push('word-edit') }} buttonText="&rarr;" disabledState={!this.props.watsonResponded || !this.validHexColor(unspokenFontColor) || !this.validHexColor(spokenFontColor)} />
        </div>
        <LoadingSpinner watsonResponded={props.watsonResponded} />
      </div>
    )
  }
}

StyleEditPage.propTypes = {
  titleStyles: PropTypes.object.isRequired,
  handleColorSelection: PropTypes.func,
  watsonResponded: PropTypes.bool
}

StyleEditPage.defaultProps = {
  handleColorSelection: () => {},
}

export default StyleEditPage;
