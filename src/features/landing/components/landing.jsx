import React, { useState, useEffect } from "react";
import LandingNavbar from "./landingNavbar";
import SectionOne from "./sectionone";
import Categories from "./categories";
import FeaturedProducts from "./featuredProducts";
import SobreNosotros from "./sobreNosotros";
import Footer from "./footer";
import ProductDetailModal from "./ProductDetailModal"; // Import the modal
import { useProducts } from "../hooks/useProducts";

function Landing() {
    const [searchTerm, setSearchTerm] = useState("");
    const { products } = useProducts();
    const [showProductDetailModal, setShowProductDetailModal] = useState(false); // State for modal visibility
    const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowProductDetailModal(true);
    };

    const handleCloseProductDetailModal = () => {
        setShowProductDetailModal(false);
        setSelectedProduct(null);
    };

    return (
        <>
            <LandingNavbar 
                searchTerm={searchTerm} 
                onSearchChange={handleSearchChange} 
                products={products} 
            />
            <div className="#">
                <SectionOne />
                <Categories />
                <FeaturedProducts onProductClick={handleProductClick} /> {/* Pass the handler */}
                <SobreNosotros />
            </div>
            <Footer />

            {/* Render ProductDetailModal conditionally */}
            {showProductDetailModal && selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={handleCloseProductDetailModal}
                />
            )}
        </>
    );
}

export default Landing;