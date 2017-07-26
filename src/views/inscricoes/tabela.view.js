var Commons = require("../../commons.js");
var FileiraView = require("./fileira.view.js");

module.exports = Backbone.View.extend({
  tagName: "table",
  attributes: {
    "class": "table table-hover"
  },
  template: '<thead>'
        + '<tr class="sgek-fileira-formulario-pesquisa">'
          + '<th class="sgek-botao-pesquisar"><button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> Pesquisar</button></th>'
        + '</tr>'
        + '<tr class="sgek-fileira-cabecalho">'
          + '<th class="sgek-entrega-kit">Entrega de Kit</th>'
        + '</tr>'
      + '</thead>'
      + '<tbody></tbody>',
  initialize: function(options) {
    this.options = options;

    this.listenTo(this.options.inscricaoCollection, "add", this._adicionarInscricao);
    this.listenTo(this.options.inscricaoCollection, "sync", this._atualizarTabela);
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

    var filtros = {
      evento: this.options.idEvento
    };

    this.$("input[type='text']").each(function() {
      if ($(this).val().length) {
        filtros[$(this).attr("name")] = $(this).val();
      }
    });

    this.$(".sgek-tabela-mensagem").remove();

    this.options.inscricaoCollection.fetch({
      data: $.param(filtros)
    });
  },
  _renderizarCabecalhoTabela: function() {
    this.options.colunaCollection.forEach(_.bind(function(model) {
      // Renderiza o formulário de pesquisa.
      this.$(".sgek-botao-pesquisar")
        .before('<th><input type="text" name="' + model.get("indice") + '" class="form-control" placeholder="Pesquisar ' + model.get("valor").toLowerCase() + '"></th>');

      // Renderiza o cabeçalho da tabela.
      this.$(".sgek-entrega-kit")
        .before('<th>' + model.get("valor") + '</th>');
    }, this));

    this.$("tbody").html('<tr class="sgek-tabela-mensagem"><td colspan="' + (this.options.colunaCollection.length + 1) + '"><p class="text-info">Realize uma pesquisa para encontrar inscrições.</p></td></tr>');
  },
  _adicionarInscricao: function(model, collection, options) {
    var fileiraView = new FileiraView({
      model: model,
      colunaCollection: this.options.colunaCollection
    });

    this.$("tbody").append(fileiraView.render().el);
  },
  _atualizarTabela: function(collection, response, options) {
    if (collection.length == 0) {
      this.$("tbody").html('<tr class="sgek-tabela-mensagem"><td colspan="' + (this.options.colunaCollection.length + 1) + '"><p class="text-info">Nenhuma inscrição encontrada, pesquise novamente.</p></td></tr>');
    }

    Commons.esconderCarregando();
  }
});
