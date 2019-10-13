import { h } from 'preact';
import { RouterProps } from 'preact-router';
import CriminalDetails from '../../components/criminaldetails';

export default function ViewRoute(props: RouterProps & { id: string }): h.JSX.Element {
    return <CriminalDetails {...props} expanded full />;
}
