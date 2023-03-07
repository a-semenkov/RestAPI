
## .env- переменные для работы
В переменных окружения должны быть определены две константы для формирования Access и Refresh JWT Token соответственно.
ACCESS_TOKEN_SECRET
ACCESS_TOKEN_REFRESH


## Логгирование

На данный момент логи пишутся в папку */logs/errLog.txt* для ошибок и *requestLog.txt* для запросов. Логгирование используется через middleware. Формат файлов:

1. errLog.txt :
        `Дата`                   `Формат uuid`                       `Сообщение об ошибке`
18:20:31   06-03-2023	a6360b35-5519-40e3-8761-be5d0d923913	Error: Not allowed y CORS policy

2. requestLog.txt
    `Дата`                   `Формат uuid`                  `Тип запроса`   `Источник (origin)` `Запрашиваемый путь`
19:09:08   06-03-2023	4503cde1-1db0-4c7d-9021-085016ee2e53	POST	        undefined	        /users


**Примечание** В продакшн не забыть убрать логгирование каждого запроса и добавить запись IP, при необходимости.




## Формат ответа API
Все методы API отвечают объектом следующего общего формата:  
```js
{
    status, // http-код ответа
    ok, // Boolean - успешно ли выполнен запрос
	payload, // любое  значение, которое должен возвращать метод API (undefined, если произошла ошибка или невозможно вернуть какие-либо значимые данные)
	message // текст описания/кода ошибки, которая произошла; заполняется, только если произошла ошибка. 
}
```





## Методы API

### GET /

Возращает картинку test.png из папки serving. Оставлено для тестов
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

// protected JWT routes
app.use(verifyJWT);
app.use('/users', require('./routes/api/users'));

### POST /register 

Регистрация нового пользователя, ожидает объект вида 

```js
{
    username, // имя пользователя
    password // пароль
}
```

Пароли хешируются, хранятся в БД в зашифрованном виде.

В ответ на успешную регистрацию отдает 
```js
{   
    username, // имя созданного пользователя
    id // сгенерированный id
}
```

**Возможнные ошибки:**  
* `Username and/or password required` — не указан username и/или password;
* `Username already taken`  — указанный username уже существует;




### POST /auth

В ответ на успешную авторизацию отдает 
```js
{   
    username, // имя пользователя
    id //  id
}
```

Авторизированному пользователю выдается JWT token. Для разработки срок жизни токена - 60сек. 
Через http-only cookie передается refresh token.

**Возможнные ошибки:**  
* `Username and password required` — не указан username и/или password;
* `No such user`  — указанный пользователя не существует;
* `Incorrect password and/or username`  — не верное имя пользователя и/или пароль;



### POST /refresh

Обновление access token при помощи refresh token. Срок действия нового access token установлен в 30сек, устанавливается переменной **TOKEN_EXPIRES_IN** в *controllers/refreshController.js*

**Возможнные ошибки:**  
* `Unauthorized` — пользователь не авторизован - отстутствует токен или истек срок его действия.;
* `Forbidden`  — пользователя не существует;


### GET /logout

Выйти и очистить токен пользователя в БД. Локальный токен нужно удалить на Frontend в ручную.


### GET /users
### PUT /users
### DELETE /users
### GET /users/:id

Защищенный route, для получения данных нужно обладать правами администратора или модератора и быть авторизованным в системе (активный token)



**Возможнные ошибки:**  
* `Unauthorized` — пользователь не авторизован - отстутствует токен или истек срок его действия.;
* `You don't have necessary permissions for this operation`  — Недостаточно прав для совершения операции;



### Not found route

Если клиент принимает html, в ответ на несуществующий запрос отправляется файл **404.html** из папки *public*
В противном случае, отдает json вида: 
```js
{ status: 404, ok: false, message: '404 Not found' }
```


## Структура хранения данных пользователей
```js
{
    "id":"54d17e7b-e08d-487b-9e5c-43494d27753d",
    "username":"moderator",
    "roles":{
        "Moderator":2,
        "User":3
        },
    "password":"$2b$10$bEzoWtQlC3gVz4DzNIZpouZvD0nTwPT4qi7d7B6waULUUV7I/5W8G",
    "refreshToken":""
    }
```
