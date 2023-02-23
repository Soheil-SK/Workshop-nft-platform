## Le but de ce workshop est de vous apprendre à mettre en place un server redis, s'y connecter à l'aide d'un langage de programmation et stocker vos données en utilisant le type redis adéquat pour la donnée, nous verrons aussi comment crypter les infromations sensibles. 
## Cela se fera par le biais d'une todo liste associée à l'utilisateur connecté.

.

.
# Mise en place du projet


## 1: Setup Redis <a href='https://redis.io/docs/getting-started/installation/'> here</a>

Once Redis is installed on your machine, run the following command :

    $ redis-server


Your redis server is now running, the default port is ALWAYS 6379

### 2: ping Redis 


    $ redis-cli

    127.0.0.1:6379> ping

Response from redis server:
    
    PONG


## 1: Setup Express server <a href='https://redis.io/docs/getting-started/installation/'> here</a>


- create a new project
        
        $ npm install express
        $ npm install express-session
        $ npm install body-parser
        $ npm install cors


- copy this bootstrap express server
    - you can choose any port you want
    ```js
    var express = require("express");
    var app = express();
    var PORT = 8080;


    app.get("/", function(req,res){
        res.sendStatus(200);
    });

    app.use("/",router);

    app.listen(PORT, function() {
        console.log("Live at Port ${PORT}", PORT);
    });
    ```


- run your project
    
        $  node .

## 2: Connexion à la base de données depuis Express
- installer le <a href="https://www.npmjs.com/package/redis?activeTab=readme"> package redis</a>
    
        $ npm install redis
        $ npm install connect-redis
## 3: Route de creationd d'utilisteurs

### mots de passes :

        $ npm install bcrypt
```js

const { hashSync, genSaltSync, compareSync } = require("bcrypt");

```
## 4: Route de connexion d'utilisateurs 


## Set les TODO
- format en db
    
        todo:0
        faire le ménage 
        
        todo:1
        faire à manger
        
        todo:3
        ronfler
- Faites un HGET des todo pour connaitre l'index actuel, puis un HSET du nouveau todo:idx + 1

*** 
Docs

<a herf='https://redis.io/docs/management/persistence/'> Persistance d'une base de donné Redis</a>