import mongoose from "mongoose";
//монгус создай схему, в которой будут все свойства, что могут быть у пользователя
const UserSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,//обязательное
    },
    email:{
        type:String,
        required:true,
        unique:true,//уникальна
    },
    passwordHash:{
        type:String,
        required:true,
    },
    avatarUrl:String,
},{
    timestamps:true, //при создании любого пользователя прикрути дату создания и обновления
});

export default mongoose.model('User', UserSchema)//экспортируем схему под названием 'User', UserSchema - указываем саму модель