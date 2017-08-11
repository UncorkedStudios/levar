import React from 'react';
import PropTypes from 'prop-types';

import './ProgressBar.css';

const ProgressBar = (props) => {
    let classStatus = props.loading ? "progressBar active" : "progressBar";
	return (
		<div className={classStatus}>
			<h2>{props.videoProgress}</h2>
			<h2 className="cancel" onClick={props.cancelVideo}>Cancel</h2>
			<div className="progressPercentage" style={{width: props.videoPercentage}}></div>
		</div>
	);
};

ProgressBar.propTypes = {
  videoProgress: PropTypes.string,
  loading: PropTypes.bool
};

ProgressBar.defaultProps = {
  videoProgress: '0%',
  loading: false
};

export default ProgressBar;
