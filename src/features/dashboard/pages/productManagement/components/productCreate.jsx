
import React from "react";
import ProductModal from "./ProductModal";

const ProductCreate = ({ onClose, onCrear }) => {
  return <ProductModal mode="create" onClose={onClose} onSave={onCrear} />;
};

export default ProductCreate;
