const express=require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');
const _ = require('lodash');
//local import
const mongoose=require('./DB/connection');
const employeeObj=require('./Model/Employee');
const {user}=require('./Model/User');
const {response}=require('./Model/response')
const {createResponse}=require('./Model/response')
//Api set up 
var app=express();
app.use(bodyParser.json());
// add post 
app.post('/addUser',(req,res)=>{
    const name=req.body.name;
    const username=req.body.userName;
    const password =req.body.password;
    addUser(name,username,password).then((result)=>{
        return  res.send(result);
    }).catch((err)=>{
        return  res.status(err.statusCode).send(err)
    })
   
});
//get user get request
app.get('/getUser',(req,res)=>{
    getUser().then((result)=>{
        return  res.send(result);
    }).catch((err)=>{
        return  res.status(err.statusCode).send(err);
    })
});
//get user single get request
app.get('/getSingleUser',(req,res)=>{
    let userObj={
        name:req.body.name,
        userName:req.body.userName
    }
    getSingleUser(userObj).then((result)=>{
        return  res.send(result);
    }).catch((err)=>{
        return  res.status(err.statusCode).send(err);
    })
});
//get user by Id get request
app.get('/getUserById/:id',(req,res)=>{
    let id=req.params.id;
      getUserById(id).then((result)=>{
        return res.send(result);
    }).catch((err)=>{
        return  res.status(err.statusCode).send(err);
    })
});
//delete all 
app.delete('/deleteUser',(req,res)=>{
    let userObj={
        name:req.body.name,
        userName:req.body.userName
    }
    deleteUser(userObj).then((result)=>{
        return res.send(result);
    }).catch(err=>{
        console.log()
        return res.status(err.statusCode).send(err);
    })
})
//delete singleUser  
app.delete('/deleteSingleUser',(req,res)=>{
    let userObj={
        name:req.body.name,
        userName:req.body.userName
    }
    deleteSingleUser(userObj).then((result)=>{
        return res.send(result);
    }).catch(err=>{
        console.log()
        return res.status(err.statusCode).send(err);
    })
})
//deleteById method
app.delete('/deleteUserById',(req,res)=>{
    let id=req.body.id;
    deleteUserById(id).then((result)=>{
        return res.send(result);
    }).catch(err=>{
        console.log()
        return res.status(err.statusCode).send(err);
    })
})
//update user
app.patch('/updateUser',(req,res)=>{
   let userOBJ={
     name:req.body.name,
     userName:req.body.userName,
     password:req.body.password,
     id:req.body.id
   };
   //return res.send(updateUser(userOBJ));
    updateUser(userOBJ).then((result)=>{
        return res.send(result);
    }).catch(err=>{
        console.log()
        return res.status(err.statusCode).send(err);
    })
})
app.listen(3000,()=>{
    console.log('App running on 3000')
})
//
/*end of api */ 
//Post methods
let addUser=(name,username,password)=>{
    return new Promise((res,rej)=>{
    let newUser=new user({
        name:name,
        userName:username,
        password:password
   });
   newUser.save().then((result)=>{
    let response=createResponse("Added Successfully!",result,200);
    return res(response)
 }).catch((err)=>{
    let response=createResponse("Error occured!" ,{error:err.errmsg},500);
    return rej(response)
})
});
}
//getall method
let getUser=()=>{
 return new Promise((res,rej)=>{
   user.find().then((result)=>{
       if(!result)
       {        
           
        let response=createResponse("No record found!","No record found!",404);      
        return  rej(response);
       }
       else
       {
        let response=createResponse("Fetched Successfully!",result,200);
        return res(response);
       }
   }).catch((err)=>{
    let response=createResponse("Error occured!" ,{error:err},500);
    return rej(response);
   })
 })
}

//get single object method
let getSingleUser=(userObject)=>{
    return new Promise((res,rej)=>{
      user.findOne().or([{name:userObject.name},{userName:userObject.userName}]).then((result)=>{
        if(!result)
       {        
           
        let response=createResponse("No record found!","No record found!",404);      
        return  rej(response);
       }
       else
       {
        let response=createResponse("Fetched Successfully!",result,200);
        return res(response);
       }
    }).catch((err)=>{
        let response=createResponse("Error occured!" ,{error:err},500);
     return rej(response);
    })
    })
   }

   //get single by ID object method
let getUserById=(id)=>{
    return new Promise((res,rej)=>{
        if(!ObjectID.isValid(id)){
        let response=createResponse('Incorrect Id!','Incorrect Id!',400);    
        return  rej(response);
        }
      user.findById(id).then((result)=>{
        if(!result)
       {   
        let response=createResponse("No record found!","No record found!",404);      
        return  rej(response);
       }
       else
       {
        let response=createResponse("Fetched Successfully!",result,200);
        return res(response);
       }
    }).catch((err)=>{
        let response=createResponse("Error occured!" ,{error:err},500);
     return rej(response);
    })
    })
   }

//delete many
let deleteUser=(userObject)=>{
    return new Promise((res,rej)=>{
       user.deleteMany().or([{name:userObject.name},{userName:userObject.userName}]).then((result)=>{
           if(result.n!=0)
           {
            let response=createResponse("Delete Successfully!",result,200);
            return res(response);
            }
            let response=createResponse("No record found!","No record found!",404); 
            return rej(response);
        }).catch(err=>{
            let response=createResponse("Error occured!" ,{error:err},500);
        return rej(response);
          })
    })
}
//delete one record
let deleteSingleUser=(userObject)=>{
    return new Promise((res,rej)=>{
       user.findOneAndDelete().or([{name:userObject.name},{userName:userObject.userName}]).then((result)=>{
        if(!result)
        {   
         let response=createResponse("No record found!","No record found!",404);      
         return  rej(response);
        }
        else
        {
         let response=createResponse("Delete Successfully!",result,200);
         return res(response);
        }
        }).catch(err=>{
        let response=createResponse("Error occured!" ,{error:err},500);
        return rej(response);
          })
    })
}
//delete by Id
let deleteUserById=(id)=>{
    return new Promise((res,rej)=>{
        if(!ObjectID.isValid(id)){
            let response=createResponse('Incorrect Id!','Incorrect Id!',400);          
            return  rej(response);
            }
       user.findByIdAndDelete(id).then(result=>{
        if(!result)
        {   
         let response=createResponse("No record found!","No record found!",404);      
         return  rej(response);
        }
        else
        {
         let response=createResponse("Delete Successfully!",result,200);
         return res(response);
        }
       }).catch(err=>{
        let response=createResponse("Error occured!" ,{error:err},500);
        return rej(response);
       })
    })
}
   // update methods
let updateUser=(userObj)=>{
    return new Promise((reject,respons)=>{
        user.findOneAndUpdate({_id:userObj.id},{$set :{password:userObj.password}},{new : true}).then(result => {
        if(!result)
        {   
         let response=createResponse("No record found!","No record found!",404);  
         console.log(response)    
         return  reject(response);
        }
        else
        {
         let response=createResponse("Updated Successfully!",result,200);
         console.log(response)
         return respons(response);
        }   
        })
        .catch( err => {
            let response=createResponse("Error occured!" ,{error:err},500);
            console.log(response)
            return reject(response);
        })
    })
}   