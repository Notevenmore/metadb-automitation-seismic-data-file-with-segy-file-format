import Styles from "../styles/Error.module.css";

export default function Custom500() {
    return (
        <div className={Styles.container}>
            500 | Uh-uh something's wrong with the server. Refresh the page or come
            back later.
        </div>
    );
}
