import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { UserPlus, User, Trash2, Pencil, X } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Admins() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [editingAdminId, setEditingAdminId] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("wtf_admin_token");
      const response = await axios.get(`${API_URL}/api/auth/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(response.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to load admins");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      const token = localStorage.getItem("wtf_admin_token");

      if (editingAdminId) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password; // Do not update password if empty

        const response = await axios.put(`${API_URL}/api/auth/admins/${editingAdminId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmins(admins.map(a => a._id === editingAdminId ? response.data.user : a));
        handleCancelEdit();
      } else {
        const response = await axios.post(`${API_URL}/api/auth/create-admin`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmins([...admins, response.data.user]);
        setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "" });
      }
    } catch (err) {
      console.error("Error saving admin:", err);
      setError(err.response?.data?.message || "Failed to save admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdminId(admin._id);
    setFormData({
      firstName: admin.firstName || "",
      lastName: admin.lastName || "",
      email: admin.email || "",
      phone: admin.phone || "",
      password: "",
    });
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingAdminId(null);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "" });
    setError(null);
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) {
      return;
    }

    try {
      const token = localStorage.getItem("wtf_admin_token");
      await axios.delete(`${API_URL}/api/auth/admins/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(admins.filter(a => a._id !== adminId));
    } catch (err) {
      console.error("Error deleting admin:", err);
      alert(err.response?.data?.message || "Failed to delete admin");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">Admin Management</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary flex items-center gap-2">
              {editingAdminId ? <Pencil size={20} className="text-primary" /> : <UserPlus size={20} className="text-primary" />}
              {editingAdminId ? "Edit Admin" : "Add New Admin"}
            </h2>
            {editingAdminId && (
              <button type="button" onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {editingAdminId && <span className="text-xs text-gray-400 font-normal">(leave blank to keep current)</span>}
              </label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingAdminId} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <button type="submit" disabled={isSubmitting} className="mt-2 w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50">
              {isSubmitting ? "Saving..." : editingAdminId ? "Update Admin" : "Create Admin"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-secondary flex items-center gap-2">
              <User size={20} className="text-primary" /> Admins List
            </h2>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading admins...</div>
            ) : admins.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No admins found</div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{admin.firstName} {admin.lastName}</td>
                      <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(admin)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition"
                            title="Edit Admin"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                            title="Delete Admin"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admins;
