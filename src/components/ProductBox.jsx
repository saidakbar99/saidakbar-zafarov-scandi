import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
	attributeSelector,
	addToCart,
	attributeCleaner,
} from '../redux/Cart/cart-action';
import { productPrice } from '../helpers/utils';
import buyBtn from '../assets/images/buy-btn.svg';
import Toaster from './Toaster';

class ProductBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = { toaster: false };
	}

	addProductFromPlp = (item) => {
		const { attributeSelector } = this.props;

		item.attributes.forEach((attr) => {
			attributeSelector({
				attrName: attr.name,
				attrValue: attr.items[0].value,
			});
		});
		this.props.addToCart(item);
		this.props.attributeCleaner();

		this.setState({ toaster: true }, () => {});

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
					<div className="items__img--container">
						<img
							className={`items__img ${!item.inStock && 'outOfStock__img'}`}
							src={item.gallery[0]}
							alt={item.id}
						/>
					</div>
					<div className={item.inStock ? 'inStock' : 'outOfStock__text'}>
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
		const isSwatch = item.attributes.find(
			(attribute) => attribute.name === 'Color'
		);

		if (isSwatch) {
			return (
				<Link to={`/product/${item.id}`}>
					<button
						className="buyBtn"
						onClick={() => alert('Choose attributes.')}
					>
						<img src={buyBtn} alt="buyBtn" />
					</button>
				</Link>
			);
		} else {
			return (
				<button className="buyBtn" onClick={() => this.addProductFromPlp(item)}>
					<img src={buyBtn} alt="buyBtn" />
				</button>
			);
		}
	}

	renderProductBoxContent() {
		const { item } = this.props;
		const { toaster } = this.state;
		const isOutOfStock = item.inStock ? 'items__container' : 'outOfStock';
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

const mapDispatchToProps = (dispatch) => {
	return {
		attributeSelector: (obj) => dispatch(attributeSelector(obj)),
		addToCart: (id) => dispatch(addToCart(id)),
		attributeCleaner: () => dispatch(attributeCleaner()),
	};
};

export default connect(null, mapDispatchToProps)(ProductBox);
