import { Component, ComponentChild, h } from "preact";
// tslint:disable-next-line: no-var-requires
const logoPNG = require('./logo-64.png');
// tslint:disable-next-line: no-var-requires
const logoWebP = require('./logo-64.webp');

export default class Header extends Component
{
    public render(): ComponentChild
    {
        return (
            <header class="mb-4">
                <nav class="navbar navbar-dark bg-primary">
                    <h1>
                        <a class="navbar-brand" href="/">
                            <picture>
                                <source type="image/webp" srcset={logoWebP}/>
                                <source type="image/png" srcset={logoPNG}/>
                                <img src={logoPNG} alt="" class="mr-2"/>
                            </picture>
                            Розшук СБУ
                        </a>
                    </h1>
                </nav>
            </header>
        );
    }
}
