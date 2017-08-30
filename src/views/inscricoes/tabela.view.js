var Inputmask = require('inputmask');
var Commons = require("../../commons.js");
var FileiraView = require("./fileira.view.js");
var PaginacaoView = require("./paginacao.view.js");

module.exports = Backbone.View.extend({
  tagName: "table",
  attributes: {
    "class": "table table-hover sgek-tabela-inscricoes"
  },
  template: '<thead>'
        + '<tr class="sgek-fileira-formulario-pesquisa">'
          + '<th class="sgek-coluna-botao-pesquisar"><button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> Pesquisar</button></th>'
        + '</tr>'
        + '<tr class="sgek-fileira-cabecalho">'
          + '<th class="sgek-coluna-entrega-kit">Retirada de Kit</th>'
        + '</tr>'
      + '</thead>'
      + '<tbody></tbody>',
  initialize: function(options) {
    this.options = options;

    this.listenTo(this.options.inscricoesModel.get("inscricoesCollection"), "add", this._adicionarInscricao);
    this.listenTo(this.options.inscricoesModel, "sync", this._atualizarTabela);
  },
  events: {
    "click thead tr th button": "pesquisar"
  },
  render: function() {
    this.$el.html(this.template);

    this._renderizarCabecalhoTabela();

    return this;
  },
  pesquisar: function(event) {
    event.preventDefault();

    Commons.mostrarCarregando();

    this.$(".sgek-tabela-mensagem").remove();

    this.options.inscricoesModel.fetch({
      data: $.param(this._filtros()),
      success: _.bind(function() {
        this._renderizarPaginacao();
      }, this)
    });
  },
  _filtros: function() {
    var filtros = {
      evento: this.options.eventoModel.get("id"),
    };

    this.$("input[type='text']").each(function() {
      if ($(this).val().length) {
        filtros[$(this).attr("name")] = $(this).val();
      }
    });

    return filtros;
  },
  _renderizarCabecalhoTabela: function() {
    this.options.colunaCollection.forEach(_.bind(function(model) {
      // Renderiza o formulário de pesquisa.
      this.$(".sgek-coluna-botao-pesquisar")
        .before('<th><input type="text" name="' + model.get("indice") + '" class="form-control" placeholder="Pesquisar ' + model.get("valor").toLowerCase() + '"></th>');

      // Renderiza o cabeçalho da tabela.
      this.$(".sgek-coluna-entrega-kit")
        .before('<th>' + model.get("valor") + '</th>');

      // Aplica as máscaras caso necessário.
      if (model.get("valor").toUpperCase().indexOf("DATA ") !== -1 || model.get("valor").toUpperCase().indexOf("NASCIMENTO") !== -1) {
        Inputmask("99/99/9999").mask(this.$('input[name="' + model.get("indice") + '"]'));
      } else if (model.get("valor").toUpperCase().indexOf("CPF") !== -1) {
        Inputmask("999.999.999-99").mask(this.$('input[name="' + model.get("indice") + '"]'));
      }
    }, this));

    this.$("tbody").html('<tr class="sgek-tabela-mensagem"><td colspan="' + (this.options.colunaCollection.length + 1) + '"><p class="text-info">Realize uma pesquisa para encontrar inscrições.</p></td></tr>');
  },
  _renderizarPaginacao: function() {
    if (this.paginacaoView) {
      this.paginacaoView.remove();
    }

    this.paginacaoView = new PaginacaoView({
      inscricoesModel: this.options.inscricoesModel,
      filtros: _.bind(this._filtros, this)
    });

    this.$el.after(this.paginacaoView.render().el);
  },
  _adicionarInscricao: function(model, collection, options) {
    var fileiraView = new FileiraView({
      model: model,
      eventoModel: this.options.eventoModel,
      colunaCollection: this.options.colunaCollection
    });

    this.$("tbody").append(fileiraView.render().el);
  },
  _atualizarTabela: function(model, response, options) {
    if (model.get("inscricoesCollection").length == 0) {
      this.$("tbody").html('<tr class="sgek-tabela-mensagem"><td colspan="' + (this.options.colunaCollection.length + 1) + '"><p class="text-info">Nenhuma inscrição encontrada, pesquise novamente.</p></td></tr>');
    }

    Commons.esconderCarregando();
  }
});
