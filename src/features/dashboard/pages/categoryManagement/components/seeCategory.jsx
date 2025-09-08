import React from "react";
import CategoryModal from "./CategoryModal";

const VerCategoriaModal = ({ categoria, onClose }) => {
  return <CategoryModal mode="view" category={categoria} onClose={onClose} />;
};

export default VerCategoriaModal;