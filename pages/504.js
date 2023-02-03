import Styles from "../styles/Error.module.css";

export default function Custom504() {
    return (
        <div className={Styles.container}>
            504 | There is a gateway timeout error. Reloat the page in a few minutes
        </div>
    );
}
