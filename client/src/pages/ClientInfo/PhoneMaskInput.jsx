// src/pages/ClientInfo/PhoneMaskInput.jsx
import React from 'react';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';

const PhoneMaskInput = React.forwardRef(function PhoneMaskInput(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

PhoneMaskInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PhoneMaskInput;

