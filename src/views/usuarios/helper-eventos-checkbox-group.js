module.exports = function(opcoesEventos) {
  var checkboxGroup = "";

  for (var i = 0; i < opcoesEventos.eventos.length; i++) {
    var achou = false;

    for (var j = 0; j < opcoesEventos.eventosSelecionados.length; j++) {
      if (opcoesEventos.eventos[i].id == opcoesEventos.eventosSelecionados[j].id_evento) {
        achou = true;
      }
    }

    if (achou) {
      checkboxGroup += '<div class="checkbox"><label><input type="checkbox" name="eventos[]" value="' + opcoesEventos.eventos[i].id + '" checked="checked"> ' + opcoesEventos.eventos[i].titulo + '</label></div>';
    } else {
      checkboxGroup += '<div class="checkbox"><label><input type="checkbox" name="eventos[]" value="' + opcoesEventos.eventos[i].id + '"> ' + opcoesEventos.eventos[i].titulo + '</label></div>';
    }
  }

  if (checkboxGroup == "") {
    checkboxGroup = "<span>Nenhum evento encontrado.</span>";
  }

  return checkboxGroup;
}
