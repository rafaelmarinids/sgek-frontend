require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("./styles.css");
require("backbone-validation");
var Commons = require("../../commons.js");
var EventoModel = require("../../models/evento.model.js");
var ModalCarregandoView = require("../modal-carregando/modal-carregando.view.js");
var template = require("./template-evento.hbs");

module.exports = Backbone.View.extend({
  el: "#conteudoPaginaDiv",
  initialize: function() {
    this.eventoModel = new EventoModel();

    this.listenTo(this.eventoModel, "progress", _.bind(this._mostrarCarregando, this));

    Backbone.Validation.bind(this, {
      model: this.eventoModel,
      valid: this._validar,
      invalid: this._invalidar
    });

    this.render();
  },
  events: {
    "click #salvarBtn": "cadastrar",
    "click #confirmacaoRadio label": "habilitarDesabilitarPlanodefundo"
  },
  render: function() {
    this.$el.html(template({
      acao: "Novo",
      icon: "plus",
      evento: this.eventoModel.toJSON()
    }));

    Commons.esconderCarregando();

    return this;
  },
  cadastrar: function(event) {
    event.preventDefault();

    this.eventoModel.set("status", this.$('#ativoRadio label.active input').val() == "true" ? "Dados não importados" : "Inativo");
    this.eventoModel.set("titulo", this.$("#tituloInput").val());
    this.eventoModel.set("cor", this.$("#corInput").val());
    this.eventoModel.set("logomarca", this.$('#logomarcaInput')[0].files.length > 0 ? this.$('#logomarcaInput')[0].files[0] : null);
    this.eventoModel.set("confirmacao", this.$('#confirmacaoRadio label.active input').val() == "true");
    this.eventoModel.set("mensageminicial", this.$("#mensageminicialInput").val());
    this.eventoModel.set("mensagemfinal", this.$("#mensagemfinalInput").val());

    if (this.eventoModel.get("confirmacao")) {
      this.eventoModel.set("planodefundo", this.$('#planodefundoInput')[0].files.length > 0 ? this.$('#planodefundoInput')[0].files[0] : null);
    } else {
      this.eventoModel.set("planodefundo", null);
    }

    if (this.eventoModel.isValid(true)) {
      this.eventoModel.save({}, {
        success: _.bind(function() {
          Commons.mostrarPopup({
            titulo: "Sucesso",
            corpo: '<div class="alert alert-success" role="alert">Evento cadastrado com sucesso!</div>',
            tamanho: "modal-sm",
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
        }, this),
        complete: _.bind(function() { 
          if (this.modalCarregandoView) {
            this.modalCarregandoView.fechar();
          }
        }, this)
      });
    }
  },
  habilitarDesabilitarPlanodefundo: function(event) {
    if (this.$(event.target).children('input').val() == "true") {
      this.$('#planodefundoInput').attr("disabled", false);
    } else {
      this.$('#planodefundoInput').attr("disabled", true);
    }
  },
  _mostrarCarregando: function(porcentagem) {
    if (!this.modalCarregandoView) {
      this.modalCarregandoView = new ModalCarregandoView({
        mensagem: porcentagem < 100 ? "Fazendo upload de arquivo(s): " + porcentagem + "%" : "Pronto!",
        porcentagem: porcentagem
      });

      this.modalCarregandoView.render();
    } else {
      if (porcentagem >= 99) {
        this.modalCarregandoView.setMensagem("Pronto!");
      } else {
        this.modalCarregandoView.setMensagem("Fazendo upload de arquivo(s): " + porcentagem + "%");
      }

      this.modalCarregandoView.setPorcentagem(porcentagem);
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
