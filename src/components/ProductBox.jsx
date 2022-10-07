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

	addProductFromPlp = (item) => {
		this.props.addToCart(item);
		this.setState({ toaster: true });

		this.notification = setTimeout(() => {
			this.setState({
				toaster: false,
			});
		}, 1000);
	};

	componentWillUnmount() {
		clearTimeout(this.notification);
	}

	renderProduct() {
		const { item, currency } = this.props;
		return (
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
						<span>{currency + productPrice(item, currency)}</span>
					</div>
				</div>
			</Link>
		);
	}

	renderBuyButton() {
		const { item } = this.props;
		return (
			<>
				{item.attributes.length ? (
					<Link to={`/product/${item.id}`}>
						<button className="buyBtn" onClick={() => alert("Choose attributes.")}>
							<img src={buyBtn} alt="buyBtn" />
						</button>
					</Link>
				) : (
					<button className="buyBtn" onClick={() => this.addProductFromPlp(item)}>
						<img src={buyBtn} alt="buyBtn" />
					</button>
				)}
			</>
		);
	}

	renderProductBoxContent() {
		const { item } = this.props;
		const { toaster } = this.state;
		const isOutOfStock = item.inStock ? "items__container" : "outOfStock";
		return (
			<>
				<div className={isOutOfStock}>
					{this.renderProduct()}
					{this.renderBuyButton()}
				</div>
				<Toaster show={toaster} />
			</>
		);
	}

	render() {
		return this.renderProductBoxContent();
	}
}

export default ProductBox;
