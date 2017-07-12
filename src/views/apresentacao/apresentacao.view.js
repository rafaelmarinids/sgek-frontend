require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("./styles.css");
var Commons = require("../../commons.js");
var template = require("./template.html");

module.exports = Backbone.View.extend({
  el: "#conteudoPaginaDiv",
  initialize: function() {
    this.render();
  },
  render: function() {
    this.$el.html(template);

    Commons.esconderCarregando();

    return this;
  }
});
