import React from 'react';
import Footer from './Footer';

const Layout = ({ className, children }) => {
  return (
    <article className={className}>
      {children}
      <Footer />
    </article>
  );
};

export default Layout;