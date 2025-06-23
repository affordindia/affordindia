import React from "react";
import { NavLink } from "react-router-dom";
import { ShoppingBag, PackageSearch, ClockArrowDown, Monitor, ChartNoAxesCombined } from "lucide-react";

const Sidebar = () => {
  const linkClass = "flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded-md";

  return (
    <div className="p-4 space-y-2">
      <NavLink to="/add" className={linkClass}>
        <ShoppingBag size={24} />
        <p>Add Items</p>
      </NavLink>

      <NavLink to="/products" className={linkClass}>
        <PackageSearch size={24} />
        <p>All Products</p>
      </NavLink>

      <NavLink to="/orders" className={linkClass}>
        <ClockArrowDown  size={24} />
        <p>Orders Details</p>
      </NavLink>

      <NavLink to="/banners" className={linkClass}>
        <Monitor size={24} />
        <p>Banner Image</p>
      </NavLink>

      <NavLink to="/analytics" className={linkClass}>
        <ChartNoAxesCombined size={24} />
        <p>Analytics</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
