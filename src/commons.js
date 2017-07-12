var Modal = require("./views/modal/modal.view.js");

module.exports = {
  // Constantes
  contextoSistema: "http://sgek",
  xdebug: "?XDEBUG_SESSION_START=atom-xdebug",/*
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
    if (!this.modalCarregando || (this.modalCarregando && !this.modalCarregando.isAberto())) {
      this.modalCarregando = new Modal({
        titulo: "Carregando, aguarde...",
        corpo: '<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>',
        tamanho: "modal-sm",
        botoes: false
      });

      this.modalCarregando.render();
    }
  },
  esconderCarregando: function() {
    if (this.modalCarregando) {
      this.modalCarregando.fechar();

      this.modalCarregando = null;
    }
  },
  mostrarPopup: function(opcoes) {
    var modal = new Modal(opcoes);

    modal.render();
  }
}
