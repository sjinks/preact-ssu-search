/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentChild, Fragment, h, VNode } from 'preact';
import { Link } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import ShowHideButton from '../showhidebutton';

export interface SearchResultsProps {
    surname: string;
    name: string;
    patronymic: string;
}

interface Criminal {
    id: string;
    surname: string;
    name: string;
    patronymic: string;
    dob: string;
    thumbnail: string;
    photo: string;
    url: string;
}

function getSearchUrl(data: SearchResultsProps): string {
    const url = new URL('https://api.myrotvorets.center/ssu/v1/search');
    url.searchParams.append('s', data.surname);
    url.searchParams.append('n', data.name);
    url.searchParams.append('p', data.patronymic);
    return url.toString();
}

function renderError(): VNode<any> {
    return (
        <div class="alert alert-danger" role="alert">
            There was an error communicating with the server
        </div>
    );
}

function renderNotFound(): VNode<any> {
    return (
        <div class="alert alert-warning" role="alert">
            Не знайдено
        </div>
    );
}

function renderLoading(): VNode<any> {
    return (
        <Fragment>
            <div class="spinner-grow text-info" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-grow text-info" role="status" />
            <div class="spinner-grow text-info" role="status" />
        </Fragment>
    );
}

export default function SearchResults(props: SearchResultsProps): VNode<any> | null {
    const [state, setState] = useState<'loading' | 'error' | 'done' | 'not-found'>('done');
    const [criminals, setCriminals] = useState<Criminal[]>([]);

    useEffect(() => {
        setState('loading');
        fetch(getSearchUrl(props))
            .then(
                (r: Response): Promise<Criminal[]> => {
                    if (!r.ok) {
                        throw new Error('HTTP Error');
                    }

                    return r.json();
                },
            )
            .then((r: Criminal[]): void => {
                setCriminals(r);
                setState(r.length ? 'done' : 'not-found');
            })
            .catch(() => {
                setCriminals([]);
                setState('error');
            });
    }, [props.surname, props.name, props.patronymic]);

    switch (state) {
        case 'error':
            return renderError();
        case 'not-found':
            return renderNotFound();
        case 'loading':
            return renderLoading();
    }

    if (!criminals.length) {
        return null;
    }

    return (
        <ul class="list-unstyled">
            {criminals.map(
                (c: Criminal): ComponentChild => (
                    <li class="media my-4" key={c.id}>
                        <Link href={`/view/${c.id}`}>
                            <img src={c.thumbnail} alt="Світлина" class="mr-3 img-thumbnail" />
                        </Link>
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
                                    <strong>Дата народження:</strong> {c.dob}
                                </li>
                            </ul>
                            <ShowHideButton id={c.id} />
                        </div>
                    </li>
                ),
            )}
        </ul>
    );
}
