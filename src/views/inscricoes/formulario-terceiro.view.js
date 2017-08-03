var Commons = require("../../commons.js");
var template = require("./template-terceiro.hbs");

module.exports = Backbone.View.extend({
  tagName: "form",
  render: function() {
    this.$el.html(template({
      terceiro: this.model.get("retirada").terceiro
    }));

    return this;
  },
  preencherFormulario: function(terceiro, callback) {
    if (_.isObject(terceiro)) {
      this.$("#nomeInput").val(terceiro.nome),
      this.$("#documentoInput").val(terceiro.documento),
      this.$("#telefoneInput").val(terceiro.telefone),
      this.$("#enderecoInput").val(terceiro.endereco)

      if (callback) {
        callback();
      }
    }
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
