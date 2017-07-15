module.exports = function(status) {
  switch (status) {
    case "Inativo":
      return '<label class="btn btn-default"><input type="radio" name="ativo" value="true" autocomplete="off"> Sim</label>'
          + '<label class="btn btn-default active"><input type="radio" name="ativo" value="false" autocomplete="off" checked> Não</label>';
    case "Dados não importados":
    case "Ativo":
    default:
      return '<label class="btn btn-default active"><input type="radio" name="ativo" value="true" autocomplete="off" checked> Sim</label>'
          + '<label class="btn btn-default"><input type="radio" name="ativo" value="false" autocomplete="off"> Não</label>';
  }
}
