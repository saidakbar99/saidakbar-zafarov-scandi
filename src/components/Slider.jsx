import React from "react";

import CarouselBtn from '../assets/images/carousel-btn.svg'

class Slider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      images: this.props.images,
      activeImage: this.props.images[0],
      activeIndex: 0,
    }
  }

  render() {
    const nextImg = () => {
      this.setState({
        activeIndex:
          this.state.activeIndex >= this.state.images.length - 1
            ? 0
            : this.state.activeIndex + 1,
      })
    }

    const prevImg = () => {
      this.setState({
        activeIndex:
          this.state.activeIndex === 0
            ? this.state.images.length - 1
            : this.state.activeIndex - 1,
      })
    }
    return (
      <div className="carousel__img">
        <img
          className="cart__img"
          src={this.state.images[this.state.activeIndex]}
          alt='carousel'
        />
        {this.state.images.length>1
          ? <div className="carousel__btns">
              <img
                  className="carousel__btn left_btn"
                  src={CarouselBtn}
                  alt='left-btn'
                  onClick={prevImg}
                />
                <img
                  className="carousel__btn"
                  src={CarouselBtn}
                  alt='right-btn'
                  onClick={nextImg}
                />
            </div>
          : ''
        }
      </div>
    );
  }
}

export default Slider;
