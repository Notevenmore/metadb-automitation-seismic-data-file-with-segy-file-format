import Styles from '../styles/Error.module.css';
import Error from '../components/error/Error';

export default function Custom503() {
  return (
    <div className={Styles.container}>
      <Error
        code="503"
        description="Server Error"
        text="Uh-uh the server have an issue that is being investigated."
      />
    </div>
  );
}
