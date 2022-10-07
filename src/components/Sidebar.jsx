import React from "react";
import { connect } from "react-redux";

import { filterAttributes, checkboxCancel } from "../redux/Cart/cart-action";

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			attributes: [],
			chosenAttributes: {},
			urlQuery: "",
			selectDisabled: false,
			clearDisabled: true,
		};
	}

	getSettedAttributes() {
		const { dispatchFilterAttributes, location } = this.props;
		const savedAttrs = {};
		let settedAttributes = location.search;

		settedAttributes = settedAttributes.substring(1).split("&");
		settedAttributes.forEach((attr) => {
			attr = attr.split("=");
			attr[0] = attr[0].split("-").join(" ");
			savedAttrs[attr[0]] = attr[1];
		});
		const mergedAttributes = { ...savedAttrs };
		this.setState({ chosenAttributes: mergedAttributes }, () => {
			dispatchFilterAttributes(mergedAttributes);
		});
	}

	getAllAttributes() {
		const { products } = this.props;
		const allAttributes = [];
		const uniqueAttributes = [];
		const mergedAttributes = [];
		const attributeLabels = {};

		products.forEach((product) => {
			if (product.attributes.length) {
				if (product.attributes.length > 1) {
					product.attributes.forEach((attr) => {
						allAttributes.push(attr);
					});
				} else {
					allAttributes.push(product.attributes[0]);
				}
			}
		});

		allAttributes.forEach((attr) => {
			const attrValue = [];
			const lowerCaseName = attr.name.toLowerCase();

			attr.items.forEach((item) => {
				if (attr.name === "Color") {
					attrValue.push({ [item.displayValue]: item.value });
				} else {
					attrValue.push(item.value);
				}
			});
			uniqueAttributes.push({
				attrName: lowerCaseName,
				attrValue: attrValue,
			});
		});

		uniqueAttributes.forEach((attr1, index1) => {
			uniqueAttributes.forEach((attr2, index2) => {
				if (attr1.attrName === attr2.attrName && index1 !== index2) {
					uniqueAttributes[index1].attrValue = [...attr1.attrValue, ...attr2.attrValue];
					uniqueAttributes[index2].attrValue = "";
				}
			});
		});

		uniqueAttributes.forEach((attr) => {
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
			attributeLabels[attr.attrName] = "";
		});

		this.setState(
			{
				attributes: mergedAttributes,
				chosenAttributes: attributeLabels,
			},
			this.getSettedAttributes
		);
	}

	shouldClearDisable() {
		const { location } = this.props;
		if (location.search.length) {
			this.setState({ clearDisabled: false });
		}
	}

	componentDidMount() {
		this.getAllAttributes();
		this.shouldClearDisable();
	}

	componentDidUpdate(prevProps) {
		const { activeCategory, products, location } = this.props;

		if (prevProps.activeCategory !== activeCategory) {
			this.getAllAttributes();
		}
		if (prevProps.products.length !== products.length) {
			this.getAllAttributes();
		}
		if (prevProps.location.search !== location.search) {
			this.getSettedAttributes();
		}
	}

	clearFilters = () => {
		const { history, location, dispatchFilterAttributes } = this.props;
		const emptyFilters = {};
		const filtersCopy = [...this.state.attributes];

		filtersCopy.forEach((attr) => {
			emptyFilters[attr.attrName] = "";
		});

		const clearQuery = () => {
			history.replace(location.pathname);
		};

		this.setState(
			{ chosenAttributes: emptyFilters, selectDisabled: false, clearDisabled: true },
			clearQuery
		);
		dispatchFilterAttributes(emptyFilters);
	};

	changeQuery = () => {
		const { history } = this.props;
		const { urlQuery } = this.state;

		history.replace(urlQuery);
	};

	getQuery = () => {
		const queryUrl = [];
		const { chosenAttributes } = this.state;

		Object.entries(chosenAttributes).forEach((attr) => {
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
		const { dispatchCheckboxCancel } = this.props;
		const chosenCopy = { ...this.state.chosenAttributes };

		if (type === "checkbox") {
			if (chosenCopy[name] === "Yes") {
				delete chosenCopy[name];
				if (!Object.values(chosenCopy).includes("Yes")) {
					dispatchCheckboxCancel(true);
				}
			} else {
				chosenCopy[name] = "Yes";
			}
		} else {
			chosenCopy[name] = value;
		}
		if (type === "select") {
			this.setState({ selectDisabled: true });
		}
		this.setState({ chosenAttributes: chosenCopy, clearDisabled: false }, this.getQuery);
		console.log();
	};

	renderSelectAttributes(attr) {
		const { chosenAttributes, selectDisabled } = this.state;
		const isColor = attr.attrName === "color";
		const isCheckbox = attr.attrValue[0] === "Yes" || attr.attrValue[0] === "No";
		const isSelect = !isColor && !isCheckbox;

		if (!isSelect) {
			return <></>;
		} else {
			return (
				<select
					className="filter__select"
					onChange={(e) => this.handleClick(attr.attrName, e.target.value, "select")}
					value={chosenAttributes[attr.attrName]}
				>
					<option value="" disabled={selectDisabled}>
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
			);
		}
	}

	renderCheckboxAttributes(attr) {
		const { chosenAttributes } = this.state;
		const isCheckbox = attr.attrValue[0] === "Yes" || attr.attrValue[0] === "No";
		const selectedCheckbox = chosenAttributes[attr.attrName] === "Yes";
		if (!isCheckbox) {
			return <></>;
		} else {
			return (
				<button
					type="checkbox"
					className={`attr__btn--swatch filter__checkbox ${selectedCheckbox && "selected"}`}
					onClick={() => this.handleClick(attr.attrName, attr.attrValue, "checkbox")}
				>
					✔
				</button>
			);
		}
	}

	renderColorAttributes(attr) {
		const { chosenAttributes } = this.state;
		const isColor = attr.attrName === "color";
		if (!isColor) {
			return <></>;
		} else {
			return (
				<>
					{attr.attrValue.map((color, i) => {
						const selectedSwatch = chosenAttributes["color"] === Object.keys(color)[0];
						const isActive = selectedSwatch && "selected--swatch";
						return (
							<button
								key={i}
								type="radio"
								className={`attr__btn--swatch filter__color ${isActive}`}
								style={{ background: `${Object.values(color)}` }}
								onClick={() => this.handleClick(attr.attrName, Object.keys(color)[0])}
							></button>
						);
					})}
				</>
			);
		}
	}

	renderSidebarAttributes() {
		const { attributes } = this.state;
		return (
			<>
				{attributes.map((attr, index) => {
					const attrLabel = attr.attrName.charAt(0).toUpperCase() + attr.attrName.slice(1);
					return (
						<div key={index} className="sidebar__attrs--container">
							<label className="attr__label">{attrLabel}:</label>
							<div className="filter__attributes--container">
								{this.renderSelectAttributes(attr)}
								{this.renderCheckboxAttributes(attr)}
								{this.renderColorAttributes(attr)}
							</div>
						</div>
					);
				})}
			</>
		);
	}

	renderSidebarClearButton() {
		const { attributes, clearDisabled } = this.state;
		if (attributes.length < 1) {
			return <></>;
		} else {
			return (
				<button
					className={`filter__clear ${clearDisabled && "clear__disabled"}`}
					disabled={clearDisabled}
					onClick={this.clearFilters}
				>
					Clear
				</button>
			);
		}
	}

	renderSidebarContent() {
		return (
			<div className="sidebar__container">
				<span className="filter__label">Shopping Options</span>
				{this.renderSidebarAttributes()}
				{this.renderSidebarClearButton()}
			</div>
		);
	}

	render() {
		return this.renderSidebarContent();
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatchFilterAttributes: (obj) => dispatch(filterAttributes(obj)),
		dispatchCheckboxCancel: (bool) => dispatch(checkboxCancel(bool)),
	};
};

export default connect(null, mapDispatchToProps)(Sidebar);
