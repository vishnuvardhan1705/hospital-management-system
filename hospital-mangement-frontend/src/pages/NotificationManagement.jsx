
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";

import notificationService from "../services/notificationService";
import "../styles/notificationMangement.css";

const initialForm = {
  userId: "",
  patientId: "",
  notificationType: "GENERAL",
  title: "",
  message: "",
};

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong."
  );
}

function formatDate(dateValue) {
  if (!dateValue) return "—";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleString();
}

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await notificationService.getAll();
      setNotifications(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (item) => item.status === "UNREAD"
  ).length;

  const filteredNotifications = useMemo(() => {
    const term = search.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesFilter =
        filter === "ALL" ||
        (filter === "UNREAD" && item.status === "UNREAD") ||
        (filter === "READ" && item.status === "READ");

      const patientName = item.patient
        ? `${item.patient.firstName || ""} ${
            item.patient.lastName || ""
          }`
        : "";

      const searchableText = [
        item.title,
        item.message,
        item.notificationType,
        item.userId,
        item.patient?.id,
        item.patient?.patientNumber,
        patientName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesFilter && searchableText.includes(term);
    });
  }, [notifications, filter, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const payload = {
        userId: form.userId.trim() ? Number(form.userId) : null,
        patientId: form.patientId.trim()
          ? Number(form.patientId)
          : null,
        notificationType: form.notificationType,
        title: form.title.trim(),
        message: form.message.trim(),
      };

      await notificationService.create(payload);

      setForm(initialForm);
      setSuccess("Notification created successfully.");
      await loadNotifications();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    setError("");
    setSuccess("");

    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notificationId
            ? { ...item, status: "READ" }
            : item
        )
      );
      setSuccess("Notification marked as read.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="notification-page">
      <div className="notification-header">
        <div>
          <h1>Notification Management</h1>
          <p>
            Create notifications and track which ones have been read.
          </p>
        </div>

        <button
          type="button"
          className="notification-refresh-button"
          onClick={loadNotifications}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="notification-alert notification-alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="notification-alert notification-alert-success">
          {success}
        </div>
      )}

      <div className="notification-stats">
        <div className="notification-stat-card">
          <span>Total notifications</span>
          <strong>{notifications.length}</strong>
        </div>

        <div className="notification-stat-card">
          <span>Unread notifications</span>
          <strong>{unreadCount}</strong>
        </div>

        <div className="notification-stat-card">
          <span>Read notifications</span>
          <strong>{notifications.length - unreadCount}</strong>
        </div>
      </div>

      <section className="notification-panel">
        <div className="notification-panel-heading">
          <div>
            <h2>Create Notification</h2>
            <p>Enter the recipient and notification details.</p>
          </div>
          <Send size={21} />
        </div>

        <form onSubmit={handleCreate} className="notification-form">
          <div className="notification-form-grid">
            <label>
              User ID <span>(optional)</span>
              <input
                type="number"
                name="userId"
                min="1"
                value={form.userId}
                onChange={handleChange}
                placeholder="Enter user ID"
              />
            </label>

            <label>
              Patient ID <span>(optional)</span>
              <input
                type="number"
                name="patientId"
                min="1"
                value={form.patientId}
                onChange={handleChange}
                placeholder="Enter patient ID"
              />
            </label>

            <label>
              Notification Type
              <select
                name="notificationType"
                value={form.notificationType}
                onChange={handleChange}
                required
              >
                <option value="GENERAL">General</option>
                <option value="APPOINTMENT">Appointment</option>
                <option value="LAB">Laboratory</option>
                <option value="PAYMENT">Payment</option>
                <option value="FOLLOW_UP">Follow-up</option>
              </select>
            </label>

            <label>
              Title
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={255}
                placeholder="Enter notification title"
                required
              />
            </label>

            <label className="notification-message-field">
              Message
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                maxLength={1000}
                rows={4}
                placeholder="Enter notification message"
                required
              />
              <span>{form.message.length}/1000 characters</span>
            </label>
          </div>

          <p className="notification-form-note">
            At least one recipient ID is recommended. If a Patient ID is
            entered, it must belong to an existing patient.
          </p>

          <button
            type="submit"
            className="notification-primary-button"
            disabled={submitting}
          >
            <Send size={17} />
            {submitting ? "Creating..." : "Create Notification"}
          </button>
        </form>
      </section>

      <section className="notification-panel">
        <div className="notification-panel-heading">
          <div>
            <h2>Notifications</h2>
            <p>
              {filteredNotifications.length} notification(s) displayed
            </p>
          </div>
          <Bell size={22} />
        </div>

        <div className="notification-toolbar">
          <div className="notification-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, message, or type..."
            />
          </div>

          <div className="notification-filters">
            {["ALL", "UNREAD", "READ"].map((option) => (
              <button
                key={option}
                type="button"
                className={
                  filter === option
                    ? "notification-filter active"
                    : "notification-filter"
                }
                onClick={() => setFilter(option)}
              >
                {option === "ALL"
                  ? "All"
                  : option === "UNREAD"
                    ? "Unread"
                    : "Read"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="notification-empty">
            Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="notification-empty">
            No notifications found.
          </div>
        ) : (
          <div className="notification-list">
            {filteredNotifications.map((item) => (
              <article
                key={item.id}
                className={`notification-item ${
                  item.status === "UNREAD" ? "is-unread" : ""
                }`}
              >
                <div className="notification-item-icon">
                  {item.status === "UNREAD" ? (
                    <Bell size={20} />
                  ) : (
                    <CheckCheck size={20} />
                  )}
                </div>

                <div className="notification-item-content">
                  <div className="notification-item-title-row">
                    <h3>{item.title}</h3>
                    <span
                      className={`notification-status ${
                        item.status === "READ"
                          ? "status-read"
                          : "status-unread"
                      }`}
                    >
                      {item.status || "UNKNOWN"}
                    </span>
                  </div>

                  <p className="notification-item-message">
                    {item.message}
                  </p>

                  <div className="notification-item-meta">
                    <span>
                      Type: {item.notificationType || "—"}
                    </span>
                    <span>User ID: {item.userId ?? "—"}</span>
                    <span>
                      Patient:{" "}
                      {item.patient
                        ? `${item.patient.firstName || ""} ${
                            item.patient.lastName || ""
                          } (ID: ${item.patient.id})`
                        : "—"}
                    </span>
                    <span>Created: {formatDate(item.createdAt)}</span>
                    {item.readAt && (
                      <span>Read: {formatDate(item.readAt)}</span>
                    )}
                  </div>
                </div>

                {item.status === "UNREAD" && (
                  <button
                    type="button"
                    className="notification-read-button"
                    onClick={() => handleMarkAsRead(item.id)}
                    title="Mark as read"
                  >
                    <Check size={17} />
                    Mark read
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
