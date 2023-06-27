import Styles from '../styles/Error.module.css';
import Error from '../components/error/Error';

export default function Custom500() {
  return (
    <div className={Styles.container}>
      <Error
        code="500"
        description="Server Error"
        text="Uh-uh something's wrong with the server. Refresh the page or come
                back later."
      />
    </div>
  );
}
