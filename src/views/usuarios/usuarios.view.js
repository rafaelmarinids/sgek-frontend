require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("./styles.css");
var Commons = require("../../commons.js");
var SessaoModel = require("../../models/sessao.model.js");
var UsuarioCollection = require("../../collections/usuario.collection.js");
var template = require("./template.hbs");

var sessaoModel = new SessaoModel();

module.exports = Backbone.View.extend({
  el: "#conteudoPaginaDiv",
  initialize: function() {
    this.usuarioCollection = new UsuarioCollection();

    Commons.mostrarCarregando();

    this.usuarioCollection.fetch({
      success: _.bind(this.render, this)
    });
  },
  events: {
    "click a.sgek-excluir": "excluir"
  },
  render: function() {
    this.$el.html(template({
      administrador: sessaoModel.get("tipoUsuario") == "administrador",
      eventos: this.usuarioCollection.toJSON()
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

    var usuarioModel = this.usuarioCollection.get(this.$(event.target).data("id"));

    if (usuarioModel) {
      Commons.mostrarPopup({ 
        titulo: "Confirmação",
        corpo: '<div class="alert alert-warning" role="alert"><span class="glyphicon glyphicon-warning-sign"></span> <strong>Tem certeza que deseja excluir o usuário #' + usuarioModel.id + '?</strong></div>',
        botoes: [
          {
            id: "simBtn",
            texto: "Sim",
            layout: "primary",
            icone: "ok",
            fechar: true,
            onclick: function() {
              Commons.mostrarCarregando();

              usuarioModel.destroy({
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
        corpo: '<div class="alert alert-warning" role="alert">Não foi possível encontrar o usuário informado.</div>',
        tamanho: "modal-sm"
      });
    }    
  }
});
