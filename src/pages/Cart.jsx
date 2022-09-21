import React, { Component } from "react";
import { connect } from "react-redux";

import { addOne, removeFromCart, subOne } from "../redux/Cart/cart-action";
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
		const activeCurrency = this.props.currency;

		let totalSum = 0;
		let totalQty = 0;
		this.props.cartProducts.forEach((item) => {
			totalSum += parseInt(item.qty) * productPrice(item, activeCurrency);
			totalQty += item.qty;
		});

		const RemoveProduct = (id) => {
			if (window.confirm("Do you want to remove product?")) {
				removeFromCart(id);
			}
		};

		return (
			<div>
				<div className="category__name">
					<span className="cart-name">
						{this.props.cartProducts.length ? "CART" : "CART IS EMPTY"}
					</span>
				</div>
				{this.props.cartProducts.length ? (
					<div className="cart__container">
						{this.props.cartProducts.map((item) => {
							return (
								<div
									key={item.id}
									className="cart__item--container cart__border"
								>
									<div className="bagCart__item--left">
										<span>{item.brand}</span>
										<span className="cart-item-name">{item.name}</span>
										<span>
											{item.prices[0].amount.toFixed(2)}
											{item.prices[0].currency.symbol}
										</span>
										<div className="cart__item--attributes--container">
											{item.attributes.map((attr, key) => {
												// const attrID = item.id.split(",").slice(1);
												// return item.attributes.length ? (
												//   <div className="cart__item--attributes">
												//     <span>
												//       {[Object.keys(attr)[0]]}:
												//     </span>
												//     <button
												//       className="cart__item--attributes--btn"
												//       key={key}
												//       style={attr.type === "swatch"
												//           ? {backgroundColor: `${item.attributes[key]?.items[attrID[key]]?.value}`}
												//           : {background: "white" }
												//       }
												//     >
												//       {attr.type !== "swatch"
												//         ? item.attributes[key]?.items[attrID[key]]?.value
												//         : ""}
												//     </button>
												//   </div>
												// ) : (
												//   ""
												// )
												return (
													<div key={key} className="cart__item--attrs">
														<span className="">{attr.attrName}:</span>
														<button
															className={`cartOverlay__attrValue ml-0
                                ${
																	attr.attrName === "Color"
																		? "btn-32-32"
																		: "btn-63-45"
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
									<span className="mb-8">
										{this.props.currency + (totalSum * 0.21).toFixed(2)}
									</span>
									<span className="mb-8">{totalQty}</span>
									<span className="mb-8">
										{this.props.currency}
										{totalSum.toFixed(2)}
									</span>
								</div>
							</div>
							<button className="cart__btn--checkOut OrderSize">ORDER</button>
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
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);