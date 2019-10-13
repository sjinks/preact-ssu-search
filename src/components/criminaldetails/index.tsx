import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { formatSex, formatDDate, formatDOB } from '../../utils/format';

export interface CriminalDetailsProps {
    id: string;
    expanded: boolean;
    full: boolean;
}

interface Criminal {
    surname: string;
    name: string;
    patronymic: string;
    dob: string;
    sex: string;
    ddate: string;
    dplace: string;
    pmeasure: string;
    article: string;
    contact: string;
    thumbnail: string;
    photo: string;
    url: string;
}

function renderLoading(): h.JSX.Element {
    return (
        <div class="mt-2">
            <div class="spinner-grow text-info" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-grow text-info" role="status" />
            <div class="spinner-grow text-info" role="status" />
        </div>
    );
}

function renderError(): h.JSX.Element {
    return (
        <div class="alert alert-danger mt-2" role="alert">
            There was an error communicating with the server
        </div>
    );
}

function renderNotFound(): h.JSX.Element {
    return (
        <div class="alert alert-warning mt-2" role="alert">
            Не знайдено
        </div>
    );
}

function renderFullDetails(c: Criminal, id: string): h.JSX.Element {
    return (
        <main>
            <h1 class="text-danger">
                {c.surname} {c.name} {c.patronymic}
            </h1>
            <div class="media">
                <a href={c.photo} target="_blank">
                    <img src={c.thumbnail} alt="Світлина" class="mr-3 img-thumbnail" />
                </a>
                <div class="media-body card">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item py-1 px-2">
                            <strong>Прізвище:</strong> {c.surname}
                        </li>
                        <li class="list-group-item py-1 px-2">
                            <strong>Ім'я:</strong> {c.name}
                        </li>
                        <li class="list-group-item py-1 px-2">
                            <strong>По батькові:</strong> {c.patronymic}
                        </li>
                        <li class="list-group-item py-1 px-2">
                            <strong>Дата народження:</strong> {formatDOB(c.dob)}
                        </li>
                        <li class="list-group-item py-1 px-2">
                            <strong>Стать:</strong> {formatSex(c.sex)}
                        </li>
                        <li class="list-group-item py-1 px-2">
                            <strong>Дата зникнення:</strong> {formatDDate(c.ddate)}
                        </li>
                        <li class="list-group-item py-1 px-2">
                            <strong>Місце зникнення:</strong> {c.dplace}
                        </li>
                        <li class="list-group-item py-1 px-2">
                            <strong>Запобіжний захід:</strong> {c.pmeasure}
                        </li>
                        <li class="list-group-item py-1 px-2">
                            <strong>Стаття звинувачення:</strong> {c.article}
                        </li>
                        <li class="list-group-item py-1 px-2">
                            <strong>Контактна інформація:</strong> {c.contact}
                        </li>
                    </ul>
                    <a
                        href={`https://ssu.gov.ua/ua/find/1/category/70/view/${id}`}
                        target="_blank"
                        class="btn btn-primary"
                    >
                        Переглянути на сайті СБУ
                    </a>
                </div>
            </div>
        </main>
    );
}

function renderBriefDetails(c: Criminal, id: string): h.JSX.Element {
    return (
        <ul class="list-group list-group-flush">
            <li class="list-group-item py-1 px-2">
                <strong>Стать:</strong> {formatSex(c.sex)}
            </li>
            <li class="list-group-item py-1 px-2">
                <strong>Дата зникнення:</strong> {formatDDate(c.ddate)}
            </li>
            <li class="list-group-item py-1 px-2">
                <strong>Місце зникнення:</strong> {c.dplace}
            </li>
            <li class="list-group-item py-1 px-2">
                <strong>Запобіжний захід:</strong> {c.pmeasure}
            </li>
            <li class="list-group-item py-1 px-2">
                <strong>Стаття звинувачення:</strong> {c.article}
            </li>
            <li class="list-group-item py-1 px-2">
                <strong>Контактна інформація:</strong>{' '}
                <a href={`https://ssu.gov.ua/ua/find/1/category/70/view/${id}`} target="_blank">
                    {c.contact}
                </a>
            </li>
        </ul>
    );
}

export default function CriminalDetails(props: CriminalDetailsProps): h.JSX.Element | null {
    type State = 'initial' | 'loading' | 'loaded' | 'error';

    const [state, setState] = useState<State>(props.expanded ? 'loading' : 'initial');
    const [criminal, setCriminal] = useState<Criminal | null>(null);

    useEffect((): void => {
        if (state === 'initial' && props.expanded) {
            setState('loading');
        } else if (state !== 'loading' || !props.expanded) {
            return;
        }

        fetch(`https://api.myrotvorets.center/ssu/v1/details/${props.id}`)
            .then(
                (r: Response): Promise<Criminal | null> => {
                    if (r.status === 404) {
                        return Promise.resolve(null);
                    }

                    if (r.ok) {
                        return r.json();
                    }

                    throw new Error('HTTP Error');
                },
            )
            .then((r: Criminal | null): void => {
                setState('loaded');
                setCriminal(r);
            })
            .catch((): void => {
                setState('error');
                setCriminal(null);
            });
    }, [props.id, props.expanded]);

    if (!props.expanded) {
        return null;
    }

    switch (state) {
        case 'initial':
            return null;
        case 'loading':
            return renderLoading();
        case 'error':
            return renderError();
    }

    if (!criminal) {
        return renderNotFound();
    }

    return props.full ? renderFullDetails(criminal, props.id) : renderBriefDetails(criminal, props.id);
}
