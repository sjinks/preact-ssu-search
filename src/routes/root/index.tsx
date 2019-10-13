import { h, Fragment } from 'preact';
import Helmet from 'preact-helmet';
import SearchForm from '../../components/searchform';

export default function RootRoute(): h.JSX.Element {
    return (
        <Fragment>
            <Helmet
                title="Розшук СБУ"
                meta={[{ name: 'description', content: 'Пошук осіб, які перебувають в розшуку СБУ' }]}
            />
            <SearchForm />
        </Fragment>
    );
}
