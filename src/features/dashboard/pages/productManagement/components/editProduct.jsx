import React from "react";
import ProductModal from "./ProductModal";

const EditProduct = ({ producto, onClose, onGuardar }) => {
  return (
    <ProductModal
      mode="edit"
      product={producto}
      onClose={onClose}
      onSave={onGuardar}
    />
  );
};

export default EditProduct;