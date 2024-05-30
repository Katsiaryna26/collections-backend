import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import multer from 'multer';//для загрузки файлов
import cors from 'cors';//что бы backend разрешил делать запрос откуда угодно
import { registerValidation, loginValidation, postCreatValidation } from './validations.js';

import {UserController, PostController}  from './controllers/index.js';
import {handleValidationErrors, checkAuth} from './utils/index.js';

const corsOptions = {
    origin: 'https://collections-frontend-eight.vercel.app/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
//подключаемся к БД, если подключились, то BD ok, иначе ('BD error',err)
mongoose
    .connect(process.env.MONGODB_URI)// допишем users и тогда это означает, что мы подключаемся именно к бд users
    .then(()=>console.log('BD ok'))
    .catch((err)=>console.log('BD error',err))

const app = express(); //вся логика экспресса хранится в переменной арр 

const storage = multer.diskStorage({//создаем хранилище для картинок
    destination:(_, __, cb)=>{//создаем функцию колбэк, которая не принимает никаких ошибок и сохраняет на диск uploads
        if (!fs.existsSync('uploads')){
            fs.mkdirSync('uploads');
        }
        cb(null,'uploads')
    },
    filename:(_, file, cb)=>{
        cb(null, file.originalname)// вытаскиваем из файла оригинальное название
    }
});

const upload = multer({storage})

app.use(express.json())//позволит читать файлы json
app.use(cors(corsOptions))
app.use('/uploads',express.static('uploads')) //если придет запрос на uploads, то ищи в папке uploads (static- получение GET запроса на статичный файл)

app.post('/auth/login',  loginValidation, handleValidationErrors, UserController.login); 

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth,upload.single('image'),(req,res)=>{
    res.json({
        url:`/uploads/${req.file.originalname}`
    });
});

app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);//получение всех статей
app.get('/posts/tags', PostController.getLastTags);//получение тэгов
app.get('/posts/:id', PostController.getOn);//получение одной статьи
app.post('/posts', checkAuth, postCreatValidation, handleValidationErrors, PostController.create);// создать статью
app.delete('/posts/:id', checkAuth, PostController.remove);//удалить статью
app.patch('/posts/:id',checkAuth, postCreatValidation, handleValidationErrors, PostController.update);//обновить



//указываем порт на кот. запустится приложение, если ошибка, то вывести ее
app.listen(process.env.PORT || 4444,(err)=>{
    if (err){
        return console.timeLog(err);
        console.log('Server Ok')
    }
});





