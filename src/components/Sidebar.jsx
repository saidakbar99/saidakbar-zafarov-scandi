import React from "react";

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			attributes: [],
			chosenAttributes: {},
		};
	}

	getAllAttributes() {
		const attrs = [];
		const attributes = [];
		const mergedAttributes = [];
		const attrNames = {};

		this.props.products.category.products.forEach((product) => {
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
			attr.items.forEach((item) => {
				attrValue.push(item.value);
			});
			attributes.push({
				attrName: attr.name,
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
				mergedAttributes.push(attr);
			}
			attr.attrValue = [...new Set(attr.attrValue)];
		});

		mergedAttributes.forEach((attr) => {
			attrNames[attr.attrName] = "";
		});

		this.setState({
			attributes: mergedAttributes,
			chosenAttributes: attrNames,
		});
	}

	componentDidMount() {
		this.getAllAttributes();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.activeCategory !== this.props.activeCategory) {
			this.getAllAttributes();
		}
	}
	render() {
		const chosen = this.state.chosenAttributes;

		const handleClick = (name, value, type) => {
			const chosen = this.state.chosenAttributes;
			if (type === "checkbox") {
				this.setState({ chosenAttributes: { ...chosen, [name]: !chosen[name] } });
			} else {
				this.setState({ chosenAttributes: { ...chosen, [name]: value } });
			}
		};

		const clearFilters = () => {
			const emptyFilters = {};
			const filtersCopy = [...this.state.attributes];

			filtersCopy.forEach((attr) => {
				emptyFilters[attr.attrName] = "";
			});
			
			this.setState({ chosenAttributes: emptyFilters });
		};
		console.log(this.state.chosenAttributes);
		return (
			<div className="sidebar__container">
				<span className="filter__label">Shopping Options</span>
				{this.state.attributes.map((attr, index) => {
					const isColor = attr.attrName === "Color";
					const isCheckbox = attr.attrValue[0] === "Yes" || attr.attrValue[0] === "No";
					return (
						<div key={index} className="sidebar__attrs--container">
							<label className="attr__label">{attr.attrName}:</label>
							<div className="filter__attributes--container">
								{!isColor && !isCheckbox ? (
									<select
										className="filter__select"
										onChange={(e) => handleClick(attr.attrName, e.target.value)}
										value={this.state.chosenAttributes[attr.attrName]}
									>
										{/* 1)pustoy turishimi 2)first value turishimi 3)'choose' dib yozilganimi*/}
										<option value="">Choose...</option>
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
											chosen[attr.attrName] ? "selected" : ""
										}`}
										onClick={() => handleClick(attr.attrName, attr.attrValue, "checkbox")}
									>
										✔
									</button>
								) : isColor ? (
									attr.attrValue.map((color, i) => {
										const isActive = chosen["Color"] === color ? "selected--swatch" : "";
										return (
											<button
												key={i}
												type="radio"
												className={`attr__btn--swatch filter__color ${isActive}`}
												style={{ background: `${color}` }}
												onClick={() => handleClick(attr.attrName, attr.attrValue[i])}
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
				{this.state.attributes.length &&
					<button className="filter__clear" onClick={clearFilters}>
						Clear
					</button>
				}
			</div>
		);
	}
}

export default Sidebar;

{
	/* <div>
	{attr.attrValue.map((value, key) => {
		const isColor = attr.attrName === "Color";
		return (
			<React.Fragment key={key}>
				{value !== "Yes" && value !== "No" ? (
					<button
						type="radio"
						className={`${isColor ? "attr__btn--swatch" : "attr__btn--notSwatch"}
						${Object.entries(this.state.selectedAttributes).map((param,idx) => {
							return(
								attr.attrName === param[idx] && param[1].includes(value)
								? attr.attrName !== "Color"
									? "selected"
									: "selected--swatch"
								: ""
							)
						})
						}`}
						style={isColor ? { background: `${value}` } : { background: "white" }}
						onClick={() => handleClick(attr.attrName, value, 'radio')}
					>
						{isColor ? "" : value}
					</button>
				) : (
					""
				)}
			</React.Fragment>
		);
	})}
	{attr.attrValue[0] === "Yes" || attr.attrValue[0] === "No" ? (
		<button 
			type="checkbox" 
			className="filter__checkbox attr__btn--notSwatch"
			onClick={() => handleClick(attr.attrName,attr.attrValue,'checkbox')}
		>
			✔
		</button>
	) : (
		""
	)}
</div> */
}
