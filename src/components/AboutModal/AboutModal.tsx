import React from "react";
import { FaTimes, FaGithub, FaEnvelope } from "react-icons/fa";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-bgColor border border-borderColor rounded-lg p-8 w-96 max-w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">About Flash Notes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="text-base space-y-4">
          <p className="text-neutral-300">
            Flash Notes is a powerful and intuitive note-taking Chrome extension
            designed to streamline your thoughts, ideas, and tasks with ease and
            efficiency.
          </p>
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Features</h3>
            <ul className="list-none space-y-2 text-neutral-300">
              <li>✨ Rich text formatting for expressive note-taking</li>
              <li>📌 Pin important notes for quick access</li>
              <li>🚀 Priority marking for urgent tasks</li>
              <li>🔍 Robust search functionality</li>
              <li>🔄 Intuitive drag-and-drop note reordering</li>
              <li>🌙 Dark mode for comfortable use in any lighting</li>
            </ul>
          </div>
          <div className="pt-4 border-t border-borderColor">
            <p className="font-semibold">Version: 1.2.0</p>
            <p>Created with ❤️ by Sanixstudio</p>
            <div className="flex items-center space-x-4 mt-2">
              <a
                href="https://github.com/sanixstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-light transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="mailto:sanixstudio@gmail.com"
                className="hover:text-primary-light transition-colors"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
