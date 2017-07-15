require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("./styles.css");
var Commons = require("../../commons.js");
var EventoCollection = require("../../collections/evento.collection.js");
var template = require("./template.hbs");

module.exports = Backbone.View.extend({
  el: "#conteudoPaginaDiv",
  initialize: function() {
    this.eventoCollection = new EventoCollection();

    Commons.mostrarCarregando();

    this.eventoCollection.fetch({
      success: _.bind(this.render, this)
    });
  },
  events: {
    "click a.sgek-excluir": "excluir"
  },
  render: function() {
    this.$el.html(template({
      eventos: this.eventoCollection.toJSON()
    }));

    Commons.esconderCarregando();

    return this;
  },
  excluir: function(event) {
    /*
     * Evita que evento se realize para os elementos DOM filhos da tag "a".
     */
    if (event.target !== event.currentTarget) {
      this.$(event.target).parent().click();

      return;
    }

    var view = this;

    var eventoModel = this.eventoCollection.findWhere({id: this.$(event.target).data("id")});

    if (eventoModel) {
      Commons.mostrarPopup({ 
        titulo: "Confirmação",
        corpo: '<div class="alert alert-warning" role="alert"><span class="glyphicon glyphicon-warning-sign"></span> <strong>Tem certeza que deseja excluir o evento #' + eventoModel.id + '?</strong><br><br>Todas as incrições relacionadas a ele serão excluídas também.</div>',
        botoes: [
          {
            id: "simBtn",
            texto: "Sim",
            layout: "primary",
            icone: "ok",
            fechar: true,
            onclick: function() {
              Commons.mostrarCarregando();

              eventoModel.destroy({
                wait: true,
                success: function() {
                  view.render();
                },
                complete: function() {
                  Commons.esconderCarregando();
                }
              });
            }
          }, {
            texto: "Não",
            icone: "remove",
            fechar: true
          }
        ]
      });
    } else {
      Commons.mostrarPopup({
        titulo: "Aviso",
        corpo: '<div class="alert alert-info" role="alert">Não foi possível encontrar o evento informado.</div>',
        tamanho: "modal-sm"
      });
    }    
  }
});
