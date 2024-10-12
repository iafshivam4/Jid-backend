const bcrypt = require('bcrypt');
const db = require('../config/database');
const MailService=require('../Services/MailSetup'); // Assuming you have a database connection file

class UserController {
  // Register a new user
  async RegisterUser(req) {
    try {
     
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      let subject;
      let text;
      let html;
      let userEmail;

      console.log("otp",otp);

      let [findQuery]= await db.query('SELECT * FROM users WHERE email = ? AND otp_verified=1', [req.body.email]);
      if (findQuery.length > 0) {
        throw new Error('User is already exists. Please use login tab'); // Custom error for existing email
      }

      let [findQuery1]= await db.query('SELECT * FROM users WHERE email = ? AND otp_verified=0', [req.body.email]);
      if (findQuery1.length > 0) {
        console.log(otp);
        let Otpresult = await db.query(
          'UPDATE users SET otp=?,f_name=?,l_name=?,gender=?,profile=?,date_of_birth=?,password=? WHERE id=?', 
          [+otp,req.body.f_name,req.body.l_name,req.body.gender,req.body.profile,req.body.date_of_birth,hashedPassword,+findQuery1[0].id]
        );
        if(Otpresult.affectedRows==0)  throw new Error('Something went wrong while sending otp');

         subject="Otp Verification";
         text=`You'r Jid Otp is ${otp}. Please use this otp to verify yourself`;
         html=`<p>You'r Jid Otp is ${otp}.<br>Please use this otp to verify yourself</p>`;
         userEmail=req.body.email;
       
        await this.sendMailToUser(subject, text, html, userEmail);

        return findQuery1[0].id; 

        
      }


      const jid = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(100000 + Math.random() * 900000)}`;

      
      let result = await db.query(
        'INSERT INTO users (f_name, l_name, email, password, is_verified, otp, gender, profile, date_of_birth,jid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)', 
        [req.body.f_name, req.body.l_name, req.body.email, hashedPassword, 0, otp, req.body.gender, req.body.profile, req.body.date_of_birth,jid]
      );
      
      if (result[0].affectedRows == 0) throw new Error('Something went wrong');
      
      const insertId = result[0].insertId;
      
      console.log("Inserted ID:", insertId);
      await this.docCreation(insertId);
      
      subject="Otp Verification";
      text=`You'r Jid Otp is ${otp}. Please use this otp to verify yourself`;
      html=`<p>You'r Jid Otp is ${otp}.<br>Please use this otp to verify yourself</p>`;
      userEmail=req.body.email;
    
      await this.sendMailToUser(subject, text, html, userEmail);

      return insertId; 
      
    } catch (err) {
      console.log(err);
      
      throw err.sqlMessage || err.message || 'An error occurred while registering the user';
    }
  }


  async verifyOtp(req){
    try{
      let [findQuery]= await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
      if (findQuery.length == 0) {
        throw new Error('User is not exists. Please use registration tab'); // Custom error for existing email
      }

      if(findQuery[0].otp==req.body.otp){
        let result = await db.query("UPDATE users SET otp_verified=1");
        if(result.affectedRows==0)  throw new Error('Something went wrong');
        return result;
      }else{
        throw new Error('Invalid OTP');
      }

    }catch(err){
      throw err.sqlMessage || err.message || 'An error occurred while registering the user';

    }
  }

  async docCreation(user_id){
    try{
      let result = await db.query("INSERT INTO  documents(??,??,??) values (?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?)",["user_id","doc_name","doc_type",user_id,"Caste Certificate","caste_certificate",user_id,"Birth Certificate","birth_certificate",user_id,"Voter Id Card","voter_id",user_id,"Ration Card","ration_card",user_id,"PAN Card","pan_card",user_id,"Driving License","driving_license",user_id,"Adhar Card","adhar_card",user_id,"Other","other"]);
      if(result.affectedRows==0)  throw new Error('Something went wrong');
      return true;

         
    }catch(err){
      throw err.sqlMessage || err.message || 'An error occurred while registering the user doc';

    }
  }

  async loginUser(req){
    try{
       const [query]=await  db.query("SELECT * FROM users WHERE email=? AND otp_verified=1",[req.body.email]);
       if(query.length==0) throw new Error('Email not found ');
       
       const isValidPassword = await bcrypt.compare(req.body.password, query[0].password);
       if(!isValidPassword) throw new Error('Invalid password');
       return query;

    }catch(err){
      throw err.sqlMessage || err.message || 'An error occurred while login the user';
    }
  }

  async SubmitDocument(req){
  try{
    console.log(req.body);
    let result = await db.query("UPDATE documents SET ??=?,??=? WHERE id=?",["doc_name",req.body.doc_name,"doc_path",req.body.doc_path,req.params.doc_id]);

    if(result.affectedRows==0)  throw new Error('Something went wrong');
    await this.sendMailFordocupload(req.params.doc_id);
      return result; 

  }catch(err){
    console.log(err);
      throw err.sqlMessage || err.message || 'An error occurred while submiting document the user';
    }

  }

 async sendMailFordocupload(doc_id){
    try{
      let [result] = await db.query("SELECT * FROM documents WHERE id=?",[doc_id]);
       if(result.length==0) throw new Error('Something went wrong');
       let [user] = await db.query("SELECT * FROM users WHERE id=?",[result[0].user_id]);
       if(user.length==0) throw new Error('Something went wrong while fetching user');
       const subject="Document Submission By User";
       const text = `User ${user[0].f_name} with Jid ${user[0].jid} has submitted ${result[0].doc_name} successfully.`;
       const html = `<p>User <strong>${user[0].f_name}</strong> with Jid <strong>${user[0].jid}</strong> has submitted <strong>${result[0].doc_name}</strong> successfully.</p>`;
       
        await this.sendMailToAdmin(subject, text, html);
     return true;

    }catch(err){
      throw err.sqlMessage || err.message || 'An error occurred while sending mail to admin';
    }
  }

  async getSumbitDoc(user_id){
    try{
      let [result] = await db.query("SELECT * FROM documents WHERE user_id=?",[user_id]);
      if(result.affectedRows==0)  throw new Error('Something went wrong');
        return result; 
  
    }catch(err){
      console.log(err);
        throw err.sqlMessage || err.message || 'An error occurred while submiting document the user';
      }
  
    }

    async loginAdmin(req){
      try{
         const [query]=await  db.query("SELECT * FROM admins WHERE user_name=?",[req.body.email]);
         if(query.length==0) throw new Error('Admin not found');
         const isValidPassword = await bcrypt.compare(req.body.password, query[0].password);
         if(!isValidPassword) throw new Error('Invalid password');
         return query;
  
      }catch(err){
        throw err.sqlMessage || err.message || 'An error occurred while login the user';
      }
    }

    async getUserList(req){
      try{
        if(req.user.role=="admin"){
          if(req.query.jid){
            let [result] = await db.query("SELECT * FROM users WHERE jid=? && otp_verified=1",[req.query.jid]);
            return result;
          }
          const [query]=await  db.query("SELECT * FROM users WHERE otp_verified=1");
          return query;

        }else{
          throw new Error('Only Admin will able to see list of user');

        }


      }catch(err){
        throw err.sqlMessage || err.message || 'An error occurred while login the user';

      }
    }


    async AcceptRejectDoc(req){


      try{
        if(req.user.role=="admin"){
        let [result] = await db.query("UPDATE documents SET is_verified=? WHERE id=?",[req.body.is_verified,req.params.doc_id]);

        let[doc]=await db.query("SELECT * FROM documents WHERE id=?",[req.params.doc_id]);
        let user_id=doc[0].user_id;
        let[user]=await db.query("SELECT * FROM users WHERE id=?",[user_id]);
        if(req.body.is_verified==-1){
          subject="Document Rejected By JID Admin";
          text = `Sorry! Your ${doc[0].doc_type} is rejected by JID admin`;
          html = `<p>Sorry! Your ${doc[0].doc_type} is rejected by JID admin</p>`;
          await this.sendMailToUser(subject,text,html,user[0].email);
        }else{
          subject="Document Accepted By JID Admin";
          text = `Congrats! Your ${doc[0].doc_type} is accepted by JID admin`;
          html = `<p>Sorry! Your ${doc[0].doc_type} is accepted by JID admin</p>`;
          await this.sendMailToUser(subject,text,html,user[0].email);

        }
        
        return result;

        }else{
          throw new Error('Only Admin will able to accept or reject user doc');
        }

      }catch(err){
        throw err.sqlMessage || err.message || 'An error occurred while login the user';

      }
    }


    async uploadOffer(req){

      try{
        if(req.user.role=="admin"){
          let [result] = await db.query("SELECT doc_name FROM documents WHERE user_id=? AND is_verified=-1 AND is_verified=0",[req.params.user_id]);
          if(result.length==0){
            let [query1]= await db.query("SELECT * FROM offer_letter WHERE user_id=?",[req.params.user_id]);
            if(query1.length==0){
              let [query2]= await db.query("INSERT INTO offer_letter(user_id,offer_letter_path) values(?,?)",[req.params.user_id,req.body.offer_letter_path]);
              return query2;

            }else{
              let [query]= await db.query("UPDATE offer_letter SET offer_letter_path=?,is_accepted=?,is_viewed=? WHERE user_id=?",[req.body.offer_letter_path,0,0,req.params.user_id]);
              return query;
            }

          }else{
            throw new Error('Some Documents are rejected or in pending state, please accept all to upload offer letter');


          }
  
          }else{
            throw new Error('Only Admin will able upload offer letter');
          }
      }catch(err){
        throw err.sqlMessage || err.message || 'An error occurred while login the user';

      }
    }


    async isViewed(req){


     
       try{
        let [result] = await db.query("UPDATE offer_letter SET is_viewed=1 WHERE user_id=?",[req.params.user_id]);
        return result;

        

      }catch(err){
        throw err.sqlMessage || err.message || 'An error occurred while login the user';

      }
    }

    
    async getOfferLetter(req){


     
      try{
       let [result] = await db.query("SELECT * FROM offer_letter WHERE user_id=?",[req.params.user_id]);
       return result;

       

     }catch(err){
       throw err.sqlMessage || err.message || 'An error occurred while login the user';

     }
   }
    

   async AcceptRejectOffer(req){
    try{
      
      let [result] = await db.query("UPDATE offer_letter SET is_accepted=? WHERE user_id=?",[req.body.is_accepted,req.params.user_id]);
      await this.sendMailForAcceptAndReject(req.body.is_accepted,req.params.user_id);
      return result;

    }catch(err){
      console.log("hello");
      throw err.sqlMessage || err.message || 'An error occurred while login user';

    }
  }

  async sendMailForAcceptAndReject(accept,user_id){
    try{
      
       let [user] = await db.query("SELECT * FROM users WHERE id=?",[user_id]);
       if(user.length==0) throw new Error('Something went wrong while fetching user');
       let subject;
       let text;
       let html;
       if(accept==1){
        subject="Offer Letter Accepted By User";
        text = `User ${user[0].f_name} with Jid ${user[0].jid} has accepted the offer letter`;
        html = `<p>User <strong>${user[0].f_name}</strong> with Jid <strong>${user[0].jid}</strong> has accepted the offer letter</p>`;
        
         await this.sendMailToAdmin(subject, text, html);

       }else{
        subject="Offer Letter Rejected By User";
        text = `User ${user[0].f_name} with Jid ${user[0].jid} has rejected the offer letter`;
        html = `<p>User <strong>${user[0].f_name}</strong> with Jid <strong>${user[0].jid}</strong> has rejected the offer letter</p>`;
        
         await this.sendMailToAdmin(subject, text, html);
       }
      
     return true;

    }catch(err){
      throw err.sqlMessage || err.message || 'An error occurred while sending mail to admin';
    }
  }


  async sendMailToUser(subject,text,html,userEmail) {
  
    try {
      console.log("hello",userEmail);
      await MailService.sendMail(userEmail, subject, text, html);
      return true

    } catch (error) {
      
      return error;

    }
  }

  async sendMailToAdmin(subject,text,html) {
  
    try {
      let [query1]= await db.query("SELECT * FROM admins");
      for(let i=0;i<query1.length;i++){

       await MailService.sendMail(query1[i].email, subject, text, html);
      }

      
      return true

    } catch (error) {
      
      return error;

    }
  }
}

module.exports = new UserController();
