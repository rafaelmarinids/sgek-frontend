/*import _ from 'lodash';
import './style.css';
import Icon from './icon.png';
import Template from './template.html';

function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello world with', 'webpack', 'i am so happy'], ' ');
  element.classList.add('hello');

  // Add the image to our existing div.
  var myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

  //element.innerHTML = Template;

  return element;
}

document.body.appendChild(component());

$("div").html(Template);*/

var Router = require("./router.js");

var MainView = Backbone.View.extend({
  className: "sgek-app",
  render: function() {
    $("body").html(this.el);
  }
});

var mainView = new MainView();

mainView.render();

var router = new Router();
