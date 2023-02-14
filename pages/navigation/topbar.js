import hljs from "highlight.js";
import { useEffect } from "react";
import Highlight from "react-highlight";
import Container from "../../components/container/container";

export default function TopBarPage() {
    useEffect(() => hljs.highlightAll());

    return (
        <Container>
            <div className="flex flex-col space-y-2">
                <div className="text-4xl font-bold">Topbar Component</div>
                <ul className="list-disc px-10">
                    <code>
                        <li className="pt-1">
                            handleClick: function
                        </li>
                    </code>
                </ul>
                <h3 className="text-xl font-bold">Example</h3>
                <p>The function is not required by the component, only if the control to toggle the side navigation  bar is it required.</p>
                <Highlight className="html rounded-md border-2">
                    {
                        "<Topbar \n\thandleClick={onClickFunction} \n/>"
                    }
                </Highlight>
            </div>
        </Container>
    );
}
