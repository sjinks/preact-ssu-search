import { Component, ComponentChild, Fragment, h } from "preact";
import { Link } from "preact-router";
import { SearchData } from '../searchform';
import ShowHideButton from "../showhidebutton";

export interface SearchResultsProps {
    data: SearchData;
}

interface Criminal {
    photo: string;
    surname: string;
    name: string;
    patronymic: string;
    dob: string;
    url: string;
    key: string;
}

interface State {
    state: 'loading' | 'error' | 'done' | 'not-found';
    criminals: Criminal[];
    searchUrl: string;
}

export default class SearchResults extends Component<SearchResultsProps, State>
{
    public static getDerivedStateFromProps(nextProps: SearchResultsProps, prevState: State): State | null
    {
        const newUrl = SearchResults.getSearchUrl(nextProps.data);
        const oldUrl = prevState.searchUrl;

        if (newUrl !== oldUrl) {
            return {
                state: 'loading',
                criminals: [],
                searchUrl: newUrl
            };
        }

        return null;
    }

    private static getSearchUrl(data: SearchData): string
    {
        const url = new URL('https://ssu.gov.ua/ua/find');
        url.searchParams.append('sur_name', data.sur_name);
        url.searchParams.append('male', data.male);
        url.searchParams.append('name', data.name);
        url.searchParams.append('date_birth_from', data.date_birth_from);
        url.searchParams.append('date_birth_to', data.date_birth_to);
        url.searchParams.append('name_second', data.name_second);
        url.searchParams.append('date_from', data.date_from);
        url.searchParams.append('date_to', data.date_to);
        return url.toString();
    }

    public constructor(props: SearchResultsProps)
    {
        super(props);
        this.state = {
            criminals: [],
            state: 'done',
            searchUrl: SearchResults.getSearchUrl(props.data),
        };
    }

    public componentDidMount(): void
    {
        this.loadData();
    }

    public componentDidUpdate(prevProps: SearchResultsProps, prevState: State): void
    {
        if (this.state.state === 'loading' || prevState.state === 'error') {
            this.loadData();
        }
    }

    public render(): ComponentChild
    {
        if (this.state.state === 'error') {
            return (
                <div class="alert alert-danger" role="alert">
                    There was an error communicating with the server
                </div>
            );
        }

        if (this.state.state === 'not-found') {
            return (
                <div class="alert alert-warning" role="alert">
                    No results found
                </div>
            );
        }

        if (this.state.state === 'loading') {
            return (
                <Fragment>
                    <div class="spinner-grow text-info" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <div class="spinner-grow text-info" role="status"/>
                    <div class="spinner-grow text-info" role="status"/>
                </Fragment>
            )
        }
        
        if (!this.state.criminals.length) {
            return null;
        }

        return (
            <ul class="list-unstyled">
                {
                    this.state.criminals.map((c: Criminal): ComponentChild => (
                        <li class="media my-4" key={c.key}>
                            <Link href={`/view/${c.key}`}>
                                <img src={c.photo} alt="Світлина" class="mr-3 img-thumbnail"/>
                            </Link>
                            <div class="media-body card">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item py-1 px-2"><strong>Прізвище:</strong> {c.surname}</li>
                                    <li class="list-group-item py-1 px-2"><strong>Ім'я:</strong> {c.name}</li>
                                    <li class="list-group-item py-1 px-2"><strong>По батькові:</strong> {c.patronymic}</li>
                                    <li class="list-group-item py-1 px-2"><strong>Дата народження:</strong> {c.dob}</li>
                                </ul>
                                <ShowHideButton url={c.url}/>
                            </div>
                        </li>
                    ))
                }
            </ul>
        );
    }

    private loadData()
    {
        const { sur_name, name, name_second } = this.props.data;
        if (!sur_name && !name && !name_second) {
            this.setState({
                criminals: [],
                state: 'done'
            });

            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'document';
        xhr.withCredentials = true;
        xhr.addEventListener('load', this.dataLoaded.bind(this, xhr));
        xhr.addEventListener('error', this.dataFailed.bind(this, xhr));
        xhr.open('GET', `https://cors-proxy.wildwolf.name/${encodeURIComponent(this.state.searchUrl)}`);
        xhr.send();
    }

    private dataLoaded(this: SearchResults, xhr: XMLHttpRequest, ev: ProgressEvent<XMLHttpRequestEventTarget>): void
    {
        if (!xhr.responseXML || xhr.status !== 200) {
            this.setState({
                state: 'error',
                criminals: [],
            });

            return;
        }

        const doc = xhr.responseXML;
        const images = doc.querySelectorAll('.find_img img');
        if (!images.length) {
            this.setState({
                criminals: [],
                state: 'not-found'
            });

            return;
        }

        const data = doc.querySelectorAll('.find_content');
        const result: Criminal[] = [];
        for (let i=0; i<data.length; ++i) {
            const items = data[i].querySelectorAll('.find_content_line .find_content_line_content');
            const img = images[i];
            const link = data[i].querySelector('.news_content_item_link a');
            const url = link && link.getAttribute('href') || '';
            const matches = url.match(/\/([0-9]+)$/);

            const entry: Criminal = {
                photo: img && img.getAttribute('src') || 'https://ssu.gov.ua/img/nophoto.png',
                surname: (items[0] && items[0].textContent || '').trim(), 
                name: (items[1] && items[1].textContent || '').trim(),
                patronymic: (items[2] && items[2].textContent || '').trim(),
                dob: (items[3] && items[3].textContent || '').trim(),
                url,
                key: matches && matches[1] || ''
            };

            if (!entry.surname || !entry.name || !entry.patronymic || !entry.dob || !entry.url || !entry.key) {
                continue;
            }

            if (entry.url.startsWith('/')) {
                entry.url = 'https://ssu.gov.ua' + entry.url;
            }

            if (entry.photo.startsWith('/')) {
                entry.photo = 'https://ssu.gov.ua' + entry.photo;
            }

            result.push(entry);
        }

        this.setState({
            criminals: result,
            state: 'done'
        });
    }

    private dataFailed(this: SearchResults, xhr: XMLHttpRequest, ev: ProgressEvent<XMLHttpRequestEventTarget>): void
    {
        this.setState({
            criminals: [],
            state: 'error'
        });
    }
}
