module.exports = function(quantidade) {
  switch (quantidade) {
    case 0:
      return 'disabled="disabled"';
    default:
      return "";
  }
}
