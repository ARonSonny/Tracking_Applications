import { useEffect } from "react";
import styles from "./Toast.module.css";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${type === "error" ? styles.error : styles.success}`}>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={onClose}>✕</button>
    </div>
  );
}

export default Toast;