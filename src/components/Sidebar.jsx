import React from "react";
import { NavLink } from "react-router-dom";
import {
  ShoppingBag,
  PackageSearch,
  ClockArrowDown,
  Monitor,
  ChartNoAxesCombined,
} from "lucide-react";

const Sidebar = () => {
  const baseLinkClass =
    "flex items-center gap-2 p-2 rounded-md transition-colors duration-200";
  const activeClass = "bg-gray-300 text-black font-semibold";
  const inactiveClass = "text-gray-700 hover:bg-gray-200";

  return (
    <div className="p-4 space-y-2">
      <NavLink
        to="/add"
        className={({ isActive }) =>
          `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <ShoppingBag size={24} />
        <p className="hidden md:block">Add Items</p>
      </NavLink>

      <NavLink
        to="/products"
        className={({ isActive }) =>
          `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <PackageSearch size={24} />
        <p className="hidden md:block">All Products</p>
      </NavLink>

      <NavLink
        to="/orders"
        className={({ isActive }) =>
          `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <ClockArrowDown size={24} />
        <p className="hidden md:block">Orders Details</p>
      </NavLink>

      <NavLink
        to="/banners"
        className={({ isActive }) =>
          `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <Monitor size={24} />
        <p className="hidden md:block">Banner Image</p>
      </NavLink>

      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <ChartNoAxesCombined size={24} />
        <p className="hidden md:block">Analytics</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
