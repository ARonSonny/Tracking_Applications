import styles from "./StatsBar.module.css";

function StatsBar({ applications }) {
  const total = applications.length;
  const wishlist = applications.filter((a) => a.status === "WISHLIST").length;
  const applied = applications.filter((a) => a.status === "APPLIED").length;
  const interviewing = applications.filter((a) => a.status === "INTERVIEWING").length;
  const offers = applications.filter((a) => a.status === "OFFER").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;

  const stats = [
    { label: "Total", count: total, color: "var(--primary)" },
    { label: "Wishlist", count: wishlist, color: "var(--gray)" },
    { label: "Applied", count: applied, color: "var(--info)" },
    { label: "Interviewing", count: interviewing, color: "var(--warning)" },
    { label: "Offers", count: offers, color: "var(--success)" },
    { label: "Rejected", count: rejected, color: "var(--danger)" },
  ];

  return (
    <div className={styles.container}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.card}>
          <span className={styles.count} style={{ color: stat.color }}>
            {stat.count}
          </span>
          <span className={styles.label}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;