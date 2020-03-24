import React from 'react';

import './Footer.css';
import Link from 'components/base/Link/Link';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__container">
        <ul className="footer__nav">
          <li className="footer__nav-item">
            <Link href="/settings" className="footer__link">
              Support
            </Link>
          </li>
          <li className="footer__nav-item">
            <Link href="/settings" className="footer__link">
              Learning
            </Link>
          </li>
        </ul>
        <div className="footer__copy">&copy; 2020 Artem Loiko</div>
      </div>
    </footer>
  );
}

export default Footer;
