import PostModel from "../models/Post.js";

export const getLastTags = async(req,res)=>{
    try{
        const posts = await PostModel.find().limit(5).exec();
        
        const tags = posts.map((obj)=>obj.tags).flat().slice(0,5);
        res.json(tags);
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:'Не удалось получить тэги'
    })
  };
}


export const getAll = async(req,res)=>{
    try{
        const posts = await PostModel.find().populate('user').exec();//populate('user').exec() - получаем связь с пользователем 
        res.json(posts);
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:'Не удалось получить статьи'
    })
  };
}

export const getOne = async(req,res)=>{
    try{
        const postId = req.params.id;

        PostModel.findOneAndUpdate(//найди одну статью и обнови ее
            {
                _id:postId,// находим по параметру
            },
            {
                $inc:{viewsCount:1}// что инкрементировать (увеличить ) и на сколько
            },
            {
                returnDocument:'after'//обновить и обновленной вернуть
            },
            (err,doc)=>{
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message:'Не удалось получить статью'
                })
            }
            if (!doc){
                return res.status(404).json({
                    message:'Статья не найдена'
            })
            }
            res.json(doc);
            }
        ).populate('user');
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:'Не удалось получить статьи'
    })
  };
}

export const remove = async(req,res)=>{
    try{
        const postId = req.params.id;

        PostModel.findOneAndDelete(//найди одну статью и удалить
            {
                _id:postId,// находим по параметру
            },
            (err,doc)=>{
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message:'Не удалось удалить статью'
                })
            }
            if (!doc){
                return res.status(404).json({
                    message:'Статья не найдена'
            })
            }
            res.json({
                success:true,
            });
            }
        );
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:'Не удалось получить статьи'
    })
  };
}

export const update = async(req,res)=>{
    try{
        const postId = req.params.id;

       await PostModel.updateOne(//обновить статью 
            {
                _id:postId,// находим по параметру
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                user:req.userId,
            },
        );
        res.json({
            success:true,
        });
           
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:'Не удалось обновить статью'
    })
  };
};

export const create = async(req,res)=>{
    try{
        const doc = new PostModel({//подготовили пост
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user:req.userId,
        });

        const post = await doc.save()//создали пост

        res.json(post);

    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message:'Не удалось создать статью'
        });
    }
};