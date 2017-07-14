var ModalView = require("./views/modal/modal.view.js");
var ModalCarregandoView = require("./views/modal-carregando/modal-carregando.view.js");

module.exports = {
  // Constantes
  contextoSistema: "http://sgek",
  //xdebug: "?XDEBUG_SESSION_START=atom-xdebug",/*
  xdebug: "",/**/

  // Funções
  validarEmail: function(email) {
    var usuario = email.substring(0, email.indexOf("@"));

  	var dominio = email.substring(email.indexOf("@") + 1, email.length);

  	if ((usuario.length >= 1) && (dominio.length >= 3)
      && (usuario.search("@") == -1) && (dominio.search("@") == -1)
      && (usuario.search(" ") == -1) && (dominio.search(" ") == -1)
      && (dominio.search(".") != -1) && (dominio.indexOf(".") >= 1)
      && (dominio.lastIndexOf(".") < dominio.length - 1)) {
  		return true;
  	} else {
  		return false;
  	}
  },
  mostrarCarregando: function() {
    if (!this.modalCarregandoView || (this.modalCarregandoView && !this.modalCarregandoView.isAberto())) {
      this.modalCarregandoView = new ModalCarregandoView();

      this.modalCarregandoView.render();
    }
  },
  esconderCarregando: function() {
    if (this.modalCarregandoView) {
      this.modalCarregandoView.fechar();

      this.modalCarregandoView = null;
    }
  },
  mostrarPopup: function(opcoes) {
    var modalView = new ModalView(opcoes);

    modalView.render();
  }
}
