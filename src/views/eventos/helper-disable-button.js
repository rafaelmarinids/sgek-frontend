module.exports = function(status) {
  switch (status) {
    case "Dados não importados":
      return 'disabled="disabled"';
    case "Inativo":
      return 'disabled="disabled"';
  }
}
