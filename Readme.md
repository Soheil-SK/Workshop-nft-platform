# Stocker un utilisateur et sa todolist sur redis

## Vous allez mettre en place un serveur redis, puis vous y connecter à l'aide d'un server express et stocker les données des utilisateurs, nous verrons aussi comment crypter les informations sensibles de ces derniers.

## Le but est d'avoir un interface simple qui permet aux utilisateurs connectés de créer leur propre todolist


<br>
<br>
<br>

[![ALT](https://i.ytimg.com/vi/G1rOthIU-uo/maxresdefault.jpg)](https://www.youtube.com/watch?v=G1rOthIU-uo&ab_channel=Fireship)

# Mise en place du projet


## 1: Setup Redis <a href='https://redis.io/docs/getting-started/installation/'> here</a>

Une fois Redis installé sur votre machine, exécutez la commande suivante pour lancer votre serveur:

    $ redis-server


Votre server tourne maintenant, le port par default est 6379

### 2: ping Redis 


    $ redis-cli

    127.0.0.1:6379> ping

Response from redis server:
    
    PONG


## 1: Setup un serveur Express <a href='https://redis.io/docs/getting-started/installation/'> Ici</a>


- create a new project
        
        $ npm install express
        $ npm install express-session
        $ npm install body-parser
        $ npm install cors


- copy this bootstrap express server
    - you can choose any port you want
    ```js
    var express = require("express");
    const bodyParser = require('body-parser');
    const session = require('express-session');
    var app = express();

    const cors=require("cors");
    app.use(cors());

    app.use(bodyParser.urlencoded({
    extended: true
    }));
    app.use(bodyParser.json())


    require('./routes')(app);


    app.listen(8080, function(){
    console.log("Live at Port 8080");
    });
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
## 3: Route de creation d'utilisateurs
comment set et get des Hash https://redis.io/docs/data-types/hashes/
```js
    app.post('/register', redirectHome, (req, res, next)=>{
        console.log("post")
        try {
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const email = req.body.email;
            let password = req.body.password;

            if (!firstName || !lastName || !email || !password)
                return res.sendStatus(400);

            const salt; // à compléter
            password; // à compléter

            /* à compléter*/  (email,
              'first_name', firstName,
              'last_name', lastName,
              'email', email,
              'password', password,
              function(err, reply) {
                if (err)
                  console.log("redis: \x1B[31m" +err+ "\x1B[0m");
                else {
                  console.log("user created: " + email);
                }
                res.sendStatus(200);
              });
        } catch(e) {
            console.log(e);
            res.sendStatus(400);
        }
    });

     app.get('/register',redirectHome, (req,res)=>{
        res.send(`
        <h1>Register</h1>
        <form method='post' action='/Register'>
        <input type='text' name='firstName' placeholder='First Name' required />
        <input type='text' name='lastName' placeholder='Last Name' required />
        <input type='email' name='email' placeholder='Email' required />
        <input type='password' name='password' placeholder='password' required/>
        <input type='submit' />
        </form>
        <a href='/login'>Login</a>
        `)
    });
```
### librairie de cryptage :

        $ npm install bcrypt
        

```js

const { hashSync, genSaltSync, compareSync } = require("bcrypt");

// hasher une string 
const salt = genSaltSync(10);
hashSync("string à hasher", salt);

// comparer 
(compareSync("string hashé", "même string mais pas hashé")

```
## 4: Route de login et logout d'utilisateurs 
```js
    app.post('/login', (req, res, next)=>{
        try {
            const email = req.body.email;
            let password = req.body.password;
            //Get le hash associé à l'email(email, function(err, obj) {
                if (!obj)
                    return res.send({message: "Invalid email"});
                if (/*?*/)
                    return res.send({message: "Invalid password"});
                req.session.email = obj.email;
                console.log(req.session);
                return res.redirect('/home');
            });
        } catch(e) {
            console.log(e);
            res.sendStatus(401)
        }
    });   
      

    app.get('/login',redirectHome, (req,res)=>{
        res.send(`
        <h1>Login</h1>
        <form method='post' action='/login'>
        <input type='email' name='email' placeholder='Email' required />
        <input type='password' name='password' placeholder='password' required/>
        <input type='submit' />
        </form>
        <a href='/register'>Register</a>
        `)
    });


    app.post('/logout', redirectLogin, (req, res)=>{
        req.session.destroy(err => {
            if(err){
                return res.redirect('/home')
            }
            res.clearCookie(process.env.SESS_NAME)
            res.redirect('/login')
        })
      
    });
```

## Set les TODO


- format en db   

        todo:0
        faire le ménage 
        
        todo:1
        faire à manger
        
        todo:3
        ronfler

*** 
Docs

- [Persistance d'une base de donné Redis](https://redis.io/docs/management/persistence/)
