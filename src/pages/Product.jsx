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

	componentDidMount() {
		window.scrollTo(0, 0);
		this.props.attributeCleaner();
		this.props.data.loading === false &&
			this.props.data.product.attributes.forEach((attr) => {
				this.props.attributeSelector({
					attrName: attr.name,
					attrValue: attr.items[0].value,
				});
			});
	}

	componentDidUpdate(prevProps) {
		if (this.props.data.loading !== prevProps.data.loading) {
			this.props.data.product.attributes.forEach((attr) => {
				this.props.attributeSelector({
					attrName: attr.name,
					attrValue: attr.items[0].value,
				});
			});
		}
	}

	componentWillUnmount() {
		clearTimeout();
		//todo: add qigandan keyin srazu chiqib ketsa utechka pamyati
	}

	render() {
		const {
			data: { loading, product },
		} = this.props;
		const gallery = product?.gallery;
		const attributes = product?.attributes;
		const { addToCart } = this.props;

		const setAttributes = (obj) => {
			this.props.attributeSelector(obj);
		};

		const toggleImage = (id) => {
			this.setState({ mainImage: id });
		};

		const addProduct = () => {
			addToCart(product);
			this.setState({ toaster: true });

			const notification = setTimeout(
				function () {
					this.setState({ toaster: false });
				}.bind(this),
				1000
			);
		};

		if (loading) {
			return <></>;
		} else {
			return (
				<>
					<div className="item__description--container">
						<div className="item__gallery">
							<div className="gallery__col">
								{gallery?.map((item, key) => {
									return (
										<img
											key={key}
											src={item}
											alt={key}
											onClick={() => toggleImage(key)}
											className="gallery__image"
										/>
									);
								})}
							</div>
							<img src={gallery ? gallery[this.state.mainImage] : ""} alt="mainImg" />
						</div>
						<div className="item__attributes">
							<h2>{product.brand}</h2>
							<h3>{product.name}</h3>
							{attributes.map((item, key1) => {
								return (
									<div key={key1}>
										<span>{item.name.toUpperCase()}:</span>
										<br />
										{item.items.map((btn, key2) => {
											const isSwatch = item.type === "swatch";
											const isSelected =
												product?.inStock &&
												this.props.attributes.find(
													(attr) => attr.attrName === item.name && attr.attrValue === btn.value
												);
											return (
												<button
													key={key2}
													type="radio"
													onClick={() =>
														setAttributes({
															attrName: item.name,
															attrValue: btn.value,
														})
													}
													style={isSwatch ? { background: `${btn.value}` } : {}}
													className={`attr__btn 
													${isSwatch ? "attr__btn--swatch" : "attr__btn--notSwatch"}
													${isSelected ? (isSwatch ? "selected--swatch" : "selected") : ""}`}
													id={btn.id}
												>
													{item.type !== "swatch" ? btn.value : ""}
												</button>
											);
										})}
									</div>
								);
							})}
							<span>PRICE:</span>
							<span className="fz-24">
								{this.props.currency + productPrice(product, this.props.currency)}
							</span>
							<button
								onClick={product?.inStock ? () => addProduct() : () => alert}
								id={product?.inStock ? "add__btn" : "add__btn--outOfStock"}
							>
								{product?.inStock ? "ADD TO CART" : "OUT OF STOCK"}
							</button>
							<div id="unset-formatting">{Parser().parse(product?.description)}</div>
						</div>
					</div>
					<Toaster show={this.state.toaster} />
				</>
			);
		}
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
