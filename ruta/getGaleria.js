const express = require('express');
const app = express();
const db = require('../dataBase/conn');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

app.get('',  async (req, res)=>{

    let sql = `select id , equipo,talla,  encode(foto, 'base64') foto from tbl_camisas order by id asc`;
    const result = await db.query(sql);
    res.json(result);

});

app.post('',  upload.single('foto')  , async (req, res)=>{


    if ( !req.file ){
        return res.status(500).json( {error:'Debes enviar un archivo'} );
    }

    const { equipo, talla } = req.body; 

    const valores = [equipo, talla, req.file.buffer];


    let sql = ` insert into tbl_camisas
                ( equipo, talla,foto)
                values 
                ( $1, $2 ,$3) returning * `;

    db.one(sql , valores)
        .then( data =>{

            let objetoCreado = { 
                                id : data.id_producto, 
                                equipo : data.equipo, 
                                talla: talla,
                                
                            };
            res.json(objetoCreado);

        })
        .catch( error=>{
            res.status(500).json(error);
        })

})

module.exports = app;