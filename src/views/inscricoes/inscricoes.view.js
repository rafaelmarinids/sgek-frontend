require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("bootstrap");
require("./styles.css");
var Commons = require("../../commons.js");
var SessaoModel = require("../../models/sessao.model.js");
var EventoModel = require("../../models/evento.model.js");
var ColunaCollection = require("../../collections/coluna.collection.js");
var InscricoesModel = require("../../models/inscricoes.model.js");
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
      this.inscricoesModel = new InscricoesModel();

      this.inscricoesModel.get("inscricoesCollection").reset(null);

      this.eventoModel = new EventoModel({id: this.options.id});

      this.eventoModel.fetch({
        success: _.bind(function(model) {
          if (this.eventoModel.get("status") != "Dados não importados" && this.eventoModel.get("status") != "Inativo") {
            sessaoModel.set("evento", this.eventoModel.id);
          
            this.colunaCollection.fetch({
              data: $.param({ 
                evento: model.get("id"),
                usarnabusca: true
              }),
              success: _.bind(this.render, this)
            });
          } else {
            Commons.mostrarPopup({
              titulo: "Aviso",
              corpo: '<div class="alert alert-warning" role="alert">O evento informado está atualmente inativo ou sem importação, portanto é impossível consultar as inscrições!</div>',
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
      inscricoesModel: this.inscricoesModel
    });

    this.$("form").html(this.tabelaView.render().el);

    Commons.esconderCarregando();

    return this;
  }
});
