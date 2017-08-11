import React, {Component} from 'react';
import {Router, Switch, Route} from 'react-router-dom';

import history from './History.js';
import initialState from './InitialState.js';

import UploadPage from './UploadPage.js';
import ViewVideoPage from './ViewVideoPage.js';
import WordEditPage from './WordEditPage.js';
import StyleEditPage from './StyleEditPage.js';
import ProgressBar from './ProgressBar.js';
import NavBar from './NavBar.js';
import Footer from './Footer.js';
import BackgroundSelectPage from './BackgroundSelectPage.js';
import BackgroundColorPage from './BackgroundColorPage.js';
import FontStylePage from './FontStylePage.js';

import './App.css';
import './GlobalClasses.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {...initialState};

    // Since these functions get passed to components
    // and changes state, they need to be bound to this
    this.generateVideo              = this.generateVideo.bind(this);
    this.handleVideoSubmission      = this.handleVideoSubmission.bind(this);
    this.handleBackgroundProceed    = this.handleBackgroundProceed.bind(this);
    this.handleBackgroundSelection  = this.handleBackgroundSelection.bind(this);
    this.handleFontProceed          = this.handleFontProceed.bind(this);
    this.handleWordEdit             = this.handleWordEdit.bind(this);
    this.onDrop                     = this.onDrop.bind(this);
    this.chooseFile                 = this.chooseFile.bind(this);
    this.handleColorChange          = this.handleColorChange.bind(this);
    this.cancelVideo                = this.cancelVideo.bind(this);

  }

  validHexColor(color) {
    return /^([A-F0-9]{6}|[A-F0-9]{3})$/i.test(color);
  }

  possibleHexColor(color) {
    return /^([A-F0-9]{0,6})$/i.test(color);
  }

  handleVideoSubmission(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('file', this.state.fileInput[0]);

    // Redirect
    history.push('/background');

    fetch('/video', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      // Make a copy of incoming data and current state
      let newState = {...this.state};
      // Organize data into newState
      newState.watsonResponded = true;
      newState.videoDetails.videoName = data.videoName;
      newState.videoDetails.files.audio = data.files.audio;
      newState.videoDetails.files.video = data.files.video;
      // We're creating two unique word lists...
      // in the future we might find it useful to track
      // where Watson went wrong
      // Using map to make a deep copy
      newState.videoDetails.words = data.words.map(elem => [...elem]);
      newState.videoDetails.confirmedWords = data.words.map(elem => [...elem]);

      this.setState(newState);
    });
  }

  handleWordEdit(e) {
    const t = e.target;
    let newState = {...this.state};

    newState.videoDetails.confirmedWords[t.dataset.number][0] = t.value;
    this.setState(newState);
  }

  handleColorChange(color, changingProperty) {
    let newState = {...this.state};

    if (!this.possibleHexColor(color)) {
      return;
    }

    switch(changingProperty) {
      case 'background':
          newState.videoDetails.background.color = color;
          break;
      case 'unspokenFontColor':
          newState.titleStyles.unspokenFontColor = color;
          break;
      case 'spokenFontColor':
          newState.titleStyles.spokenFontColor = color;
          break;
      default:
          break;
    }

    this.setState(newState);
  }

  handleBackgroundSelection(selection) {
    let newState = {...this.state};
    newState.videoDetails.background.selection = selection;
    this.setState(newState);
  }

  //proceed after a background has been selected
  handleBackgroundProceed(e){
    e.preventDefault();
    //only do all this if image was the last option selected
    if ( this.state.videoDetails.background.selection === 'image' ) {
        let imageFile = document.getElementById('imageFile').files[0];
        let formData = new FormData();
        formData.append('file', imageFile);

        fetch('/get-image-path', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(data => {
          let newState = Object.assign(this.state, {loading: false});
          // Save the image URL
          newState.videoDetails.files.image = data.files.image;
          this.setState(newState);
        });
      // proceed to font selection
      history.push('/font-style');
    }
    // proceed to background color selection
    else if ( this.state.videoDetails.background.selection === 'color' ) {
      history.push('/background-color');
    }
    // user wants to use their video, proceed to font selection
    else {
      history.push('font-style');
    }
  }

  // proceed after a font style has been selected
  handleFontProceed (fontStyle) {
    let newState = {...this.state};
    newState.titleStyles.fontStyle = fontStyle;
    this.setState(newState);
    history.push('style-edit');
  }

  generateVideo(cancel) {
    const self = this;
    // websocket config
    let host = window.document.location.host.replace(/:.*/, '');
    let ws = new WebSocket('ws://' + host + ':3001');
    // handle web socket messages
    ws.onmessage = function (event) {
      // web socket provides percentage done
      let percentage = event.data;
      // total size of original video
      let totalMB = (self.state.fileInput[0].size/1000000).toFixed();
      // MB of video completed
      let MB = (percentage/100) * totalMB;
      // limited decimal if at 100%
      let fixedDecimal = MB >= totalMB ? 0 : 2;
      MB = MB.toFixed(fixedDecimal);

      let newState = Object.assign(self.state, {loading: true, videoProgress: `${MB}MB of ${totalMB}MB (${percentage}%)`, videoPercentage: `${percentage}%`});
      self.setState(newState);
    };

    // create the video
    let xhr = new XMLHttpRequest();
    this.setState({loading: true, httpReq: xhr});
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4 && xhr.status === 200){
          videoCallback(xhr.responseText);
      }
    }
    xhr.open("POST", '/create-video', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({...this.state.videoDetails, titleStyles: {...this.state.titleStyles}}));

    function videoCallback(res) {
      const data = JSON.parse(res);
      let newState = Object.assign(self.state, {loading: false, videoProgress: ''});
      // Save the output URL
      newState.videoDetails.files.output = data.output;
      self.setState(newState);

      // Redirect
      history.push('/view-video');
    }

  }

  cancelVideo() {
    // cancel xhr
    if (this.state.httpReq) {
      this.state.httpReq.abort();
    }
    this.setState({loading: false, videoProgress: '', httpReq: null});
  }

  onDrop(file) {
    this.setState({
      watsonResponded: false,
      fileInput: file
    });
  }

  chooseFile() {
    const self = this;
    let fileToRead = document.getElementById('videoFile');

    fileToRead.addEventListener('change', (event) => {
        let file = fileToRead.files;
        if (file) {
          self.onDrop(file);
        }
    });
  }

  render() {
    return (
      <div className="global__container">
        <ProgressBar loading={this.state.loading} videoProgress={this.state.videoProgress} videoPercentage={this.state.videoPercentage} cancelVideo={this.cancelVideo} />
        <NavBar />

        <div className="content__container">
          <Router history={history}>
            <Switch>

              <Route exact path="/" render={() => (
                <UploadPage handleVideoSubmission={this.handleVideoSubmission} onDrop={this.onDrop} fileInput={this.state.fileInput} chooseFile={this.chooseFile}/>
              )}/>

              <Route path="/background" render={() => (
                <BackgroundSelectPage handleBackgroundSelection={this.handleBackgroundSelection} backgroundSelection={this.state.videoDetails.background.selection} handleBackgroundProceed={this.handleBackgroundProceed}/>
              )}/>

              <Route path="/background-color" render={() => (
                <BackgroundColorPage handleColorSelection={this.handleColorChange} backgroundColor={this.state.videoDetails.background.color} />
              )}/>

              <Route path="/style-edit" render={() => (
                <StyleEditPage handleColorSelection={this.handleColorChange} titleStyles={this.state.titleStyles} watsonResponded={this.state.watsonResponded} />
              )}/>

              <Route path="/word-edit" render={() => (
                <WordEditPage handleConfirmWords={this.generateVideo} audioPath={this.state.videoDetails.files.audio} playingAudio={this.state.playingAudio} handleAudioPlayer={this.handleAudioPlayer} handleWordEdit={this.handleWordEdit} words={this.state.videoDetails.confirmedWords} loading={this.state.loading} />
              )}/>

              <Route path="/view-video" render={() => (
                <ViewVideoPage outputFile={this.state.videoDetails.files.output}/>
              )}/>

              <Route path="/font-style" render={() => (
                <FontStylePage fontStyleSelection={this.state.titleStyles.fontStyle} handleFontProceed={this.handleFontProceed}/>
              )}/>

            </Switch>
          </Router>
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
