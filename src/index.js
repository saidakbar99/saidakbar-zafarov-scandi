import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";

import "./assets/style/global.css";
import "./assets/style/Scrolls.css";
import "./assets/style/App.css";
import "./assets/style/Toaster.css";

const client = new ApolloClient({
	uri: "http://localhost:4000",
	cache: new InMemoryCache(),
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</ApolloProvider>,
	document.getElementById("root")
);
