const HttpController = require('./HttpController');

class LoginController extends HttpController {
  //sobescreve o método da classe base
  routesConfig(baseUrl) {
    //define a rota e o manipulador da classe login
    this.express.post(`${baseUrl}/login`, (req, res) => {
      this.login(req, res);
    });
  }

  login(req, res) {
    //devolve a resposta mockada do login em formato json
    res.json({
      token: 'token gerado pela APi'
    });
  }
}

module.exports = LoginController;