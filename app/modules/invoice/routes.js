var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var prepend = require('../welcome/prepend');
var numberFormat = require('../welcome/numberFormat');

function finvoice(req,res,next){
  /*Transaction Info for Invoice, Match(params);
  *(tbltransaction)-(tblchat)-(tblservice)*(tbluser)*(tblservicetag)*/
  var stringquery="SELECT tbltransaction.* , tbluser.*, tblservicetag.* FROM tbltransaction INNER JOIN tblchat ON intTransChatID= intChatID INNER JOIN tblservice ON intChatServ= intServID INNER JOIN tbluser ON intServAccNo= intAccNo INNER JOIN tblservicetag ON intServTag= intServTagID WHERE intTransID= ? ";
  stringquery = stringquery.concat("UNION SELECT tbltransaction.* , tbluser.*, tblservicetag.* FROM tbltransaction INNER JOIN tblchat ON intChatID= intTransChatID INNER JOIN tblservice ON intChatServ= intServID INNER JOIN tbluser ON intChatSeeker= intAccNo INNER JOIN tblservicetag ON intServTag= intServTagID WHERE intTransID= ?");
  db.query(stringquery,[req.params.transid, req.params.transid], (err, results, fields) => {
      if (err) console.log(err);
      if(!(!results[0])){
        date = results[0].dtmTransScheduled;
        for(count=0;count<results.length;count++){
          results[count].date = [date.getMonth()+1,date.getDate(),date.getFullYear()].join('/');
          results[count].prepAccNo = prepend(results[count].intAccNo);
          results[count].prepTransID = prepend(results[count].intTransID);
          results[count].formatPrice = numberFormat(results[count].fltTransPrice.toFixed(2));
        }
      }
      req.finvoice= results;
      return next();
    });
}

function render(req,res){
  switch(req.valid){
    case 1:
      res.render('invoice/views/index', {invoicetab: req.finvoice});
      break;
    case 2:
    case 3:
      if(!req.finvoice[0]){
        res.redirect('/noroute');
      }
      else if(req.session.user == req.finvoice[0].intAccNo || req.session.user == req.finvoice[1].intAccNo){
        res.render('invoice/views/index', {invoicetab: req.finvoice});
        break;
      }
      else{
        res.redirect('/noroute');
      }
  }
}

router.get('/:transid', flog, finvoice, render);

exports.invoice = router;
