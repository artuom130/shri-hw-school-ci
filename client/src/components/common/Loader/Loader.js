import React from 'react';
import PropTypes from 'prop-types';

import './Loader.css';

function Loader(props) {
  const { children, isLoading, showContent } = props;
  return (
    <>
      {isLoading && (
        <div className="loader">
          <div className="cat">
            <div className="cat__body"></div>
            <div className="cat__body"></div>
            <div className="cat__tail"></div>
            <div className="cat__head"></div>
          </div>
        </div>
      )}
      {isLoading && !showContent ? null : children}
    </>
  );
}

Loader.propTypes = {
  children: PropTypes.any.isRequired,
  isLoading: PropTypes.bool.isRequired,
  showContent: PropTypes.bool,
};

export default Loader;
