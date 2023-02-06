import Styles from "../styles/Error.module.css";
import Error from "../components/error/Error";

export default function Custom502() {
    return (
        <div className={Styles.container}>
            <Error
                code="502"
                description="Network Error"
                text="Uh-uh there's something wrong with the network connectivity."
            ></Error>
        </div>
    );
}
