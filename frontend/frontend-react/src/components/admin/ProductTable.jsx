import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatPrice, getCategoryLabel, getProductImage } from '../../utils/format';
import { productShape } from '../../utils/shapes';

const STOCK_BAJO = 10;

function ProductTable({ products, onEdit, onDelete }) {
  // Pide confirmar en el mismo botón (sin alert del navegador)
  const [confirmingId, setConfirmingId] = useState(null);

  if (!products.length) {
    return <p className='admin-empty'>No hay productos cargados.</p>;
  }

  return (
    <div className='table-wrapper'>
      <table className='products-table'>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const stockOk = product.stock > STOCK_BAJO;
            const confirming = confirmingId === product._id;

            return (
              <tr key={product._id}>
                <td data-label='Producto'>
                  <div className='product-cell'>
                    <img
                      className='product-thumb'
                      src={getProductImage(product)}
                      alt={product.nombre}
                    />
                    <div>
                      <p className='product-name'>{product.nombre}</p>
                      <p className='product-brand'>{product.marca}</p>
                    </div>
                  </div>
                </td>
                <td data-label='Categoría'>{getCategoryLabel(product.categoria)}</td>
                <td data-label='Precio'>{formatPrice(product.precio)}</td>
                <td data-label='Stock'>{product.stock}</td>
                <td data-label='Estado'>
                  <span className={`status-badge ${stockOk ? 'status-active' : 'status-low'}`}>
                    {stockOk ? 'Activo' : 'Stock bajo'}
                  </span>
                </td>
                <td data-label='Acciones'>
                  <div className='table-actions'>
                    <button
                      type='button'
                      className='button button-secondary button-small'
                      onClick={() => onEdit(product)}
                    >
                      Editar
                    </button>
                    <button
                      type='button'
                      className='button button-danger button-small'
                      onClick={() => {
                        if (confirming) {
                          onDelete(product);
                          setConfirmingId(null);
                        } else {
                          setConfirmingId(product._id);
                        }
                      }}
                      onBlur={() => setConfirmingId(null)}
                    >
                      {confirming ? '¿Seguro?' : 'Eliminar'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

ProductTable.propTypes = {
  products: PropTypes.arrayOf(productShape).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductTable;
