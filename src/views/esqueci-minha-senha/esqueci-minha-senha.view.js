require("./styles.css");
var Commons = require("../../commons.js");
var template = require("./template.html");

module.exports = Backbone.View.extend({
  el: ".sgek-identificacao-form-base",
  events: {
    "click #submitBtn": "recuperarSenha"
  },
  initialize: function() {
    this.render();
  },
  render: function() {
    this.$el.html(template);

    return this;
  },
  recuperarSenha: function(event) {
    this.email = this.$("#emailInput").val();

    if (this._validar()) {
      event.preventDefault();
    } else {
      event.preventDefault();
    }
  },
  _validar: function() {
    var validou = true;

    if (!this.email) {
      this.$("#emailInput").parent().addClass("has-error");
      this.$("#emailInput").parent().children("span").text("Email é necessário.").show();

      validou = false;
    } else if (this.email && !Commons.validarEmail(this.email)) {
      this.$("#emailInput").parent().addClass("has-error");
      this.$("#emailInput").parent().children("span").text("Email inválido.").show();

      validou = false;
    } else {
      this.$("#emailInput").parent().removeClass("has-error");
      this.$("#emailInput").parent().children("span").hide();
    }

    return validou;
  }
});
