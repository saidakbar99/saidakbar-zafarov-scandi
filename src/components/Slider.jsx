import React from "react";

import CarouselBtn from "../assets/images/carousel-btn.svg";

class Slider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			images: this.props.images,
			activeIndex: 0,
		};
	}

	render() {
		const activeIndex = this.state.activeIndex;
		const images = this.state.images;

		const nextImg = () => {
			this.setState({
				activeIndex: activeIndex >= images.length - 1 ? 0 : activeIndex + 1,
			});
		};

		const prevImg = () => {
			this.setState({
				activeIndex: activeIndex === 0 ? images.length - 1 : activeIndex - 1,
			});
		};
		return (
			<div className="carousel__img">
				<img className="cart__img" src={images[activeIndex]} alt="carousel" />
				{images.length > 1 ? (
					<div className="carousel__btns">
						<img
							className="carousel__btn left_btn"
							src={CarouselBtn}
							alt="left-btn"
							onClick={prevImg}
						/>
						<img className="carousel__btn" src={CarouselBtn} alt="right-btn" onClick={nextImg} />
					</div>
				) : (
					""
				)}
			</div>
		);
	}
}

export default Slider;
