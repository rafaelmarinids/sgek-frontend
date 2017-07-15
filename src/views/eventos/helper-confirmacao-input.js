module.exports = function(status) {
  switch (status) {
    case true:
      return '<label class="btn btn-default active"><input type="radio" name="confirmacao" value="true" autocomplete="off" checked> Sim</label>'
          + '<label class="btn btn-default"><input type="radio" name="confirmacao" value="false" autocomplete="off"> Não</label>';
    case false:
    default:
      return '<label class="btn btn-default"><input type="radio" name="confirmacao" value="true" autocomplete="off"> Sim</label>'
          + '<label class="btn btn-default active"><input type="radio" name="confirmacao" value="false" autocomplete="off" checked> Não</label>';
  }
}
