require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/css/bootstrap-theme.min.css");
require("./styles.css");
var Commons = require("../../commons.js");
var EventoCollection = require("../../collections/evento.collection.js");
var template = require("./template.hbs");

module.exports = Backbone.View.extend({
  el: "#conteudoPaginaDiv",
  initialize: function() {
    this.eventoCollection = new EventoCollection();

    Commons.mostrarCarregando();

    this.eventoCollection.fetch({
      success: _.bind(this.render, this)
    });
  },
  render: function() {
    this.$el.html(template({
      eventos: this.eventoCollection.toJSON()
    }));

    Commons.esconderCarregando();

    return this;
  }
});
