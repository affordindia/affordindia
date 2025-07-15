import React, { useEffect, useState } from "react";

import ExploreMaterials from "../components/home/ExploreMaterials.jsx";
import NewArrivals from "../components/home/NewArrivals.jsx";
import FeaturedProducts from "../components/home/FeaturedProducts.jsx";
// import PopularProducts from "../components/home/PopularProducts.jsx";
import YouMightAlsoLike from "../components/home/YouMightAlsoLike.jsx";

const Home = () => {
    return (
        <>
            <div className="h-10"></div>
            <ExploreMaterials />
            <NewArrivals />
            <FeaturedProducts />
            {/* <PopularProducts /> */}
            <YouMightAlsoLike />
        </>
    );
};

export default Home;
