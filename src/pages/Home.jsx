import React from "react";
import { connect } from "react-redux";
import { graphql } from "@apollo/client/react/hoc";

import ProductBox from "../components/ProductBox";
import { fetchProducts } from "../graphql/queries";
import { activeProduct, addToCart } from "../redux/Cart/cart-action";
import Sidebar from "../components/Sidebar";

class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			data: { loading },
		} = this.props;
		const { addToCart } = this.props;
		const activeCategory = this.props.activeCategory;
		console.log(this.props.data.category)
		if (loading) {
			return <></>;
		} else {
			return (
				<div className="home__container">
					<Sidebar
						products={this.props.data}
						activeCategory={this.props.activeCategory}
					/>
					<div>
						<div className="category__name">
							<span>{activeCategory?.charAt(0)?.toUpperCase() + activeCategory?.slice(1)}</span>
						</div>
						<div className="itemsBox__container">
							{this.props.data.category.products.map((item) => {
								return (
									<ProductBox
										key={item.id}
										item={item}
										currency={this.props.currency}
										addToCart={addToCart}
									/>
								);
							})}
						</div>
					</div>
				</div>
			);
		}
	}
}
const mapStateToProps = (state) => {
	return {
		activeCategory: state.cart.activeCategory,
		currency: state.cart.currency,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addToCart: (id) => dispatch(addToCart(id)),
		activeProduct: (id) => dispatch(activeProduct(id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	graphql(fetchProducts, {
		options: (props) => ({
			variables: { title: props.activeCategory ?? "all" },
		}),
	})(Home)
);
