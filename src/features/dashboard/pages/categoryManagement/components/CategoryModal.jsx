
import React from "react";
import BaseModal from "./BaseModal";
import CategoryForm from "./CategoryForm";

const CategoryModal = ({ category, onClose, onSave, mode }) => {
  const title = {
    create: "Crear Nueva Categoría",
    edit: "Editar Categoría",
    view: "Ver Categoría",
  }[mode];

  return (
    <BaseModal title={title} onClose={onClose}>
      <CategoryForm
        category={category}
        onSave={onSave}
        onClose={onClose}
        mode={mode}
      />
    </BaseModal>
  );
};

export default CategoryModal;
