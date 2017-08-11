require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("./styles.css");
var Commons = require("../../commons.js");
var SessaoModel = require("../../models/sessao.model.js");
var EventoModel = require("../../models/evento.model.js");
var template = require("./template.hbs");
var templateDadosPessoais = require("./template-dados-pessoais.hbs");

var sessaoModel = new SessaoModel();

module.exports = Backbone.View.extend({
  el: ".sgek-app",
  initialize: function(options) {
    this.options = options;

    this.$el.empty();

    if (sessaoModel.get("evento")) {
      sessaoModel.listenKeyChange("inscricao", _.bind(this._renderizarConteudo, this));

      this.eventoModel = new EventoModel({id: sessaoModel.get("evento")});

      this.eventoModel.fetch({
        success: _.bind(this.render, this)
      });
    } else {
      Commons.esconderCarregando();

      this._mostrarAvisoEventoInvalido();
    }
  },
  render: function() {
    if (this.eventoModel.get("titulo")) {
      this.$el.html(template({
        planodefundo: this.eventoModel.get("planodefundo") ? Commons.contextoSistema + "/eventos/imagens/" + this.eventoModel.get("planodefundo") : ""
      }));

      this._renderizarConteudo();
    } else {
      this._mostrarAvisoEventoInvalido();
    }

    Commons.esconderCarregando();

    return this;
  },
  _mostrarAvisoEventoInvalido: function() {
    Commons.mostrarPopup({
      titulo: "Aviso",
      corpo: '<div class="alert alert-warning" role="alert">É necessário selecionar um evento antes de realizar a confirmação de dados pessoais.</div>',
      fechar: false,
      botoes: false
    });
  },
  _renderizarConteudo: function(key, action) {
    if (sessaoModel.get("inscricao") == "confirmada") {
      this.$(".sgek-confirmacao-dados-pessoais").html('<h1 style="color: ' 
        + (this.eventoModel.get("cor") ? this.eventoModel.get("cor") : "#333") 
        + '">' + (this.eventoModel.get("mensagemfinal") ? this.eventoModel.get("mensagemfinal") : "Agradecemos sua participação e boa corrida!") + '</h1>');
    } else if (_.isObject(sessaoModel.get("inscricao"))) {
      this.$(".sgek-confirmacao-dados-pessoais").html(templateDadosPessoais({
        inscricao: sessaoModel.get("inscricao"),
        cor: this.eventoModel.get("cor") ? this.eventoModel.get("cor") : "#333"
      }));
    } else {
      this.$(".sgek-confirmacao-dados-pessoais").html('<h1 style="color: ' 
        + (this.eventoModel.get("cor") ? this.eventoModel.get("cor") : "#333") 
        + '">' + (this.eventoModel.get("mensageminicial") ? this.eventoModel.get("mensageminicial") : "Seja bem-vindo!") + '</h1><h3 style="color: ' 
        + (this.eventoModel.get("cor") ? this.eventoModel.get("cor") : "#333") 
        + '">' + this.eventoModel.get("titulo") + '</h3>');
    }
  }
});
