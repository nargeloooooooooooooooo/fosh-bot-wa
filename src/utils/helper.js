function parseCommand(text, prefix) {
  const parts = text.slice(prefix.length).trim().split(/\s+/);
  return {
    command: parts[0]?.toLowerCase() || '',
    args: parts.slice(1)
  };
}

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

module.exports = { parseCommand, formatRupiah };
