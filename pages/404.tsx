import Styles from '../styles/Error.module.css';
import Error from '../components/error';

// page not found
export default function Custom404() {
  return (
    <div className={Styles.container}>
      <Error
        code="404"
        description="Page not found"
        text="The page you are trying to find doesn't exist"
      />
    </div>
  );
}
