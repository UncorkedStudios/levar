'use strict';

const https = require('https');
const fs = require('fs');

const { watsonCredentials } = require('./watsonCredentials');

const auth = 'Basic ' + new Buffer(watsonCredentials.username + ':' + watsonCredentials.password).toString('base64');

exports.getWordsFromWatson = (inputFile) => {
  return new Promise((resolve, reject) => {
    // Parse upload
    const post_data = fs.readFileSync(inputFile);

    // Information we need for the post request
    const post_options = {
      hostname: 'stream.watsonplatform.net',
      port: 443,
      path: '/speech-to-text/api/v1/recognize?timestamps=true',
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': "audio/wav",
        'Content-Length': Buffer.byteLength(post_data)
      }
    };

    // Gather the chunks in the response
    const req = https.request(post_options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        const parsedData = JSON.parse(rawData);
        const wordArr = parsedData.results.reduce((accu, elem) => {
          return [...accu, ...elem.alternatives[0].timestamps]
        }, []);
        // Return a JSON of the response
        return resolve(wordArr);
      });
    });
    // Catch error
    req.on('error', (err) => {
      console.log(err);
      return reject('Error with Watson API request: ' + err);
    });
    // Not sure what this stuff is
    req.write(post_data);
    req.end();
  });
};
