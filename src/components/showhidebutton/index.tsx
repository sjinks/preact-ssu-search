import { h } from 'preact';
import { useState } from 'preact/hooks';
import CriminalDetails from '../criminaldetails';

interface SHProps {
    id: string;
}

export default function ShowHideButton(props: SHProps): h.JSX.Element {
    const [expanded, setExpanded] = useState(false);
    const clickHandler = (): void => {
        setExpanded(!expanded);
    };

    return (
        <div class={expanded ? 'border-top' : undefined}>
            <CriminalDetails id={props.id} expanded={expanded} full={false} />
            <div class="card-footer pt-0 pb-2 px-2">
                <button type="button" class="btn btn-info btn-sm mt-2" onClick={clickHandler}>
                    {expanded ? '⮝ Згорнути' : '⮟ Разгорнути'}
                </button>
            </div>
        </div>
    );
}
