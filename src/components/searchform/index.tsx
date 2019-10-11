import { Component, ComponentChild, h } from "preact";
import { getCurrentUrl, route } from 'preact-router';

interface State
{
    surname?: string;
    name?: string;
    patronymic?: string;
}

export interface SearchData
{
    sur_name: string;
    name: string;
    name_second: string;
    male: string;
    date_birth_from: string;
    date_birth_to: string;
    date_from: string;
    date_to: string;
}

export default class SearchForm extends Component<{}, State>
{
    public static urlToState(): State
    {
        const url = new URL((location.origin || 'https://example.com') + getCurrentUrl());

        return {
            surname: url.searchParams.get('surname') || '',
            name: url.searchParams.get('name') || '',
            patronymic: url.searchParams.get('patronymic') || '',
        };
    }

    public constructor()
    {
        super();

        this.state = SearchForm.urlToState();

        this.onChange  = this.onChange.bind(this);
        this.onSubmit  = this.onSubmit.bind(this);
        this.clearForm = this.clearForm.bind(this);
    }

    public render(): ComponentChild
    {
        return (
            <form onSubmit={this.onSubmit} class="mb-4">
                <div class="form-row align-items-center mb-2">
                    <div class="col-auto">
                        <label for="surname" class="col-form-label col-form-label-sm">Прізвище</label>
                        <input type="text" id="surname" class="form-control form-control-sm" value={this.state.surname} onChange={this.onChange}/>
                    </div>
                    <div class="col-auto">
                        <label for="name" class="col-form-label col-form-label-sm">Ім'я</label>
                        <input type="text" id="name" class="form-control form-control-sm" value={this.state.name} onChange={this.onChange}/>
                    </div>
                    <div class="col-auto">
                        <label for="patronymic" class="col-form-label col-form-label-sm">По батькові</label>
                        <input type="text" id="patronymic" class="form-control form-control-sm" value={this.state.patronymic} onChange={this.onChange}/>
                    </div>
                </div>
                <div class="form-row align-items-left">
                    <div class="col-auto">
                        <button type="submit" class="btn btn-primary btn-sm">Шукати</button>
                    </div>
                    <div class="col-auto">    
                        <button type="button" class="btn btn-danger btn-sm" onClick={this.clearForm}>Очистити</button>
                    </div>
                </div>
            </form>
        );
    }

    private clearForm(): void
    {
        route('/');
    }

    private onChange(e: Event): void
    {
        const element = e.target as HTMLInputElement;
        const { id, value } = element;
        this.setState({
            [id]: value
        });
    }

    private onSubmit(e: Event): void
    {
        e.preventDefault();
        route(`/search?surname=${this.state.surname}&name=${this.state.name}&patronymic=${this.state.patronymic}`);
    }
}
