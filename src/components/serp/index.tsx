import { Component, ComponentChild, Fragment, h } from "preact";
import { getCurrentUrl } from "preact-router";
import SearchForm, { SearchData } from '../searchform';
import SearchResults from '../searchresults';

interface State {
    searchData: SearchData;
}

export default class SERP extends Component<{}, State>
{
    public static urlToState(): State
    {
        const url = new URL(location.origin + getCurrentUrl());

        return {
            searchData: {
                sur_name: url.searchParams.get('surname') || '',
                name: url.searchParams.get('name') || '',
                name_second: url.searchParams.get('patronymic') || '',
                male: '',
                date_birth_from: '0000-00-00',
                date_birth_to: '2099-12-31',
                date_from: '0000-00-00',
                date_to: '2099-12-31'
            }
        };
    }

    public static getDerivedStateFromProps(nextProps: any, prevState: State): State | null
    {
        return SERP.urlToState();
    }

    public render(): ComponentChild
    {
        return (
            <Fragment>
                <SearchForm/>
                <SearchResults data={this.state.searchData}/>
            </Fragment>
        );
    }
}