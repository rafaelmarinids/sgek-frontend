var Commons = require("../commons.js");
var DefaultCollection = require("./default.collection.js");
var ColunaModel = require("../models/coluna.model.js");

module.exports = DefaultCollection.extend({
	model: ColunaModel,
	url: Commons.contextoSistema + "/rs/colunas"
});
