import { h, VNode } from "preact";
import { useState } from "preact/hooks";
import CriminalDetails from "../criminaldetails";

interface SHProps
{
    url: string;
}

export default function ShowHideButton(props: SHProps): VNode<any>
{
    const [expanded, setExpanded] = useState(false);
    const clickHandler = (): void => {
        setExpanded(!expanded);
    };

    return (
        <div class={expanded ? "border-top" : undefined}>
            <CriminalDetails origurl={props.url} expanded={expanded} full={false}/>
            <div class="card-footer pt-0 pb-2 px-2">
                <button type="button" class="btn btn-info mt-2" onClick={clickHandler}>
                    {expanded ? "⮝ Згорнути" : "⮟ Разгорнути"}
                </button>
            </div>
        </div>
    );
}
