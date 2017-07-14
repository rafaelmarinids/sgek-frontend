var ModalView = require("../modal/modal.view.js");
var template = require("./template.hbs");

module.exports = Backbone.View.extend({
  tagName: "div",
  initialize(options) {
    this.options = options;
  },
  render: function() {
    this.$el.append(template({
      mensagem: this.options && this.options.mensagem ? this.options.mensagem : false,
      porcentagem: this.options && this.options.porcentagem ? this.options.porcentagem : 100
    }));

    this.modalView = new ModalView({
      titulo: "Carregando, aguarde...",
      corpo: this.$el.html(),
      tamanho: "modal-sm",
      fechar: this.options ? this.options.fechar : true,
      botoes: false
    });

    this.modalView.render();

    return this;
  },
  abrir: function() {
    (_.bind(this.render, this))();
  },
  fechar: function() {
    this.modalView.fechar();
  },
  isAberto: function() {
    return this.modalView.isAberto();
  },
  setMensagem: function(mensagem) {
    if (mensagem) {
      this.$("p").text(mensagem);
    }
  },
  setPorcentagem: function(porcentagem) {
    if (_.isNumber(porcentagem) && porcentagem >= 0 && porcentagem <= 100) {
      this.$(".progress-bar").css("width", porcentagem);
      this.$(".progress-bar").attr("aria-valuenow", porcentagem);
    }
  }
});
