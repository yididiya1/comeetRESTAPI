const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');


module.exports = (req,res,next) => {
  try{
    //const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    //const decoded = jwt.verify(token,process.env.JWT_KEY);
    
    //req.userData = decoded;
    
    //const id = req.userData.adminId;
    console.log(req.userData);
    const role = req.userData.role;
    
    if(role == 'SuperAdmin'){
        next();
    }else{
        return res.status(401).json({
            message:"You are not SuperAdmin"
        });
    }

    

    
    
  }catch(error){
    return res.status(401).json({
        message:"Auth Failed(token)"
    });
  } 
};
