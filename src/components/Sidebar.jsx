import React from "react";
import { connect } from "react-redux";

import { filterAttributes } from "../redux/Cart/cart-action";

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			attributes: [],
			chosenAttributes: {},
			urlQuery: "",
			selectDisabled: false,
		};
	}

	getSettedAttributes() {
		const savedAttrs = {};
		let settedAttributes = this.props.location.search;

		settedAttributes = settedAttributes.substring(1).split("&");
		settedAttributes.map((attr) => {
			attr = attr.split("=");
			attr[0] = attr[0].split("-").join(" ");
			savedAttrs[attr[0]] = attr[1];
		});
		const mergedAttributes = { ...savedAttrs };
		this.setState({ chosenAttributes: mergedAttributes }, () => {
			this.props.dispatchFilterAttributes(mergedAttributes);
		});
	}

	getAllAttributes() {
		const attrs = [];
		const attributes = [];
		const mergedAttributes = [];
		const attrNames = {};

		this.props.products.forEach((product) => {
			if (product.attributes.length) {
				if (product.attributes.length > 1) {
					product.attributes.forEach((attr) => {
						attrs.push(attr);
					});
				} else {
					attrs.push(product.attributes[0]);
				}
			}
		});

		attrs.forEach((attr) => {
			const attrValue = [];
			const lowerCaseName = attr.name.toLowerCase();

			attr.items.forEach((item) => {
				if (attr.name === "Color") {
					attrValue.push({ [item.displayValue]: item.value });
				} else {
					attrValue.push(item.value);
				}
			});
			attributes.push({
				attrName: lowerCaseName,
				attrValue: attrValue,
			});
		});

		attributes.forEach((attr1, index1) => {
			attributes.forEach((attr2, index2) => {
				if (attr1.attrName === attr2.attrName && index1 !== index2) {
					attributes[index1].attrValue = [...attr1.attrValue, ...attr2.attrValue];
					attributes[index2].attrValue = "";
				}
			});
		});

		attributes.forEach((attr) => {
			if (attr.attrValue.length) {
				if (attr.attrName === "color") {
					const uniqueAttrs = attr.attrValue.filter(
						(v, i, a) => a.findIndex((v2) => JSON.stringify(v2) === JSON.stringify(v)) === i
					);
					attr.attrValue = uniqueAttrs;
				}
				mergedAttributes.push(attr);
			}
			attr.attrValue = [...new Set(attr.attrValue)];
		});

		mergedAttributes.forEach((attr) => {
			attrNames[attr.attrName] = "";
		});

		this.setState(
			{
				attributes: mergedAttributes,
				chosenAttributes: attrNames,
			},
			this.getSettedAttributes
		);
	}

	componentDidMount() {
		this.getAllAttributes();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.activeCategory !== this.props.activeCategory) {
			this.getAllAttributes();
		}
		if (prevProps.products.length !== this.props.products.length) {
			this.getAllAttributes();
		}
		if (prevProps.location.search !== this.props.location.search) {
			this.getSettedAttributes();
		}
	}

	clearFilters = () => {
		const emptyFilters = {};
		const filtersCopy = [...this.state.attributes];

		filtersCopy.forEach((attr) => {
			emptyFilters[attr.attrName] = "";
		});

		const clearQuery = () => {
			this.props.history.replace(this.props.location.pathname);
		};

		this.setState({ chosenAttributes: emptyFilters, selectDisabled: false }, clearQuery);
		this.props.dispatchFilterAttributes(emptyFilters);
	};

	changeQuery = () => {
		this.props.history.replace(this.state.urlQuery);
	};

	getQuery = () => {
		const queryUrl = [];
		const chosen = this.state.chosenAttributes;

		Object.entries(chosen).forEach((attr) => {
			const formattedAttrName = attr[0].toLowerCase().split(" ").join("-");
			const formattedAttrValue = attr[1]?.toString();
			const query = `${formattedAttrName + "=" + formattedAttrValue}`;

			if (formattedAttrValue) {
				queryUrl.push(query);
			}
		});

		this.setState({ urlQuery: `?${queryUrl.join("&")}` }, this.changeQuery);
	};

	handleClick = (name, value, type) => {
		const chosen = this.state.chosenAttributes;
		const chosenCopy = { ...chosen };

		if (type === "checkbox") {
			if (chosenCopy[name] === "Yes") {
				delete chosenCopy[name];
			} else {
				chosenCopy[name] = "Yes";
			}
		} else {
			chosenCopy[name] = value;
		}
		if (type === "select") {
			this.setState({ selectDisabled: true });
		}
		this.setState({ chosenAttributes: chosenCopy }, this.getQuery);
	};
	render() {
		const chosen = this.state.chosenAttributes;
		return (
			<div className="sidebar__container">
				<span className="filter__label">Shopping Options</span>
				{this.state.attributes.map((attr, index) => {
					const isColor = attr.attrName === "color";
					const isCheckbox = attr.attrValue[0] === "Yes" || attr.attrValue[0] === "No";
					const attrLabel = attr.attrName.charAt(0).toUpperCase() + attr.attrName.slice(1);
					return (
						<div key={index} className="sidebar__attrs--container">
							<label className="attr__label">{attrLabel}:</label>
							<div className="filter__attributes--container">
								{!isColor && !isCheckbox ? (
									<select
										className="filter__select"
										onChange={(e) => this.handleClick(attr.attrName, e.target.value, "select")}
										value={this.state.chosenAttributes[attr.attrName]}
									>
										{/* 1)pustoy turishimi 2)first value turishimi 3)'choose' dib yozilganimi*/}
										<option value="" disabled={this.state.selectDisabled}>
											Choose...
										</option>
										{attr.attrValue.map((value, key) => {
											return (
												<option type="radio" key={key} className="filter__option">
													{value}
												</option>
											);
										})}
									</select>
								) : (
									""
								)}
								{isCheckbox ? (
									<button
										type="checkbox"
										className={`attr__btn--swatch filter__checkbox ${
											chosen[attr.attrName] === "Yes" ? "selected" : ""
										}`}
										onClick={() => this.handleClick(attr.attrName, attr.attrValue, "checkbox")}
									>
										✔
									</button>
								) : isColor ? (
									attr.attrValue.map((color, i) => {
										const isActive =
											chosen["color"] === Object.keys(color)[0] ? "selected--swatch" : "";
										return (
											<button
												key={i}
												type="radio"
												className={`attr__btn--swatch filter__color ${isActive}`}
												style={{ background: `${Object.values(color)}` }}
												onClick={() => this.handleClick(attr.attrName, Object.keys(color)[0])}
											></button>
										);
									})
								) : (
									""
								)}
							</div>
						</div>
					);
				})}
				{this.state.attributes.length && (
					<button className="filter__clear" onClick={this.clearFilters}>
						Clear
					</button>
				)}
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatchFilterAttributes: (obj) => dispatch(filterAttributes(obj)),
	};
};

export default connect(null, mapDispatchToProps)(Sidebar);
