var Commons = require("../commons.js");
var DefaultModel = require("./default.model.js");
var InscricaoCollection = require("../collections/inscricao.collection.js");

module.exports = DefaultModel.extend({
	urlRoot: Commons.contextoSistema + "/rs/inscricoes",
	defaults:{
		"inscricoesCollection": new InscricaoCollection()
	},
	parse: function(response, options) {
		if (_.isObject(response)) {
			if (_.has(response, "inscricoes") && _.isArray(response.inscricoes)) {
				this.get("inscricoesCollection").set(response.inscricoes);
			}
		}
		
		return response;
	}
});
