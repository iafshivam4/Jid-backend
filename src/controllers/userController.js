// src/controllers/userController.js

const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const secretKey = 'your_secret_key';
const MailService= require('../Services/MailSetup');

class UserController {
  async registerUser(req, res) {
    try {
      if (req.body.password == req.body.confirm_password) {
        const user = await UserModel.RegisterUser(req);
        res.json({ id: user });
      } else {
        return res.status(404).json({ message: 'password and confirm password is not same' });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async verifyOtp(req, res) {
    try {

      let data = await userModel.verifyOtp(req);
      res.json({ message: "Otp verified Successfully" });


    } catch (error) {
      res.status(500).json({ error: error });
    }
  }



  async loginUser(req, res) {
    try {


      const user = await UserModel.loginUser(req);
      const userRecord = user[0];
      const token = jwt.sign(
        {
          id: userRecord.id,
          email: userRecord.email,
          f_name: userRecord.f_name,
          l_name: userRecord.l_name,
          role: "user",
        },
        secretKey, // Secret key to sign the token
        { expiresIn: '24h' } // Token expiration time
      );

      // Respond with the token
      res.json({ token: token, user: userRecord });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }

  }

  async SubmitDocument(req, res) {
    try {
      let data = await userModel.SubmitDocument(req);
      res.json({ message: "Data Submit Successfully" });


    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async getSumbitDocFOrUser(req, res) {
    try {
      let data = await userModel.getSumbitDoc(req.user.id);
      res.json({ data });

    } catch (error) {
      res.status(500).json({ error: error });

    }
  }

  async loginAdmin(req, res) {
    try {


      const user = await UserModel.loginAdmin(req);
      user[0].role = "admin";
      const adminRecord = user[0];
      const token = jwt.sign(
        {
          id: adminRecord.id,
          user_name: adminRecord.user_name,
          role: "admin",
        },
        secretKey, // Secret key to sign the token
        { expiresIn: '24h' } // Token expiration time
      );

      // Respond with the token
      res.json({ token: token, user: adminRecord });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }

  }

  async getUserList(req, res) {
    try {
      let data = await userModel.getUserList(req);
      res.json({ data });

    } catch (error) {
      res.status(500).json({ error: error });

    }
  }



  async userDoc(req, res) {
    try {
      let data = await userModel.getSumbitDoc(req.params.user_id);
      res.json({ data });

    } catch (error) {
      res.status(500).json({ error: error });

    }
  }


  async AcceptRejectDoc(req, res) {
    try {
      let data = await userModel.AcceptRejectDoc(req);
      res.json({ data });

    } catch (error) {
      res.status(500).json({ error: error });

    }
  }




  async uploadOffer(req, res) {
    try {
      let data = await userModel.uploadOffer(req);
      res.json({ data });

    } catch (error) {
      res.status(500).json({ error: error });

    }
  }

  async isViewed(req, res) {
    try {
      let data = await userModel.isViewed(req);
      res.json({ data });

    } catch (error) {
      res.status(500).json({ error: error });

    }

  }


  async getOfferLetter(req, res) {
    try {
      let data = await userModel.getOfferLetter(req);
      res.json({ data });

    } catch (error) {
      res.status(500).json({ error: error });

    }

  }



  async AcceptRejectOffer(req, res) {
    try {
      let data = await userModel.AcceptRejectOffer(req);
      res.json({ data });

    } catch (error) {
      res.status(500).json({ error: error });

    }

  }
  async sendWelcomeEmail(req,res) {
    const subject = 'Welcome to Our Service';
    const text = 'Thank you for signing up!';
    const html = '<h1>Thank you for signing up!</h1>';
    const userEmail='iafshivam4@gmail.com';
  
    try {
     await userModel.sendMailToAdmin(subject,text,html);
      return res.status(200).json({ message: 'Email sent' });

    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: 'Error occured' });

    }
  }

}

module.exports = new UserController();
