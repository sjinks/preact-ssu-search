import { ComponentChild, Fragment, h, VNode } from "preact";
import { Link } from "preact-router";
import { StateUpdater, useEffect, useState } from "preact/hooks";
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

function getSearchUrl(data: SearchData): string
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

function loadData(props: SearchResultsProps, searchUrl: string, setCriminals: StateUpdater<Criminal[]>, setState: StateUpdater<'loading' | 'error' | 'done' | 'not-found'>)
{
    const { sur_name, name, name_second } = props.data;
    if (!sur_name && !name && !name_second) {
        setCriminals([]);
        setState('done');
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'document';
    xhr.withCredentials = true;
    xhr.addEventListener('load', () => {
        if (!xhr.responseXML || xhr.status !== 200) {
            setState('error');
            setCriminals([]);
            return;
        }

        const doc = xhr.responseXML;
        const images = doc.querySelectorAll('.find_img img');
        if (!images.length) {
            setState('not-found');
            setCriminals([]);
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

        setState('done');
        setCriminals(result);
    });
    xhr.addEventListener('error', () => {
        setCriminals([]);
        setState('error');
    });
    xhr.open('GET', `https://cors-proxy.wildwolf.name/${encodeURIComponent(searchUrl)}`);
    xhr.send();
}

function renderError(): VNode<any>
{
    return (
        <div class="alert alert-danger" role="alert">
            There was an error communicating with the server
        </div>
    );
}

function renderNotFound(): VNode<any>
{
    return (
        <div class="alert alert-warning" role="alert">
            Не знайдено
        </div>
    );
}

function renderLoading(): VNode<any>
{
    return (
        <Fragment>
            <div class="spinner-grow text-info" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-grow text-info" role="status"/>
            <div class="spinner-grow text-info" role="status"/>
        </Fragment>
    );
}

export default function SearchResults(props: SearchResultsProps): VNode<any> | null
{
    const [state, setState] = useState<'loading' | 'error' | 'done' | 'not-found'>('done');
    const [criminals, setCriminals] = useState<Criminal[]>([]);

    useEffect(() => {
        const searchUrl = getSearchUrl(props.data);
        setState('loading');
        loadData(props, searchUrl, setCriminals, setState);
    }, [props.data.sur_name, props.data.name, props.data.name_second]);

    switch (state) {
        case 'error': return renderError();
        case 'not-found': return renderNotFound();
        case 'loading': return renderLoading();
    }

    if (!criminals.length) {
        return null;
    }

    return (
        <ul class="list-unstyled">
            {
                criminals.map((c: Criminal): ComponentChild => (
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
