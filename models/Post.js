import mongoose from "mongoose";
//монгус создай схему, в которой будут все свойства, что могут быть у поста
const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,//обязательное
    },
    text:{
        type:String,
        required:true,
        unique:true,//уникальна
    },
    tags:{
        type:Array,
        default:[], //если тегов не будет, будет создан пустой массив
    },
    viewsCount:{//количество просмотров, если их не будет верни 0
        type:Number,
        default:0,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,//монгусом создана схема User, а в ней найди по ObjectId user(связь между двумя таблицами)
        ref: 'User',
        required:true,
    },

    imageUrl:String,
},{
    timestamps:true, //при создании  прикрути дату создания и обновления
});

export default mongoose.model('Post', PostSchema)//экспортируем схему под названием 'User', UserSchema - указываем саму модель