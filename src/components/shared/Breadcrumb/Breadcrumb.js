import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ children }) => {
  return (
    <nav className="dp-breadcrumb">
      <ul>{children}</ul>
    </nav>
  );
};

const BreadcrumbItem = ({ href, text }) => {
  return (
    <>
      {!!href ? (
        href.startsWith('http') ? (
          <li>
            <a href={href}>{text}</a>
          </li>
        ) : (
          <li>
            <Link to={href} data-testid="internal-link">
              {text}
            </Link>
          </li>
        )
      ) : (
        <li>{text}</li>
      )}
    </>
  );
};

export { Breadcrumb, BreadcrumbItem };
