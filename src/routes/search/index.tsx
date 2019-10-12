import { Fragment, h, VNode } from "preact";
import { getCurrentUrl, RouterProps } from "preact-router";
import SearchForm, { SearchData } from "../../components/searchform";
import SearchResults from "../../components/searchresults";

function getInitialState(): SearchData
{
    const url = new URL(location.origin + getCurrentUrl());
    return {
        sur_name: url.searchParams.get('surname') || '',
        name: url.searchParams.get('name') || '',
        name_second: url.searchParams.get('patronymic') || '',
        male: '',
        date_birth_from: '0000-00-00',
        date_birth_to: '2099-12-31',
        date_from: '0000-00-00',
        date_to: '2099-12-31'
    };
}

export default function SearchRoute(props: RouterProps): VNode<any>
{
    return (
        <Fragment>
            <SearchForm/>
            <SearchResults data={getInitialState()}/>
        </Fragment>
    );
}
