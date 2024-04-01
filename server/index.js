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
// async function run() {
//   try {
//     // await client.connect();
//     const db = client.db("hw3");
//     const watchlist = db.collection('watchlist');

//     // console.log(watchlist.collectionName);
//   } 
//   finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);


const app = express();
const port = 3000;
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//     res.setHeader('x-content-type-options', 'nosniff');
//     next();
//   });
//   app.use((req, res, next) => {
//     res.removeHeader('Expires');
//     next();
//   });
  
  // Middleware to set 'Cache-Control' header
//   app.use((req, res, next) => {
//     res.setHeader('Cache-Control', 'no-store');
//     next();
//   });
//   app.use((req, res, next) => {
//     res.setHeader('Server', 'Express');
//     next();
//   });
const apikey1 = "co3igm9r01qq6k8jef2gco3igm9r01qq6k8jef30";
const apikey2 = "cSoJQ40pXp1iQg28eqfYj0cOs3MhtTXY"

app.listen(port, () => console.log(`Server listening at port ${port}`));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

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


app.get("/search/company/:ticker", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // if (!isValidTicker(req.params.ticker)) {
    //     res.status(404).send({ 'error': 'invalid ticker' })
    // } else {
        // const params = { 'token': 'cn8png1r01qocbpguaq0cn8png1r01qocbpguaqg' }
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${req.params.ticker}&token=${apikey1}`) 
        // + new URLSearchParams(params))
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
    fetch(`https://finnhub.io/api/v1/quote?symbol=${req.params.ticker}&token=${apikey1}`).then(data1 => {
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

/*

api.get('/search', async (req: Request, res) => {
    try {
        const query = Parser.parseStringParameter(req.query.query);
        const data = await Service.search(query);
        return Response.sendOk(res, data);
    } catch (error) {
        return Response.sendError(res, error);
    }
});
export const parseStringParameter = (value: any): string => {
    if (!Validator.isNonEmptyString(value)) {
        throw new BadRequestError();
    }
    return (value as string).trim();
};
export const isNonEmptyString = (value: any): boolean => value && typeof value === 'string' && (value as string).trim().length > 0;

export const isNonEmptyArray = (value: any): boolean => Array.isArray(value) && (value as any[]).length > 0;

export const isNumber = (value: any): boolean => typeof value === "number";

export const search = async (query: string): Promise<SearchResultItem[]> => {
    const items = await Tiingo.search(query);
    const searchResultItems: SearchResultItem[] = [];
    items.forEach(item => {
        try {
            searchResultItems.push({
                ticker: Parser.parseString(item.ticker),
                name: Parser.parseString(item.name)
            });
        } catch (error) {
            // Skip item
        }
    });
    return Parser.parseArray(searchResultItems);
};

export const search = async (query: string): Promise<any[]> => {
    const url = buildURL(`tiingo/utilities/search/${query}`);
    const data = await get(url, {
        columns: 'ticker,name'
    });
    return Parser.parseArray(data);
};
const get = async (url: string, params: { [param: string]: any } = {}) => {
    params.token = Token;
    return await Request.get(url, params);
};

export const get = async (url: string, params: { [param: string]: any } = {}): Promise<any> => {
    let response: AxiosResponse;
    try {
        response = await Axios.get(url, {
            params
        });
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            if (status === 404) {
                throw new NotFoundError();
            } else {
                throw new UncheckedError(status);
            }
        } else {
            throw new NetworkError();
        }
    }
    if (!response.data) {
        throw new NotFoundError();
    }
    return response.data;
};

*/