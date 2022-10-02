import React from "react";
import { connect } from "react-redux";
import { graphql } from "@apollo/client/react/hoc";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

import ProductBox from "../components/ProductBox";
import Sidebar from "../components/Sidebar";
import { fetchProducts } from "../graphql/queries";
import { activeProduct, addToCart } from "../redux/Cart/cart-action";

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			filteredProducts: [],
		};
	}

	componentDidUpdate(prevProps) {
		const filterAttrs = this.props.filterAttributes;
		const AttrName = Object.keys(filterAttrs);
		const products = [];

		if (prevProps.filterAttributes[AttrName[0]] !== filterAttrs[AttrName[0]]) {
			this.props.data.category.products.map((product) => {
				product.attributes.forEach((attrs) => {
					if (attrs.name.toLowerCase() === AttrName[0]) {
						attrs.items.forEach((item) => {
							if (attrs.name === "Color") {
								item.displayValue === filterAttrs[AttrName[0]] && products.push(product);
							} else {
								item.value === filterAttrs[AttrName[0]] && products.push(product);
							}
						});
					}
				});
			});
			this.setState({ filteredProducts: products });
		}
	}

	render() {
		const {
			data: { loading },
		} = this.props;
		const { addToCart } = this.props;
		const activeCategory = this.props.activeCategory;

		const savedCategory = localStorage.getItem("activeCategory")
			? localStorage.getItem("activeCategory")
			: this.props.activeCategory;

		const products =
			Object.keys(this.props.filterAttributes)[0] === ""
				? this.props.data.category?.products
				: this.state.filteredProducts;

		if (loading) {
			return <></>;
		} else {
			return (
				<div className="home__container">
					<Sidebar
						products={products}
						activeCategory={savedCategory}
						history={this.props.history}
						location={this.props.location}
					/>
					<div>
						<div className="category__name">
							<span>{activeCategory?.charAt(0)?.toUpperCase() + activeCategory?.slice(1)}</span>
						</div>
						<div className="itemsBox__container">
							{products?.map((item) => {
								return (
									<ProductBox
										key={item.id}
										item={item}
										currency={this.props.currency}
										addToCart={addToCart}
										filterAttributes={this.props.filterAttributes}
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
		filterAttributes: state.cart.filterAttributes,
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
	withRouter(
		graphql(fetchProducts, {
			options: (props) => ({
				variables: { title: props.location.pathname.slice(1) ?? "all" },
			}),
		})(Home)
	)
);
