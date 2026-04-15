// frontend/src/components/admin/ManageUsers.jsx (CREATE/UPDATE THIS)
import { useState, useEffect } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "../../api/userApi";
import { FaEdit, FaTrash, FaUserCog } from "react-icons/fa";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [roleModal, setRoleModal] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      await fetchUsers();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      await fetchUsers();
      setRoleModal(null);
    } catch (error) {
      console.error("Failed to update user role:", error);
      alert("Failed to update user role");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Manage Users</h2>
        <span className="badge bg-primary fs-6">Total: {users.length} users</span>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="ps-4 fw-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'info'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="text-center">
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setRoleModal(user)}
                      >
                        <FaUserCog />
                      </button>
                      {user.role !== 'admin' && (
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setDeleteConfirm(user._id)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteConfirm(null)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change User Role</h5>
                <button type="button" className="btn-close" onClick={() => setRoleModal(null)}></button>
              </div>
              <div className="modal-body">
                <p>Change role for <strong>{roleModal.name}</strong></p>
                <div className="d-flex gap-3">
                  <button 
                    className={`btn ${roleModal.role === 'user' ? 'btn-primary' : 'btn-outline-primary'} flex-grow-1`}
                    onClick={() => handleRoleChange(roleModal._id, 'user')}
                  >
                    User
                  </button>
                  <button 
                    className={`btn ${roleModal.role === 'admin' ? 'btn-primary' : 'btn-outline-primary'} flex-grow-1`}
                    onClick={() => handleRoleChange(roleModal._id, 'admin')}
                  >
                    Admin
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setRoleModal(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;