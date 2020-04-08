import React from 'react';
import PropTypes from 'prop-types';
import { cn } from 'utils/bem-cn';

import Icon from 'components/base/Icon/Icon';

import './IconText.css';

function IconText(props) {
  const { iconType, text, secondaryText } = props;

  return (
    <div className={cn('icon-text', props)}>
      <Icon mods={{ type: iconType }} mix={['icon-text']} />
      <div className="icon-text__text">{text}</div>
      {secondaryText && (
        <div className="icon-text__text icon-text__secondary-text">{secondaryText}</div>
      )}
    </div>
  );
}

IconText.propTypes = {
  iconType: PropTypes.oneOf([
    'commit',
    'calendar',
    'stopwatch',
    'user',
    'rebuild',
    'play',
    'settings',
  ]).isRequired,
  text: PropTypes.string,
  secondaryText: PropTypes.string,
  children: PropTypes.string,
};

export default IconText;
