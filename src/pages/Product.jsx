import React from "react";
import { connect } from "react-redux";
import { Parser } from "html-to-react";
import { graphql } from "@apollo/client/react/hoc";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

import { fetchProduct } from "../graphql/queries";
import { addToCart, attributeSelector, attributeCleaner } from "../redux/Cart/cart-action";
import { productPrice } from "../helpers/utils";
import Toaster from "../components/Toaster";

class Product extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mainImage: 0,
			toaster: false,
		};
	}

	componentWillUnmount() {
		clearTimeout(this.notification);
	}

	componentDidMount() {
		const {
			attributeCleaner,
			attributeSelector,
			data: { loading, product },
		} = this.props;

		if (!loading) {
			product.attributes.forEach((attr) => {
				attributeSelector({
					attrName: attr.name,
					attrValue: attr.items[0].value,
				});
			});
		}
		window.scrollTo(0, 0);
		attributeCleaner();
	}

	componentDidUpdate(prevProps) {
		const {
			attributeSelector,
			data: { loading, product },
		} = this.props;

		if (loading !== prevProps.data.loading) {
			product.attributes.forEach((attr) => {
				console.log(attr.name)
				if(attr.name !== 'Color'){
					attributeSelector({
						attrName: attr.name,
						attrValue: attr.items[0].value,
					});
				}
			});
		}
	}

	toggleImage = (id) => {
		this.setState({ mainImage: id });
	};

	setAttributes = (name, value) => {
		const { attributeSelector } = this.props;
		attributeSelector({
			attrName: name,
			attrValue: value,
		});
	};

	addProduct = () => {
		clearTimeout(this.notification);

		const {
			addToCart,
			attributes,
			data: { product },
		} = this.props;

		if(attributes.length === product.attributes.length){
			addToCart(product);
			this.setState({ toaster: true });
			this.notification = setTimeout(() => {
				this.setState({
					toaster: false,
				});
			}, 1000);
		}else{
			alert('Choose all attributes.')
		}
	};

	renderProductGallery() {
		const {
			data: {
				product: { gallery },
			},
		} = this.props;
		const { mainImage } = this.state;

		return (
			<div className="item__gallery">
				<div className="gallery__col">
					{gallery?.map((item, key) => {
						return (
							<img
								key={key}
								src={item}
								alt={key}
								onClick={() => this.toggleImage(key)}
								className="gallery__image"
							/>
						);
					})}
				</div>
				<img src={gallery && gallery[mainImage]} alt="mainImg" />
			</div>
		);
	}

	renderProductAttributes() {
		const {
			data: {
				product: { attributes, inStock },
			},
		} = this.props;
		return (
			<>
				{attributes.map((item, key1) => {
					const { type, name, items } = item;
					const isSwatch = type === "swatch";
					return (
						<div key={key1}>
							<span>{name.toUpperCase()}:</span>
							<br />
							{items.map((btn, key2) => {
								const { value, id } = btn;
								const isSelected =
									inStock &&
									this.props.attributes.find(
										(attr) => attr.attrName === name && attr.attrValue === value
									);
								return (
									<button
										key={key2}
										type="radio"
										onClick={() => this.setAttributes(name, value)}
										style={isSwatch ? { background: `${value}` } : {}}
										className={`attr__btn ${
											isSwatch ? "attr__btn--swatch" : "attr__btn--notSwatch"
										} ${isSelected ? (isSwatch ? "selected--swatch" : "selected") : ""}`}
										id={id}
									>
										{!isSwatch && value}
									</button>
								);
							})}
						</div>
					);
				})}
			</>
		);
	}

	renderProductInfo() {
		const {
			currency,
			data: {
				product,
				product: { inStock, description, brand, name },
			},
		} = this.props;
		return (
			<div className="item__attributes">
				<p className="product__brand">{brand}</p>
				<p className="product__name">{name}</p>
				{this.renderProductAttributes()}
				<span>PRICE:</span>
				<span className="fz-24">{currency + productPrice(product, currency)}</span>
				<button
					onClick={inStock ? this.addProduct : undefined}
					id={inStock ? "add__btn" : "add__btn--outOfStock"}
				>
					{inStock ? "ADD TO CART" : "OUT OF STOCK"}
				</button>
				<div id="unset-formatting">{Parser().parse(description)}</div>
			</div>
		);
	}

	renderProductContent() {
		const {
			data: { loading },
		} = this.props;
		const { toaster } = this.state;

		if (loading) {
			return <></>;
		} else {
			return (
				<>
					<div className="item__description--container">
						{this.renderProductGallery()}
						{this.renderProductInfo()}
					</div>
					<Toaster show={toaster} />
				</>
			);
		}
	}

	render() {
		return this.renderProductContent();
	}
}

const mapStateToProps = (state) => {
	return {
		currency: state.cart.currency,
		attributes: state.cart.attributes,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addToCart: (product) => dispatch(addToCart(product)),
		attributeSelector: (obj) => dispatch(attributeSelector(obj)),
		attributeCleaner: () => dispatch(attributeCleaner()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withRouter(
		graphql(fetchProduct, {
			options: (props) => ({ variables: { id: props.match.params.id } }),
		})(Product)
	)
);
