var Commons = require("../../commons.js");
var SessaoModel = require("../../models/sessao.model.js");
var Modal = require("../modal/modal.view.js");
var FormularioConfirmacaoView = require("./formulario-confirmacao.view.js");
var FormularioTerceiroView = require("./formulario-terceiro.view.js");
//var templateDadosPessoais = require("./template-dados-pessoais.hbs");
var templateOcorrencia = require("./template-ocorrencia.hbs");

var sessaoModel = new SessaoModel();

module.exports = Backbone.View.extend({
  tagName: "tr",
  initialize: function(options) {
    this.options = options;

    this.ocorrencia = null;

    this.listenTo(this.model, "remove", this.remove);
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "update", this.render);
  },
  events: {
    "click .sgek-botao-entregar": "entregar",
    "click .sgek-botao-entregar-para-terceiro": "entregarParaTerceiro",
    "click .sgek-botao-entregue": "mostrarDetalhesEntrega"
  },
  render: function() {
    this.$el.empty();

    this.options.colunaCollection.forEach(_.bind(function(colunaModel) {
      var colunaFileira = _.find(this.model.get("colunasFileirasBusca"), _.bind(function(colunaFileira) {
        return colunaModel.get("indice") == colunaFileira.coluna.indice;
      }, this));

      if (colunaFileira) {
        this.$el.append('<td>' + colunaFileira.fileira.valor + '</td>');
      }
    }, this));

    if (this.model.get("retirada") && this.model.get("retirada").retirado) {
      this.$el.append('<td><button type="button" class="btn btn-success sgek-botao-entregue"><span class="glyphicon glyphicon-ok"></span> Retirado</button></td>');
    } else {
      this.$el.append('<td class="sgek-coluna-botao-entregar">'
        + '<div class="btn-group">'
          + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Disponível <span class="caret"></span></button>'
          + '<ul class="dropdown-menu">'
            + '<li><a href="javascript: void(0);" class="sgek-botao-entregar">Retirar</a></li>'
            + '<li role="separator" class="divider"></li>'
            + '<li><a href="javascript: void(0);" class="sgek-botao-entregar-para-terceiro">Retirar por terceiro</a></li>'
          + '</ul>'
        + '</div>'
      + '</td>');

      this.$('.dropdown-toggle').dropdown();
    }

    return this;
  },
  entregar: function(event) {
    event.preventDefault();

    var modal;

    if (this.options.eventoModel.get("confirmacao")) {
      // Neste momento a tela de confirmação do inscrito deverá mudar para os dados pessoais.
      sessaoModel.set("inscricao", this.model);

      var formularioConfirmacaoView = new FormularioConfirmacaoView({
        model: this.model
      });

      modal = new Modal({
        titulo: "Confirmação de dados pessoais",
        corpo: formularioConfirmacaoView.render().el,
        fechar: false,
        botoes: [
          {
            id: "entregarBtn",
            texto: "Confirmar",
            layout: "primary",
            icone: "ok",
            fechar: true,
            onclick: _.bind(function() {
              formularioConfirmacaoView.corrigirDadosPessoais();

              this._entregar();
            }, this)
          }, {
            id: "cancelarBtn",
            texto: "Cancelar",
            layout: "default",
            icone: "remove",
            fechar: true,
            onclick: function() {
              if (sessaoModel.get("inscricao")) {
                sessaoModel.set("inscricao", null);
              }
            }
          }
        ]
      });
    } else {
      modal = new Modal({
        titulo: "Registrar ocorrência?",
        corpo: templateOcorrencia(),
        fechar: false,
        botoes: [
          {
            id: "entregarBtn",
            texto: "Confirmar",
            layout: "primary",
            icone: "ok",
            fechar: true,
            onclick: _.bind(function() {
              this.ocorrencia = $("#ocorrenciaInput").val()

              this._entregar();
            }, this)
          }, {
            id: "cancelarBtn",
            texto: "Cancelar",
            layout: "default",
            icone: "remove",
            fechar: true
          }
        ]
      });
    }

    modal.render();
  },
  _entregar: function() {
    Commons.mostrarCarregando();

    this.model.get("retirada").retirado = true;

    if (this.ocorrencia) {
      this.model.get("retirada").ocorrencia = this.ocorrencia;

      this.ocorrencia = null;
    }

    this.model.save({}, {
      success: function() {
        Commons.mostrarPopup({
          titulo: "Sucesso",
          corpo: '<div class="alert alert-success" role="alert">Retirada de kit confirmada com sucesso!</div>'
        });

        sessaoModel.set("inscricao", "confirmada");

        setTimeout(function() {
          if (sessaoModel.get("inscricao") == "confirmada") {
            sessaoModel.set("inscricao", null);
          }
        }, 5000);
      },
      error: function() {
        sessaoModel.set("inscricao", null);
      },
      complete: function() {
        Commons.esconderCarregando();
      }
    });
  },
  entregarParaTerceiro: function(event) {
    event.preventDefault();

    var formularioTerceiroView = new FormularioTerceiroView({
      model: this.model
    });

    var modal = new Modal({
      titulo: "Entre com os dados do terceiro",
      corpo: formularioTerceiroView.render().el,
      botoes: [
        {
          id: "ultimoTerceiroBtn",
          texto: "Preencher com último",
          layout: "default",
          icone: "pencil",
          fechar: false,
          esconder: _.isNull(sessaoModel.get("ultimoTerceiro")) || _.isUndefined(sessaoModel.get("ultimoTerceiro")),
          classes: "pull-left",
          onclick: function() {
            formularioTerceiroView.preencherFormulario(sessaoModel.get("ultimoTerceiro"));
          }
        }, {
          id: "entregarBtn",
          texto: "Entregar",
          layout: "primary",
          icone: "ok",
          fechar: false,
          onclick: _.bind(function() {
            formularioTerceiroView.preencherTerceiro(_.bind(function() {
              sessaoModel.set("ultimoTerceiro", this.model.get("retirada").terceiro);

              modal.fechar();

              this.entregar(event);
            }, this));
          }, this)
        }, {
          id: "cancelarBtn",
          texto: "Cancelar",
          layout: "default",
          icone: "remove",
          fechar: true
        }
      ]
    });

    modal.render();
  },
  mostrarDetalhesEntrega: function() {
    var detalhes = '<table class="table">'
        + '<thead>'
          + '<tr><th><span class="glyphicon glyphicon-user"></span> Usuário</th><th><span class="glyphicon glyphicon-time"></span> Data e Hora</th></tr>'
        + '</thead>'
        + '<tbody>'
          + '<tr><td>' + this.model.get("retirada").usuarioInsercao.nome + '</td><td>' + this.model.get("retirada").dataHoraInsercao + '</td></tr>'
        + '</tbody>'
      + '</table>';

    if (this.model.get("retirada").terceiro && this.model.get("retirada").terceiro.nome) {
      detalhes += '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Kit retirado por terceiro</h3></div>'
        + '<table class="table">'
          + '<thead>'
            + '<tr><th>Nome</th><th>Documento</th><th>Telefone</th><th>Endereço</th></tr>'
          + '</thead>'
          + '<tbody>'
            + '<tr><td>' + this.model.get("retirada").terceiro.nome + '</td><td>' 
            + (this.model.get("retirada").terceiro.documento ? this.model.get("retirada").terceiro.documento : "-")
            + '</td><td>' 
            + (this.model.get("retirada").terceiro.telefone ? this.model.get("retirada").terceiro.telefone : "-")
            + '</td><td>' 
            + (this.model.get("retirada").terceiro.endereco ? this.model.get("retirada").terceiro.endereco : "-")
            + '</td></tr>'
          + '</tbody>'
        + '</table>'
      + '</div>';
    }

    if (this.model.get("retirada").ocorrencia) {
      detalhes += '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Ocorrência</h3></div>'
        + '<div class="panel-body">'
          + this.model.get("retirada").ocorrencia
        + '</div>'
      + '</div>';
    }

    Commons.mostrarPopup({
      titulo: "Detalhes da retirada de kit: #" + this.model.get("inscricao"),
      corpo: detalhes,
      tamanho: this.model.get("retirada").terceiro && this.model.get("retirada").terceiro.nome ? "modal-lg" : ""
    });
  }
});
