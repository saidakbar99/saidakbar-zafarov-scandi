import React from "react";

import CarouselBtn from "../assets/images/carousel-btn.svg";

class Slider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeIndex: 0,
		};
	}

	handleClick = (type) => {
		const { activeIndex } = this.state;
		const { images } = this.props;

		type === "next" &&
			this.setState({
				activeIndex: activeIndex >= images.length - 1 ? 0 : activeIndex + 1,
			});
		type === "prev" &&
			this.setState({
				activeIndex: activeIndex === 0 ? images.length - 1 : activeIndex - 1,
			});
	};

	renderSliderButtons() {
		const { images } = this.props;
		if (images.length <= 1) {
			return <></>;
		} else {
			return (
				<div className="carousel__btns">
					<img
						className="carousel__btn left_btn"
						src={CarouselBtn}
						alt="left-btn"
						onClick={() => this.handleClick("prev")}
					/>
					<img
						className="carousel__btn"
						src={CarouselBtn}
						alt="right-btn"
						onClick={() => this.handleClick("next")}
					/>
				</div>
			);
		}
	}

	renderSliderContent() {
		const { activeIndex } = this.state;
		const { images } = this.props;
		return (
			<div className="carousel__img">
				<img className="cart__img" src={images[activeIndex]} alt="carousel" />
				{this.renderSliderButtons()}
			</div>
		);
	}

	render() {
		return <>{this.renderSliderContent()}</>;
	}
}

export default Slider;
