import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/dashboard" className={styles.brand}>
        Job Tracker
      </Link>
      <div className={styles.links}>
        {token ? (
          <>
            <Link to="/dashboard" className={styles.link}>
              Dashboard
            </Link>
            <Link to="/contacts" className={styles.link}>
              Contacts
            </Link>
            <button onClick={handleLogout} className={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>
              Login
            </Link>
            <Link to="/register" className={styles.link}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;