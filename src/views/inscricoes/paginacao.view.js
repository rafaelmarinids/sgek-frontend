var Commons = require("../../commons.js");
var FileiraView = require("./fileira.view.js");

module.exports = Backbone.View.extend({
  tagName: "div",
  attributes: {
    "class": "panel panel-default sgek-paginacao-base"
  },
  template: '<div class="panel-body"><nav><ul class="pager"><li id="paginaLi"><strong>Página 1:</strong> </li><li><a href="javascript: void(0);" id="anterior">Anterior</a></li><li><a href="javascript: void(0);" id="proximo">Próximo</a></li></ul></nav></div>',
  initialize: function(options) {
    this.options = options;

    this.listenTo(this.options.inscricoesModel, "sync", _.bind(this.render, this));

    this.quantidadeRegistros = 25;
    this.pagina = 1;
  },
  events: {
    "click li:not('.disabled') #proximo": "avancar",
    "click li:not('.disabled') #anterior": "recuar"
  },
  render: function() {
    this.$el.html(this.template);

    if (this.pagina == 1) {
      this.$("#anterior").parent().addClass("disabled");
    } else {
      if (!this.$("#anterior").parent().hasClass("disabled")) {
        this.$("#anterior").parent().removeClass("disabled");
      }
    }

    if (this.options.inscricoesModel.get("inscricoesCollection").length < this.quantidadeRegistros) {
      this.$("#proximo").parent().addClass("disabled");
    } else {
      if (!this.$("#proximo").parent().hasClass("disabled")) {
        this.$("#proximo").parent().removeClass("disabled");
      }
    }

    this.$("#paginaLi").html("<strong>Página " + this.pagina + " de " + this._recuperarTotalDePaginas() + ":</strong> ");

    //this.$(".panel-body").append('<span><strong>Total de inscrições:</strong> ' + this.options.inscricoesModel.get("quantidadeTotalInscricoes") + ' | <strong>Kits retirados:</strong> ' + this.options.inscricoesModel.get("quantidadeKitsRetirados") + '</span>');

    return this;
  },
  _recuperarTotalDePaginas: function() {
    var total = parseInt(this.options.inscricoesModel.get("quantidadeRegistros")) / this.quantidadeRegistros;

    if (total % 1 !== 0) {
      return Math.floor(total) + 1;
    }

    return total > 1 ? total : 1;
  },
  avancar: function(event) {
    event.preventDefault();

    Commons.mostrarCarregando();

    var filtros = this.options.filtros();

    filtros = _.extend(filtros, {
      quantidadeRegistros: this.quantidadeRegistros,
      pagina: ++this.pagina
    });

    this.options.inscricoesModel.fetch({
      data: $.param(filtros),
      complete: function() {
        window.scrollTo(0, 0);
      }
    });
  },
  recuar: function(event) {
    event.preventDefault();

    Commons.mostrarCarregando();

    var filtros = this.options.filtros();

    filtros = _.extend(filtros, {
      quantidadeRegistros: this.quantidadeRegistros,
      pagina: --this.pagina
    });

    this.options.inscricoesModel.fetch({
      data: $.param(filtros),
      complete: function() {
        window.scrollTo(0, 0);
      }
    });
  },
  getQuantidadeRegistros: function() {
    return this.quantidadeRegistros;
  },
  getPagina: function() {
    return this.pagina;
  }
});
