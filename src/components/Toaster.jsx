import React from "react";

import CheckIcon from "../assets/images/check-icon.svg";

class Toaster extends React.Component {
	renderToasterContent() {
		const { show } = this.props;
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

	render() {
		return this.renderToasterContent();
	}
}

export default Toaster;
