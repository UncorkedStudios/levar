export default {
  videoProgress: '',
  videoPercentage: '0%',
  videoMB: '0MB',
  httpReq: null,
  fileInput: [{name: ''}],
  loading: false,
  watsonResponded: false,
  titleStyles: {
    unspokenFontColor: null,
    spokenFontColor: null,
    fontStyle: null
  },
  videoDetails : {
    videoName: null,
    background: {
      selection: null,
      color: null
    },
    files: {
      video: null,
      image: null,
      audio: null,
    },
    words: [[]],
    confirmedWords: [[]]
  }
};
