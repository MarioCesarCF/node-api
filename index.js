const { response, application } = require('express');
const express = require('express');
const{ v4: uuidv4 } = require('uuid');

const port = 3333;
const app = express();

app.use(express.json());

const customers = [];

function verifyExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers; // antes usava-se req.params, mas agora usa-se headers por conta do uso de tokens dessa msm forma.

  const customer = customers.find((customer) => customer.cpf === cpf);

  if(!customer) {
    return res.status(400).json({ error: 'Customer not found' });
  }

  req.customer = customer;

  return next();
}

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if(operation.type === 'credit') {
      //operation.type vefirica o tipo de operação informada no statement e faz a soma (credit) ou a subtração (debit)
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
}

app.post('/account', (req, res) => {
  const { cpf, name } = req.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );
  
  if(customerAlreadyExists) {
    return res.status(400).json({error: 'Customer already exists'});
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return res.status(201).send();
});

app.get('/statement', verifyExistsAccountCPF, (req, res) => { 
  const { customer } = req; //recebe direto do request o customer atribuido no middleware

  return res.json(customer.statement);
});

app.post("/deposit", verifyExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;

  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    create_at: new Date(), //data de realização do depósito
    type: 'credit',  //tipo de operação
  }

  customer.statement.push(statementOperation); //o array statement que estava vazio recebe o objeto statementOperation com as informações sobre a operação

  return res.status(201).send();
});

app.post("/withdraw", verifyExistsAccountCPF, (req, res) => {
  const { amount } = req.body;
  const { customer } = req;

  const balance = getBalance(customer.statement);

  if(balance < amount) {
    return res.status(400).json({ error: 'Insuficient funds!'})
  }

  const statementOperation = {   
    amount,
    create_at: new Date(), //data de realização do saque
    type: 'debit',  //tipo de operação
  };

  customer.statement.push(statementOperation);

  return res.status(201).send();
});

app.get('/statement/date', verifyExistsAccountCPF, (req, res) => { 
  const { customer } = req; //recebe direto do request o customer atribuido no middleware
  const { date } = req.query; //recebe a data passada na query, não sei como passar isso em uma aplicação funcional. E o formato deve ser AAAA-MM-DD

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter((statement) => {
    statement.create_at === dateFormat.toDateString() //serve para transformar a data em formato DD/MM/AAAA, ou melhor, tentou mas nao deu kkkkkk
  })

  return res.json(statement);
});

app.put('/account', verifyExistsAccountCPF, (req, res) => {
  const { name } = req.body;
  const { customer } = req;

  customer.name = name;

  return res.status(201).send();
});

app.get('/account', verifyExistsAccountCPF, (req, res) => {
  const { customer } = req;

  return res.json(customer);
});

app.delete('/account', verifyExistsAccountCPF, (req, res) => {
  const { customer } = req;

  const indexCustomer = customers.findIndex(customerIndex => customerIndex.cpf === customer.cpf)

  customers.splice(indexCustomer, 1);

  return res.status(200).json(customers);
});

app.get('/balance', verifyExistsAccountCPF, (req, res) => {
  const { customer } = req;

  const balance = getBalance(customer.statement);

  return res.json(balance);
});

app.listen(port)