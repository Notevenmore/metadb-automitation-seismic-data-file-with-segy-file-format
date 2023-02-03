import Styles from "../styles/Error.module.css";

export default function Custom503() {
    return (
        <div className={Styles.container}>
            503 | Uh-uh, the server have an issue that is being investigated.
        </div>
    );
}
