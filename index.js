const { response } = require('express');
const express = require('express');
const{ v4: uuidv4 } = require('uuid');

const port = 3333;
const app = express();

app.use(express.json());

const customers = [];

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
})

app.get('/statement', (req, res) => { 
  const { cpf } = req.headers; // antes usava-se req.params, mas agora usa-se headers por conta do uso de tokens dessa msm forma.

  const customer = customers.find((customer) => customer.cpf === cpf);

  if(!customer) {
    return res.status(400).json({ error: 'Customer not found' });
  }

  return res.json(customer.statement);
});

app.listen(port)