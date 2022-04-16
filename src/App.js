import React, { Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from "@apollo/client";

import './App.css'
import { Navbar, Cart, PLP, PDP } from './components'

export const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
});


class App extends Component {

    constructor(props){
        super(props)

        this.state = {
            pdpPath: [],
            plpPath: [],
        }
    }

    componentDidMount(){
        client.query({
            query: gql`
                {
                    categories{
                        name
                    }
                    category{
                        products{
                            id
                        }
                    }
                }
            `
        }).then(response => this.setState({ plpPath: response.data.categories, pdpPath: response.data.category.products }))
    }
    
    render(){
        const plpRoutes = [
            this.state.plpPath.map(item => {
                return({
                    path: `/${item.name}`,
                    query: item.name
                })
            })
        ]

        const pdpRoutes = [
            this.state.pdpPath.map(item => {
                return({
                    path: `/${item.id}`,
                    query: item.id
                })
            })
        ]

        return(
            <ApolloProvider client={client}>
                <div className='App__container'>
                    <Navbar client={client} />
                    <Routes>
                        <Route path='*' element={<PLP client={client} query={"all"} />} />
                        <Route path='/cart' element={ <Cart client={client} /> } />

                        {
                            plpRoutes[0].map((item, key) => {
                                return(
                                    <Route key={key} path={item.path} element={<PLP client={client} query={item.query}  />}/>
                                )
                            })
                        }
                        {
                            pdpRoutes[0].map((item, key) => {
                                return(
                                    <Route key={key} path={item.path} element={<PDP client={client} query={item.query} />}/>
                                )
                            })
                        }
                    </Routes>
                </div>
            </ApolloProvider>
        )
    }
}


export default App