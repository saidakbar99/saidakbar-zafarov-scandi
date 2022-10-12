import React from "react";

class ErrorToaster extends React.Component {
	renderToasterContent() {
		const { show } = this.props;
		return (
			<div className={`notification-container-error ${show ? "active-toaster" : ""}`}>
				<div>
					<p className="notification-message">Error! Missing attribute.</p>
				</div>
			</div>
		);
	}

	render() {
		return this.renderToasterContent();
	}
}

export default ErrorToaster;
