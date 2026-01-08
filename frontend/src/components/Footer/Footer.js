import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="clintrack-footer">
      <div className="clintrack-footer__content">
        <p className="clintrack-footer__text">
          All the trials are conducted according to FDA and ICH-GCP guidelines.
        </p>
      </div>
      <div className="clintrack-footer__copyright">
        <small>© {new Date().getFullYear()} ClinTrack. All rights reserved.</small>
      </div>
    </div>
  );
};

export default Footer;
