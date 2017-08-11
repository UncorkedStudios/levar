import React from 'react';

import './NavBar.css';

export default (props) => {
  return (
    <div className="navbar__container">
      <h1><a href="/">levar</a></h1>
      <svg className="navbar__squiggle" x="0px" y="0px" viewBox="0 0 27 2.3">
        <path d="M25.1,0.8C24.7,1,24.5,1.2,24,1.2c-0.5,0-0.7-0.2-1.1-0.5C22.5,0.4,22,0,21,0c-1,0-1.5,0.4-1.9,0.8
        	C18.7,1,18.5,1.2,18,1.2c-0.5,0-0.8-0.2-1.1-0.5C16.5,0.4,16,0,15,0v0c0,0,0,0,0,0s0,0,0,0c-1,0-1.5,0.4-1.9,0.8
        	C12.7,1,12.5,1.2,12,1.2c-0.5,0-0.7-0.2-1.1-0.5C10.5,0.4,10,0,9,0C8,0,7.5,0.4,7.1,0.8C6.8,1,6.5,1.2,6,1.2C5.5,1.2,5.3,1,4.9,0.8
        	C4.5,0.4,4,0,3,0C2,0,1.5,0.4,1.1,0.8C0.8,1,0.5,1.2,0,1.2v1.1c1,0,1.5-0.4,1.9-0.8C2.3,1.3,2.5,1.1,3,1.1c0.5,0,0.8,0.2,1.1,0.5
        	C4.5,1.9,5,2.3,6,2.3c1,0,1.5-0.4,1.9-0.8C8.3,1.3,8.5,1.1,9,1.1c0.5,0,0.7,0.2,1.1,0.5C10.5,1.9,11,2.3,12,2.3v0c0,0,0,0,0,0
        	s0,0,0,0c1,0,1.5-0.4,1.9-0.8c0.3-0.3,0.6-0.5,1.1-0.5c0.5,0,0.7,0.2,1.1,0.5C16.5,1.9,17,2.3,18,2.3c1,0,1.5-0.4,1.9-0.8
        	c0.3-0.3,0.6-0.5,1.1-0.5c0.5,0,0.7,0.2,1.1,0.5C22.5,1.9,23,2.3,24,2.3c1,0,1.5-0.4,1.9-0.8c0.3-0.3,0.6-0.5,1.1-0.5V0
        	C26,0,25.5,0.4,25.1,0.8z"/>
        </svg>
    </div>
  )
}