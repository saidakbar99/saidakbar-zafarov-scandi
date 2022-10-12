import React from "react";

class WarningToaster extends React.Component {
	renderToasterContent() {
		const { show } = this.props;
		return (
			<div className={`notification-container-warning ${show ? "active-toaster" : ""}`}>
				<div>
					<p className="notification-message">Please, select all attributes.</p>
				</div>
			</div>
		);
	}

	render() {
		return this.renderToasterContent();
	}
}

export default WarningToaster;
