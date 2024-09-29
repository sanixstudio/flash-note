import React from "react";
import { FaSearch } from "react-icons/fa";

interface HeaderProps {
  onSearchToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchToggle }) => {
  return (
    <div className="header flex justify-between items-center mb-4">
      <h1 className="text-2xl text-textColor font-bold">Flash Notes</h1>
      <div className="header-actions flex items-center gap-4">
        <button
          className="search-toggle bg-transparent p-2"
          onClick={onSearchToggle}
        >
          <FaSearch className="text-textColor" />
        </button>
      </div>
    </div>
  );
};

export default Header;
