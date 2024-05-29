import jwt from 'jsonwebtoken';
//функция проверяет можно ли выдавать информацию 
export default (req, res, next)=>{
    const token = (req.headers.autorization || '').replace(/Bearer\s?/,''); //если есть токен или нет удалить слово Bearer и выдать только сам токен

    if (token){
        try{
            const decoded = jwt.verify(token,'secret123'); //если токен есть то расшифровать его и вытянуть из него id
            req.userId = decoded._id;//вшиваем это в реквест
            next();
        }catch (e) {
            return res.status(403).json({
                message:'Нет доступа',
            }); 
        }
    }else {
       return res.status(403).json({
            message:'Нет доступа',
        });
    }

};