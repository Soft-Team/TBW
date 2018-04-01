# TBW

Instruction:

    npm install
    run SQL Dump
    create .env (copy from env sample)
      > change password
    run
      > nodemon index.js OR node index.js

Starting Pages:

    welcome: http://localhost:3000/welcome

Dev Notes:

	nodemon -e js,pug
    
	function ftest(req,res,next){
	/*Test Function, Match(params);
    *(tblchat)*/
    db.query("SELECT * FROM tblchat WHERE intChatID= ?",[req.params.chatid], (err, results, fields) => {
    if (err) console.log(err);
    if(!(!results[0])){

    }
    /*console.log('-------TEST_RESULTS-------');
    console.log(results);*/
    req.ftest= results;
    return next();
    });
    }
