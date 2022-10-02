import React, { Component } from "react";
import { connect } from "react-redux";

import { addOne, removeFromCart, subOne, cartCleaner } from "../redux/Cart/cart-action";
import Slider from "../components/Slider";
import { productPrice } from "../helpers/utils";

class Cart extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeImg: [],
		};
	}

	componentDidMount() {
		const imageCopy = [];
		for (let i = 0; this.props.cartProducts.length > i; i++) {
			imageCopy.push(0);
			this.setState({ activeImg: imageCopy });
		}
	}

	render() {
		const { addOne } = this.props;
		const { removeFromCart } = this.props;
		const { subOne } = this.props;
		const { cartCleaner } = this.props;
		const activeCurrency = this.props.currency;
		const cartProducts = this.props.cartProducts;

		let totalSum = 0;
		let totalQty = 0;
		cartProducts.forEach((item) => {
			totalSum += parseInt(item.qty) * productPrice(item, activeCurrency);
			totalQty += item.qty;
		});

		const RemoveProduct = (id) => {
			if (window.confirm("Do you want to remove product?")) {
				removeFromCart(id);
			}
		};

		const handleClick = () => {
			alert(`Checked out ${activeCurrency + totalSum.toFixed(2)}`);
			cartCleaner();
		};

		return (
			<div className="cart__container">
				<div className="category__name">
					<span className="cart-name">{cartProducts.length ? "CART" : "CART IS EMPTY"}</span>
				</div>
				{cartProducts.length ? (
					<div>
						{cartProducts.map((item) => {
							return (
								<div key={item.id} className="cart__item--container cart__border">
									<div className="bagCart__item--left">
										<span>{item.brand}</span>
										<span className="cart-item-name">{item.name}</span>
										<span>
											{item.prices[0].amount.toFixed(2)}
											{item.prices[0].currency.symbol}
										</span>
										<div className="cart__item--attributes--container">
											{item.attributes.map((attr, key) => {
												return (
													<div key={key} className="cart__item--attrs">
														<span className="cart__attrName">{attr.attrName}:</span>
														<button
															className={` cart__item--attributes--btn 
                                ${
																	attr.attrName === "Color"
																		? "btn-32-32"
																		: "btn-63-45 cart__attrValue"
																}
                              `}
															style={
																attr.attrName === "Color"
																	? { backgroundColor: `${attr.attrValue}` }
																	: { background: "white" }
															}
														>
															{attr.attrName !== "Color" ? attr.attrValue : ""}
														</button>
													</div>
												);
											})}
										</div>
									</div>
									<div className="bagCart__item--right">
										<div className="cart__item--counter">
											<button onClick={() => addOne(item.id)}>+</button>
											<span>{item.qty}</span>
											<button
												onClick={() => subOne(item.id, item.qty)}
												className={item.qty < 2 ? "btn__opacity" : ""}
											>
												-
											</button>
										</div>
										<Slider images={item.gallery} />
										<button
											className="remove__btn remove__btn--top"
											onClick={() => RemoveProduct(item.id)}
										>
											x
										</button>
									</div>
								</div>
							);
						})}
						<div className="totalOrder">
							<div className="d-flex">
								<div className="totalOrder__nums mr-8">
									<p>Tax 21%: </p>
									<p>Quantity:</p>
									<p>Total: </p>
								</div>
								<div className="totalOrder__nums">
									<span className="mb-8">{this.props.currency + (totalSum * 0.21).toFixed(2)}</span>
									<span className="mb-8">{totalQty}</span>
									<span className="mb-8">
										{this.props.currency}
										{totalSum.toFixed(2)}
									</span>
								</div>
							</div>
							<button className="cart__btn--checkOut OrderSize" onClick={handleClick}>
								ORDER
							</button>
						</div>
					</div>
				) : (
					""
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		cartProducts: state.cart.cart,
		currency: state.cart.currency,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addOne: (id) => dispatch(addOne(id)),
		removeFromCart: (id) => dispatch(removeFromCart(id)),
		subOne: (id, value) => dispatch(subOne(id, value)),
		cartCleaner: () => dispatch(cartCleaner()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
