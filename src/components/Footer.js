import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6 text-center">
      <p className="text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Blogging Platform. All rights reserved.
      </p>
    </footer>

  );
};

export default Footer;
