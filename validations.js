import {body} from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),//если в теле 'email' будет как isEmail(), то хорошо, если нет, то express-validator нас оповестит
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min:5}),
]

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),//если в теле 'email' будет как isEmail(), то хорошо, если нет, то express-validator нас оповестит
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min:5}),
    body('fullName', 'Укажите имя').isLength({min:3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),//если информация придет, то проверить является ли она URL
]

export const postCreatValidation = [
    body('title', 'Введите заголовок статьи').isLength({min:3}).isString(),
    body('text', 'Введите текст статьи').isLength({min:10}).isString(),
    body('tags', 'Неверный формат тэгов').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]

