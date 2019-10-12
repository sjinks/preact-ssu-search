import { Component, ComponentChild, h } from "preact";
import { Route, Router } from "preact-router";

import RootRoute from "../routes/root";
import SearchRoute from "../routes/search";
import ViewRoute from "../routes/view";
import Header from "./header";

export default class App extends Component
{
    public render(): ComponentChild
    {
        return (
            <div id="app">
                <Header />
                <div class="container">
                    <Router>
                        <Route path="/" component={RootRoute}/>
                        <Route path="/search" component={SearchRoute}/>
                        <Route path="/view/:id" component={ViewRoute}/>
                    </Router>
                </div>
            </div>
        );
    }
}
