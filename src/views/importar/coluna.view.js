var Commons = require("../../commons.js");
var template = require("./template-coluna.hbs");

module.exports = Backbone.View.extend({
  tagName: "tr",
  initialize: function(options) {
    this.options = options;
  },
  events: {
    "change .sgek-inscricao-checkbox": "marcarUsarNaInscricao",
    "change .sgek-confirmacao-checkbox": "marcarUsarNaConfirmacao",
    "change input[name='numeroInscricao']": "marcarInscricao",
    "deselect input[name='numeroInscricao']": "desmarcarInscricao"
  },
  render: function() {
    this.$el.html(template({
      coluna: this.model,
      confirmacao: this.options.confirmacao
    }));

    return this;
  },
  marcarUsarNaInscricao: function(event) {
    this.model.usarnabusca = this.$(event.target).is(":checked");
  },
  marcarUsarNaConfirmacao: function(event) {
    this.model.usarnaconfirmacao = this.$(event.target).is(":checked");
  },
  marcarInscricao: function(event) {
    this.model.inscricao = true;

    // Dispara o evento de deselecionar para todas as outras colunas.
    $("input[name='numeroInscricao']").not($(event.target)).trigger("deselect");
  },
  desmarcarInscricao: function(event) {
    this.model.inscricao = false;
  }
});
