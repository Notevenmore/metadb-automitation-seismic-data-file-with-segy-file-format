import Styles from "../styles/Error.module.css";

// page not found
export default function Custom404() {
    return (
        <div className={Styles.container}>
            404 | the page you are trying to find doesn't exist
        </div>
    );
}
