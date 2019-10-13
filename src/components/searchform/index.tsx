/* eslint-disable @typescript-eslint/no-explicit-any */
import { h, VNode } from 'preact';
import { getCurrentUrl, route, RouterProps } from 'preact-router';
import { StateUpdater, useState } from 'preact/hooks';

function clearForm(): void {
    route('/');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SearchForm(props: RouterProps): VNode<any> | null {
    const url = new URL((location.origin || 'https://example.com') + getCurrentUrl());
    const [surname, setSurname] = useState(url.searchParams.get('surname') || '');
    const [name, setName] = useState(url.searchParams.get('name') || '');
    const [patronymic, setPatronymic] = useState(url.searchParams.get('patronymic') || '');

    const onSubmit = (e: Event): void => {
        e.preventDefault();
        route(`/search?surname=${surname}&name=${name}&patronymic=${patronymic}`);
    };

    const map: Record<string, StateUpdater<string>> = {
        surname: setSurname,
        name: setName,
        patronymic: setPatronymic,
    };

    const onChange = (e: Event): void => {
        const element = e.target as HTMLInputElement;
        const { id, value } = element;
        map[id](value);
    };

    return (
        <form onSubmit={onSubmit} class="mb-4">
            <div class="form-row align-items-center mb-2">
                <div class="col-auto">
                    <label for="surname" class="col-form-label col-form-label-sm">
                        Прізвище
                    </label>
                    <input
                        type="text"
                        id="surname"
                        class="form-control form-control-sm"
                        value={surname}
                        onChange={onChange}
                    />
                </div>
                <div class="col-auto">
                    <label for="name" class="col-form-label col-form-label-sm">
                        Ім'я
                    </label>
                    <input
                        type="text"
                        id="name"
                        class="form-control form-control-sm"
                        value={name}
                        onChange={onChange}
                    />
                </div>
                <div class="col-auto">
                    <label for="patronymic" class="col-form-label col-form-label-sm">
                        По батькові
                    </label>
                    <input
                        type="text"
                        id="patronymic"
                        class="form-control form-control-sm"
                        value={patronymic}
                        onChange={onChange}
                    />
                </div>
            </div>
            <div class="form-row align-items-left">
                <div class="col-auto">
                    <button type="submit" class="btn btn-primary btn-sm">
                        Шукати
                    </button>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-danger btn-sm" onClick={clearForm}>
                        Очистити
                    </button>
                </div>
            </div>
        </form>
    );
}
