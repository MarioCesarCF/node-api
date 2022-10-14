//busca na raiz do projeto um arquivo .env que carrega as variaveis de ambiente
require('dotenv').config();
const App = require('./src/App');

const app = new App();
app.start();
