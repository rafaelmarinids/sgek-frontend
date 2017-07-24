require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
var template = require("./template.hbs");
var Commons = require("../../commons.js");

module.exports = Backbone.View.extend({
  el: "#conteudoPaginaDiv",
  initialize: function(options) {
    this.render();
  },
  render: function() {
    this.$el.html(template());

    Commons.esconderCarregando();

    return this;
  }
});
