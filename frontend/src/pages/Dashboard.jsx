import { useState, useEffect, useCallback } from "react";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../services/api";
import StatsBar from "../components/StatsBar";
import SearchBar from "../components/SearchBar";
import Toast from "../components/Toast";
import Modal from "../components/Modal";
import styles from "./Dashboard.module.css";

const STATUS_COLORS = {
  WISHLIST: "#6c757d",
  APPLIED: "#0d6efd",
  INTERVIEWING: "#fd7e14",
  OFFER: "#198754",
  REJECTED: "#dc3545",
};

const EMPTY_FORM = {
  company: "",
  role_title: "",
  status: "WISHLIST",
  location: "",
  date_applied: "",
  job_url: "",
  salary_range: "",
  notes: "",
};

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [modal, setModal] = useState({ message: "", id: null });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchApplications = useCallback(async () => {
    try {
      const response = await getApplications();
      setApplications(response.data);
    } catch {
      showToast("Failed to load applications", "error");
    }
  }, []);

  useEffect(() => {
    const loadApplications = async () => {
      await fetchApplications();
      setLoading(false);
    };
    loadApplications();
  }, [fetchApplications]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateApplication(editingId, formData);
      } else {
        await createApplication(formData);
      }
      setFormData(EMPTY_FORM);
      setShowForm(false);
      setEditingId(null);
      showToast(editingId ? "Application updated!" : "Application added!");
      fetchApplications();
    } catch {
      showToast("Failed to save application", "error");
    }
  };

  const handleEdit = (app) => {
    setFormData({
      company: app.company,
      role_title: app.role_title,
      status: app.status,
      location: app.location || "",
      date_applied: app.date_applied || "",
      job_url: app.job_url || "",
      salary_range: app.salary_range || "",
      notes: app.notes || "",
    });
    setEditingId(app.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setModal({ message: "Are you sure you want to delete this application?", id });
  };

  const confirmDelete = async () => {
    try {
      await deleteApplication(modal.id);
      setModal({ message: "", id: null });
      showToast("Application deleted!");
      fetchApplications();
    } catch {
      showToast("Failed to delete application", "error");
    }
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredApplications = applications
    .filter((a) => filterStatus === "ALL" || a.status === filterStatus)
    .filter((a) =>
      a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role_title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortField] || "";
      const valB = b[sortField] || "";
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Applications</h2>
        <button className={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Add Application"}
        </button>
      </div>

      <StatsBar applications={applications} />

      {showForm && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>
            {editingId ? "Edit Application" : "New Application"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Company *</label>
                <input
                  className={styles.input}
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Google"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Role *</label>
                <input
                  className={styles.input}
                  name="role_title"
                  value={formData.role_title}
                  onChange={handleChange}
                  placeholder="Frontend Engineer"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select
                  className={styles.input}
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="WISHLIST">Wishlist</option>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEWING">Interviewing</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Location</label>
                <input
                  className={styles.input}
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Chicago, IL"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Date Applied</label>
                <input
                  className={styles.input}
                  type="date"
                  name="date_applied"
                  value={formData.date_applied}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Job URL</label>
                <input
                  className={styles.input}
                  name="job_url"
                  value={formData.job_url}
                  onChange={handleChange}
                  placeholder="https://careers.google.com"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Salary Range</label>
                <input
                  className={styles.input}
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  placeholder="$120k - $150k"
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Notes</label>
              <textarea
                className={styles.textarea}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any notes about this application..."
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.saveButton}>
                {editingId ? "Save Changes" : "Add Application"}
              </button>
              <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />

      <div className={styles.filterRow}>
        {["ALL", "WISHLIST", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`${styles.filterPill} ${filterStatus === status ? styles.filterPillActive : ""}`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredApplications.length === 0 ? (
        <div className={styles.empty}>
          {filterStatus === "ALL" ? (
            <>
              <p className={styles.emptyIcon}>📋</p>
              <p>No applications yet. Add your first one!</p>
            </>
          ) : (
            <>
              <p className={styles.emptyIcon}>🔍</p>
              <p>No applications with status <strong>{filterStatus}</strong>.</p>
              <button className={styles.clearFilter} onClick={() => setFilterStatus("ALL")}>
                Clear Filter
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                {[
                  { label: "Company", field: "company" },
                  { label: "Role", field: "role_title" },
                  { label: "Status", field: "status" },
                  { label: "Location", field: "location" },
                  { label: "Date Applied", field: "date_applied" },
                  { label: "Salary", field: "salary_range" },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    className={styles.th}
                    onClick={() => handleSort(field)}
                  >
                    {label}{" "}
                    {sortField === field ? (sortDirection === "asc" ? "▲" : "▼") : "▲▼"}
                  </th>
                ))}
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id} className={styles.tableRow}>
                  <td className={styles.td}>
                    {app.job_url
                      ? <a href={app.job_url} target="_blank" rel="noreferrer" className={styles.companyLink}>{app.company}</a>
                      : <span style={{ fontWeight: 600, color: "var(--primary)" }}>{app.company}</span>
                    }
                  </td>
                  <td className={styles.td}>{app.role_title}</td>
                  <td className={styles.td}>
                    <span
                      className={styles.badge}
                      style={{ backgroundColor: STATUS_COLORS[app.status] }}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className={styles.td}>{app.location || "—"}</td>
                  <td className={styles.td}>{app.date_applied || "—"}</td>
                  <td className={styles.td}>{app.salary_range || "—"}</td>
                  <td className={styles.td}>
                    <button className={styles.editButton} onClick={() => handleEdit(app)}>
                      Edit
                    </button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(app.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        message={modal.message}
        onConfirm={confirmDelete}
        onCancel={() => setModal({ message: "", id: null })}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />
    </div>
  );
}

export default Dashboard;