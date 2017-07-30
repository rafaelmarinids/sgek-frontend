require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("bootstrap");
require("./styles.css");
var Commons = require("../../commons.js");
var SessaoModel = require("../../models/sessao.model.js");
var EventoModel = require("../../models/evento.model.js");
var ColunaCollection = require("../../collections/coluna.collection.js");
var InscricaoCollection = require("../../collections/inscricao.collection.js");
var TabelaView = require("./tabela.view.js");
var template = require("./template.hbs");

var sessaoModel = new SessaoModel();

module.exports = Backbone.View.extend({
  el: "#conteudoPaginaDiv",
  initialize: function(options) {
    this.options = options;

    sessaoModel.set("inscricao", null);

    if (this.options.id) {
      this.colunaCollection = new ColunaCollection();
      this.inscricaoCollection = new InscricaoCollection();

      this.eventoModel = new EventoModel({id: this.options.id});

      this.eventoModel.fetch({
        success: _.bind(function(model) {
          sessaoModel.set("evento", this.eventoModel);
          
          this.colunaCollection.fetch({
            data: $.param({ 
              evento: model.get("id"),
              usarnabusca: true
            }),
            success: _.bind(this.render, this)
          });
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
  render: function() {
    this.$el.html(template({
      evento: this.eventoModel.toJSON(),
      contexto: Commons.contextoSistema
    }));

    this.tabelaView = new TabelaView({
      eventoModel: this.eventoModel,
      colunaCollection: this.colunaCollection,
      inscricaoCollection: this.inscricaoCollection
    });

    this.$("form").html(this.tabelaView.render().el);

    Commons.esconderCarregando();

    return this;
  }
});
