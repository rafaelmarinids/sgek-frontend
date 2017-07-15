var Commons = require("../commons.js");
var DefaultModel = require("./default.model.js");

module.exports = DefaultModel.extend({
	urlRoot: Commons.contextoSistema + "/rs/eventos",
	validation: {
		titulo: {
			required: true
		},
		logomarca: function(value, attr, computedState) {
			// 1 Mb
			if (value && value.size && value.size > 1048576) {
				return "O tamanho do arquivo da logomarca não pode ser superior a 1 Mb.";
			}
		},
		planodefundo: function(value, attr, computedState) {			
			// 1 Mb
			if (value && value.size && value.size > 1048576) {
				return "O tamanho do arquivo de plano de fundo não pode ser superior a 1 Mb.";
			}
		}
	},
	labels: {
		titulo: "Título"
	},
	sync: function(method, model, options) {
		// Post data as FormData object on create to allow file upload
		if (method == "create" || method == "update") {
			var formData = new FormData();
			
			// Loop over model attributes and append to formData
			_.each(model.attributes, function(value, key) {
				formData.append(key, value);
			});
			
			// Set processData and contentType to false so data is sent as FormData
			_.defaults(options || (options = {}), {
				data: formData,
				processData: false,
				contentType: false, 
				xhr: function() {
					// get the native XmlHttpRequest object
					var xhr = $.ajaxSettings.xhr();
					
					// set the onprogress event handler
					xhr.upload.onprogress = function(event) {
						if (event.lengthComputable) {
							//console.log('%d%', (event.loaded / event.total) * 100);
							
							// Trigger progress event on model for view updates
							model.trigger("progress", Math.floor((event.loaded / event.total) * 100));
						}
					};
					
					// set the onload event handler
					xhr.upload.onload = function() {
						//console.log('complete');
						
						model.trigger("progress", 100);
					};
					
					// return the customized object
					return xhr;
				}
			});
		}
		
		return Backbone.sync.call(this, method, model, options);
	}
});
