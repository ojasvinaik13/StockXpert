const express = require("express");
const path = require("path");
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ojasvinaik:webtech3ass@cluster0.sr6fzab.mongodb.net/?retryWrites=true&w=majority";
const bodyParser = require('body-parser');

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
let db;
client.connect().then((client)=>{    
    db = client.db('HW3');
    console.log('Connected to MongoDB');
}).catch((error) => console.error('Error connecting to MongoDB:', error));
//Code Credit - From MongoDB Website

const app = express();
const PORT = process.env.PORT || 3000;
// app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:4200',
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apikey1 = "co3igm9r01qq6k8jef2gco3igm9r01qq6k8jef30";
const apikey2 = "cSoJQ40pXp1iQg28eqfYj0cOs3MhtTXY"
const apikey3 = "co5neehr01qrjq1gcc6gco5neehr01qrjq1gcc70"
const apikey4 = "co5nf9hr01qrjq1gce7gco5nf9hr01qrjq1gce80"

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "./dist/client/browser/index.html"));
// });
app.use(express.static('dist/client/browser'));

app.get("/getwatchlist", (req, res)=>{
    db.collection('watchlist').find().toArray().then((data) => res.send({"results": data}).status(200))
    .catch((error) => res.status(error).json({ error: 'Internal server error' }));
});
app.get("/isonwatchlist/:ticker", (req, res)=>{
    db.collection('watchlist').findOne({ticker:req.params.ticker}).then((data) => res.send({"flag":!!data}).status(200))
    .catch((error) => res.status(error).json({ error: 'Internal server error' }));
});
app.delete("/delfromwatchlist/:ticker", (req, res)=>{
    try{
        let t = req.params.ticker;
        // console.log(t);
        result = db.collection('watchlist').deleteOne({ticker:t});
        
        if (result) {
            res.status(200).json({ message: 'Document deleted successfully' });
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    }catch(error){
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post("/addtowatchlist", (req, res)=>{
    try{
        const data = req.body;
        // console.log(data);
        result = db.collection('watchlist').insertOne({"ticker":data["ticker"],"companyName":data["companyName"]});
        res.status(201).json({ message: 'Document added successfully', insertedId: result.insertedId });
    }catch (error) {
        console.error('Error adding document:', error);
        res.status(500).json({ message: 'Internal server error' });
      }  
    
});
app.get("/getBalance", (req, res)=>{
    db.collection('portfolio').findOne({"wallet": { $exists: true }}).then((data) => res.send(data).status(200))
    .catch((error) => res.status(error).json({ error: 'Internal server error' }));
});
app.get("/getportfolio", (req, res)=>{
    db.collection('portfolio').find({"ticker": { $exists: true }}).toArray().then((data) => res.send({"results": data}).status(200))
    .catch((error) => res.status(error).json({ error: 'Internal server error' }));
});
app.post("/buystock", (req, res)=>{
    try{
        const data = req.body;
        // console.log(data);
        result = db.collection('portfolio').insertOne({"ticker":data["ticker"],"companyName":data["companyName"],
        "timestamp":data["timestamp"],"price":data["price"],"quantity":data["quantity"]});
        res.status(201).json({ message: 'Document added successfully', insertedId: result.insertedId });
    }catch (error) {
        console.error('Error adding document:', error);
        res.status(500).json({ message: 'Internal server error' });
      }  
});

app.put("/updateBalance",(req,res)=>{
    try{
        const data = req.body.wallet;
        // console.log(data);
        result = db.collection('portfolio').updateOne({"wallet":{$exists:true}},{$set: { "wallet": data }})
        res.status(201).json({ message: 'Wallet balance updated successfully', insertedId: result.insertedId });
    }catch (error) {
        console.error('Error adding document:', error);
        res.status(500).json({ message: 'Internal server error' });
      }

});
app.put("/sellstock",async(req,res)=>{
    try{
        const ticker = req.body.ticker;
        const quantity = req.body.quantity;
        let remainingQuantity = quantity;
        const documents = await db.collection('portfolio').find({ ticker: ticker }).sort({ timestamp: 1 }).toArray();
        for (let doc of documents) {
            if (remainingQuantity <= 0) {
              break;
            }
            else if(remainingQuantity>=doc.quantity){
                db.collection('portfolio').deleteOne({ _id: doc._id });
                remainingQuantity -= doc.quantity;
            }
            else{
            let quantityToUpdate = Math.min(remainingQuantity, doc.quantity);
            await db.collection('portfolio').updateOne({ _id: doc._id }, { $inc: { quantity: -quantityToUpdate } });
            remainingQuantity -= quantityToUpdate;
            }
          }
        res.status(201).json({ message: 'Updated successfully'});
    }catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
});


app.get("/search/company/:ticker", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${req.params.ticker}&token=${apikey3}`)
            .then(data1 => {
                if (data1.status === 200) {
                    // console.log(datarec);
                    return data1.json();
                } else {                    
                    throw {'status': data1.status, 
                           'reason': `GET Company Request for ${req.params.ticker} failed. Reason: ${data1.statusText}`};
                }
            }).then(data2 => {
                let d = {}
                d["exchange"] = data2.exchange;
                d["finnhubIndustry"] = data2.finnhubIndustry;
                d["ipo"] = data2.ipo;
                d["logo"] = data2.logo;
                d["name"] = data2.name;
                d["ticker"] = data2.ticker;
                d["weburl"] = data2.weburl;
                // console.log(data2);
                res.send(d);
            }).catch(err => {
                res.status(err.status).send({ 'Error': err.reason })
            })
    // }
});

app.get("/search/historical/:ticker", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // let currentDate = new Date();
    // let year = currentDate.getFullYear();
    // let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    // let day = String(currentDate.getDate()).padStart(2, '0');
    // let formattedDate = `${year}-${month}-${day}`;
    // console.log(formattedDate);

    // let cd = new Date();
    // cd.setMonth(cd.getMonth() - 6);
    // cd.setDate(cd.getDate() - 1);
    // let y = cd.getFullYear();
    // let m = String(cd.getMonth() + 1).padStart(2, '0');
    // let d = String(cd.getDate()).padStart(2, '0');
    // let fd = `${y}-${m}-${d}`;
    // console.log(fd);
    if (!('fromDate' in req.query)) {
        // console.log("hello1");
        res.status(404).send({ 'error': 'Missing fromDate query parameter' });
    }
    else if (!('toDate' in req.query)) {
        // console.log("hello2");
        res.status(404).send({ 'error': 'Missing toDate query parameter' });
    }
    else {
        // console.log("hello3");
    fetch(`https://api.polygon.io/v2/aggs/ticker/${req.params.ticker}/range/1/${req.query.timespan}/${req.query.fromDate}/${req.query.toDate}?adjusted=true&sort=asc&apiKey=${apikey2}`).then(data1 => {
            if (data1.status === 200) {
                // console.log("hello4");
                return data1.json();
            } else {                    
                throw {'status': data1.status, 
                       'reason': `GET Historical Data Request for ${req.params.ticker} failed. Reason: ${data1.statusText}`};
            }
        }).then(data2 => {
            // console.log(data2);
            let d = {}
            d["results"] = data2.results;
            res.send(d);
        }).catch(err => {
            res.status(err.status).send({ 'Error': err.reason })
        })
    }       
});

app.get("/search/stockquote/:ticker", (req, res) => {
    res.setHeader('Content-Type', 'application/json');   
    fetch(`https://finnhub.io/api/v1/quote?symbol=${req.params.ticker}&token=${apikey4}`).then(data1 => {
            if (data1.status === 200) {
                return data1.json();
            } else {                    
                throw {'status': data1.status, 
                       'reason': `GET Stock Quote Request for ${req.params.ticker} failed. Reason: ${data1.statusText}`};
            }
        }).then(data2 => {
            res.send(data2);
        }).catch(err => {
            res.status(err.status).send({ 'Error': err.reason })
        })     
});

app.get("/autocomplete", (req, res) => {
    res.setHeader('Content-Type', 'application/json');   
    // res.setHeader('X-Content-Type-Options', 'nosniff');
    fetch(`https://finnhub.io/api/v1/search?q=${req.query.searchInput}&token=${apikey1}`).then(data1 => {
            if (data1.status === 200) {
                return data1.json();
            } 
            // else {                    
            //     throw {'status': data1.status, 
            //            'reason': `Autocomplete failed. Reason: ${data1.statusText}`};
            // }
        }).then(data2 => {
            res.send(data2);
        }).catch(err => {
            console.log("UH OH")
            res.status(err.status).send({ 'Error': err.reason })
        })     
});

app.get("/search/company-news/:ticker", (req, res) => {
    res.setHeader('Content-Type', 'application/json');   
    fetch(`https://finnhub.io/api/v1/company-news?symbol=${req.params.ticker}&from=${req.query.fromDate}&to=${req.query.toDate}&token=${apikey1}`)
    .then(data1 => {
            if (data1.status === 200) {
                return data1.json();
            } else {                    
                throw {'status': data1.status, 
                       'reason': `GET News Request for ${req.params.ticker} failed. Reason: ${data1.statusText}`};
            }
        }).then(data2 => {
            let d = {}
            d["results"] = data2
            res.send(d);
        }).catch(err => {
            res.status(err.status).send({ 'Error': err.reason })
        })     
});

app.get("/search/recommendation-trends/:ticker", (req, res) => {
    res.setHeader('Content-Type', 'application/json');   
    fetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${req.params.ticker}&token=${apikey1}`)
    .then(data1 => {
            if (data1.status === 200) {
                return data1.json();
            } else {                    
                throw {'status': data1.status, 
                       'reason': `GET Recommendations Request for ${req.params.ticker} failed. Reason: ${data1.statusText}`};
            }
        }).then(data2 => {
            let d = {}
            d["results"] = data2
            res.send(d);
        }).catch(err => {
            res.status(err.status).send({ 'Error': err.reason })
        })     
});

app.get("/search/insider-sentiment/:ticker", (req, res) => {
    res.setHeader('Content-Type', 'application/json');   
    fetch(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${req.params.ticker}&from=2022-01-01&token=${apikey1}`)
    .then(data1 => {
            if (data1.status === 200) {
                return data1.json();
            } else {                    
                throw {'status': data1.status, 
                       'reason': `GET Insider Sentiments Request for ${req.params.ticker} failed. Reason: ${data1.statusText}`};
            }
        }).then(data2 => {
            res.send(data2);
        }).catch(err => {
            res.status(err.status).send({ 'Error': err.reason })
        })     
});

app.get("/search/company-peers/:ticker", (req, res) => {
    res.setHeader('Content-Type', 'application/json');   
    fetch(`https://finnhub.io/api/v1/stock/peers?symbol=${req.params.ticker}&token=${apikey1}`)
    .then(data1 => {
            if (data1.status === 200) {
                return data1.json();
            } else {                    
                throw {'status': data1.status, 
                       'reason': `GET Company Peers Request for ${req.params.ticker} failed. Reason: ${data1.statusText}`};
            }
        }).then(data2 => {
            let d = {}
            d["results"] = data2
            res.send(d);
        }).catch(err => {
            res.status(err.status).send({ 'Error': err.reason })
        })     
});

app.get("/search/company-earnings/:ticker", (req, res) => {
    res.setHeader('Content-Type', 'application/json');   
    fetch(`https://finnhub.io/api/v1/stock/earnings?symbol=${req.params.ticker}&token=${apikey1}`)
    .then(data1 => {
            if (data1.status === 200) {
                return data1.json();
            } else {                    
                throw {'status': data1.status, 
                       'reason': `GET Company Earnings Request for ${req.params.ticker} failed. Reason: ${data1.statusText}`};
            }
        }).then(data2 => {
            let d = {}
            d["results"] = data2
            res.send(d);
        }).catch(err => {
            res.status(err.status).send({ 'Error': err.reason })
        })     
});
