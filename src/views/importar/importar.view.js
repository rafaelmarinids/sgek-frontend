require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("./styles.css");
var Commons = require("../../commons.js");
var template = require("./template.html");
var templateConfiguracao = require("./template-configuracao.html");

module.exports = Backbone.View.extend({
  el: "#conteudoPaginaDiv",
  initialize: function(options) {
    this.options = options;

    this.etapa = "inicial";

    this.render();
  },
  events: {
    "click #avancarBtn": "avancar",
    "click #voltarBtn": "voltar",
    "click #importarBtn": "importar"
  },
  render: function() {
    switch (this.etapa) {
      case "configuracao":
        this.$el.html(templateConfiguracao);

        break;
      default:
        this.$el.html(template);

        break;
    }

    Commons.esconderCarregando();

    return this;
  },
  avancar: function(event) {
    event.preventDefault();

    this.etapa = "configuracao";

    Commons.mostrarCarregando();

    this.render();
  },
  voltar: function() {
    this.etapa = "inicial";

    Commons.mostrarCarregando();

    this.render();
  },
  importar: function(event) {
    event.preventDefault();
  }
});
