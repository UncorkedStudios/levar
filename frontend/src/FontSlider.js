import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

export default class FontSlider extends Component {
  render() {
    let changeSlide = (index) => {
      this.props.handleChangeSlide(index);
    }

    var settings = {
      infinite:false,
      focusOnSelect: true,
      slidesToShow: 1,
      afterChange: changeSlide
    };

    return (
      <div className="flex-container">
      <Slider ref={c => this.slider = c } {...settings}>
        <div className="font_style__preview NovaMono">
               The quick brown fox <br/> jumps over the lazy <br/> dog.
        </div>
        <div className="font_style__preview OverpassMono-Regular">
               The quick brown fox <br/> jumps over the lazy <br/> dog.
        </div>
        <div className="font_style__preview ShareTechMono-Regular">
               The quick brown fox <br/> jumps over the lazy <br/> dog.
        </div>
      </Slider>
    </div>
    );
  }
}

FontSlider.propTypes = {
  handleChangeSlide: PropTypes.func
};

FontSlider.defaultProps = {
  handleChangeSlide: () => {}
};
