require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("./styles.css");
var Commons = require("../../commons.js");
var SessaoModel = require("../../models/sessao.model.js");
var template = require("./template.hbs");
var templateDadosPessoais = require("../inscricoes/template-dados-pessoais.hbs");

var sessaoModel = new SessaoModel();

module.exports = Backbone.View.extend({
  el: ".sgek-app",
  initialize: function(options) {
    this.options = options;

    sessaoModel.listenKeyChange("inscricao", _.bind(this._renderizarConteudo, this));

    this.render();
  },
  render: function() {
    this.$el.empty();

    this.$el.html(template({
      planodefundo: Commons.contextoSistema + "/eventos/imagens/" //+ sessaoModel.get("evento").planodefundo
    }));

    this._renderizarConteudo();

    Commons.esconderCarregando();

    return this;
  },
  _renderizarConteudo: function(key, action) {
    if (sessaoModel.get("inscricao") == "confirmada") {
      this.$(".sgek-confirmacao-dados-pessoais").html(this.templateBoasorte);
    } else if (_.isObject(sessaoModel.get("inscricao"))) {
      this.$(".sgek-confirmacao-dados-pessoais").html(templateDadosPessoais({
        aviso: false,
        inscricao: sessaoModel.get("inscricao"),
        cor: sessaoModel.get("evento").cor ? sessaoModel.get("evento").cor : "#333"
      }));
    } else {
      this.$(".sgek-confirmacao-dados-pessoais").html(this.templateBemvindo);
    }
  },
  templateBemvindo: '<h1 style="color: ' + (sessaoModel.get("evento").cor ? sessaoModel.get("evento").cor : "#333") + '">Seja bem-vindo!</h1><h3>' + sessaoModel.get("evento").titulo + '</h3>',
  templateBoasorte: '<h1 style="color: ' + (sessaoModel.get("evento").cor ? sessaoModel.get("evento").cor : "#333") + '">Agradecemos sua participação e boa corrida!</h1>'
});
