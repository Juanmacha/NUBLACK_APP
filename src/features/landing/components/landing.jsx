import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "./landingNavbar";
import SectionOne from "./sectionone";
import Categories from "./categories";
import FeaturedProducts from "./featuredProducts";
import SobreNosotros from "./sobreNosotros";
import Footer from "./footer";


function Landing() {
    return (
        <>
            <LandingNavbar />
            <div className="#">
                <SectionOne />
                <Categories />
                <FeaturedProducts />
                <SobreNosotros />
            </div>
            <Footer />
        </>
    );
}

export default Landing;