const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const mailDetail = require('./mail.controller');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
//const { json } = require("sequelize/types");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            let to = req.body.email;
            let subject = "Confermation mail";
            let text = '<h2>registered successfully  with the following details : </h2>' + JSON.stringify(req.body);
            mailDetail.mailDetails(to, subject, text);

            res.send({ message: "User registered successfully!" });

          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User  registered successfully! but mail not sent properly" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 300 // 5 min
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetMailSending = (req, res) => {

  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 300 // 5 min
      });

      let to = req.body.email;
      let subject = "Password Reset link";
      let text = `<a>http://localhost:8080/api/test/reset?token=+${token}`;
      mailDetail.mailDetails(to, subject, text);
    })
  res.send('check your mail and go through link ... link will be active only for 10 mins ........');

};

exports.resetingPassword = async (req, res) => {

  User.update(
    { password: bcrypt.hashSync(req.body.password, 8) }, //what going to be updated
    { where: { email: req.body.email } } // where clause
)
.then(result => {
  // code with result
  let to = req.body.email;
    let subject = "password reset ";
    let text = '<h2>reset password successfully , now you can signin using new password </h2>' + JSON.stringify(req.body);
    mailDetail.mailDetails(to, subject, text);

    res.send({ message: "password reset successfully!" });

})
.catch(error => {
  // error handling
  console.log(error);
})

}
