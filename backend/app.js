/********************************
*********************************
*********************************
Configuration
*********************************
*********************************
********************************/

const express = require("express");
const app = express();

const bodyParser = require('body-parser');
const path = require("path");
const fs = require('fs');

const watson = require('./modules/watson');
const helpers = require('./modules/helpers');
// cron job to remove upload and download files
const removeUploads = require('./utilities/removeUploads').fileWatcher(__dirname);

const multer = require('multer');

const upload = multer({dest: 'uploads/'});


// Start the app
const server = app.listen(3001, function() {
  console.log('App active at: http://localhost:3001');
});
server.timeout = 600000;

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
let webSocket;
// websocket is connected 
wss.on('connection', function connection(ws, req) {
  // reference connection object for later
  webSocket = ws;
  try { 
    console.log('web socket is connected ', req.headers['sec-websocket-key']); 
  }
  catch (e) { 
    console.log('something went wrong with web socket connection ', e);
    webSocket.close();
  }
});

// Express settings
app.use('/', express.static(__dirname));
// Body-parser settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/********************************
*********************************
*********************************
Routes
*********************************
*********************************
********************************/

app.post('/get-image-path', upload.any(), (req, res) => {
  let jsonRes = {
    files: {
      image:req.files[0].path
    }
  };
  res.json(jsonRes);
})

// User uploading video files
app.post('/video', upload.any(), (req, res) => {
  let originalName = req.files[0].originalname;
  let jsonRes = {
    videoName: originalName,
    files: {
      video: req.files[0].path
    }
  };

  // Split the audio from the video
  return helpers.splitWavFromMp4(jsonRes.files.video).then((audioPath) => {
    // Save the path to the audio file
    jsonRes.files.audio = audioPath;
    // Send the audio to Watson
    return watson.getWordsFromWatson(audioPath);
  }).then((words) => {
    // Save the words
    jsonRes.words = words;
    // Send the JSON back to the client
    res.json(jsonRes);
  })
  // Catch errors
  .catch((err) => {
    console.log('Promise error in /video: ', err);
    res.json({error: 'Unable to process upload.'});
  });
});

// User has confirmed the words and is ready for the video to be made
// Will accept a form post and return a video for download
app.post('/create-video', (req, res) => {
  let rb = req.body;
  let files = rb.files;
  let backgroundSelection = rb.background.selection;   //specified background method
  let color = rb.background.color;   //background color, if specified
  //default
  let backgroundFile = backgroundSelection === 'image' ? files.image : files.video;
  let dimensions;

  // define output file name with timestamp
  let outputFile = `downloads/${rb.videoName}_${Date.now()}.mp4`;
  helpers.getDimensions(backgroundFile).then( dim => {
  // Get the font size for the image or video dimensions
    dimensions = dim;
    return helpers.getFontSize(dim[0], dim[1]);
  })
  .then(fontSize => {
    // We have the words and font size, now make the titles
    // If rb.titleStyles is undefined, default styles will kick in
    return helpers.createTitles(rb.confirmedWords, fontSize, rb.titleStyles);
  })
  .then(titles => {
    if ( backgroundSelection === 'image') {
      // If there's an image file, make a video with the image
      return helpers.createImageVideo(titles, backgroundFile, files.audio, outputFile, req, webSocket);
    } else if ( backgroundSelection === 'color' ) {
      return helpers.createColorVideo(titles, color, dimensions, files.audio, outputFile, req, webSocket);
    } else {
      // Otherwise make the video with the video
      return helpers.createRegularVideo(titles, backgroundFile, outputFile, req, webSocket);
    }
  })
  .then(output => {
    if (!output) {
      res.code(500);
    }
    // Check if the generated video exists
    fs.stat(output.output, (err, fileStat) => {
      // If it exists, return it for download
      if (fileStat) {
        // res.flush();
        res.json(output);
      } else {
        res.json({error: 'File not found.'});
      }
    });
  })
  .catch((err) => {
    console.log('Promise error in /confirm-words: ', err);
    res.json({error: 'Unable to generate video.'});
  });
});

// Render index page
app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

/********************************
*********************************
*********************************
Run things
*********************************
*********************************
********************************/


