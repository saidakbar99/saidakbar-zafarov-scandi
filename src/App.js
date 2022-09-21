import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";

class App extends Component {
	render() {
		return (
			<>
				<div className="App__container">
					<Navbar />
					<Switch>
						<Route exact path="/">
							<Home />
						</Route>
						<Route exact path="/product/:id">
							<Product />
						</Route>
						<Route exact path="/cart">
							<Cart />
						</Route>
					</Switch>
				</div>
			</>
		);
	}
}

export default App;
