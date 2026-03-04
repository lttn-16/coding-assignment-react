import { Link } from "react-router-dom";
import Routes from "../routes";
import styles from "./app.module.css";

const App = () => {
    return (
        <div className={styles["app"]}>
            <div className={styles["header"]}>
                <Link to="/" className={styles["link"]}>
                    <h1>Ticket Management App</h1>
                </Link>
            </div>
            <Routes />
        </div>
    );
};

export default App;
