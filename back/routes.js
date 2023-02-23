const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { redirect } = require('express/lib/response');
const redisClient = require('./redis');


module.exports = function(app) {

    const redirectLogin = (req, res, next) =>{
        if(!req.session.email){
            res.redirect('/login')
        }else{
                next()
            }
     }
      
     const redirectHome = (req, res, next) =>{
        if(req.session.email){
            res.redirect('/home')
        }else{
                next()
            }
     }


    app.get('/', (req, res)=>{
        const { email } = req.session
        console.log(email);
        res.send(`
        <h1> Welcome!</h1>
        ${email ? `<a href = '/home'> Home </a>
        ` : `<a href = '/login'> Login </a>
        <a href = '/register'> Register </a>
        `}
        `)
      });


      app.get('/home',  redirectLogin, async(req,res)=>{
        const {email} = req.session
        console.log(email);
         if(email){
        try{
            html = '';
            redisClient.redis_client.hgetall(email, function(err, obj) {
                if (err) {
                  console.log("redis: \x1B[31m" +err+ "\x1B[0m");
                  return res.sendStatus(500);
                }
                if (!obj || Object.keys(obj).length === 0) {
                  return res.send("You have no todo items.");
                }
                let todoItems = "";
                for (const [key, value] of Object.entries(obj)) {
                  if (key.startsWith("todo:")) {
                    todoItems += `<li>${value}</li>`;
                  }
                }
                 html = `<h1>TODO List</h1><ul>${todoItems}</ul>`;
              });

            redisClient.redis_client.hgetall(email, function(err, obj){
            var resp = '';
            console.log(obj)
            //req.user = obj;

            res.send(`
            <h1>Home</h1>
            <a href='/'>Main</a>
            <ul>
            <li> Name: ${obj.first_name} </li>
            <li> Email:${obj.email} </li>
            </ul>
            <h1>Set todo</h1>
            <form method='post' action='/todo'>
            <input type='text' name='todoItem' placeholder='TODO' required />
            <input type='submit' />
            </form>
            <p>todo:${html}<p>
            <form method='post' action='/logout'> <button>Logout</button> </form>

            `)
            })    
        } catch(e) {
            console.log(e);
            res.sendStatus(404);
        }
    }
         
    });
     
     
    app.post('/register', redirectHome, (req, res, next)=>{
        console.log("post")
        try {
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const email = req.body.email;
            let password = req.body.password;
            const salt = genSaltSync(10);

            if (!firstName || !lastName || !email || !password)
                return res.sendStatus(400);

            password = hashSync(password, salt);
            redisClient.redis_client.hset(email,
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

    app.post('/login', (req, res, next)=>{
        try {
            const email = req.body.email;
            let password = req.body.password;
            redisClient.redis_client.hgetall(email, function(err, obj) {
                if (!obj)
                    return res.send({message: "Invalid email"});
                if (!(compareSync(password, obj.password)))
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

      
      app.post('/todo', redirectLogin, (req, res) => {
        const email = req.session.email;
        const todoItem = req.body.todoItem;
        console.log('tgour' + todoItem)
        redisClient.redis_client.hkeys(email, function(err, replies) {
            if (err) {
              console.log("redis: \x1B[31m" +err+ "\x1B[0m");
              return res.sendStatus(500);
            }
          
            const todoIndex = replies.filter(key => key.startsWith('todo:')).length; // get the next available index
            const todoKey = 'todo:' + todoIndex; // create the key for the new todo item
          
            redisClient.redis_client.hset(email, todoKey, todoItem, function(err, reply) {
              if (err) {
                console.log("redis: \x1B[31m" +err+ "\x1B[0m");
                return res.sendStatus(500);
              } else {
                console.log("todo created: " + email);
                return res.redirect('/home');
              }
            });
          });
      });
}