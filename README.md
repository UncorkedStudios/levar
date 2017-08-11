# Levar: speech-to-text video conversion

An Uncorked Studios original: [Uncorked Studios](https://www.uncorkedstudios.com/)

## Getting Started

In order to get started with this project, you're going to need a Watson API username and password (for the speech-to-text functionality). Here's the link for that: [Watson's Developer Portal](https://www.ibm.com/watson/developer/). Another dependency for this project is FFmpeg (for video processing) which you can download for free here: [FFmpeg home](https://www.ffmpeg.org/).

Once you fork this repository and it's on your local machine, navigate to the application root folder in your terminal and run this command:

`./init.sh`

This script will ask for your Watson credentials and store them in `./backend/modules/watsonCredentials.js`. It's also going to download all of the dependencies for the React frontend and the Express backend.

To start editing the project, start the development servers:

`npm run serve --prefix ./backend` for the backend
`npm run start --prefix ./frontend` for the frontend

You could also just build the project if you're ready to deploy. This command will compile the frontend React and Sass files before moving them to the backend directory:

`npm run build --prefix ./frontend`

## Amazon EC2 Deployment

We used an Amazon EC2 instance to host our version of the app. If you'd like to do something similar, you'll need to update `./backend/gulpfile.js` and add your EC2 instance to your `~/.ssh/config` file.

### Installing FFmpeg on EC2

https://www.hiroom2.com/2016/05/20/ubuntu-16-04-install-ffmpeg-3-0/

### Running the app on EC2 with forever:

https://github.com/foreverjs/forever

`forever start app.js`
`forever restart app.js`
`forever stop app.js`

## Contributors

* Megan Bauer
* Avani Bhargava
* Melissa Chan
* Lucero Cortez
* Matthew Curtis
* Melodee Dudley
* David Evans
* Joshua Fingert
* Leia Sefkin
* Abby Williams
