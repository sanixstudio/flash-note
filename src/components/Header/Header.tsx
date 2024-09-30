import React from "react";
import { FaSearch, FaInfoCircle } from "react-icons/fa";

interface HeaderProps {
  onSearchToggle: () => void;
  onInfoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchToggle, onInfoClick }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold">Flash Notes</h1>
      <div className="flex items-center space-x-2">
        <button
          onClick={onSearchToggle}
          className="p-1 bg-inputBg text-textColor border border-borderColor rounded hover:bg-buttonHover"
        >
          <FaSearch size={14} />
        </button>
        <button
          onClick={onInfoClick}
          className="p-1 bg-inputBg text-textColor border border-borderColor rounded hover:bg-buttonHover"
        >
          <FaInfoCircle size={14} />
        </button>
      </div>
    </div>
  );
};

export default Header;
