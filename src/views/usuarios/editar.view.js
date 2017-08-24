require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("./styles.css");
require("backbone-validation");
var Commons = require("../../commons.js");
var UsuarioModel = require("../../models/usuario.model.js");
var EventoCollection = require("../../collections/evento.collection.js");
var template = require("./template-usuario.hbs");

module.exports = Backbone.View.extend({
  el: "#conteudoPaginaDiv",
  initialize: function(options) {
    this.options = options;

    this.usuarioModel = new UsuarioModel({id: this.options.id});

    Backbone.Validation.bind(this, {
      model: this.usuarioModel,
      valid: this._validar,
      invalid: this._invalidar
    });

    this.eventoCollection = new EventoCollection();

    Commons.mostrarCarregando();

    this.usuarioModel.fetch({
      success: _.bind(function() {
        this.eventoCollection.fetch({
          success: _.bind(this.render, this)
        });
      }, this)
    });    
  },
  events: {
    "click #salvarBtn": "cadastrar"
  },
  render: function() {
    this.$el.html(template({
      acao: "Editar",
      icon: "plus",
      usuario: this.usuarioModel.toJSON(),
      opcoesEventos: {
        eventos: this.eventoCollection.toJSON(),
        eventosSelecionados: this.usuarioModel.get("eventos")
      }
    }));

    Commons.esconderCarregando();

    return this;
  },
  cadastrar: function(event) {
    event.preventDefault();

    this.usuarioModel.set("nome", this.$("#nomeInput").val());
    this.usuarioModel.set("email", this.$("#emailInput").val());
    this.usuarioModel.set("senha", this.$("#senhaInput").val());
    this.usuarioModel.set("tipo", this.$('#tipoRadio label.active input').val());
    
    var eventos = [];
    
    $.each(this.$("input[name='eventos[]']:checked"), function() {
      eventos.push($(this).val());
    });

    this.usuarioModel.set("eventos", eventos);

    if (this.usuarioModel.isValid(true)) {
      Commons.mostrarCarregando();

      this.usuarioModel.save({}, {
        success: _.bind(function() {
          Commons.mostrarPopup({
            titulo: "Sucesso",
            corpo: '<div class="alert alert-success" role="alert">Usuário editado com sucesso!</div>',
            tamanho: "modal-sm",
            botoes: [
              {
                id: "fecharBtn",
                texto: "Fechar",
                layout: "primary",
                icone: "remove",
                fechar: true,
                onclick: function() {
                  Backbone.history.navigate("#/usuarios", {trigger : true});
                }
              }
            ]
          });
        }, this),
        complete: _.bind(function() { 
          Commons.esconderCarregando();
        }, this)
      });
    }
  },
  _validar: function(view, attr) {
    var $el = view.$("[name='" + attr + "']");
			
    $el.parent().parent().removeClass("has-error");
    $el.parent().find("span.help-block").empty().hide();
  },
  _invalidar: function(view, attr, error) {
    var $el = view.$("[name='" + attr + "']");
    
    $el.parent().parent().addClass("has-error");
    $el.parent().find("span.help-block").text(error).show();
  }
});
