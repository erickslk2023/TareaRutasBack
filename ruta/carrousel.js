const express = require('express');
const carrousel = express();
const db = require('../dataBase/conn');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

carrousel.get('',  async (req, res)=>{

    let sql = `select id , nombre, encode(imagen, 'base64') imagen from tbl_carrusel order by id asc`;
    const result = await db.query(sql);
    res.json(result);

});

carrousel.post('',  upload.single('imagen')  , async (req, res)=>{


    if ( !req.file ){
        return res.status(500).json( {error:'Debes enviar un archivo'} );
    }


    const { nombre} = req.body; 
    const valores = [ nombre, req.file.buffer];


    let sql = ` insert into tbl_carrusel
                (nombre, imagen)
                values 
                ( $1,$2) returning * `;

    db.one(sql , valores)
        .then( data =>{

            let objetoCreado = { 
                                id : data.id,
                                nombre : data.nombre
                             
                            };
            res.json(objetoCreado);

        })
        .catch( error=>{
            res.status(500).json(error);
        })

})

module.exports = carrousel;