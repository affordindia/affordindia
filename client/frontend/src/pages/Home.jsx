import React, { useEffect, useState } from "react";

import ExploreMaterials from "../components/home/ExploreMaterials.jsx";
import NewArrivals from "../components/home/NewArrivals.jsx";
import FeaturedProducts from "../components/home/FeaturedProducts.jsx";
// import PopularProducts from "../components/home/PopularProducts.jsx";
import YouMightAlsoLike from "../components/home/YouMightAlsoLike.jsx";
import Banners from "../components/common/Banners.jsx";
import ScrollToTop from "../components/common/ScrollToTop.jsx";

const Home = () => {
    return (
        <>
            <div className="bg-[#F5F5F5] ">
                <ScrollToTop />
                <Banners />
                <ExploreMaterials />
                <NewArrivals />
                <FeaturedProducts />
                {/* <PopularProducts /> */}
                <YouMightAlsoLike />
            </div>
        </>
    );
};

export default Home;
