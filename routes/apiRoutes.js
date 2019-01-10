var db = require("../models");
var passport = require("../config/passport");
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  // Get all user data
  app.get("/api/users/:id", isAuthenticated, function (req, res) {
    db.User.findAll({
      where: {
        UserId: req.params.id
      }
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // Create a new example
  app.get("/api/users/:id", isAuthenticated, function (req, res) {
    db.User.update({
      UserId: req.user.id,

    }).then(function (newUser) {
      res.json(newUser);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", isAuthenticated, function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (
      dbExample
    ) {
      res.json(dbExample);
    });
  });

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json(req.user);

  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    console.log(req.body);
    db.User.create(req.body)
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(422).json(err.errors[0].message);
      });
  });

  
  
  // var skillArray = []

  app.post("/api/skill", isAuthenticated, function(req, res) {
   // Continue from here
    // console.log(req.body);
    console.log(req.user);
    var skillBody = req.body;
    skillBody.UserId = req.user.id;  
    db.Skill.create(skillBody).then(function(dbskills) {
      res.json(dbskills); 
     
      // skillArray.push(dbskills);

      // console.log(skillArray[0])


    })
   

  });

  // app.get("/api/skill", function(req, res){
   
  //   db.User.findAll({
  //     where: {
  //       id : id
  //     }
  //   }).then(function (e){
  //     console.log(e)
  //   })
  // })
  

  app.put("/api/user", isAuthenticated, function(req, res){
    // update the user by id using req.user.id 
    db.User.update(req.body, {where: {id: req.user.id}
      }).then(function (data) {
      res.json(data);
    })
      // fill out the rest from the body of the request
      // respond back with the updated user
      .catch(function (err) {
        res.status(400).send(err);
      });
  });

  app.get("/api/user", function (req, res) {
    db.User.findAll({}).then(function (dbUsers) {
      res.json(dbUsers);
    });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
};