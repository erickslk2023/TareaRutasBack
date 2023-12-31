const express = require('express');
const estadios = express();
const db = require('../dataBase/conn');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

estadios.get('',  async (req, res)=>{

    let sql = `select id , nombre, aforo, encode(foto, 'base64') foto from tbl_estadios order by id asc`;
    const result = await db.query(sql);
    res.json(result);

});

estadios.post('',  upload.single('foto')  , async (req, res)=>{


    if ( !req.file ){
        return res.status(500).json( {error:'Debes enviar un archivo'} );
    }


    const { nombre, aforo} = req.body; 
    const valores = [ nombre, aforo, req.file.buffer];


    let sql = ` insert into tbl_estadios
                (nombre, aforo, foto)
                values  
                ($1,$2,$3) returning * `;

    db.one(sql , valores)
        .then( data =>{

            let objetoCreado = { 
                                id : data.id,
                                nombre : data.nombre,
                                aforo : data.aforo
                             
                            };
            res.json(objetoCreado);

        })
        .catch( error=>{
            res.status(500).json(error);
        })

})

module.exports = estadios;