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
  render: function(autenticado) {
    var opcoes = _.extend({
      titulo: "",
      corpo: "",
      fechar: true,
      tamanho: "", //modal-lg, modal-sm
      botoes: [{
        texto: "Fechar",
        icone: "remove",
        fechar: true
      }]
    }, this.options);

    this.$el.append(template(opcoes));

    $("body").append(this.el);

    this.$el.modal().modal("show");

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
    var id = this.$(event.target).attr("id");

    _.each(this.options.botoes, function(botao) {
      if (botao.id == id && botao.onclick) {
        botao.onclick();
      }
    });
  }
});
