var db = require("../models");
var passport = require("../config/passport");
var isAuthenticated = require("../config/middleware/isAuthenticated");
// const Op = Sequelize.Op

module.exports = function (app) {
  // Get all data for one user using their unique id
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
  app.delete("/api/user/:id", isAuthenticated, function (req, res) {
    db.User.destroy({ where: { id: req.user.id } }).then(function (
     
    ) {
      // res.redirect("/");
    });
  });

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Since doing a POST with JS, can't redirect into a GET request - send user back to landing page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authorized
    res.json(req.user);

  });

  // Route for signing up a user. User's password is automatically hashed and stored securely bc of configuration of Sequelize User Model. If the user is created successfully, log them in, otherwise send back an error
  app.post("/api/signup", function (req, res) {
    // console.log(req.body);
    db.User.create(req.body)
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(422).json(err.errors[0].message);
      });
  });

  
  
 

  app.post("/api/skill", isAuthenticated, function(req, res) {
   
    // console.log(req.user);
    var skillBody = req.body;
    skillBody.UserId = req.user.id;

    db.Skill.create(skillBody).then(function(dbskills) {
      res.json(dbskills); 
     
    })
  });

  

  app.put("/api/user", isAuthenticated, function(req, res){
    

    // update the user by id using req.user.id 
    db.User.update(req.body, {
      where: { id: req.user.id }
    }).then(function (data) {

      res.json(data);
    })
      // fill out the rest from the body of the request
      // respond back with the updated user
      .catch(function (err) {
        res.status(400).send(err);
      });
  });
    
      // console.log(req.body.appType)
  app.get("/api/user/compare", isAuthenticated, function(req, res){
      db.User.findAll({
          where: {
            appType : req.user.appType,
            id: {
              $ne: req.user.id
            }
          }
          
        }).then(function (dbUser) {
          res.json(dbUser);
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