import { h, VNode } from "preact";
import { RouterProps } from "preact-router";
import CriminalDetails from "../../components/criminaldetails";

export default function ViewRoute(props: RouterProps): VNode<any>
{
    return (
        <CriminalDetails {...props} expanded={true} full={true}/>
    );
}
