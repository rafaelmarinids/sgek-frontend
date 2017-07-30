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
    if (!this.modalView || (this.modalView && !this.modalView.isAberto())) {
      this.modalView = new ModalView(opcoes);

      this.modalView.render();
    }
  },
  fecharPopup: function() {
    if (this.modalView) {
      this.modalView.fechar();

      this.modalView = null;
    }
  },
  getDescricaoMes: function(mes) {
    switch (mes) {
      case 1:
        return "janeiro";
      case 2:
        return "fevereiro";
      case 3:
        return "Março";
      case 4:
        return "abril";
      case 5:
        return "maio";
      case 6:
        return "junho";
      case 7:
        return "julho";
      case 8:
        return "agost";
      case 9:
        return "setembro";
      case 10:
        return "outubro";
      case 11:
        return "novembro";
      case 12:
        return "dezembro";
    }
  },
  getDescricaoDia: function(dia) {
    switch (dia) {
      case 1:
        return "segunda";
      case 2:
        return "terça";
      case 3:
        return "quarta";
      case 4:
        return "quinta";
      case 5:
        return "sexta";
      case 6:
        return "sábado";
      case 0:
        return "domingo";
    }
  }
}
