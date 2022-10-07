import React from "react";
import { connect } from "react-redux";
import { graphql } from "@apollo/client/react/hoc";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

import ProductBox from "../components/ProductBox";
import Sidebar from "../components/Sidebar";
import { fetchProducts } from "../graphql/queries";
import { activeProduct, addToCart, checkboxCancel, isPageChanged } from "../redux/Cart/cart-action";

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

		const isPageChanged = prevProps.isPageChanged !== this.props.isPageChanged;
		const isFilterChanged = prevProps.filterAttributes[AttrName[0]] !== filterAttrs[AttrName[0]];

		this.props.dispatchIsPageChanged(false);

		if (isFilterChanged || isPageChanged) {
			this.props.data.category.products.forEach((product) => {
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

		if (this.props.checkboxCancel) {
			this.setState({ filteredProducts: [] });
			this.props.dispatchCheckboxCancel(false);
		}
	}

	componentWillUnmount() {
		this.props.dispatchIsPageChanged(true);
	}

	renderProducts(products) {
		const { activeCategory, currency, addToCart, filterAttributes } = this.props;
		return (
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
								currency={currency}
								addToCart={addToCart}
								filterAttributes={filterAttributes}
							/>
						);
					})}
				</div>
			</div>
		);
	}

	renderHomeContent() {
		const {
			activeCategory,
			history,
			location,
			filterAttributes,
			data: { loading, category },
		} = this.props;
		const { filteredProducts } = this.state;

		const products =
			Object.keys(filterAttributes)[0] === "" ? category?.products : filteredProducts;

		const savedCategory = localStorage.getItem("activeCategory")
			? localStorage.getItem("activeCategory")
			: activeCategory;

		if (loading) {
			return <></>;
		} else {
			return (
				<div className="home__container">
					<Sidebar
						products={products}
						activeCategory={savedCategory}
						history={history}
						location={location}
					/>
					{this.renderProducts(products)}
				</div>
			);
		}
	}

	render() {
		return this.renderHomeContent();
	}
}
const mapStateToProps = (state) => {
	return {
		activeCategory: state.cart.activeCategory,
		currency: state.cart.currency,
		filterAttributes: state.cart.filterAttributes,
		checkboxCancel: state.cart.checkboxCancel,
		isPageChanged: state.cart.isPageChanged,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addToCart: (id) => dispatch(addToCart(id)),
		activeProduct: (id) => dispatch(activeProduct(id)),
		dispatchCheckboxCancel: (bool) => dispatch(checkboxCancel(bool)),
		dispatchIsPageChanged: (bool) => dispatch(isPageChanged(bool)),
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
