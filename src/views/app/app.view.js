require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("./styles.css");
var Commons = require("../../commons.js");
var SessaoModel = require("../../models/sessao.model.js");
var Modal = require("../modal/modal.view.js");
var templateIdentificacao = require("./template-identificacao.html");
var templateApp = require("./template-app.hbs");
var imagemLogo = require("../../assets/images/ars-eventos.png");
var imagemUsuario = require("../../assets/images/usuario.png");

var sessaoModel = new SessaoModel();

module.exports = Backbone.View.extend({
  el: ".sgek-app",
  events: {
    "click .sgek-app-mobile-cabecalho a": "abrirFecharMenuMobile",
    "click #sairA": "sair"
  },
  render: function(autenticado) {
    if (!autenticado) {
      if (!this.$(".identificacao").length) {
        this.$el.removeClass("app").addClass("identificacao");

        this.$el.html(templateIdentificacao);
      }
    } else {
      if (!this.$(".app").length) {
        this.$el.removeClass("identificacao").addClass("app");

        var agora = new Date();

        this.$el.html(templateApp({
          imagemLogo: imagemLogo,
          imagemUsuario: imagemUsuario,
          nomeUsuario: sessaoModel.getNomeUsuario(),
          eventoSelecionado: "Hoje é " + Commons.getDescricaoDia(agora.getDay()) + ", " + agora.getDate() + " de " + Commons.getDescricaoMes(agora.getMonth()) + " de " + agora.getFullYear()
        }));
      }

      this._renderizarMenu();
    }

    return this;
  },
  sair: function(event) {
    event.preventDefault();

    var modal = new Modal({
      titulo: "Sair",
      corpo: '<div class="alert alert-warning" role="alert">Tem certeza que deseja sair?</div>',
      tamanho: "modal-sm",
      botoes: [
        {
          id: "simBtn",
          texto: "Sim",
          layout: "primary",
          icone: "ok",
          fechar: true,
          onclick: function() {
            sessaoModel.sair(function() {
              Backbone.history.navigate("#/identificacao", {trigger : true});
            });
          }
        }, {
          texto: "Não",
          icone: "remove",
          fechar: true
        }
      ]
    });

    modal.render();
  },
  abrirFecharMenuMobile: function(event) {
    event.preventDefault();

    if (this.$(".sgek-app-coluna-esquerda").is(":visible")) {
      this.$(".sgek-app-coluna-esquerda").hide();

      this.$(".sgek-app-coluna-direita").removeClass("menu-aberto");
    } else {
      this.$(".sgek-app-coluna-esquerda").show();

      this.$(".sgek-app-coluna-direita").addClass("menu-aberto");
    }
  },
  _renderizarMenu: function() {
    this.$(".sgek-menu ul li a.ativo").removeClass("ativo");

    if (Backbone.history.getFragment()) {
      this.$("#" + Backbone.history.getFragment().split("/")[0]).addClass("ativo");
    } else {
      this.$("#apresentacao").addClass("ativo");
    }
  }
});
