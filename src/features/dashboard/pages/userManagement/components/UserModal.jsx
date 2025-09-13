import React from "react";
import UserForm from "./UserForm";
import { User } from "lucide-react";

const UserModal = ({ user, onClose, onSave, mode, isProfileEdit = false, users }) => {
  const title = {
    create: "Crear Nuevo Usuario",
    edit: "Editar Usuario",
    view: "Ver Usuario",
  }[mode];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-600">
            <User className="h-5 w-5" />
            {title}
          </h3>
        </div>
        <UserForm user={user} onSave={onSave} onClose={onClose} mode={mode} isProfileEdit={isProfileEdit} users={users} />
      </div>
    </div>
  );
};

export default UserModal;