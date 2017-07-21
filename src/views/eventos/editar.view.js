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
  initialize: function(options) {
    this.options = options;

    this.eventoModel = new EventoModel({id: this.options.id});

    this.listenTo(this.eventoModel, "progress", this._mostrarCarregando);

    Backbone.Validation.bind(this, {
      model: this.eventoModel,
      valid: this._validar,
      invalid: this._invalidar
    });

    this.eventoModel.fetch({
      success: _.bind(this.render, this)
    });
  },
  events: {
    "click #salvarBtn": "editar",
    "click #confirmacaoRadio label": "habilitarDesabilitarPlanodefundo",
    "click .sgek-ampliar-imagem": "ampliarImagem"
  },
  render: function() {
    this.$el.html(template({
      acao: "Editar",
      icon: "pencil",
      evento: this.eventoModel.toJSON(),
      contexto: Commons.contextoSistema
    }));

    Commons.esconderCarregando();

    return this;
  },
  editar: function(event) {
    event.preventDefault();

    this.eventoModel.set("status", this.$('#ativoRadio label.active input').val() == "true" ? "Dados não importados" : "Inativo");
    this.eventoModel.set("titulo", this.$("#tituloInput").val());
    this.eventoModel.set("cor", this.$("#corInput").val());
    this.eventoModel.set("logomarca", this.$('#logomarcaInput')[0].files.length > 0 ? this.$('#logomarcaInput')[0].files[0] : null);

    if (!this.eventoModel.get("importacaoRealizada")) {
      this.eventoModel.set("confirmacao", this.$('#confirmacaoRadio label.active input').val() == "true");
    }    

    if (this.eventoModel.get("confirmacao")) {
      this.eventoModel.set("planodefundo", this.$('#planodefundoInput')[0].files.length > 0 ? this.$('#planodefundoInput')[0].files[0] : null);
    } else {
      this.eventoModel.set("planodefundo", null);
    }

    if (this.eventoModel.isValid(true)) {
      this.eventoModel.save(this.eventoModel.attributes, {
        method: "POST",
        url: this.eventoModel.url(),
        success: _.bind(function() {
          Commons.mostrarPopup({
            titulo: "Sucesso",
            corpo: '<div class="alert alert-success" role="alert">Evento editado com sucesso!</div>',
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
  ampliarImagem: function(event) {
    event.preventDefault();

    Commons.mostrarPopup({
      titulo: "Imagem",
      corpo: '<img src="' + this.$(event.target).attr("src") + '" class="sgek-imagem-ampliada">',
    });
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
