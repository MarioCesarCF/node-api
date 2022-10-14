const HttpController = require('./HttpController');

class LoginController extends HttpController {
  //sobescreve o método da classe base
  routesConfig(baseUrl) {
    //define a rota e o manipulador da classe login
    //esse metodo bind permite pegar a referência direto do metodo login, então não precisa passar uma callback com req e res como argumentos.
    //passando o método login como referência e informando que o contexto que deve ser usado é da próprio objeto da classe LoginController.
    this.express.post(`${baseUrl}/login`, this.login.bind(this));
  }

  login(req, res) {
    //atribui o corpo da solicitação para a variável body
    const body = req.body;

    //valida se foi passado no body os campos de login e senha
    if(!body || !body.login || !body.password) {
      //retorna um erro para quem chamou a api falando que os parametros estão inválidos
      return res.status(400).json({
        status: 400,
        erro: "Invalid enter parameters"
      });
    }
    //devolve a resposta mockada do login em formato json
    res.json({
      token: 'token gerado pela APi'
    });
  }
}

module.exports = LoginController;