import styles from "./SearchBar.module.css";

function SearchBar({ searchQuery, onSearch }) {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>🔍</span>
      <input
        className={styles.input}
        type="text"
        placeholder="Search by company or role..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
      />
      {searchQuery && (
        <button className={styles.clear} onClick={() => onSearch("")}>
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;