import Styles from '../styles/Error.module.css';
import Error from '../components/error';

export default function Custom403() {
  return (
    <div className={Styles.container}>
      <Error
        code="403"
        description="Permission problem"
        text="You have no permission to this page"
      />
    </div>
  );
}
