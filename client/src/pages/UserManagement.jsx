import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { apiFetch } from "../api.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member"
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadCurrentUser();
    loadUsers();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const data = await apiFetch("/api/users/me/profile");
      setCurrentUser(data);
      
      // Redirect if not PM or Admin
      if (data.role !== "PM" && data.role !== "Admin") {
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      window.location.href = "/";
    }
  };

  const loadUsers = async () => {
    try {
      const data = await apiFetch("/api/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      if (editingId) {
        // Update user
        const payload = { ...formData };
        // Don't send password if empty
        if (!payload.password || payload.password.trim() === "") {
          delete payload.password;
        }
        
        await apiFetch(`/api/users/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        // Create user
        if (!formData.password || formData.password.trim() === "") {
          setError(t("users.passwordRequired"));
          return;
        }
        
        await apiFetch("/api/users", {
          method: "POST",
          body: JSON.stringify(formData)
        });
      }
      
      loadUsers();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role
    });
    setEditingId(user.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!confirm(t("users.deleteConfirm"))) return;
    
    try {
      await apiFetch(`/api/users/${id}`, { method: "DELETE" });
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Member"
    });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return "bg-deep-indigo/15 text-deep-indigo border border-deep-indigo/20";
      case "PM":
        return "bg-soft-coral/15 text-soft-coral border border-soft-coral/20";
      default:
        return "bg-muted-sage/15 text-muted-sage border border-muted-sage/20";
    }
  };

  // Show loading while checking permissions
  if (!currentUser) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-xs font-semibold text-soft-stone">{t("common.loading")}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t("users.title")}>
      <div className="p-4 md:px-8 md:pb-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-dark-slate md:hidden">{t("users.title")}</h2>
            <p className="text-xs text-soft-stone md:hidden">{t("users.manageTeam")}</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-coral text-xs py-2 px-4"
          >
            + {t("users.addUser")}
          </button>
        </div>

        {/* User Form */}
        {showForm && (
          <div className="mb-6 rounded-xl border border-light-grey bg-pure-white p-5 shadow-soft sm:p-6">
            <h3 className="mb-4 text-base font-semibold text-dark-slate sm:text-lg">
              {editingId ? t("users.editUser") : t("users.createUser")}
            </h3>
            
            {error && (
              <div className="mb-4 rounded-lg bg-muted-rose/10 border border-muted-rose/20 p-3 text-xs font-medium text-muted-rose">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-soft-stone">{t("users.fullName")}</label>
                <input
                  type="text"
                  placeholder={t("users.fullName")}
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-soft-stone">{t("users.email")}</label>
                <input
                  type="email"
                  placeholder={t("users.email")}
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-soft-stone">{t("users.password")}</label>
                <input
                  type="password"
                  placeholder={editingId ? t("users.passwordPlaceholder") : t("users.password")}
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingId}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-soft-stone">{t("users.role")}</label>
                <select
                  className="input-field"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Member">{t("users.roles.member")}</option>
                  <option value="PM">{t("users.roles.pm")}</option>
                  <option value="Admin">{t("users.roles.admin")}</option>
                </select>
              </div>
              
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs py-2.5"
                >
                  {editingId ? t("users.updateUser") : t("users.createUser")}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 btn-secondary text-xs py-2.5"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table - Desktop */}
        <div className="hidden overflow-hidden rounded-xl border border-light-grey bg-pure-white shadow-soft md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-light-grey bg-soft-mist">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-soft-stone">
                    {t("users.name")}
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-soft-stone">
                    {t("users.email")}
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-soft-stone">
                    {t("users.role")}
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-soft-stone">
                    {t("users.joined")}
                  </th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-soft-stone">
                    {t("users.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-grey">
                {users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-soft-mist/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-coral text-xs font-semibold text-white">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-dark-slate text-xs">{user.name}</p>
                          {user.id === currentUser.id && (
                            <span className="rounded-full bg-muted-emerald/15 px-2 py-0.5 text-[10px] font-semibold text-muted-emerald">
                              {t("users.you")}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-soft-stone">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-muted-grey">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="rounded-lg border border-light-grey bg-white px-3 py-1.5 text-xs font-semibold text-dark-slate transition hover:bg-soft-mist"
                        >
                          {t("common.edit")}
                        </button>
                        {user.id !== currentUser.id && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="rounded-lg border border-muted-rose/30 bg-muted-rose/10 px-3 py-1.5 text-xs font-semibold text-muted-rose transition hover:bg-muted-rose/20"
                          >
                            {t("common.delete")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Cards - Mobile */}
        <div className="space-y-4 md:hidden">
          {users.map((user) => (
            <div key={user.id} className="rounded-xl border border-light-grey bg-pure-white p-4 shadow-soft">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="truncate font-semibold text-dark-slate text-xs">{user.name}</p>
                    {user.id === currentUser.id && (
                      <span className="flex-shrink-0 rounded-full bg-muted-emerald/15 px-2 py-0.5 text-[10px] font-semibold text-muted-emerald">
                        {t("users.you")}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-soft-stone">{user.email}</p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getRoleBadge(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <div className="mb-3 text-[11px] text-muted-grey">
                {t("users.joined")}: {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2 border-t border-light-grey pt-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="flex-1 rounded-lg border border-light-grey bg-white py-1.5 text-xs font-semibold text-dark-slate transition hover:bg-soft-mist"
                >
                  {t("common.edit")}
                </button>
                {user.id !== currentUser.id && (
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex-1 rounded-lg border border-muted-rose/30 bg-muted-rose/10 py-1.5 text-xs font-semibold text-muted-rose transition hover:bg-muted-rose/20"
                  >
                    {t("common.delete")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="mt-6 rounded-xl border border-light-grey bg-pure-white p-12 text-center shadow-soft">
            <p className="text-xs text-soft-stone">{t("users.noUsers")}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
