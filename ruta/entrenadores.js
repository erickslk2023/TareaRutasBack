const express = require('express');
const entrenadores = express();
const db = require('../dataBase/conn');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

entrenadores.get('',  async (req, res)=>{

    let sql = `select id , nombre, equipo, datos, encode(foto, 'base64') foto from tbl_entrenadores order by id asc`;
    const result = await db.query(sql);
    res.json(result);

});

entrenadores.post('',  upload.single('foto')  , async (req, res)=>{


    if ( !req.file ){
        return res.status(500).json( {error:'Debes enviar un archivo'} );
    }


    const { nombre,equipo, datos} = req.body; 
    const valores = [nombre, equipo, datos, req.file.buffer];


    let sql = ` insert into tbl_entrenadores
                (nombre, equipo, datos, foto)
                values 
                ( $1,$2,$3,$4) returning * `;

    db.one(sql , valores)
        .then( data =>{

            let objetoCreado = { 
                                id : data.id,
                                nombre : data.nombre,
                                equipo : data.equipo,
                                datos : data.datos
                             
                            };
            res.json(objetoCreado);

        })
        .catch( error=>{
            res.status(500).json(error);
        })

})

module.exports = entrenadores;