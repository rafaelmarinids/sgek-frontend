require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("./styles.css");
require("backbone-validation");
var Commons = require("../../commons.js");
var EventoCollection = require("../../collections/evento.collection.js");
var ImportacaoModel = require("../../models/importacao.model.js");
var ModalCarregandoView = require("../modal-carregando/modal-carregando.view.js");
var ColunaView = require("./coluna.view.js");
var template = require("./template.hbs");
var templateConfiguracao = require("./template-configuracao.hbs");

module.exports = Backbone.View.extend({
  el: "#conteudoPaginaDiv",
  initialize: function(options) {
    this.options = options;

    this.etapa = "inicial";

    this.importacaoModel = new ImportacaoModel();

    this.listenTo(this.importacaoModel, "progress", this._mostrarCarregando);

    Backbone.Validation.bind(this, {
      model: this.importacaoModel,
      valid: this._validar,
      invalid: this._invalidar
    });

    this.eventoCollection = new EventoCollection();

    this.eventoCollection.fetch({
      data: $.param({
        status: "Dados não importados"
      }),
      success: _.bind(function(collection) {
        if (this.options.id) {
          this.evento = collection.findWhere({id: parseInt(this.options.id)});

          if (this.evento) {
            this.evento.set("selecionado", true);
          }
        }

        this.render();
      }, this)
    });
  },
  events: {
    "click #avancarBtn": "avancar",
    "click #voltarBtn": "voltar",
    "click #importarBtn": "importar"
  },
  render: function() {
    switch (this.etapa) {
      case "configuracao":
        this.$el.html(templateConfiguracao({
          importacao: this.importacaoModel.toJSON()
        }));

        this._renderizarTabela();

        break;
      default:
        this.$el.html(template({
          eventos: this.eventoCollection.toJSON()
        }));

        break;
    }

    Commons.esconderCarregando();

    return this;
  },
  avancar: function(event) {
    event.preventDefault();

    var eventoSelecionado = this.eventoCollection.findWhere({id: parseInt(this.$("#eventoSelect").val())});

    this.importacaoModel.set("evento", eventoSelecionado);
    this.importacaoModel.set("excel", this.$('#excelInput')[0].files.length > 0 ? this.$('#excelInput')[0].files[0] : null);

    this.excelFile = this.importacaoModel.get("excel");

    if (this.importacaoModel.isValid(true)) {
      this.importacaoModel.set("evento", this.importacaoModel.get("evento").id);

      this.importacaoModel.fetch({
        method: "POST",
        success: _.bind(function() {
          this.etapa = "configuracao";

          this.render();
        }, this),
        complete: _.bind(function() { 
          if (this.modalCarregandoView) {
            this.modalCarregandoView.fechar();
          }
        }, this)
      });
    }
  },
  voltar: function() {
    this.etapa = "inicial";

    this.importacaoModel = new ImportacaoModel();

    this.excelFile = null;

    Commons.mostrarCarregando();

    this.render();
  },
  importar: function(event) {
    event.preventDefault();

    if (this._validarImportacao()) {
      var evento = this.importacaoModel.get("evento");

      this.importacaoModel.set("evento", this.importacaoModel.get("evento").id);
      this.importacaoModel.set("excel", this.excelFile);

      this.importacaoModel.save(null, {
        method: "POST",
        success: function() {
          Commons.mostrarPopup({
            titulo: "Sucesso",
            corpo: '<div class="alert alert-success" role="alert">Importação realizada com sucesso!</div>',
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
        },
        complete: _.bind(function() { 
          if (this.modalCarregandoView) {
            this.modalCarregandoView.fechar();
          }
        }, this)
      });
    }
  },
  _renderizarTabela: function() {
    if (this.importacaoModel.get("colunas") && this.importacaoModel.get("colunas").length) {
      for (var i = 0; i < this.importacaoModel.get("colunas").length; i++) {
        var colunaView = new ColunaView({
          model: this.importacaoModel.get("colunas")[i],
          confirmacao: this.importacaoModel.get("evento").confirmacao
        });

        this.$(".table tbody").append(colunaView.render().el);
      }
    } else {
      this.$(".table tbody").append('<tr><td colspan="4">Nenhuma coluna encontrada.</td></tr>');
    }
  },
  _mostrarCarregando: function(porcentagem) {
    if (!this.modalCarregandoView || !this.modalCarregandoView.isAberto()) {
      this.modalCarregandoView = new ModalCarregandoView({
        mensagem: porcentagem < 100 ? "Fazendo upload de arquivo(s): " + porcentagem + "%" : "Upload completo, processando dados.",
        porcentagem: porcentagem
      });

      this.modalCarregandoView.render();
    } else {
      if (porcentagem >= 99) {
        this.modalCarregandoView.setMensagem("Upload completo, processando dados.");
      } else {
        this.modalCarregandoView.setMensagem("Fazendo upload de arquivo(s): " + porcentagem + "%");
      }

      this.modalCarregandoView.setPorcentagem(porcentagem);
    }
  },
  _validar: function(view, attr) {
    var $el = view.$("[name='" + attr + "']");

    if ($el.attr("name") == "excel") {
      $el.parent().find("span.help-block").html('<strong>Formatos aceitos:</strong> XLS, XLSX, ODS e CSV.');
    } else {
      $el.parent().parent().removeClass("has-error");
      $el.parent().find("span.help-block").empty().hide();
    }
  },
  _invalidar: function(view, attr, error) {
    var $el = view.$("[name='" + attr + "']");

    $el.parent().parent().addClass("has-error");
    $el.parent().find("span.help-block").text(error).show();
  },
  _validarImportacao: function() {
    if (this.importacaoModel.get("colunas") && this.importacaoModel.get("colunas").length) {
      var colunasTelaDeInscricao = false;
      var colunasTelaDeConfirmacao = false;
      var colunaInscricao = false;

      for (var i = 0; i < this.importacaoModel.get("colunas").length; i++) {
        colunasTelaDeInscricao = colunasTelaDeInscricao || this.importacaoModel.get("colunas")[i].usarnabusca;

        colunasTelaDeConfirmacao = colunasTelaDeConfirmacao || this.importacaoModel.get("colunas")[i].usarnaconfirmacao;

        colunaInscricao = colunaInscricao || this.importacaoModel.get("colunas")[i].inscricao;
      }

      var mensagem = '<div class="alert alert-danger" role="alert"><ul>';

      if (!colunasTelaDeInscricao) {
        mensagem += "<li>É necessário selecionar ao menos uma coluna para a tela de inscrição.</li>";
      }

      if (this.importacaoModel.get("evento").confirmacao && !colunasTelaDeConfirmacao) {
        mensagem += "<li>É necessário selecionar ao menos uma coluna para a tela de confirmação.</li>";
      }

      if (!colunaInscricao) {
        mensagem += "<li>É necessário selecionar uma coluna que representa unicamente a inscrição.</li>";
      }

      mensagem += "</ul></div>";

      if (!colunasTelaDeInscricao 
        || (this.importacaoModel.get("evento").confirmacao && !colunasTelaDeConfirmacao)
        || !colunaInscricao) {
          Commons.mostrarPopup({
            titulo: "Erro",
            corpo: mensagem
          });

          return false;
      }

      return true;
    }
  }
});
