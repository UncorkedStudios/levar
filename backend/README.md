# Levar backend

A Node/Express REST API utilizing IBM's Watson API for speech-to-text conversion and FFmpeg for video generation/manipulation.

## Good to know

`PROJECT_ROOT/backend/utilities/removeUploads.js`

A tool for removing all files in `PROJECT_ROOT/backend/uploads` and `PROJECT_ROOT/backend/downloads`. Runs daily and is meant to keep storage at a minimum.

`PROJECT_ROOT/backend/modules/helpers.js`

The bulk of the work in done in this file.

* `unlinkFile`: Try and remove file
* `splitWavFromMp4`: Export the audio from a video as a WAV file
* `createImageVideo`: Uses a video, image, and array of titles to create a captioned video with the image as the background
* `createColorVideo`: Uses a video, hexadecimal color, and array of titles to create a captioned video with the color as the background
* `createRegularVideo`: Uses a video and array of titles to create a captioned video with the original video as the background
* `getFontSize`: The function tries to find a suitable font size based on video or image dimensions
* `getDimensions`: Returns the dimensions of the video or image to be used as the output background
* `createTitles`: Takes an array of words with timestamps along with styles to generate titles for the video. Each word is given an FFmpeg filter that changes color when the word is spoken
* `normalizeHexColor`: Standardizes hexadecimal colors to a format that's acceptable to FFmpeg
* `sortLineGroups`: Groups lines of text in a way that helps `createTitles` work more efficiently

`PROJECT_ROOT/backend/modules/watson.js`

This file uses the audio from the video to make an API call from IBM's Watson API. Watson takes the audio and returns words and timestamps.
