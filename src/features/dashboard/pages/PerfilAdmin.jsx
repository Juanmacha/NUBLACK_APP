import React, { useState } from 'react';
import { useAuthClient } from '../../auth/hooks/useAuthClient';
import UserModal from './userManagement/components/UserModal';
import Swal from 'sweetalert2';

function PerfilAdmin() {
    const { user, updateUser } = useAuthClient();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveChanges = async (formData) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se guardarán los cambios en el perfil.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar cambios',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updateUser(formData);
                    setIsModalOpen(false);
                    Swal.fire(
                        '¡Guardado!',
                        'Tu perfil ha sido actualizado.',
                        'success'
                    );
                } catch (error) {
                    console.error("Error updating user:", error);
                    Swal.fire(
                        'Error',
                        error.message || 'Hubo un problema al actualizar tu perfil.',
                        'error'
                    );
                }
            }
        });
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
