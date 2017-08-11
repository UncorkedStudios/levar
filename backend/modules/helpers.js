'use strict';

const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

let inputFile;
const CHARS_PER_LINE = 15;
const LINES_PER_GROUP = 4;
const SHADOW_COLOR = "0x000000@0.2";
const SHADOW_OFFSET = 3;

exports.unlinkFile = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filepath, (err, fileStat) => {
      // If it exists, remove it
      if (fileStat) {
        fs.unlink(filepath, (err) => {
          if (err) {
            console.log('Unlink error: ', err);
          }
        });
      } else {
        console.log("nothing to unlink: " + filepath);
      }
      return resolve();
    });
  });
};

exports.splitWavFromMp4 = (inputFile) => {
  return new Promise((resolve, reject) => {
    let outputPath = `${inputFile}.wav`;
    ffmpeg(inputFile)
      .noVideo()
      .save(outputPath)
      .on('end', () => {
        return resolve(outputPath);
      })
      .on('error', (err) => {
        return reject('Error exporting audio: ' + err);
      });
  });
};

/* return file path for video created using static image, audio, and captions */
exports.createImageVideo = (titles, imageFilePath, audioFilePath, outputFilePath, req, webSocket) => {
  let progressPercentage;
  let previousPercentage = 0;
  let newVideo;

  return new Promise((resolve, reject) => {
    webSocket.send(0);
    ffmpeg.ffprobe(audioFilePath, function(err, data) {
      newVideo = ffmpeg(imageFilePath)
        // send progress to client via websocket
        .on('progress', function(progress) {
          let lastIndex = progress.timemark.lastIndexOf(':');
          // how much of the video has been built
          let timemark = progress.timemark.substring(lastIndex + 1);
          // calculate percentage
          progressPercentage = Math.floor((timemark / data.streams[0].duration) * 100);
          // send an update if we've progressed by at least one whole percentage point
          if (progressPercentage > previousPercentage) {
            webSocket.send(progressPercentage);
            previousPercentage = progressPercentage;
          }
        })
        // image loop for video duration
        .loop(data.streams[0].duration)
        // add audio path as input
        .input(audioFilePath)
        // size video
        .size('100%')
        //add titles
        .videoFilters(titles)
        .save(outputFilePath)
        .on('end', () => {
          webSocket.send(100);
          webSocket.close();
          return resolve({output: outputFilePath});
        })
        .on('error', (err) => {
          return reject('Unable to create image video: ' + err);
        });
    });
    // kill ffmpeg process on user cancel xhr
    req.on('close', ()=> {
      newVideo.kill();
      return Promise.reject('client canceled request');
    });

  });
};

/* return file path for video created using background color, audio, and captions */
exports.createColorVideo = (titles, colorBackground, dimensions, audioFilePath, outputFilePath, req, webSocket) => {
  let progressPercentage;
  let previousPercentage = 0;
  let newVideo;
  colorBackground = normalizeHexColor(colorBackground);
  return new Promise((resolve, reject) => {
    webSocket.send(0);
    ffmpeg.ffprobe(audioFilePath, function(err, data) {
      newVideo = ffmpeg()
        // send progress to client via websocket
        .on('progress', function(progress) {
          let lastIndex = progress.timemark.lastIndexOf(':');
          // how much of the video has been built
          let timemark = progress.timemark.substring(lastIndex + 1);
          // calculate percentage
          progressPercentage = Math.floor((timemark / data.streams[0].duration) * 100);
          // send an update if we've progressed by at least one whole percentage point
          if (progressPercentage > previousPercentage) {
            webSocket.send(progressPercentage);
            previousPercentage = progressPercentage;
          }
        })
        // add color and sizing inputs
        .input('color=0x' + colorBackground + ':s='+ dimensions[0] + 'x' + dimensions[1])
        .inputFormat('lavfi')
        // add audio path as input
        .input(audioFilePath)
        // overlay titles
        .videoFilters(titles)
        // add video duration
        .duration(data.streams[0].duration)
        .save(outputFilePath)
        .on('end', () => {
          webSocket.send(100);
          webSocket.close();
          return resolve({output: outputFilePath});
        })
        .on('error', (err) => {
          return reject('Unable to create color video: ' + err);
        });
    });
    // kill ffmpeg process on user cancel xhr
    req.on('close', ()=> {
      newVideo.kill();
      return Promise.reject('client canceled request');
    });
  });
};

//return file path to original video background with captions overlaid
exports.createRegularVideo = (titles, videoFilePath, outputFilePath, req, webSocket) => {
  let progressPercentage;
  let previousPercentage = 0;
  let newVideo;
  return new Promise((resolve, reject) => {
    webSocket.send(0);
    newVideo = ffmpeg(videoFilePath)
      .on('progress', function(progress) {
        // calculate percentage
        progressPercentage = Math.floor(progress.percent);
        // send an update if we've progressed by at least one whole percentage point
        if (progressPercentage > previousPercentage) {
          webSocket.send(progressPercentage);
          previousPercentage = progressPercentage;
        }
      })
      .videoFilters(titles)
      .save(outputFilePath)
      .on('end', (stdout, stderr) => {
        webSocket.send(100);
        webSocket.close();
        return resolve({output: outputFilePath});
      })
      .on('error', (err) => {
        console.log('Unable to create regular video: ' + err);
        return reject('Unable to create regular video: ' + err);
      });

      // kill ffmpeg process on user cancel xhr
      req.on('close', ()=> {
        newVideo.kill();
        return Promise.reject('client canceled request');
      });
    });
};


exports.getFontSize = ( width, height ) => {
  return new Promise((resolve, reject) => {
      let fontSize = Math.floor(height / LINES_PER_GROUP);

      while ((fontSize / 1.5) * (CHARS_PER_LINE + 2) > width) {
        fontSize -= 1;
      }

      return resolve(fontSize);
  });
};

exports.getDimensions = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      return reject('getDimensions was not given the correct inputs');
    }

    ffmpeg.ffprobe(filePath, (err, data) => {
      // If there's no error and we get the expected data from probe
      if (!err && data && data.streams && data.streams[0].height && data.streams[0].width) {
          return resolve([data.streams[0].width, data.streams[0].height]);
      }
      // Otherwise just return the default value
      return resolve([1000,500]);
    });
  });
};


//return captions to overlay on video
exports.createTitles = (inputText, fontSize, titleStyles = defaultTitleStyles) => {
  return new Promise((resolve, reject) => {
    if (!inputText || !fontSize) {
      return reject('createTitles was not given the correct inputs');
    }

    let fontFile = 'fonts/' + titleStyles.fontStyle + '.ttf';
    let unspokenFontColor = normalizeHexColor(titleStyles.unspokenFontColor);
    let spokenFontColor = normalizeHexColor(titleStyles.spokenFontColor);
    let lineGroups = sortLineGroups(inputText);

    // Make the titles
    let titles = [];
    let currLine = '';
    let lineCount = 0;
    let groupCount = 0;
    // Here we get the group start time
    // Based on the start time of the first word
    // of the current group
    let groupStart = lineGroups[groupCount][0][1];
    // Same with the end time of the last word
    // in the current group
    let groupEnd = lineGroups[groupCount][lineGroups[groupCount].length - 1][2];
    // Here we're beginning to start calculating the Y position of each line
    // Line margin is the space between lines
    let lineMargin = fontSize / 5;
    // Group height is the total height of the lines in each group
    // plus the margins between the lines
    // (ffmpegLineHeight * LINES_PER_GROUP)+((LINES_PER_GROUP - 1) * lineMargin)
    let groupHeight = `((lh*${LINES_PER_GROUP})+(${LINES_PER_GROUP - 1}*${lineMargin}))`;
    // Page margin is the distance between the top of the video and the first line
    // (ffmpegVideoHeight - groupHeight) / 2
    let pageMargin = `((h-${groupHeight})/2)`;
    let linesPerGroup;
    let word;
    let wordStart;
    let xDistance;
    let lineY;
    let wordX;
    inputText.forEach(elem => {
      // Here we iterate over each word
      // grabbing the word and its start time
      word = elem[0];
      wordStart = elem[1];
      // and we determine the distance
      // from the left edge of the video:
      // the length of all the previous characters in the line
      // plus 1 for the left padding and 1 for the space between words
      xDistance = currLine.length + 2;

      // For the first word, just add the word to currLine
      // and account for the left padding
      if (!currLine) {
        currLine = `${word}`;
        xDistance = 1;
      // If adding the current word to the current line
      // exceeds out max character count,
      // create a new line and reset distance
      } else if (`${currLine} ${word}`.length > CHARS_PER_LINE) {
        currLine = `${word}`;
        xDistance = 1;
        lineCount++;
        // If we pass our max lines per screen,
        // go to a new group and determine start/stop times
        if (lineCount >= LINES_PER_GROUP) {
          lineCount = 0;
          groupCount++;
          groupStart = lineGroups[groupCount][0][1];
          groupEnd = lineGroups[groupCount][lineGroups[groupCount].length - 1][2];
        }
      // Otherwise the current word is safe to add to the current line
      } else {
        currLine = `${currLine} ${word}`;
      }

      // Now we get the distance from the top of the video to the current line
      // pageMargin + (ffmpegLineHeight * lineCount) + (lineMargin * lineCount)
      lineY = `${pageMargin}+(lh*${lineCount})+(${lineMargin}*${lineCount})`;

      wordX = Math.floor((fontSize / 1.75) * xDistance);

      titles[titles.length] = `drawtext=enable='between(t,${groupStart},${groupEnd})':fontfile=${fontFile}:fontsize=${fontSize}:fontcolor_expr=%{eif\\\\: if(between(t\\, ${groupStart}\\, ${wordStart})\\, 0x${unspokenFontColor}\\, 0x${spokenFontColor}) \\\\: x}:x=${wordX}:y=${lineY}:shadowx=${SHADOW_OFFSET}:shadowy=${SHADOW_OFFSET}:shadowcolor=${SHADOW_COLOR}:text='${elem[0]}'`;

      return resolve(titles);
    });
  });
};

// Ideally in the future we'll have users selecting title styles
// and them to createTitles from the frontend via JSON
const defaultTitleStyles = {
  unspokenFontColor: 'FFFFFF',
  spokenFontColor: 'FFB6C1'
}

// Helper function to clean up hex color inputs
const normalizeHexColor = (color) => {
  let modified = color;

  // If it's a valid input...
  if (/^#?([a-f0-9]{3}|[a-f0-9]{6})$/i.test(color)) {
    // Remove #s
    modified = modified.replace(/#/g, '');
    // Convert 3-digit hex to 6-digit
    modified = modified.length === 6 ? modified : modified.split('').reduce((a, e) => a+e+e, '');
    // Temporary handling for hexes beginning with 0
    if ( modified.charAt(0) === '0') {
      modified = modified.replace('0', '1');
    }
    return modified;
  } else {
    return 'FFFFFF';
  }
}

// Helper function to sort input text into lines and then groups of lines
// Returns an array of groups of lines
const sortLineGroups = (inputText) => {
  // Remove 'words' that are empty strings
  inputText = inputText.filter(elem => elem[0]);

  // Create individual lines
  let lines = inputText.reduce((acc, elem, i) => {
    elem[0] = elem[0].replace(/'/g, '’').toUpperCase();

    // Weird bug with reduce made me init first inner array
    if (acc.length === 0) {
      return [
        [...elem]
      ];
    }

    // If this word makes the line longer than 10 chars,
    // create new line
    if (`${acc[acc.length - 1][0]} ${elem[0]}`.length > CHARS_PER_LINE) {
      return [...acc, [...elem]];
    }

    // Add word to line
    acc[acc.length - 1][0] = `${acc[acc.length - 1][0]} ${elem[0]}`;
    // Set line end time to the last word
    acc[acc.length - 1][2] = elem[2];
    return acc;
  }, []);

  // Group lines into an array of 1 to 3 lines
  let lineGroups = [];
  for (let i = 0; i < lines.length; i += LINES_PER_GROUP) {
    lineGroups = [...lineGroups, lines.slice(i, i + LINES_PER_GROUP)];
  }

  return lineGroups;
}
