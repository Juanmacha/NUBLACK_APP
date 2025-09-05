import React from "react";
import CategoryModal from "./CategoryModal";

const EditarCategoriaModal = ({ categoria, onClose, onGuardar }) => {
  return (
    <CategoryModal
      mode="edit"
      category={categoria}
      onClose={onClose}
      onSave={onGuardar}
    />
  );
};

export default EditarCategoriaModal;