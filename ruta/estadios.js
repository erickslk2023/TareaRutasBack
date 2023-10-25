const express = require('express');
const estadios = express();
const db = require('../dataBase/conn');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

estadios.get('',  async (req, res)=>{

    let sql = `select id , equipo, encode(imagen, 'base64') imagen from tbl_champion order by id asc`;
    const result = await db.query(sql);
    res.json(result);

});

estadios.post('',  upload.single('imagen')  , async (req, res)=>{


    if ( !req.file ){
        return res.status(500).json( {error:'Debes enviar un archivo'} );
    }


    const { equipo} = req.body; 
    const valores = [ equipo, req.file.buffer];


    let sql = ` insert into tbl_champion
                (equipo, imagen)
                values 
                ( $1,$2) returning * `;

    db.one(sql , valores)
        .then( data =>{

            let objetoCreado = { 
                                id : data.id,
                                equipo : data.equipo
                             
                            };
            res.json(objetoCreado);

        })
        .catch( error=>{
            res.status(500).json(error);
        })

})

module.exports = champion;