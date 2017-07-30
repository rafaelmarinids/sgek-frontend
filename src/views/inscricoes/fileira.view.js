var Commons = require("../../commons.js");
var SessaoModel = require("../../models/sessao.model.js");
var Modal = require("../modal/modal.view.js");
var FormularioTerceiroView = require("./formulario-terceiro.view.js");
var templateDadosPessoais = require("./template-dados-pessoais.hbs");

var sessaoModel = new SessaoModel();

module.exports = Backbone.View.extend({
  tagName: "tr",
  initialize: function(options) {
    this.options = options;

    this.listenTo(this.model, "remove", this.remove);
    this.listenTo(this.model, "change", this.render);
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
            + '<li><a href="javascript: void(0);" class="sgek-botao-entregar">Entregar</a></li>'
            + '<li role="separator" class="divider"></li>'
            + '<li><a href="javascript: void(0);" class="sgek-botao-entregar-para-terceiro">Entregar para terceiro</a></li>'
          + '</ul>'
        + '</div>'
      + '</td>');

      this.$('.dropdown-toggle').dropdown();
    }

    return this;
  },
  entregar: function(event) {
    event.preventDefault();

    if (this.options.eventoModel.get("confirmacao")) {
      // Neste momento a tela de confirmação do inscrito deverá mudar para os dados pessoais.
      sessaoModel.set("inscricao", this.model);

      var modal = new Modal({
        titulo: "Confirmação de dados pessoais",
        corpo: templateDadosPessoais({
          aviso: true,
          inscricao: this.model.toJSON()
        }),
        fechar: false,
        botoes: [
          {
            id: "entregarBtn",
            texto: "Confirmar",
            layout: "primary",
            icone: "ok",
            fechar: true,
            onclick: _.bind(this._entregar, this)
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

      modal.render();
    } else {
      this._entregar();
    }
  },
  _entregar: function() {
    Commons.mostrarCarregando();

    this.model.get("retirada").retirado = true;

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
          id: "entregarBtn",
          texto: "Entregar",
          layout: "primary",
          icone: "ok",
          fechar: false,
          onclick: _.bind(function() {
            formularioTerceiroView.preencherTerceiro(_.bind(function() {
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
            + '<tr><td>' + this.model.get("retirada").terceiro.nome + '</td><td>' + this.model.get("retirada").terceiro.documento + '</td><td>' + this.model.get("retirada").terceiro.telefone + '</td><td>' + this.model.get("retirada").terceiro.endereco + '</td></tr>'
          + '</tbody>'
        + '</table>'
      + '</div>';
    }

    Commons.mostrarPopup({
      titulo: "Detalhes da retirada de kit: #" + this.model.get("inscricao"),
      corpo: detalhes,
      tamanho: this.model.get("retirada").terceiro && this.model.get("retirada").terceiro.nome ? "modal-lg" : ""
    });
  }
});
