import Styles from '../styles/Error.module.css';
import Error from '../components/error';

export default function Custom504() {
  return (
    <div className={Styles.container}>
      <Error
        code="503"
        description="Gateway Timeout"
        text="There is a gateway timeout error. Reloat the page in a few minutes"
      />
    </div>
  );
}
