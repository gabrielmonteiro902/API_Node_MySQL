const Sequelize = require('sequelize');

const sequelize = new Sequelize('api', 'root', 'zxcasdqwe123', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().
then(() => {
    console.log("Conexão com o DB realizada com sucesso")
}).catch(() => {
    console.log("Erro: Conexão com o DB falhou")
})

module.exports = sequelize;