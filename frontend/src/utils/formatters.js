/**
 * Formats a player's price (e.g., 10.5 becomes "$10.5m")
 * @param {number} price 
 * @returns {string}
 */
export const formatPrice = (price) => {
  if (price === undefined || price === null) return '-';
  return `$${Number(price).toFixed(1)}m`;
};

/**
 * Maps short position codes to full names
 * @param {string} code - GK, DEF, MID, FWD
 * @returns {string}
 */
export const formatPosition = (code) => {
  const map = {
    'GK': 'Goalkeeper',
    'DEF': 'Defender',
    'MID': 'Midfielder',
    'FWD': 'Forward'
  };
  return map[code] || code;
};

/**
 * Formats a standard date string
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-ZW', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};