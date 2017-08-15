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
      // Adiciona sempre um novo terceiro, independente se a retirada 
      // já foi cancelada e exsitia um terceiro anteriormente.
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
    var flag = true;

    if (!this.$("#nomeInput").val()) {
      this.$("#nomeInput").parent().addClass("has-error");
      this.$("#nomeInput").parent().find("span.help-block").text("Nome é necessário.").show();

      flag = false;
    }

    if (!this.$("#documentoInput").val()) {
      this.$("#documentoInput").parent().addClass("has-error");
      this.$("#documentoInput").parent().find("span.help-block").text("Número do documento é necessário.").show();

      flag = false;
    }

    if (!this.$("#telefoneInput").val()) {
      this.$("#telefoneInput").parent().addClass("has-error");
      this.$("#telefoneInput").parent().find("span.help-block").text("Telefone é necessário.").show();

      flag = false;
    }

    return flag;
  }
});
