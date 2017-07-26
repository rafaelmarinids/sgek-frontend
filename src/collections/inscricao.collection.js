var Commons = require("../commons.js");
var DefaultCollection = require("./default.collection.js");
var InscricaoModel = require("../models/inscricao.model.js");

module.exports = DefaultCollection.extend({
	model: InscricaoModel,
	url: Commons.contextoSistema + "/rs/inscricoes"
});
