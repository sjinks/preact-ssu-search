import { Component, ComponentChild, h } from "preact";
import CriminalDetails from "../criminaldetails";

export interface SHProps
{
    url: string;
}

interface SHState
{
    expanded: boolean;
}

export default class ShowHideButton extends Component<SHProps, SHState>
{
    public constructor(props: SHProps)
    {
        super(props);

        this.state = {
            expanded: false
        };

        this.clickHandler = this.clickHandler.bind(this);
    }

    public render(): ComponentChild
    {
        return (
            <div class={this.state.expanded ? "border-top" : undefined}>
                <CriminalDetails origurl={this.props.url} expanded={this.state.expanded} full={false}/>
                <div class="card-footer pt-0 pb-2 px-2">
                    <button type="button" class="btn btn-info mt-2" onClick={this.clickHandler}>
                        {this.state.expanded ? "⮝ Згорнути" : "⮟ Разгорнути"}
                    </button>
                </div>
            </div>
        );
    }

    private clickHandler(): void
    {
        this.setState((prevState: Readonly<SHState>, props: Readonly<SHProps>): SHState => {
            return {
                expanded: !prevState.expanded
            };
        });
    }
}
