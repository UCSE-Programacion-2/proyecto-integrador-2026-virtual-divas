import PropTypes from 'prop-types';

// Formas de datos compartidas para validar props
export const productShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  marca: PropTypes.string,
  categoria: PropTypes.string,
  precio: PropTypes.number.isRequired,
  stock: PropTypes.number,
  descripcion: PropTypes.string,
  imagen: PropTypes.string,
});

export const cartItemShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  marca: PropTypes.string,
  categoria: PropTypes.string,
  precio: PropTypes.number.isRequired,
  imagen: PropTypes.string,
  stock: PropTypes.number,
  quantity: PropTypes.number.isRequired,
});
