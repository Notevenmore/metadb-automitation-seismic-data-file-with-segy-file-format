import Styles from "../styles/Error.module.css";

export default function Custom502() {
    return (
        <div className={Styles.container}>
            502 | Uh-uh, there's something wrong with the network connectivity
        </div>
    );
}
