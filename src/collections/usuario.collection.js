var Commons = require("../commons.js");
var DefaultCollection = require("./default.collection.js");
var UsuarioModel = require("../models/usuario.model.js");

module.exports = DefaultCollection.extend({
	model: UsuarioModel,
	url: Commons.contextoSistema + "/rs/usuarios"
});
