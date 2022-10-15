const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger.json');
const LoginController = require('./controllers/LoginController');
const AppConstants = require('./enum/AppConstants');

class App {
  #controllers;

  start() {
    //configura o express
    this.#expressConfig();
    //carrega os controllers
    this.#loaderControllers();
    //inicia o servidor
    this.#startServer();
  }

  #expressConfig() {
    //antigamente usava como arrow function
    //cria a instancia do express para gerenciar o servidor
    this.express = express();

    //registra os middlewares para fazer a conversão das requisições da API
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.json());

    //configura o swagger da app para servir a documentação
    this.express.use(`${AppConstants.BASE_API_URL}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerFile))

    //registra o middleware para fazer log das requisições
    this.express.use((req, res, next) => {
      console.log(`requisição recebida, url=${req.url}, método http=${req.method}`);
      next();
    })
  }

  #loaderControllers() {
    //atribui para propriedade controllers a lista de controllers disponíveis da aplicação
    this.#controllers = [
      new LoginController(this.express)
    ];
  }

  #startServer() {
    //tenta pegar a porta a partir da variável de ambiente, se não estiver definida usa a porta 3001
    const port = process.env.PORT || 3001;
    this.express.listen(port, () => {
      console.log(`App listening port ${port}`);
    })
  }
}

module.exports = App;