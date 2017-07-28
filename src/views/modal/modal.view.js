require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("bootstrap");
require("./styles.css");
var template = require("./template.hbs");

module.exports = Backbone.View.extend({
  tagName: "div",
  attributes: {
    id: new Date().getTime(),
    "class": "modal fade",
    tabindex: "-1",
    role: "dialog"
  },
  initialize(options) {
    this.options = options;

    this.aberto = false;
  },
  events: {
    "click button": "_onClickButton"
  },
  render: function() {
    var opcoes = _.extend({
      titulo: "",
      fechar: true,
      tamanho: "", //modal-lg, modal-sm
      botoes: [{
        texto: "Fechar",
        icone: "remove",
        fechar: true
      }]
    }, this.options);

    this.$el.html(template(opcoes));

    this.$(".modal-body").append(opcoes.corpo);

    $("body").append(this.el);

    this.$el.modal({
      backdrop: !opcoes.fechar ? "static" : true
    }).modal("show");

    this.aberto = true;

    this.$el.on("hidden.bs.modal", _.bind(this._remove, this));

    return this;
  },
  abrir: function() {
    (_.bind(this.render, this))();
  },
  fechar: function() {
    this.$el.modal("hide");
  },
  isAberto: function() {
    return this.aberto;
  },
  _remove: function() {
    this.remove();

    this.aberto = false;
  },
  _onClickButton: function(event) {
    /*
     * Evita que evento se realize para os elementos DOM filhos da tag "a".
     */
    if (event.target !== event.currentTarget) {
      this.$(event.target).parent().click();

      return;
    }
    
    var id = this.$(event.target).attr("id");

    _.each(this.options.botoes, function(botao) {
      if (botao.id == id && botao.onclick) {
        botao.onclick();
      }
    });
  }
});
