import React from "react";

import CheckIcon from "../assets/images/check-icon.svg";

class Toaster extends React.Component {
	render() {
		const show = this.props.show;
		return (
			<div className={`notification-container ${show ? "active-toaster" : ""}`}>
				<div className="notification-image">
					<img src={CheckIcon} alt="icon" />
				</div>
				<div>
					<p className="notification-message">Item added to Cart.</p>
				</div>
			</div>
		);
	}
}

export default Toaster;
