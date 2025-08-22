import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LandingNavbar from "./landingNavbar";
import SectionOne from "./sectionone";
import Categories from "./categories";
import FeaturedProducts from "./featuredProducts";
import SobreNosotros from "./sobreNosotros";
import Footer from "./footer";


function Landing() {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Extraer el término de búsqueda de la URL
        const urlParams = new URLSearchParams(location.search);
        const search = urlParams.get('search');
        setSearchTerm(search || "");
    }, [location.search]);

    return (
        <>
            <LandingNavbar />
            <div className="#">
                <SectionOne />
                <Categories />
                <FeaturedProducts searchTerm={searchTerm} />
                <SobreNosotros />
            </div>
            <Footer />
        </>
    );
}

export default Landing;