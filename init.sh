#!/bin/bash
cd ./backend

if [ ! -f ./modules/watsonCredentials.js ]
then
  echo "Please input your Watson API username:"
  read USERNAME
  echo "Please input your Watson API password:"
  read PASSWORD
  echo "exports.watsonCredentials = { username: '${USERNAME}', password: '${PASSWORD}' };" > ./modules/watsonCredentials.js
fi

npm install
cd ../frontend
npm install
