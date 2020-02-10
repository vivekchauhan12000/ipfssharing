const ipfsClient = require('ipfs-http-client');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs=require('fs');

const ipfs= new ipfsClient({host:'localhost',port:'5001',protocol:'http'});
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

app.get('/',(req,res)=>{
  res.render('home');
});

app.post('/upload',(req,res)=>{
  const file = req.files.file;
  const fileName = req.body.fileName;
  const filePath = 'files/'+ fileName;
  
  file.mv(filePath, async(err)=>{
    if(err){
      Console.log('Error:failed to download the file');
      return res.status(500).send(err);
    } 
    const fileHash =await addFile(fileName,filePath);
    fs.unlink(filePath ,(err)=>{
      if (err) Console.log(err);
    });
    res.render('upload',{ fileName,fileHash });
  });
});

const addFile=async(fileName,filePath)=>{
  const file=fs.readFileSync(filePath);
  const fileAdded=await ipfs.add({path:fileName,content:file});
  const fileHash=fileAdded[0].hash;

  return fileHash;
};

app.listen(3000,()=>{
  Console.log('server is listening on port 3000');
});
