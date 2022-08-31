const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs')
app.use(express.static('public'))


mongoose.connect('mongodb://localhost:27017/wikiDB')

const articleSchema = mongoose.Schema({
    title:String,
    content:String
})

const article = mongoose.model('article',articleSchema);

// Request targetting all articles.......................................................................................


app.get('/articles',function(req,res){
    article.find({},function(err,foundArticles){
        if(!err){
            res.send(foundArticles)
        }else{
            res.send(err)
        }
        
      
    })
})

app.post('/articles',function(req,res){

    const newArticle = new article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send('Succesfully added a new article')

        }else{
            res.send(err)
        }
    })

})

app.delete('/articles',function(req,res){
    article.deleteMany({},function(err){
        if(!err){
            res.send('Successfully deleted all the articles');
        }else{
            res.send(err);
        }
    })
})



// request targetting specific article.......................................................

app.route('/articles/:articleTitle')



.get(function(req,res){
    article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(!err){
            res.send(foundArticle)
        }else{
            res.send("no article found with that matching")
        }
    })

})

.put(function(req,res){
    article.updateMany({title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        function(err){
            if(!err){
                res.send('updated succesfuly')
            }else{
                res.send(err)
            }
        })

})

.patch(function(req,res){
    article.updateOne({title:req.params.articleTitle},
        {$set: req.body},function(err){
            if(!err){
                res.send('successfuly updated articles')
            }else{
                res.send(err)
            }
        })
})
.delete(function(req,res){
    article.deleteOne({title:req.params.articleTitle},function(err){
        if(!err){
            res.send('Successfully deleted that particular article');
        }else{
            res.send(err);
        }
    })
})



app.listen(3000,function(){
    console.log('listening to port 300')
})

