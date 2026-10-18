
import { useEffect, useState } from "react";
import userManagementService from "../services/userManagementService";
import "../styles/userManagement.css";

const emptyForm = {
  username: "",
  password: "",
  email: "",
  mobileNumber: "",
  firstName: "",
  lastName: "",
  roleIds: [],
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordUserId, setPasswordUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [userData, roleData] = await Promise.all([
        userManagementService.getAll(),
        userManagementService.getRoles(),
      ]);

      setUsers(Array.isArray(userData) ? userData : []);
      setRoles(Array.isArray(roleData) ? roleData : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load users and roles. Check your login and permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const toggleRole = (roleId) => {
    setForm((current) => {
      const exists = current.roleIds.includes(roleId);

      return {
        ...current,
        roleIds: exists
          ? current.roleIds.filter((id) => id !== roleId)
          : [...current.roleIds, roleId],
      };
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editingId && form.roleIds.length === 0) {
        setError("Select at least one role for the new user.");
        return;
        }
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        const { username, password, roleIds, ...updateData } = form;
        await userManagementService.update(editingId, updateData);
        setSuccess("User details updated successfully.");
      } else {
        await userManagementService.create({
          ...form,
          roleIds: form.roleIds.map(Number),
        });
        setSuccess("User account created successfully.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save the user. Check the entered details."
      );
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.userId);
    setForm({
      username: user.username || "",
      password: "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      roleIds: [],
    });
    setSuccess("");
    setError("");
  };

  const toggleStatus = async (user) => {
    const status = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    setError("");
    setSuccess("");

    try {
      await userManagementService.updateStatus(user.userId, status);
      setSuccess(`Account status changed to ${status}.`);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to change account status."
      );
    }
  };

  const assignRole = async (userId) => {
    if (!selectedRole) {
      setError("Select a role to assign.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await userManagementService.assignRole(userId, selectedRole);
      setSuccess("Role assigned successfully.");
      setSelectedRole("");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to assign this role."
      );
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();

    if (!passwordUserId || newPassword.length < 8) {
      setError("The new password must contain at least 8 characters.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await userManagementService.resetPassword(
        passwordUserId,
        newPassword
      );
      setSuccess("Password reset successfully.");
      setPasswordUserId(null);
      setNewPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to reset the password."
      );
    }
  };

  return (
    <main className="user-management">
      <header className="user-management__header">
        <div>
          <h1>User Management</h1>
          <p>Create accounts and manage hospital staff access.</p>
        </div>
        <button type="button" className="um-button um-button--secondary"
          onClick={loadData}>
          Refresh
        </button>
      </header>

      {error && <div className="um-message um-message--error">{error}</div>}
      {success && (
        <div className="um-message um-message--success">{success}</div>
      )}

      <section className="um-panel">
        <h2>{editingId ? "Update User Details" : "Create User Account"}</h2>

        <form className="um-form" onSubmit={handleSubmit}>
          {!editingId && (
            <>
              <label>
                Username *
                <input
                  name="username"
                  value={form.username}
                  onChange={updateField}
                  required
                />
              </label>

              <label>
                Initial Password *
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateField}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </label>
            </>
          )}

          <label>
            First Name
            <input name="firstName" value={form.firstName}
              onChange={updateField} />
          </label>

          <label>
            Last Name
            <input name="lastName" value={form.lastName}
              onChange={updateField} />
          </label>

          <label>
            Email *
            <input name="email" type="email" value={form.email}
              onChange={updateField} required />
          </label>

          <label>
            Mobile Number
            <input name="mobileNumber" value={form.mobileNumber}
              onChange={updateField} />
          </label>

          {!editingId && (
            <fieldset className="um-role-options">
              <legend>Assign Role(s)</legend>
              {roles.length === 0 && <p>No roles were returned by the API.</p>}

              {roles.map((role) => (
                <label key={role.roleId} className="um-role-option">
                  <input
                    type="checkbox"
                    checked={form.roleIds.includes(role.roleId)}
                    onChange={() => toggleRole(role.roleId)}
                  />
                  <span>{role.roleName}</span>
                </label>
              ))}
            </fieldset>
          )}

          <div className="um-form__actions">
            <button className="um-button" type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Create Account"}
            </button>

            {editingId && (
              <button type="button" className="um-button um-button--secondary"
                onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {passwordUserId && (
        <section className="um-panel">
          <h2>Reset Password — User #{passwordUserId}</h2>
          <form className="um-password-form" onSubmit={resetPassword}>
            <label>
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>
            <button className="um-button" type="submit">Reset Password</button>
            <button type="button" className="um-button um-button--secondary"
              onClick={() => {
                setPasswordUserId(null);
                setNewPassword("");
              }}>
              Cancel
            </button>
          </form>
        </section>
      )}

      <section className="um-panel">
        <h2>Existing Users ({users.length})</h2>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No user accounts found.</p>
        ) : (
          <div className="um-table-wrap">
            <table className="um-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>
                      <strong>
                        {[user.firstName, user.lastName].filter(Boolean).join(" ")
                          || user.username}
                      </strong>
                      <small>{user.username}</small>
                    </td>
                    <td>
                      <span>{user.email}</span>
                      <small>{user.mobileNumber || "No mobile number"}</small>
                    </td>
                    <td>
                      <div className="um-tags">
                        {(user.roles || []).map((role) => (
                          <span className="um-tag" key={role}>{role}</span>
                        ))}
                      </div>
                      <div className="um-assign">
                        <select
                          aria-label={`Role to assign to ${user.username}`}
                          value={selectedRole}
                          onChange={(event) => setSelectedRole(event.target.value)}
                        >
                          <option value="">Choose role</option>
                          {roles
                            .filter((role) => !(user.roles || []).includes(role.roleName))
                            .map((role) => (
                              <option key={role.roleId} value={role.roleId}>
                                {role.roleName}
                              </option>
                            ))}
                        </select>
                        <button type="button" className="um-button um-button--small"
                          onClick={() => assignRole(user.userId)}>
                          Assign
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`um-status ${
                        user.status === "ACTIVE" ? "is-active" : "is-inactive"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="um-actions">
                        <button type="button" className="um-button um-button--small"
                          onClick={() => startEdit(user)}>
                          Edit
                        </button>
                        <button type="button"
                          className="um-button um-button--small um-button--secondary"
                          onClick={() => toggleStatus(user)}>
                          {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>
                        <button type="button"
                          className="um-button um-button--small um-button--secondary"
                          onClick={() => {
                            setPasswordUserId(user.userId);
                            setNewPassword("");
                          }}>
                          Reset Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
