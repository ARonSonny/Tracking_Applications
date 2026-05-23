import { useState, useEffect, useCallback } from "react";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../services/api";
import Toast from "../components/Toast";
import Modal from "../components/Modal";
import styles from "./Contacts.module.css";

const EMPTY_FORM = {
  app_id: "",
  name: "",
  role: "",
  email: "",
  linkedin: "",
  notes: "",
};

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [modal, setModal] = useState({ message: "", id: null });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchContacts = useCallback(async () => {
    try {
      const response = await getContacts();
      setContacts(response.data);
    } catch {
      showToast("Failed to load contacts", "error");
    }
  }, []);

  useEffect(() => {
    const loadContacts = async () => {
      await fetchContacts();
      setLoading(false);
    };
    loadContacts();
  }, [fetchContacts]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateContact(editingId, formData);
      } else {
        await createContact(formData);
      }
      setFormData(EMPTY_FORM);
      setShowForm(false);
      setEditingId(null);
      showToast(editingId ? "Contact updated!" : "Contact added!");
      fetchContacts();
    } catch {
      showToast("Failed to save contact", "error");
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      app_id: contact.app_id,
      name: contact.name,
      role: contact.role || "",
      email: contact.email || "",
      linkedin: contact.linkedin || "",
      notes: contact.notes || "",
    });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setModal({ message: "Are you sure you want to delete this contact?", id });
  };

  const confirmDelete = async () => {
    try {
      await deleteContact(modal.id);
      setModal({ message: "", id: null });
      showToast("Contact deleted!");
      fetchContacts();
    } catch {
      showToast("Failed to delete contact", "error");
    }
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setShowForm(false);
    setEditingId(null);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.role && c.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Contacts</h2>
        <button className={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Add Contact"}
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>
            {editingId ? "Edit Contact" : "New Contact"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Application ID *</label>
                <input
                  className={styles.input}
                  name="app_id"
                  value={formData.app_id}
                  onChange={handleChange}
                  placeholder="Paste application ID here"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Name *</label>
                <input
                  className={styles.input}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Role</label>
                <input
                  className={styles.input}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Recruiter"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@company.com"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>LinkedIn</label>
                <input
                  className={styles.input}
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/jane"
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
                placeholder="Any notes about this contact..."
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.saveButton}>
                {editingId ? "Save Changes" : "Add Contact"}
              </button>
              <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.searchContainer}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by name or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredContacts.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>👤</p>
          <p>No contacts yet. Add your first one!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredContacts.map((contact) => (
            <div key={contact.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className={styles.cardName}>{contact.name}</h3>
                  <p className={styles.cardRole}>{contact.role || "—"}</p>
                </div>
              </div>
              <div className={styles.cardBody}>
                {contact.email && (
                  <p className={styles.cardInfo}>
                    📧 <a href={"mailto:" + contact.email} className={styles.cardLink}>{contact.email}</a>
                  </p>
                )}
                {contact.linkedin && (
                  <p className={styles.cardInfo}>
                    🔗 <a href={contact.linkedin} target="_blank" rel="noreferrer" className={styles.cardLink}>LinkedIn</a>
                  </p>
                )}
                {contact.notes && (
                  <p className={styles.cardNotes}>{contact.notes}</p>
                )}
              </div>
              <div className={styles.cardActions}>
                <button className={styles.editButton} onClick={() => handleEdit(contact)}>
                  Edit
                </button>
                <button className={styles.deleteButton} onClick={() => handleDelete(contact.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
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

export default Contacts;