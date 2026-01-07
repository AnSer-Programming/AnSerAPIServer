// src/pages/ClientInfo/PhoneMaskInput.jsx
import React from 'react';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';

const PhoneMaskInput = React.forwardRef(function PhoneMaskInput(props, ref) {
  const { onChange, type, ...other } = props;

  // Define masks for different input types
  const masks = {
    phone: '(000) 000-0000',
    twitter: '@**********', // Twitter handle format
    facebook: '@**********', // Facebook handle format
    linkedin: '**********', // LinkedIn profile ID
    instagram: '@**********', // Instagram handle format
    whatsapp: '+00 000 000 0000', // WhatsApp phone number format
    xTwitter: '@**********', // X (Twitter) handle format
    default: '*',
  };

  const mask = masks[type] || masks.default;

  return (
    <IMaskInput
      {...other}
      mask={mask}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
      placeholder={type.charAt(0).toUpperCase() + type.slice(1)} // Dynamically set placeholder based on type
    />
  );
});

PhoneMaskInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['phone', 'twitter', 'facebook', 'linkedin', 'instagram', 'whatsapp', 'xTwitter', 'default']),
};

PhoneMaskInput.defaultProps = {
  type: 'default',
};

export default PhoneMaskInput;

