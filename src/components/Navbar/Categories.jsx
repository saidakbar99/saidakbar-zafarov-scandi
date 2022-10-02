import React from "react";
import { connect } from "react-redux";
import { graphql } from "@apollo/client/react/hoc";
import { Link } from "react-router-dom";

import { activeCategory, filterAttributes } from "../../redux/Cart/cart-action";
import { fetchCategories } from "../../graphql/queries";

class Categories extends React.Component {
	componentDidMount() {
		const activeCategory = localStorage.getItem("activeCategory");
		if (activeCategory) {
			this.props.dispatchActiveCategory(activeCategory);
		}
	}
	render() {
		const handleClick = (category) => {
			this.props.dispatchActiveCategory(category);
			localStorage.setItem("activeCategory", category);

			const emptyFilters = {};
			this.props.dispatchFilterAttributes(emptyFilters);
		};

		const savedCategory = localStorage.getItem("activeCategory")
			? localStorage.getItem("activeCategory")
			: this.props.activeCategory;

		return (
			<div className="menu__container">
				{this.props.data.categories?.map((category, id) => {
					return (
						<Link to={`/${category.name}`} key={id}>
							<button
								className={savedCategory === category.name ? "active" : "menu__button"}
								onClick={() => handleClick(category.name)}
							>
								{category.name.charAt(0).toUpperCase() + category.name.slice(1)}
							</button>
						</Link>
					);
				})}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		activeCategory: state.cart.activeCategory,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		dispatchActiveCategory: (category) => dispatch(activeCategory(category)),
		dispatchFilterAttributes: (obj) => dispatch(filterAttributes(obj)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(graphql(fetchCategories)(Categories));
