import { Fragment, h } from 'preact';
import { getCurrentUrl, RouterProps } from 'preact-router';
import SearchForm from '../../components/searchform';
import SearchResults, { SearchResultsProps } from '../../components/searchresults';

function getInitialState(): SearchResultsProps {
    const url = new URL(location.origin + getCurrentUrl());
    return {
        surname: url.searchParams.get('surname') || '',
        name: url.searchParams.get('name') || '',
        patronymic: url.searchParams.get('patronymic') || '',
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SearchRoute(props: RouterProps): h.JSX.Element {
    return (
        <Fragment>
            <SearchForm />
            <SearchResults {...getInitialState()} />
        </Fragment>
    );
}
