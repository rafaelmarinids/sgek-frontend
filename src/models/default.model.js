var Commons = require("../commons.js");
var SessaoModel = require("./sessao.model.js");

var sessaoModel = new SessaoModel();

module.exports = Backbone.Model.extend({
	fetch: function(options) {
		var optionsClone = _.clone(options);

		var opts = {
			beforeSend: function(request) {
				/*
				 * Configura o token para ser enviado com a requisição.
				 */
				request.setRequestHeader("Authorization", "Bearer " + sessaoModel.get("token"));
			},
			error: function(model, response, options) {
				if (_.has(optionsClone && optionsClone, "error")) {
					optionsClone.error(model, response, options);
				} else {
          Commons.esconderCarregando();

    			if (response.status == 500 || response.status == 405) { // 400 -> BAD REQUEST | 405 -> METHOD NOT ALLOWED
    				if (response.responseText) {
    					console.log(response.responseText);
    				}

    				Commons.mostrarPopup({
    					titulo: "Erro",
      				corpo: '<div class="alert alert-danger" role="alert">' + response.responseText + '</div>'
      			});
    			} else if (response.status == 401) { // 401 -> UNAUTHORIZED
    				var urlRedirecionamento = "#/identificacao";

    				sessaoModel.sair(function() {
    					sessaoModel.set({
    						mensagem: response.responseText,
    						autenticado: false,
    						redirecionamento: Backbone.history.getFragment()
    					});

    					Backbone.history.navigate(urlRedirecionamento, {trigger : true});
    				});
    			} else if (response.status == 0 || response.status == 404) { // 0 -> ERROR CONNECTION REFUSED
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
  		},
  		success: function(model, response, options) {
  			/*
				 * Coloca a credencial na Session Storage.
				 */
				if (options.xhr.getResponseHeader("credencial")) {
  				sessaoModel.set("token", options.xhr.getResponseHeader("Authorization").replace("Bearer ", ""));
  			}

  			if (optionsClone && _.has(optionsClone, "success")) {
  				optionsClone.success(model, response, options);
  			}
  		}
		};

		(_.bind(Backbone.Model.prototype.fetch, this, _.extend({}, options, opts)))();
	},
	save: function(attrs, options) {
		var optionsClone = _.clone(options);

		var opts = {
			beforeSend: function(request) {
				/*
				 * Configura o token para ser enviado com a requisição.
				 */
				request.setRequestHeader("Authorization", "Bearer " + sessaoModel.get("token"));
			},
			error: function(model, response, options) {
				debugger;

				if (optionsClone && _.has(optionsClone, "error")) {
					optionsClone.error(model, response, options);
				} else {
					Commons.esconderCarregando();

          if (response.status == 500 || response.status == 405) { // 400 -> BAD REQUEST | 405 -> METHOD NOT ALLOWED
    				if (response.responseText) {
    					console.log(response.responseText);
    				}

    				Commons.mostrarPopup({
    					titulo: "Erro",
      				corpo: '<div class="alert alert-danger" role="alert">' + response.responseText + '</div>'
      			});
    			} else if (response.status == 401) { // 401 -> UNAUTHORIZED
    				var urlRedirecionamento = "#/identificacao";

    				sessaoModel.sair(function() {
    					sessaoModel.set({
    						mensagem: response.responseText,
    						autenticado: false,
    						redirecionamento: Backbone.history.getFragment()
    					});

    					Backbone.history.navigate(urlRedirecionamento, {trigger : true});
    				});
    			} else if (response.status == 0 || response.status == 404) { // 0 -> ERROR CONNECTION REFUSED
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
  		},
  		success: function(model, response, options) {
  			/*
			 * Coloca a credencial na Session Storage.
			 */
  			if (options.xhr.getResponseHeader("credencial")) {
  				sessaoModel.set("token", options.xhr.getResponseHeader("Authorization").replace("Bearer ", ""));
  			}

  			if (optionsClone && _.has(optionsClone, "success")) {
  				optionsClone.success(model, response, options);
  			}
  		}
		};

		(_.bind(Backbone.Model.prototype.save, this, attrs, _.extend({}, options, opts)))();
	},
	destroy: function(options) {
		var optionsClone = _.clone(options);

		var opts = {
			beforeSend: function(request) {
				/*
				 * Configura o token para ser enviado com a requisição.
				 */
				request.setRequestHeader("Authorization", "Bearer " + sessaoModel.get("token"));
			},
			error: function(model, response, options) {
				if (_.has(optionsClone && optionsClone, "error")) {
					optionsClone.error(model, response, options);
				} else {
					Commons.esconderCarregando();

          if (response.status == 500 || response.status == 405) { // 400 -> BAD REQUEST | 405 -> METHOD NOT ALLOWED
    				if (response.responseText) {
    					console.log(response.responseText);
    				}

    				Commons.mostrarPopup({
    					titulo: "Erro",
      				corpo: '<div class="alert alert-danger" role="alert">' + response.responseText + '</div>'
      			});
    			} else if (response.status == 401) { // 401 -> UNAUTHORIZED
    				var urlRedirecionamento = "#/identificacao";

    				sessaoModel.sair(function() {
    					sessaoModel.set({
    						mensagem: response.responseText,
    						autenticado: false,
    						redirecionamento: Backbone.history.getFragment()
    					});

    					Backbone.history.navigate(urlRedirecionamento, {trigger : true});
    				});
    			} else if (response.status == 0 || response.status == 404) { // 0 -> ERROR CONNECTION REFUSED
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
  		},
  		success: function(model, response, options) {
  			/*
			 * Coloca a credencial na Session Storage.
			 */
  			if (options.xhr.getResponseHeader("credencial")) {
  				sessaoModel.set("token", options.xhr.getResponseHeader("Authorization").replace("Bearer ", ""));
  			}

  			if (optionsClone && _.has(optionsClone, "success")) {
  				optionsClone.success(model, response, options);
  			}
  		}
		};

		(_.bind(Backbone.Model.prototype.destroy, this, _.extend({}, options, opts)))();
	}
});
