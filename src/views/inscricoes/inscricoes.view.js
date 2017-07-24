require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("bootstrap");
require("./styles.css");
var Commons = require("../../commons.js");
var SessaoModel = require("../../models/sessao.model.js");
var EventoModel = require("../../models/evento.model.js");
var template = require("./template.hbs");

var sessaoModel = new SessaoModel();

module.exports = Backbone.View.extend({
  el: "#conteudoPaginaDiv",
  initialize: function(options) {
    this.options = options;

    if (this.options.id) {
      this.eventoModel = new EventoModel({id: this.options.id});

      this.eventoModel.fetch({
        success: _.bind(function() {
          sessaoModel.set("evento", this.eventoModel);
          
          this.render();
        }, this)
      });
    } else {
      Commons.mostrarPopup({
        titulo: "Aviso",
        corpo: '<div class="alert alert-warning" role="alert">É necessário informar um evento para consultar e confirmar inscrçiões!</div>',
        tamanho: "modal-sm",
        fechar: false,
        botoes: [
          {
            id: "fecharBtn",
            texto: "Fechar",
            layout: "primary",
            icone: "remove",
            fechar: true,
            onclick: function() {
              Backbone.history.navigate("#/eventos", {trigger : true});
            }
          }
        ]
      });
    }
  },
  events: {
    //"click #avancarBtn": "avancar"
  },
  render: function() {
    this.$el.html(template({
      evento: this.eventoModel.toJSON(),
      contexto: Commons.contextoSistema
    }));

    this.$('.dropdown-toggle').dropdown();

    Commons.esconderCarregando();

    return this;
  }
});
