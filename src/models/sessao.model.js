require("JSON2");
require("jstorage");
var Commons = require("../commons.js");

module.exports = Backbone.Model.extend({
	urlRoot: Commons.contextoSistema + "/rs/autenticacao",
	autenticar: function(email, senha, callback) {
		this.fetch({
  			type: "POST",
  			data: {
    			email: email,
    			senha: senha
    		},
  			success: function(model, response, options) {
  				if (callback) {
  					callback();
  				}
  			}
		});
	},
	renovarAutenticacao: function(callback) {
		var sessaoModel = this;

		$.ajax({
			method: "GET",
			url: Commons.contextoSistema + "/rs/renovar-autenticacao",
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", "Bearer " + sessaoModel.get("token"));
			},
			success: function(data, textStatus, jqXHR) {
			  sessaoModel.set("token", jqXHR.getResponseHeader("Authorization").replace("Bearer ", ""));
			},
			error: function(jqXHR, textStatus, errorThrown) {
				sessaoModel._erroCustomizado(jqXHR.status, jqXHR.responseText);
			},
			complete: function() {
				if (callback) {
					callback();
				}
			}
		});
	},
	recuperarSenha: function(email, callback) {
		var sessaoModel = this;

		$.ajax({
			method: "POST",
			url: Commons.contextoSistema + "/rs/recuperar-senha?XDEBUG_SESSION_START=netbeans-xdebug",
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", "Bearer " + sessaoModel.get("token"));
			},
			data: {
				email: email
  		},
    	success: function(data, textStatus, jqXHR) {
    		if (callback) {
    			callback(data);
    		}
    	},
    	error: function(jqXHR, textStatus, errorThrown) {
    		sessaoModel._erroCustomizado(jqXHR.status, jqXHR.responseText, function() {
    			Backbone.history.navigate("#/esqueci-minha-senha", {trigger : true});
    		});
    	}
		});
	},
	sair: function(callback) {
		this.clear();

		if (callback) {
			callback();
		}
	},
	getNomeUsuario: function() {
		if (this.get("nomeUsuario")) {
			return this.get("nomeUsuario").split(" ")[0];
		}

		return "usuário";
	},
	getMensagem: function() {
		var mensagem;

		if (this.get("mensagem")) {
			mensagem = this.get("mensagem");

			this.unset("mensagem");
		}

		return mensagem;
	},
	get: function(key) {
		return $.jStorage.get(key);
	},
	set: function(key, value) {
		if (_.isObject(key)) {
			for (var index in key) {
				$.jStorage.set(index, key[index]);
			}
		} else {
			$.jStorage.set(key, value);
		}

		return this;
	},
	unset: function(key) {
		$.jStorage.deleteKey(key);

		return this;
	},
	clear: function() {
		var indexes = $.jStorage.index();

		for (i = 0; i < indexes.length; i++) {
		    this.unset(indexes[i]);
		}

		return this;
	},
	listenKeyChange: function(key, callback) {
		$.jStorage.listenKeyChange(key, callback);
	},
	fetch: function(options) {
		var sessaoModel = this;

		var opts = {
			beforeSend: function(request) {
				/*
				 * Configura a token para ser enviado com a requisição.
				 */
				request.setRequestHeader("Authorization", "Bearer " + sessaoModel.get("token"));
			},
			error: function(model, response, options) {
				sessaoModel._erroCustomizado(response.status, response.responseText);
  		}
		};

		(_.bind(Backbone.Model.prototype.fetch, this, _.extend({}, opts, options)))();
	},
	_erroCustomizado: function(codigoStatus, textoResposta, callback) {
		var sessaoModel = this;

		Commons.esconderCarregando();

		if (codigoStatus == 500 || codigoStatus == 405) { // 400 -> BAD REQUEST | 405 -> METHOD NOT ALLOWED
			if (textoResposta) {
				console.log(textoResposta);
			}

			Commons.mostrarPopup({
				titulo: "Erro",
				corpo: '<div class="alert alert-danger" role="alert">' + textoResposta + '</div>'
			});
		} else if (codigoStatus == 401) { // 401 -> UNAUTHORIZED
			sessaoModel.sair(function() {
				sessaoModel.set({
					mensagem: "Sua sessão expirou, por favor identifique-se novamente.",
					autenticado: false,
					redirecionamento: Backbone.history.getFragment(),
				});

				if (callback) {
					callback();
				}
			});
		} else if (codigoStatus == 0 || codigoStatus == 404) { // 0 -> ERROR CONNECTION REFUSED
			Commons.mostrarPopup({
				titulo: "Erro",
				corpo: '<div class="alert alert-danger" role="alert">Não foi possível conectar-se ao servidor, verifique sua conexão com a internet e tente novamente em alguns minutos.</div>',
				fechar: false,
				botoes: [{
				id: "okBtn",
				texto: "Ok",
				icone: "ok",
							fechar: true,
				onclick: _.bind(function() {
					Commons.mostrarCarregando();

					sessaoModel.sair(function() {
						sessaoModel.set({
						autenticado: false,
						redirecionamento: Backbone.history.getFragment()
						});

						Backbone.history.navigate("#/identificacao", {trigger : true});
					});
				}, this)
				}]
			});
		} else {
			Commons.mostrarPopup({
				titulo: "Erro",
				corpo: '<div class="alert alert-danger" role="alert">Um erro inesperado ocorreu, por favor tente novamente mais tarde.</div>'
			});
		}
	}
});
