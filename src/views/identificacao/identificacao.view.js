require("./styles.css");
var SessaoModel = require("../../models/sessao.model.js");
var Commons = require("../../commons.js");
var template = require("./template.hbs");

var sessaoModel = new SessaoModel();

module.exports = Backbone.View.extend({
  el: ".sgek-identificacao-form-base",
  events: {
    "click #submitBtn": "identificar"
  },
  initialize: function() {
    sessaoModel = new SessaoModel();
  },
  render: function() {
    this.$el.html(template({
      "mensagem": sessaoModel.getMensagem()
    }));

    return this;
  },
  identificar: function(event) {
    event.preventDefault();

    this.email = this.$("#emailInput").val();
    this.senha = this.$("#senhaInput").val();

    if (this._validar()) {
      Commons.mostrarCarregando();

  		var redirecionamento = sessaoModel.get("redirecionamento");

  		sessaoModel.unset("redirecionamento");

  		sessaoModel.autenticar(this.email, this.senha, function() {
			  Backbone.history.navigate(redirecionamento ? "#/" + redirecionamento : "#/apresentacao", {trigger : true});
  		});
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

    if (!this.senha) {
      this.$("#senhaInput").parent().addClass("has-error");
      this.$("#senhaInput").parent().children("span").text("Senha é necessária.").show();

      validou = false;
    } else {
      this.$("#senhaInput").parent().removeClass("has-error");
      this.$("#senhaInput").parent().children("span").hide();
    }

    return validou;
  }
});
