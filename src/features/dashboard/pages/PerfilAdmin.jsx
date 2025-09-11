import React, { useState } from 'react';
import { useAuthClient } from '../../auth/hooks/useAuthClient';
import UserModal from './userManagement/components/UserModal';
import UserForm from './userManagement/components/UserForm';
import { useUsers } from './userManagement/hooks/useUsers';

function PerfilAdmin() {
    const { user, setUser } = useAuthClient();
    const { updateUser } = useUsers();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveChanges = async (formData) => {
        try {
            const updatedUser = await updateUser(user.id, formData);
            setUser(updatedUser); // Actualizar el usuario en el contexto de autenticación
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    if (!user) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Perfil de Administrador</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-lg font-semibold">Primer Nombre:</p>
                        <p className="text-gray-700">{user.firstName}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Primer Apellido:</p>
                        <p className="text-gray-700">{user.lastName}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Tipo de Documento:</p>
                        <p className="text-gray-700">{user.documentType}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Número de Documento:</p>
                        <p className="text-gray-700">{user.documentNumber}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Teléfono:</p>
                        <p className="text-gray-700">{user.phone}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Email:</p>
                        <p className="text-gray-700">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Rol:</p>
                        <p className="text-gray-700">{user.role}</p>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button 
                        onClick={handleOpenModal} 
                        className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Editar Perfil
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <UserModal 
                    user={user}
                    onClose={handleCloseModal}
                    onSave={handleSaveChanges}
                    mode="edit"
                    isProfileEdit={true}
                />
            )}
        </div>
    );
}

export default PerfilAdmin;
