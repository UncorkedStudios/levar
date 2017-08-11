import React from 'react';
import history from './History.js';

import IconAccentButton from './IconAccentButton.js';
import TextAccentButton from './TextAccentButton.js';
import FileInputButton from './FileInputButton.js';

export default (props) => {
  return (
    <div>
      <h3>Customize your video background.</h3>

      <TextAccentButton inverted={props.backgroundSelection === "video"} buttonText="Use my video" buttonClickCallback={() => {props.handleBackgroundSelection("video")}}/>

      <FileInputButton inverted={props.backgroundSelection === "image"} buttonText={"Upload an Image"} onChangeCallback={() => {props.handleBackgroundSelection("image")}} acceptFiles=".jpg, .jpeg, .png" inputName="imageFile" />

      <TextAccentButton inverted={props.backgroundSelection === "color"} buttonText="Choose a color" buttonClickCallback={() => {props.handleBackgroundSelection("color")}}/>

      <div>
        <IconAccentButton type="button" buttonText="&larr;" buttonClickCallback={history.goBack} />
        <IconAccentButton buttonClickCallback={props.handleBackgroundProceed} buttonText="&rarr;" disabledState={!props.backgroundSelection}/>

      </div>

    </div>
  )
}
