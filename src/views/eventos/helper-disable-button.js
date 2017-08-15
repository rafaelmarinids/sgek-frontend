module.exports = function(evento) {
  switch (evento.status) {
    case "Dados não importados":
      return 'href="javascript: void(0);" disabled="disabled"';
    case "Inativo":
      return 'href="javascript: void(0);" disabled="disabled"';
    default:
      return 'href="#/inscricoes/eventos/' + evento.id + '"';
  }
}
