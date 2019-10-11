import { Component, ComponentChild, h } from "preact";
import { Router } from "preact-router";

import CriminalDetails from "./criminaldetails";
import Header from "./header";
import SearchForm from './searchform';
import SERP from './serp';

if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    // require("preact/debug");
}

export default class App extends Component
{
    public render(): ComponentChild
    {
        return (
            <div id="app">
                <Header />
                <div class="container">
                    <Router>
                        <SearchForm path="/"/>
                        <SERP path="/search"/>
                        <CriminalDetails path="/view/:id" expanded={true} full={true}/>
                    </Router>
                </div>
            </div>
        );
    }
}
