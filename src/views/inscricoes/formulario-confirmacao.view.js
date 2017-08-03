var Commons = require("../../commons.js");
var SessaoModel = require("../../models/sessao.model.js");
var template = require("./template-dados-pessoais.hbs");

var sessaoModel = new SessaoModel();

module.exports = Backbone.View.extend({
  tagName: "form",
  events: {
    "keyup input": "_atualizarDadoPessoal"
  },
  initialize: function() {
    //this.modelClone = _.clone(this.model);
  },
  render: function() {
    this.$el.html(template({
      inscricao: this.model.toJSON()
    }));

    return this;
  },
  corrigirDadosPessoais: function(callback) {
    this.model.get("retirada").ocorrencia = this.$("#ocorrenciaInput").val();

    /*_.each(this.model.get("colunasFileirasBusca"), _.bind(function(colunaFileira) {
      colunaFileira.fileira.valor = this.$(colunaFileira.fileira.id).val();
    }, this));

    _.each(this.model.get("colunasFileirasConfirmacao"), _.bind(function(colunaFileira) {
      colunaFileira.fileira.valor = this.$(colunaFileira.fileira.id).val();
    }, this));*/

    if (callback) {
      callback();
    }
  },
  _atualizarDadoPessoal: function(event) {
    Commons.delay(_.bind(function() {
      var idFileira = this.$(event.target).attr("id");
    
      var colunaFileiraBuscaAtualizada = _.find(this.model.get("colunasFileirasBusca"), _.bind(function(colunaFileira) {
        return colunaFileira.fileira.id == idFileira;
      }, this));

      if (colunaFileiraBuscaAtualizada) {
        colunaFileiraBuscaAtualizada.fileira.valor = this.$(event.target).val();
      }

      var colunaFileiraConfirmacaoAtualizada = _.find(this.model.get("colunasFileirasConfirmacao"), _.bind(function(colunaFileira) {
        return colunaFileira.fileira.id == idFileira;
      }, this));

      if (colunaFileiraConfirmacaoAtualizada) {
        colunaFileiraConfirmacaoAtualizada.fileira.valor = this.$(event.target).val();
      }

      // Neste momento a tela de confirmação do inscrito deverá se atualizar com os dados pessoais.
      sessaoModel.set("inscricao", this.model);
    }, this), 300);
  }
});
