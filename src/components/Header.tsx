import React from "react";

interface HeaderProps {
  onSignIn: () => void;
  onSearchToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSignIn, onSearchToggle }) => {
  return (
    <div className="header flex justify-between items-center mb-4">
      <h1 className="text-2xl text-textColor">Flash Notes</h1>
      <div className="header-actions flex items-center gap-4">
        <button
          className="sign-in-btn bg-buttonBg hover:bg-buttonHover text-textColor p-2 rounded transition-transform transform hover:scale-105"
          onClick={onSignIn}
        >
          Sign In
        </button>
        <button
          className="search-toggle bg-transparent p-2"
          onClick={onSearchToggle}
        >
          <i className="material-icons text-textColor">search</i>
        </button>
      </div>
    </div>
  );
};

export default Header;
