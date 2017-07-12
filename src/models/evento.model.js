var Commons = require("../commons.js");
var DefaultModel = require("./default.model.js");

module.exports = DefaultModel.extend({
	urlRoot: Commons.contextoSistema + "/rs/eventos" + Commons.xdebug
});
