import React from "react";
import { Link } from "react-router-dom";

import buyBtn from "../assets/images/buy-btn.svg";
import { productPrice } from "../helpers/utils";
import Toaster from "./Toaster";

class ProductBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = { toaster: false };
	}
	render() {
		const item = this.props.item;
		const { addToCart } = this.props;

		const addProductFromPlp = (item) => {
			addToCart(item);
			this.setState({ toaster: true });

			const notification = setTimeout(
				function () {
					this.setState({ toaster: false });
				}.bind(this),
				1000
			);
		};

		return (
			<>
				<div className={item.inStock ? "items__container" : "outOfStock"}>
					<Link to={`/product/${item.id}`}>
						<div className="items" id="p-relative">
							<img
								className={item.inStock ? "" : "outOfStock__img"}
								src={item.gallery[0]}
								alt={item.id}
							/>
							<div className={item.inStock ? "inStock" : "outOfStock__text"}>
								<p>OUT OF STOCK</p>
							</div>
							<div className="item__brand">
								<span className="item-brand-text">
									{item.brand} {item.name}
								</span>
								<span>{this.props.currency + productPrice(item, this.props.currency)}</span>
							</div>
						</div>
					</Link>

					{item.attributes.length ? (
						<Link to={`/product/${item.id}`}>
							<button className="buyBtn" onClick={() => alert("Choose attributes.")}>
								<img src={buyBtn} alt="buyBtn" />
							</button>
						</Link>
					) : (
						<button className="buyBtn" onClick={() => addProductFromPlp(item)}>
							<img src={buyBtn} alt="buyBtn" />
						</button>
					)}
				</div>
				<Toaster show={this.state.toaster} />
			</>
		);
	}
}

export default ProductBox;
