import { Component, ComponentChild, h } from "preact";

export interface CriminalDetailsProps
{
    origurl?: string;
    id?: string;
    expanded: boolean;
    full: boolean;
}

interface Criminal {
    photo: string;
    surname: string;
    name: string;
    patronymic: string;
    dob: string;
    sex: string;
    ddate: string;
    dplace: string;
    deterrence: string;
    article: string;
    contact: string;
}

interface State
{
    state: 'initial' | 'loading' | 'loaded' | 'error';
    criminal: Criminal | null;
}

export default class CriminalDetails extends Component<CriminalDetailsProps, State>
{
    public static getDerivedStateFromProps(nextProps: CriminalDetailsProps, prevState: State): State | null
    {
        if (nextProps.expanded && prevState.state === 'initial') {
            return {
                state: 'loading',
                criminal: null,
            };
        }

        return null;
    }

    public constructor(props: CriminalDetailsProps)
    {
        super(props);

        this.state = {
            state: props.expanded ? 'loading' : 'initial',
            criminal: null,
        };
    }

    public getOrigUrl(): string
    {
        if (this.props.origurl) {
            return this.props.origurl;
        }

        if (this.props.id) {
            return `https://ssu.gov.ua/ua/find/1/category/70/view/${this.props.id}`;
        }

        return '#';
    }

    public componentDidMount(): void
    {
        if (this.state.state !== 'loading') {
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'document';
        xhr.withCredentials = true;
        xhr.addEventListener('load', this.dataLoaded.bind(this, xhr));
        xhr.addEventListener('error', this.dataFailed.bind(this, xhr));
        xhr.open('GET', `https://cors-proxy.wildwolf.name/${encodeURIComponent(this.getOrigUrl())}`);
        xhr.send();
    }

    public componentDidUpdate(prevProps: CriminalDetailsProps, prevState: State): void
    {
        this.componentDidMount();
    }

    public render(): ComponentChild
    {
        if (!this.props.expanded || this.state.state === 'initial') {
            return null;
        }

        if (this.state.state === 'loading') {
            return (
                <div class="mt-2">
                    <div class="spinner-grow text-info" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <div class="spinner-grow text-info" role="status"/>
                    <div class="spinner-grow text-info" role="status"/>
                </div>
            );
        }

        if (this.state.state === 'error') {
            return (
                <div class="alert alert-danger mt-2" role="alert">
                    There was an error communicating with the server
                </div>
            );
        }

        if (!this.state.criminal) {
            return null;
        }

        return this.props.full ? this.renderFullDetails() : this.renderBriefDetails();
    }

    private renderFullDetails(): ComponentChild
    {
        return this.state.criminal ? (
            <main>
                <h1 class="text-danger">{this.state.criminal.surname} {this.state.criminal.name} {this.state.criminal.patronymic}</h1>
                <div class="media">
                    <a href={this.state.criminal.photo.replace('/thumb', '')} target="_blank">
                        <img src={this.state.criminal.photo} alt="Світлина" class="mr-3 img-thumbnail"/>
                    </a>
                    <div class="media-body card">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item py-1 px-2"><strong>Прізвище:</strong> {this.state.criminal.surname}</li>
                            <li class="list-group-item py-1 px-2"><strong>Ім'я:</strong> {this.state.criminal.name}</li>
                            <li class="list-group-item py-1 px-2"><strong>По батькові:</strong> {this.state.criminal.patronymic}</li>
                            <li class="list-group-item py-1 px-2"><strong>Дата народження:</strong> {this.state.criminal.dob}</li>
                            <li class="list-group-item py-1 px-2"><strong>Стать:</strong> {this.state.criminal.sex}</li>
                            <li class="list-group-item py-1 px-2"><strong>Дата зникнення:</strong> {this.state.criminal.ddate}</li>
                            <li class="list-group-item py-1 px-2"><strong>Місце зникнення:</strong> {this.state.criminal.dplace}</li>
                            <li class="list-group-item py-1 px-2"><strong>Запобіжний захід:</strong> {this.state.criminal.deterrence}</li>
                            <li class="list-group-item py-1 px-2"><strong>Стаття звинувачення:</strong> {this.state.criminal.article}</li>
                            <li class="list-group-item py-1 px-2"><strong>Контактна інформація:</strong> {this.state.criminal.contact}</li>
                        </ul>
                        <a href={this.getOrigUrl()} target="_blank" class="btn btn-primary">Переглянути на сайті СБУ</a>
                     </div>
                </div>
           </main>
        ) : null;
    }

    private renderBriefDetails(): ComponentChild
    {
        return this.state.criminal ? (
            <ul class="list-group list-group-flush">
                <li class="list-group-item py-1 px-2"><strong>Стать:</strong> {this.state.criminal.sex}</li>
                <li class="list-group-item py-1 px-2"><strong>Дата зникнення:</strong> {this.state.criminal.ddate}</li>
                <li class="list-group-item py-1 px-2"><strong>Місце зникнення:</strong> {this.state.criminal.dplace}</li>
                <li class="list-group-item py-1 px-2"><strong>Запобіжний захід:</strong> {this.state.criminal.deterrence}</li>
                <li class="list-group-item py-1 px-2"><strong>Стаття звинувачення:</strong> {this.state.criminal.article}</li>
                <li class="list-group-item py-1 px-2"><strong>Контактна інформація:</strong> <a href={this.getOrigUrl()} target="_blank">{this.state.criminal.contact}</a></li>
            </ul>
        ) : null;
    }

    private dataLoaded(this: CriminalDetails, xhr: XMLHttpRequest, ev: ProgressEvent<XMLHttpRequestEventTarget>): void
    {
        if (!xhr.responseXML || xhr.status !== 200) {
            this.setState({
                state: 'error',
                criminal: null,
            });

            return;
        }

        const doc = xhr.responseXML;
        const image = doc.querySelector('.find_img img');
        const data = doc.querySelector('.find_content');
        if (!image || !data) {
            this.setState({
                state: 'error',
                criminal: null
            });

            return;
        }

        const items = data.querySelectorAll('.find_content_line .find_content_line_content');

        const entry: Criminal = {
            photo: image && image.getAttribute('src') || 'https://ssu.gov.ua/img/nophoto.png',
            surname: (items[0] && items[0].textContent || '').trim(), 
            name: (items[1] && items[1].textContent || '').trim(),
            patronymic: (items[2] && items[2].textContent || '').trim(),
            dob: (items[3] && items[3].textContent || '').trim(),
            sex: (items[4] && items[4].textContent || '').trim(),
            ddate: (items[5] && items[5].textContent || '').trim(),
            dplace: (items[6] && items[6].textContent || '').trim(),
            deterrence: (items[7] && items[7].textContent || '').trim(),
            article: (items[8] && items[8].textContent || '').trim(),
            contact: (items[9] && items[9].textContent || '').trim(),
        };

        if (entry.photo.startsWith('/')) {
            entry.photo = 'https://ssu.gov.ua' + entry.photo;
        }

        this.setState({
            criminal: entry,
            state: 'loaded'
        });
    }

    private dataFailed(this: CriminalDetails, xhr: XMLHttpRequest, ev: ProgressEvent<XMLHttpRequestEventTarget>): void
    {
        this.setState({
            state: 'error',
            criminal: null,
        });
    }
}
