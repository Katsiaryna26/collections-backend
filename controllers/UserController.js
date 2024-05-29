import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'//с помощью этой библиотеки зашифруем пароль
import { validationResult } from 'express-validator';//проверяет есть ли ошибки
import UserModel from '../models/User.js'

export const register = async (req,res)=>{
    try{
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);// алгоритм шифрования
        const hash = await bcrypt.hash(password,salt);//шифруем пароль, передав открытый пароль и алгоритм шифрования
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        });
    
        const user = await doc.save();//наш документ с пользователей сохраняем в БД
    //создаем токен, зная _id ключом 'secret123', он будет жить 30 дней
        const token = jwt.sign({
            _id:user._id,
        }, 'secret123',{
            expiresIn: '30d'
        },
    );
  //возврощаем пользователя и токен  
    const {passwordHash, ...userData} = user._doc;//passwordHash, ...userData - вытаскиваем дестроктуризацией passwordHash из ...userData, user._doc информация из документа только 

        res.json({
            ...userData,
            token})
    } catch(err){
        console.log(err);
        res.status(500).json({
            message:'Не удалось зарегистрироваться'
        });
    }
};

export const login = async(req, res)=>{
    try {
     const user = await UserModel.findOne({email:req.body.email});//найти пользователя по email
     if (!user){//если такого email в бд нет, то
         return res.status(400).json({
             message:'Пользователь не найден',
         })
     } 
     const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)//сравни 2 пароля в теле запроса и в документе
     if (!isValidPass){
         return res.status(400).json({
             message:'Неверный логин или пароль',
         })
     }
     //генерирует токен и передаем информацию, которую шифруем с помощью какого-то ключа
     const token = jwt.sign({
         _id:user._id,
     }, 'secret123',{
         expiresIn: '30d'
     },
     );
 
     const {passwordHash, ...userData} = user._doc;
 
     res.json({
         ...userData,
         token})
     } catch(err){
     console.log(err);
     res.status(500).json({
     message:'Не удалось авторизоваться'
     });
     }
 };

export const getMe = async (req,res)=>{
    try{
        const user = await UserModel.findById(req.userId)//вытягиваем это id и ищем в бд
         if (!user){
            return res.status(404).json({
                message:'Пользователь не найден',
            });  
         }
         const {passwordHash, ...userData} = user._doc;
        res.json(userData);
    } catch(err){
        console.log(err);
        res.status(500).json({
            message:'Нет доступа'
        });
    }
};
