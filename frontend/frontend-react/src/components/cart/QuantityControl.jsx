import PropTypes from 'prop-types';

// Botones - / + reutilizables (carrito y detalle de producto)
function QuantityControl({ value, onChange, min = 1, max }) {
  return (
    <div className='quantity-control'>
      <button
        type='button'
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label='Restar uno'
      >
        -
      </button>
      <span>{value}</span>
      <button
        type='button'
        onClick={() => onChange(value + 1)}
        disabled={max !== undefined && value >= max}
        aria-label='Sumar uno'
      >
        +
      </button>
    </div>
  );
}

QuantityControl.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default QuantityControl;
