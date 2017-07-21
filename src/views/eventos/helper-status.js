module.exports = function(evento) {
  switch (evento.status) {
    case "Dados não importados":
      return '<a href="#/importar/eventos/' + evento.id + '" title="Dados não importados" class="text-info"><span class="glyphicon glyphicon-floppy-remove"></span> Dados não importados</a>';
    case "Ativo":
      return '<span class="text-success"><span class="glyphicon glyphicon-ok"></span> Ativo</span>';
    case "Inativo":
      return '<span class="text-danger"><span class="glyphicon glyphicon-remove"></span> Inativo</span>';
  }
}
