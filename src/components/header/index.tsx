import { h } from 'preact';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoPNG = require('./logo-64.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoWebP = require('./logo-64.webp');

export default function Header(): h.JSX.Element {
    return (
        <header class="mb-4">
            <nav class="navbar navbar-dark bg-primary">
                <h1>
                    <a class="navbar-brand" href="/">
                        <picture>
                            <source type="image/webp" srcset={logoWebP} />
                            <source type="image/png" srcset={logoPNG} />
                            <img src={logoPNG} alt="" class="mr-2" />
                        </picture>
                        Розшук СБУ
                    </a>
                </h1>
            </nav>
        </header>
    );
}
