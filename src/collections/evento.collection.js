var Commons = require("../commons.js");
var DefaultCollection = require("./default.collection.js");
var EventoModel = require("../models/evento.model.js");

module.exports = DefaultCollection.extend({
	model: EventoModel,
	url: Commons.contextoSistema + "/rs/eventos" + Commons.xdebug
});
