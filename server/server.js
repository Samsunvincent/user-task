const http = require('http');
const PORT = 3000;
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');

const{MongoClient, ObjectId} = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')

async function connect(){
    try {
        await client.connect();
        console.log("database connection established")
    } catch (error) {
        console.log('database connection refused',error);
    }
}

connect();


const server = http.createServer(async(req,res)=>{

    let db = client.db('user-db');
    let collection = db.collection('user-data')

    const parsed_url = url.parse(req.url,true);
    console.log('parsed_url',parsed_url)
    const pathname = parsed_url.pathname;
    console.log('pathname',pathname)

    if(pathname === '/'){
        res.writeHead(200,{'Content-Type' : 'text/html'});
        res.end(fs.readFileSync('../client/index.html'))
    }
    else if(pathname === '/style.css'){
        res.writeHead(200,{'Content-Type' :'text/css'});
        res.end(fs.readFileSync('../client/style.css'))
    }
    else if(pathname === '/script.js'){
        res.writeHead(200,{'Content-Type':"text/javascript"});
        res.end(fs.readFileSync('../client/script.js'));
    }
    else if(pathname === '/add-user.html'){
        res.writeHead(200,{'Content-Type' : "text/html"});
        res.end(fs.readFileSync('../client/add-user.html'));
    }
    else if(pathname ===  '/add-style.css'){
        res.writeHead(200,{'Content-Type' : "text/css"});
        res.end(fs.readFileSync('../client/add-style.css'))
    }
    else if(pathname === '/get-user.html' ){
        res.writeHead(200,{'Content-Type' : 'text/html'});
        res.end(fs.readFileSync('../client/get-user.html'))
    }
    else if(pathname ===  '/get-style.css'){
        res.writeHead(200,{'Conetent-Type' : 'text/css'});
        res.end(fs.readFileSync('../client/get-style.css'))
    }
    else if(pathname === '/get-single.html'){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(fs.readFileSync('../client/get-single.html'))
    }
    else if (pathname === '/get-single-style.css'){
        res.writeHead(200,{'Content-Type':'text/css'});
        res.end(fs.readFileSync('../client/get-single-style.css'))
    }
    else if (pathname === '/update.html'){
        res.writeHead(200,{'Content-Type' : 'text/html'});
        res.end(fs.readFileSync('../client/update.html'));
    }


    else if(pathname === '/submit' && req.method === 'POST'){
       let body = '';
       req.on('data',(chunks)=>{
        console.log('chunks',chunks);
        body = body+chunks.toString();
        console.log('body',body);

       });
       req.on('end',async()=>{
       try {
        let datas = JSON.parse(body);
        console.log('datas',datas,typeof(datas))
        //save to database
        await collection.insertOne(datas);

        res.writeHead(201,{'Content-Type' : "text/plain"});
        res.end('data added succesfully');
        
       } catch (error) {
            console.error('error adding data',error);
            res.writeHead(400,{'Content-Type' : 'text/plain'});
            res.end('failed to add data');
       }

        
       });
    }
    else if(pathname === '/submit' && req.method === 'GET'){
        try {
            const user_data = await collection.find().toArray();
            console.log("user_data",user_data ,typeof(user_data));

            res.writeHead(201,{'Content-Type' : 'application/json'});
            res.end(JSON.stringify(user_data));
        } catch (error) {
            console.log('error',error);
            res.writeHead(400,{'Content-Type' : 'text/plain'});
            res.end("failed to retrieve user data")
        }
    }
    else if(pathname === '/user' && req.method === 'GET'){
        
        // let query = parsed_url.query;
        // console.log("query : ",query);

        // let parsed_query = querystring.parse(query);
        // console.log("parsed_query : ",parsed_query);

        // let id = parsed_query.id;
        // console.log("id : ",id);
        let id = parsed_url.query.id;
        console.log("id : ",id);

        let _id = new ObjectId(id);
        console.log("_id : ",_id);

        let userData = await collection.findOne({_id});
        console.log("userData : ",userData);

        let strUserData = JSON.stringify(userData);
        console.log("strUserData : ",strUserData);

        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(strUserData);

    }else if(pathname === '/users' && req.method === 'PUT' ){
        

        let id = parsed_url.query.id;
        console.log("id :",id);

        let _id = new ObjectId(id);
        console.log("new_object_id",_id);



        let body = '';
        req.on('data',(chunks)=>{
            body = chunks.toString();
            console.log("body111",body,'body from body 11111',typeof(body));
        })
        req.on('end',async()=>{
            let parsed_body = JSON.parse(body);
            console.log("parsed_body",parsed_body);

            let data = {
                name : parsed_body.name,
                email : parsed_body.email,
                phone : parsed_body.phone,
                password : parsed_body.password,
            }
            console.log('data11111',data)

            let todatabase = await collection.updateOne({_id},{$set:data})
            res.writeHead(201,{'Conetent-Type':'text/plain'});
            res.end("user updated successfully");

            console.log('todatabase',todatabase);
        })

       
    }

    else if(pathname === '/del' && req.method ==='DELETE'){
        let id = parsed_url.query.id;
        console.log("id",id);

        let _id = new ObjectId(id);
        console.log('_id : ',_id);

        let userDatas = await collection.deleteOne({_id});
        console.log("userData",userDatas);

        let strUserData = JSON.stringify(userDatas);
        console.log("strUserData",strUserData);

        res.writeHead(200,{'Content-Type' : 'application/json'});
        res.end(strUserData)
    }

    
})

server.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});