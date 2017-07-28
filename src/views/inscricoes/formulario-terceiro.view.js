var Commons = require("../../commons.js");

module.exports = Backbone.View.extend({
  tagName: "form",
  template: '<div class="form-group">'
      + '<label for="nomeInput" class="control-label">Nome</label>'
      + '<input type="text" class="form-control" id="nomeInput">'
      + '<span class="help-block"></span>'
    + '</div>'
    + '<div class="form-group">'
      + '<label for="documentoInput" class="control-label">Documento</label> <i>(opcional)</i>'
      + '<input type="text" class="form-control" id="documentoInput">'
    + '</div>'
    + '<div class="form-group">'
      + '<label for="telefoneInput" class="control-label">Telefone</label> <i>(opcional)</i>'
      + '<input type="text" class="form-control" id="telefoneInput">'
    + '</div>'
    + '<div class="form-group">'
      + '<label for="enderecoInput" class="control-label">Endereço</label> <i>(opcional)</i>'
      + '<input type="text" class="form-control" id="enderecoInput">'
    + '</div>',
  render: function() {
    this.$el.html(this.template);

    return this;
  },
  preencherTerceiro: function(callback) {
    if (this._validar()) {
      this.model.get("retirada").terceiro = {
        nome: this.$("#nomeInput").val(),
        documento: this.$("#documentoInput").val(),
        telefone: this.$("#telefoneInput").val(),
        endereco: this.$("#enderecoInput").val(),
      };

      if (callback) {
        callback();
      }
    }
  },
  _validar: function() {
    if (!this.$("#nomeInput").val()) {
      this.$("#nomeInput").parent().addClass("has-error");
      this.$("#nomeInput").parent().find("span.help-block").text("Nome é necessário.").show();

      return false;
    }

    return true;
  }
});
