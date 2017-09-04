module.exports = function(evento) {
  switch (evento.status) {
    case "Dados não importados":
      return '<span class="text-info"><span class="glyphicon glyphicon-floppy-remove"></span> Dados não importados</span>';
    case "Ativo":
      return '<span class="text-success"><span class="glyphicon glyphicon-ok"></span> Ativo</span>';
    case "Inativo":
      return '<span class="text-danger"><span class="glyphicon glyphicon-remove"></span> Inativo</span>';
  }
}
