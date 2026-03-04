import Routes from '../routes';
import styles from './app.module.css';

const App = () => {
  return (
    <div className={styles['app']}>
      <div className={styles['header']}>
        <h1>Ticket Management App</h1>
      </div>
      <Routes />
    </div>
  );
};

export default App;
