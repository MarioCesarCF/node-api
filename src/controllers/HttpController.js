const AppConstants = require("../enum/AppConstants");

class HttpController {
  constructor(instanciaExpress) {
    if(!instanciaExpress) {
      throw new Error('Express instance is mandatory.')
    }

    //persiste a propriedade express do controller a inscantica do express criada no App.js
    this.express = instanciaExpress;
    this.routesConfig(AppConstants.BASE_API_URL);
  }

  //ao chamar este método faz uma verificação se a classe filha tem o metodo configurar rotas atribuição, ela precisa se nao da erro.
  routesConfig(baseUrl) {
    throw new Error('The routesConfig method needs assignment.');
  }
}

module.exports = HttpController;