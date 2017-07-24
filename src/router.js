require("backbone-validation");
var Commons = require("./commons.js");
var SessaoModel = require("./models/sessao.model.js");
var AppView = require("./views/app/app.view.js");
var IdentificacaoView = require("./views/identificacao/identificacao.view.js");
var EsqueciMinhaSenhaView = require("./views/esqueci-minha-senha/esqueci-minha-senha.view.js");
var ApresentacaoView = require("./views/apresentacao/apresentacao.view.js");
var EventosView = require("./views/eventos/eventos.view.js");
var EventosNovoView = require("./views/eventos/novo.view.js");
var EventosEditarView = require("./views/eventos/editar.view.js");
var ImportarView = require("./views/importar/importar.view.js");
var InscricoesView = require("./views/inscricoes/inscricoes.view.js");
var PaginaNaoEncontradaView = require("./views/pagina-nao-encontrada/pagina.view.js");

var sessaoModel = new SessaoModel();

module.exports = Backbone.Router.extend({
	initialize: function() {
		Backbone.history.start();

		Backbone.Validation.configure({
			labelFormatter: "label"
		});
	},
	requerAutenticacao: ["apresentacao", "eventos", "importar", "inscricoes"],
	previneAcessoQuandoAutenticado: ["identificacao", "esqueci-minha-senha"],
	execute: function(callback, args, name) {
		/*
		* Remove os eventos atribuidos anteriormente.
		*/
		if (typeof this.view == "object") {
			this.view.undelegateEvents();
			this.view.stopListening();
		}

		/*
		* Registra a rota no histórico.
		*/
		this.historico = this.historico || [];

		this.historico[this.historico.length] = this._construirUrl(name, args);

		/*
		* Define a rota anterior na sessão.
		*/
		sessaoModel.set("rotaAnterior",
			this.historico.length > 1 ? this.historico[this.historico.length - 2] : this.historico[0]);

		/*
		* Define a rota atual na sessão.
		*/
		sessaoModel.set("rotaAtual",this._construirUrl(name, args));

		/*
		* Realiza a renovação da autenticação caso token não esteja vazio.
		*/
		if (sessaoModel.get("token")) {
			Commons.mostrarCarregando();

			sessaoModel.renovarAutenticacao(_.bind(this._execute, this, callback, args, name));
		} else {
			this._execute(callback, args, name);
		}
	},
	_execute: function(callback, args, name) {
		/*
		* Realiza a lógica de autorização.
		*/
		var isAutenticado = sessaoModel.get("autenticado");
		var necessitaAutenticacao = _.contains(this.requerAutenticacao, name);
		var cancelaAcesso = _.contains(this.previneAcessoQuandoAutenticado, name);

		if (necessitaAutenticacao && !isAutenticado) {
			sessaoModel.set("redirecionamento", this._construirUrl(name, args));

			this.navigate("#/identificacao", {trigger: true});

			return false;
		} else if (isAutenticado && cancelaAcesso) {
			this.navigate("#/apresentacao", {trigger: true});

			return false;
		}

		/*
		* Reneriza o template que representa a aplicação no momento.
		*/
		this.appView = this.appView || new AppView();

		this.appView.render(isAutenticado);

		if (callback) {
			callback.apply(this, args);
		}
	},
	_construirUrl: function(name, args) {
		var url = name;

		if (_.isArray(args)) {
			for (i = 0; i < args.length; i++) {
				if (args[i]) {
					url += "/" + args[i];
				}
			}
		}

		return url;
	},
  routes: {
	"": "apresentacao",
	"identificacao": "identificacao",
	"esqueci-minha-senha": "esqueci-minha-senha",
	"apresentacao": "apresentacao",
	"eventos(/:acao)(/:id)": "eventos",
	"importar(/eventos/:id)": "importar",
	"inscricoes/eventos/:id": "inscricoes",
	"*path": "pagina-nao-encontrada"
	},
		"identificacao": function() {
		this.view = new IdentificacaoView();

		this.view.render();
	},
		"esqueci-minha-senha": function() {
		this.view = new EsqueciMinhaSenhaView();

		this.view.render();
	},
	"apresentacao": function() {
		this.view = new ApresentacaoView();
	},
	"eventos": function(acao, id) {
		switch (acao) {
			case "novo":
				this.view = new EventosNovoView();

				break;
			case "editar":
				this.view = new EventosEditarView({id: id});

				break;
			default:
				this.view = new EventosView();

				break;
		}
	},
	"importar": function(id) {
		this.view = new ImportarView({
			id: id
		});
	},
	"inscricoes": function(id) {
		this.view = new InscricoesView({
			id: id
		});
	},
	"pagina-nao-encontrada": function() {
		this.view = new PaginaNaoEncontradaView();
	},
});
