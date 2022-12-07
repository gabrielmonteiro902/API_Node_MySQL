const express = require("express");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const user = require('./models/user');
const app = express();


app.use(express.json());

app.get("/users", async(req, res) => {

    await user.findAll({
            attributes: [
                'id', 'name', 'email', 'password'
            ],

            order: [
                ['id', 'DESC']
            ]
        })
        .then((users) => {
            return res.json({
                erro: false,
                users
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                messenger: "Nenhum usuario encontrado"
            });
        })
});

app.get("/user/:id", async(req, res) => {
    const { id } = req.params;

    // await usuario.findAll({
    //     where: {
    //         id: id
    //     }

    // })
    await user.findByPk(id)
        .then((user) => {
            return res.json({
                erro: false,
                user: user
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Nenhum usuario encontrado"
            })
        });

});

app.post("/user", async(req, res) => {
    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8)

    await user.create(dados).
    then(() => {
        return res.json({
            erro: false,
            messenger: "Usuario cadastrado com sucesso"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            messenger: "Usuario não cadastrado"
        });
    });
})



app.put("/user-senha", async(req, res) => {
    const { id, password } = req.body;

    var senhaCrypt = await bcrypt.hash(password, 8);

    await user.update({ password: senhaCrypt }, { where: { id } })
        .then(() => {
            return res.json({
                erro: false,
                messenger: "Senha editado com sucesso"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                messenger: "Senha não editada"
            });
        })

});

app.delete("/user/:id", async(req, res) => {
    const { id } = req.params;

    await user.destroy({
            where: { id }
        })
        .then(() => {
            return res.json({
                erro: false,
                menssenger: "Usuario deletado com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                messenger: "Usuario não deletado"
            });
        })


});

app.post('/login', async(req, res) => {
    const users = await user.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
            email: req.body.email
        }
    });
    if (users === null) {
        return res.status(400).json({
            erro: true,
            messenger: "Senha ou e-mail, não encontrado"
        });
    }

    if (!(await bcrypt.compare(req.body.password, users.password))) {
        return res.status(400).json({
            erro: true,
            messenger: "Senha inválida"
        });
    };

    var token = jwt.sign({ id: users.password }, '2b-3>r,=', {
        expiresIn: '7d'
    });

    return res.json({
        erro: false,
        messenger: "Login realizado com sucesso",
        token
    })
});

/*validar token */
async function vt(req, res, next) {
    return res.json({ messenger: "Valida token" });
}

app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000: http://localhost:3000");
});