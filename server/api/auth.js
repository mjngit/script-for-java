const express = require('express');
const app = express.Router();
const {User}  = require('../db');
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('./middleware.js');




app.post('/', async(req, res, next)=> {
  try {
    res.send(await User.authenticate(req.body));
  }
  catch(ex){
    next(ex);
  }
});

// prefix is /api/auth
app.get('/', async(req, res, next)=> {
  try {
    res.send(await User.findByToken(req.headers.authorization));
  }
  catch(ex){
    next(ex);
  }
});


app.post('/register', async(req, res, next)=> {
  try{
    res.send(await User.register(req.body)); 
  }
  catch(ex){
    next(ex);
  }
});

// prof code
app.get('/', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  }
  catch(ex){
    next(ex);
  }
});

// prefix is /api/auth
app.put('/:token', async(req, res, next)=> {
  try{
    const user = await User.findByToken(req.params.token);
    await user.update(req.body);
    res.send(user);
  }
  catch(ex){
    next(ex);
  }
});


app.get('/github', async(req, res, next)=> {
  try{
    const { token } = await User.authenticateGithub(req.query.code);
    res.send(`
      <script>
        window.localStorage.setItem('token', '${ token }');
        window.location = '/';
      </script>
    `);
  }
  catch(ex){
    next(ex);
  }
});
// localhost/3000/api/auth/github
app.get('/:token', async(req, res, next)=> {
  try{
    res.send(await User.findByToken(req.params.token));
  }
  catch(ex){
    next(ex);
  };

});

module.exports = app;
