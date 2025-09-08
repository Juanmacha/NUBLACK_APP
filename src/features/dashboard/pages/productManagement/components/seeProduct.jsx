import React from "react";
import ProductModal from "./ProductModal";

const SeeProduct = ({ producto, onClose }) => {
  return <ProductModal mode="view" product={producto} onClose={onClose} />;
};

export default SeeProduct;