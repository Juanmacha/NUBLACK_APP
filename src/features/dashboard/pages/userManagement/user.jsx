import React, { useState, useEffect } from 'react';
import { useUsers } from './hooks/useUsers';
import UserTable from './components/userTable';
import UserCreate from './components/userCreate';
import EditUser from './components/editUser';
import DeleteUser from './components/deleteUser';
import SeeUser from './components/seeUser';
import Swal from 'sweetalert2';

const User = () => {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // 4 elementos por página

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.documentNumber?.includes(searchTerm);
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reiniciar a la primera página cuando los filtros cambian
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

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
    Swal.fire({
      icon: type,
      title: type === 'success' ? 'Éxito' : 'Error',
      text: message,
      timer: 3000,
      showConfirmButton: false,
    });
  };

  const handleToggleUserStatus = async (id, newStatus) => {
    try {
      await updateUser(id, { estado: newStatus });
      showNotification(`Estado del usuario actualizado a ${newStatus}`, 'success');
    } catch (error) {
      showNotification(error.message || 'Hubo un problema al cambiar el estado del usuario.', 'error');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500 mb-6">Administra los usuarios de tu empresa</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <span className="text-lg">+</span>
          Nuevo Usuario
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-1">Filtros de Usuarios</h2>
        <p className="text-sm text-gray-500 mb-4">Busca y filtra los usuarios registrados</p>
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, email, documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los roles</option>
            <option value="Cliente">Cliente</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-center py-4 text-gray-600">Cargando usuarios...</p>}
      {error && <p className="text-center py-4 text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <UserTable
          users={currentItems}
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
          onToggleStatus={handleToggleUserStatus}
        />
      )}

      {/* Controles de Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Anterior
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === i + 1
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}

      {showCreateModal && (
        <UserCreate
          users={users}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUser
          user={selectedUser}
          users={users}
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
    </div>
  );
};

export default User;