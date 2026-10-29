import PropTypes from 'prop-types';

function StatCard({ label, value, hint = '' }) {
  return (
    <div className='card stat-card'>
      <span className='stat-label'>{label}</span>
      <strong className='stat-value'>{value}</strong>
      {hint && <span className='stat-hint'>{hint}</span>}
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  hint: PropTypes.string,
};

export default StatCard;
