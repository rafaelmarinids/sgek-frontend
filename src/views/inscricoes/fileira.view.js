var Commons = require("../../commons.js");

module.exports = Backbone.View.extend({
  tagName: "tr",
  initialize: function(options) {
    this.options = options;

    this.listenTo(this.model, "remove", this.remove);
  },
  events: {
    //"click button": "pesquisar"
  },
  render: function() {
    this.options.colunaCollection.forEach(_.bind(function(colunaModel) {
      var colunaFileira = _.find(this.model.get("colunasFileirasBusca"), _.bind(function(colunaFileira) {
        return colunaModel.get("indice") == colunaFileira.coluna.indice;
      }, this));

      if (colunaFileira) {
        this.$el.append('<td>' + colunaFileira.fileira.valor + '</td>');
      }
    }, this));

    this.$el.append('<td><button type="button" class="btn btn-success sgek-botao-entregue"><span class="glyphicon glyphicon-ok"></span> Entregue</button></td>');

    //this.$('.dropdown-toggle').dropdown();

    return this;
  }
});
