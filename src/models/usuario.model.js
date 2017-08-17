var Commons = require("../commons.js");
var DefaultModel = require("./default.model.js");

module.exports = DefaultModel.extend({
	urlRoot: Commons.contextoSistema + "/rs/usuarios",
	validation: {
		nome: {
			required: true,
			maxLength: 45
		},
		email: {
			pattern: 'email'
		},
		senha: {
			required: true,
			maxLength: 45
		},
		tipo: {
			required: true
		}
	}
});
