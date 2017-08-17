module.exports = function(tipo) {
  switch (tipo) {
    case "administrador":
      return '<label class="btn btn-default active"><input type="radio" name="tipo" value="administrador" autocomplete="off" checked> Administrador</label>'
          + '<label class="btn btn-default"><input type="radio" name="tipo" value="atendente" autocomplete="off"> Atendente</label>';
    case "atendente":
    default:
      return '<label class="btn btn-default"><input type="radio" name="tipo" value="administrador" autocomplete="off"> Administrador</label>'
        + '<label class="btn btn-default active"><input type="radio" name="tipo" value="atendente" autocomplete="off" checked> Atendente</label>';
  }
}
