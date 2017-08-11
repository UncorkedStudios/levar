import React, {Component} from 'react';
import history from './History.js';
import PropTypes from 'prop-types';

import WordEditInput from './WordEditInput.js';
import IconAccentButton from './IconAccentButton.js';

import './WordEditPage.css';

class WordEditPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editEnabled: false,
      playingAudio: false,
    };

    this.handleEditToggle = this.handleEditToggle.bind(this);
    this.handleAudioPlayer = this.handleAudioPlayer.bind(this);
  }

  handleEditToggle() {
    this.setState({editEnabled: !this.state.editEnabled});
  }

  handleAudioPlayer() {
    if (this.state.playingAudio) {
      this.setState({playingAudio: false});
      this.audioPlayer.pause();
    } else {
      this.setState({playingAudio: true});
      this.audioPlayer.play();
    }
  }

  render() {
    const props = this.props;

    const wordInputs = props.words.map((elem, idx) => {
      return <WordEditInput editEnabled={this.state.editEnabled} wordArray={elem} wordNumber={idx} key={idx} handleWordEdit={props.handleWordEdit} />
    });

    const audioIcon = this.state.playingAudio ? (
      <svg className="word_edit__icon" viewBox="0 0 510 510">
      	<g>
      		<path d="M178.5,357h51V153h-51V357z M255,0C114.75,0,0,114.75,0,255s114.75,255,255,255s255-114.75,255-255S395.25,0,255,0z M255,459c-112.2,0-204-91.8-204-204S142.8,51,255,51s204,91.8,204,204S367.2,459,255,459z M280.5,357h51V153h-51V357z"/>
      	</g>
      </svg>
    ) : (
      <svg className="word_edit__icon" viewBox="0 0 30 30">
      	<g>
      		<path d="M19.982,14.438l-6.24-4.536c-0.229-0.166-0.533-0.191-0.784-0.062c-0.253,0.128-0.411,0.388-0.411,0.669v9.069 c0,0.284,0.158,0.543,0.411,0.671c0.107,0.054,0.224,0.081,0.342,0.081c0.154,0,0.31-0.049,0.442-0.146l6.24-4.532 c0.197-0.145,0.312-0.369,0.312-0.607C20.295,14.803,20.177,14.58,19.982,14.438z" />
      		<path d="M15.026,0.002C6.726,0.002,0,6.728,0,15.028c0,8.297,6.726,15.021,15.026,15.021c8.298,0,15.025-6.725,15.025-15.021 C30.052,6.728,23.324,0.002,15.026,0.002z M15.026,27.542c-6.912,0-12.516-5.601-12.516-12.514c0-6.91,5.604-12.518,12.516-12.518 c6.911,0,12.514,5.607,12.514,12.518C27.541,21.941,21.937,27.542,15.026,27.542z" />
      	</g>
      </svg>
    )

    return (
      <div>
        <h3>This is what we heard, but we all make mistakes, so select any words you’d like to edit.</h3>

        <audio id="audioPlayer" ref={(ref)=>{this.audioPlayer = ref;}} onEnded={this.handleAudioPlayer} className="hidden" src={props.audioPath} />
        <br/>
        <div className="word_edit__outer_container">
          <div onClick={this.handleAudioPlayer} className={"btn btn-toggle active"}>{audioIcon}</div>
          <div onClick={this.handleEditToggle} className={this.state.editEnabled ? "btn btn-toggle active" : "btn btn-toggle"}>
            <svg className="word_edit__icon" x="0px" y="0px" viewBox="0 0 78.3 78.3">
              <path d="M77.6,18.4L59.9,0.7c-1-1-2.6-1-3.5,0L45.7,11.4c0,0,0,0,0,0s0,0,0,0L5.2,51.9c-0.3,0.3-0.6,0.8-0.7,1.3L0,75.3
                c-0.2,0.8,0.1,1.7,0.7,2.3c0.5,0.5,1.1,0.7,1.8,0.7c0.2,0,0.3,0,0.5-0.1l22.2-4.5c0.5-0.1,0.9-0.3,1.3-0.7l51.1-51.1
                c0.5-0.5,0.7-1.1,0.7-1.8S78,18.9,77.6,18.4z M31.7,60.7L17.6,46.6l29.9-29.9l14.1,14.1L31.7,60.7z M23.4,69L5.7,72.6l3.6-17.7
                l4.8-4.8l14.1,14.1L23.4,69z M65.1,27.3L51,13.2L58.1,6l14.1,14.1L65.1,27.3z"/>
            </svg>
          </div>
          <div className="word_edit__input_container">

            <br />
            {wordInputs}
          </div>
        </div>

        <div>
          <IconAccentButton type="button" buttonText="&larr;" buttonClickCallback={history.goBack} />
          <IconAccentButton type="button" buttonText="&rarr;" buttonClickCallback={props.handleConfirmWords} disabledState={props.loading} />
        </div>
      </div>
    )
  }
}

WordEditPage.propTypes = {
  handleConfirmWords: PropTypes.func,
  words: PropTypes.array,
  loading: PropTypes.bool
}

WordEditPage.defaultProps = {
  handleConfirmWords: () => {},
  words: [],
  loading: false
}

export default WordEditPage;
