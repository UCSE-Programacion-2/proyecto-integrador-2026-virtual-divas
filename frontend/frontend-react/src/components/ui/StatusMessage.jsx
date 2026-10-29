import PropTypes from 'prop-types';

// Mensaje para los estados de carga, error o vacío
function StatusMessage({ type = 'empty', children }) {
  return (
    <div className={`status-message status-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {type === 'loading' && <span className='spinner' aria-hidden='true' />}
      <p>{children}</p>
    </div>
  );
}

StatusMessage.propTypes = {
  type: PropTypes.oneOf(['loading', 'error', 'empty']),
  children: PropTypes.node.isRequired,
};

export default StatusMessage;
