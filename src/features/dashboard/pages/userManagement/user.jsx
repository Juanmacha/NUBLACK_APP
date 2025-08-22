import React, { useState } from 'react';
import { useUsers } from './hooks/useUsers';
import UserTable from './components/userTable';
import UserCreate from './components/userCreate';
import EditUser from './components/editUser';
import DeleteUser from './components/deleteUser';
import SeeUser from './components/seeUser';
import Notification from './components/Notification';

const User = () => {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.documentNumber?.includes(searchTerm);
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleCreate = async (userData) => {
    try {
      await createUser(userData);
      setShowCreateModal(false);
      showNotification('Usuario creado exitosamente', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleEdit = async (userData) => {
    try {
      await updateUser(selectedUser.id, userData);
      setShowEditModal(false);
      setSelectedUser(null);
      showNotification('Usuario actualizado exitosamente', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
      showNotification('Usuario eliminado exitosamente', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <span className="mr-2">+</span>
          Nuevo Usuario
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los roles</option>
          <option value="Cliente">Cliente</option>
          <option value="Administrador">Administrador</option>
        </select>
      </div>

      {loading && <p className="text-gray-600">Cargando usuarios...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <UserTable
        users={filteredUsers}
        onView={(user) => {
          setSelectedUser(user);
          setShowViewModal(true);
        }}
        onEdit={(user) => {
          setSelectedUser(user);
          setShowEditModal(true);
        }}
        onDelete={(user) => {
          setSelectedUser(user);
          setShowDeleteModal(true);
        }}
      />

      {showCreateModal && (
        <UserCreate
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUser
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSubmit={handleEdit}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteUser
          user={selectedUser}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDelete}
        />
      )}

      {showViewModal && selectedUser && (
        <SeeUser
          user={selectedUser}
          onClose={() => {
            setShowViewModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default User;
