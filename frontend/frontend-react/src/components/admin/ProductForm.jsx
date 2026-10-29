import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES } from '../../utils/format';
import { productShape } from '../../utils/shapes';

const emptyForm = {
  nombre: '',
  marca: '',
  categoria: 'interior',
  precio: '',
  stock: '',
  imagen: '',
  descripcion: '',
};

// Formulario controlado para crear o editar (si recibe "editing")
function ProductForm({ editing = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Cuando se elige un producto para editar, carga sus datos
  useEffect(() => {
    if (editing) {
      setForm({
        nombre: editing.nombre,
        marca: editing.marca,
        categoria: editing.categoria,
        precio: String(editing.precio),
        stock: String(editing.stock ?? 0),
        imagen: editing.imagen || '',
        descripcion: editing.descripcion || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  const handleChange = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setSaving(true);

    const ok = await onSubmit({
      ...form,
      nombre: form.nombre.trim(),
      marca: form.marca.trim(),
      imagen: form.imagen.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
    });

    setSaving(false);
    if (ok && !editing) setForm(emptyForm);
  };

  return (
    <form className='product-form' onSubmit={handleSubmit}>
      <div className='form-group'>
        <label htmlFor='product-name-input'>Nombre</label>
        <input
          id='product-name-input'
          name='nombre'
          placeholder='Látex Interior'
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='product-brand-input'>Marca</label>
        <input
          id='product-brand-input'
          name='marca'
          placeholder='Alba'
          value={form.marca}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='product-category-input'>Categoría</label>
        <select
          id='product-category-input'
          name='categoria'
          value={form.categoria}
          onChange={handleChange}
        >
          {CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <div className='form-group'>
        <label htmlFor='product-price-input'>Precio</label>
        <input
          id='product-price-input'
          name='precio'
          type='number'
          min='0'
          placeholder='15200'
          value={form.precio}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='product-stock-input'>Stock</label>
        <input
          id='product-stock-input'
          name='stock'
          type='number'
          min='0'
          placeholder='24'
          value={form.stock}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='product-image-input'>Imagen (URL)</label>
        <input
          id='product-image-input'
          name='imagen'
          placeholder='https://... o /assets/latexinterior.png'
          value={form.imagen}
          onChange={handleChange}
        />
      </div>
      <div className='form-group form-group-full'>
        <label htmlFor='product-description-input'>Descripción</label>
        <textarea
          id='product-description-input'
          name='descripcion'
          placeholder='Descripción breve del producto'
          value={form.descripcion}
          onChange={handleChange}
        />
      </div>
      <div className='form-group form-group-full admin-form-actions'>
        <button type='submit' className='button button-primary' disabled={saving}>
          {editing ? 'Actualizar producto' : 'Crear producto'}
        </button>
        {editing && (
          <button type='button' className='button button-secondary' onClick={onCancel}>
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}

ProductForm.propTypes = {
  editing: productShape,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ProductForm;
