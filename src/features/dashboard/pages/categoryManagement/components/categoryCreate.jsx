import React from "react";
import CategoryModal from "./CategoryModal";

const CrearCategoriaModal = ({ onClose, onCrear }) => {
  return <CategoryModal mode="create" onClose={onClose} onSave={onCrear} />;
};

export default CrearCategoriaModal;