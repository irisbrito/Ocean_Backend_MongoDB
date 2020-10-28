const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;


(async () => {

const connectionString = 'mongodb://localhost:27017';

console.info("Conectando ao banco de dados MongoDB");

const options = {
    useUnifiedTopology: true
};

const client = await mongodb.MongoClient.connect(connectionString, options);

console.info("MongoDB conectado com sucesso!")

const app = express();

const port = 3000;

// Precisamos avisar o Express para utilizar o body-parser
// Assim, ele saberá como transformar as informações no BODY da requisição
//      em informação útil para a programação

app.use(bodyParser.json());


/*
URL -> http://localhost:3000
Endpoint ou Rota -> [GET] /mensagem
Endpoint ou Rota -> [POST] /mensagem
*/

//teste 
app.get('/', function (req, res) {
  res.send('Hello World');
});

// criando o banco de dados
const db = client.db('ocean_backend_27_10_2020');
//conexão com as connections
const mensagens = db.collection('mensagens');


/*const mensagens = [
    {
        id: 1,
        texto: 'Essa é uma mensagem'
    },
    {
        id: 2,
        texto: 'Essa é outra mensagem'
    }
];*/

// Read All - GET -  ler todas as mensagens
app.get('/mensagem', async function (req, res) {
    const findResult = await mensagens.find({}).toArray(); // promise - o findResult vai ser uma lista
    res.send(findResult); // vai exibir o resultado da busca (as mensagenss) 
});

// Create - POST - criar uma mensagem
app.post('/mensagem', async function (req, res) {
    const texto = req.body.texto;

    const mensagem = {
       // 'id': mensagens.length + 1, (o mongoDB que vai criar)
        'texto': texto
    };

    const resultado = await mensagens.insertOne(mensagem);

    const objetoInserido = resultado.ops[0];

    //mensagens.push(mensagem);

    res.send(objetoInserido);
});

// Read Single - GET - retornar uma única mensagem
app.get('/mensagem/:id', async function (req, res) {
    const id = req.params.id;

    const mensagem = await mensagens.findOne({ _id: mongodb.ObjectId(id)});

    res.send(mensagem);
});

// Update - PUT - Atualizar uma mensagem
app.put('/mensagem/:id', async function (req, res) {
    const id = req.params.id;
    const texto = req.body.texto;

    const mensagem = {
        _id: ObjectId(id),
        texto
    };

    await mensagens.updateOne(
        { _id: ObjectId(id)},
        { $set: mensagem }
    )

   // mensagens[id - 1].texto = texto;

    res.send(mensagem);
});

// Delete - deletar uma mensagem pelo ID
app.delete('/mensagem/:id', function (req, res) {
    const id = req.params.id;

    mensagens.deleteOne({ _id: ObjectId(id) } );

    //delete mensagens[id - 1];

    res.send(`A mensagem de ID ${id} foi removida com sucesso.`);
});

app.listen(port, function () {
    console.info('App rodando em http://localhost:' + port);
});

})(); //async - tudo que estiver aqui dentro tá dentro de uma função assíncrona