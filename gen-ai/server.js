const express = require('express');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

const app = express();
const PORT = 3000;
const secretKey = 'My super secret key';
const saltRounds = 10;

// Database connection
const connection = mysql.createConnection({
  host: 'sql5.freemysqlhosting.net',
  user: 'sql5750146',
  password: 'ShIFsPHghE',
  database: 'sql5750146'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified; // Attach decoded token payload to req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token: Please log in again' });
  }
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Protect all routes except /login and /register
app.use((req, res, next) => {
  const unprotectedRoutes = ['/api/login', '/api/register'];
  if (!unprotectedRoutes.includes(req.path)) {
    return verifyToken(req, res, next);
  }
  next();
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Login.js'));
});


/* //Summary text part 1 
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeAndSummarize() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://hatchworks.com/blog/gen-ai/generative-ai-use-cases/');

  const content = await page.content();
  const $ = cheerio.load(content);

  const summary = {
    title: $('h1').first().text().trim(),
    sections: []
  };

  $('h2').each((index, element) => {
    const sectionTitle = $(element).text().trim();
    const sectionContent = $(element).next('p').text().trim();
    summary.sections.push({ title: sectionTitle, content: sectionContent });
  });

  await browser.close();

  fs.writeFileSync('./public/generative_ai_summary.json', JSON.stringify(summary, null, 2));
  console.log('Summary saved to generative_ai_summary.json');
}

scrapeAndSummarize(); */ 



//Summary Content Web Scraping Endpoint

// Effiecent code for Text Summarization using Puppeteer and Cheerrio
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json()); 


async function scrapeAndSummarize() {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://hatchworks.com/blog/gen-ai/generative-ai-use-cases/', {
      waitUntil: 'domcontentloaded'
    });

    // Wait for key content to load
    await page.waitForSelector('h1');

    const content = await page.content();
    const $ = cheerio.load(content);

    const summary = {
      title: $('h1').first().text().trim(),
      sections: []
    };

    $('h2').each((index, element) => {
      const sectionTitle = $(element).text().trim();
      const sectionContent = $(element).nextUntil('h2').text().trim();
      summary.sections.push({ title: sectionTitle, content: sectionContent });
    });

    // Ensure output directory exists
    if (!fs.existsSync('./public')) {
      fs.mkdirSync('./public', { recursive: true });
    }

    fs.writeFileSync('./public/generative_ai_summary.json', JSON.stringify(summary, null, 2));
    console.log('Summary saved to generative_ai_summary.json');
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    if (browser) await browser.close();
  }
}

scrapeAndSummarize();



/*  

///this was for local Testing 
//commented theis for Depolying
let users = [
  { id: 1, username: 'Mrinal', password: bcrypt.hashSync('Mrinal', saltRounds), firstname: 'Mrinal',lastame: 'Raj' },
  { id: 2, username: 'HW7', password: bcrypt.hashSync('100', saltRounds), firstname: 'HW7' ,lastname: 'Alex' }
];*/




// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM user WHERE username = ?';
  connection.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ 
        success: false, 
        err: 'Internal server error' 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        token: null,
        err: 'Username or password is incorrect'
      });
    }

    const user = results[0];
    console.log('User fetched:', user);

    // Ensure user.password exists
    if (!user.password) {
      return res.status(500).json({
        success: false,
        err: 'Internal server error: Password field missing'
      });
    }

    try {
      const match = await bcrypt.compare(password, user.password);
      if (password==user.password || match) {
        const token = jwt.sign(
          { 
            id: user.id, 
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname 
          }, 
          secretKey, 
          { expiresIn: '6000s' }
        );
        
        res.json({
          success: true,
          token,
          firstname: user.firstname,
          lastname: user.lastname
        });
      } else {
        res.status(401).json({
          success: false,
          token: null,
          err: 'Username or password is incorrect'
        });
      }
    } catch (error) {
      console.error('Error comparing passwords:', error);
      res.status(500).json({
        success: false,
        err: 'Internal server error'
      });
    }
  });
});



// For New Registration
// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password, firstname, lastname } = req.body;

  // Check if all required fields are provided
  if (!username || !password || !firstname || !lastname) {
    return res.status(400).json({ 
      success: false, 
      err: 'All fields (username, password, firstname, lastname) are required' 
    });
  }

  // Check if the username already exists
  const checkQuery = 'SELECT * FROM user WHERE username = ?';
  connection.query(checkQuery, [username], async (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ 
        success: false, 
        err: 'Internal server error' 
      });
    }

    if (results.length > 0) {
      return res.status(400).json({ 
        success: false, 
        err: 'Username already exists' 
      });
    }

    // Hash the password
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const insertQuery = `
        INSERT INTO user (username, password, firstname, lastname)
        VALUES (?, ?, ?, ?)
      `;
      connection.query(insertQuery, [username, hashedPassword, firstname, lastname], (err, result) => {
        if (err) {
          console.error('Error inserting user into database:', err);
          return res.status(500).json({ 
            success: false, 
            err: 'Internal server error' 
          });
        }

        // Return success response
        res.status(201).json({
          success: true,
          message: 'User registered successfully',
        });
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).json({ 
        success: false, 
        err: 'Internal server error' 
      });
    }
  });
});


/* Articles
const { EventRegistry, QueryArticles, ArticleInfoFlags, ReturnInfo, RequestArticlesInfo } = require('eventregistry');

app.get('/api/news', async (req, res) => {
  try {
    const er = new EventRegistry({ apiKey: "bcc0bf06-b9a5-4b43-b35a-f36b088f7c3b" });
    
    const q = new QueryArticles({
      keywords: "Generative AI OR Artificial Intelligence",
      lang: "eng",
      dateStart: "2024-06-01",
      dateEnd: "2024-12-04"
    });

    const articleInfo = new ArticleInfoFlags({
      concepts: true,
      categories: true,
      image: true,
      title: true,
      body: true
    });

    const returnInfo = new ReturnInfo({
      articleInfo: articleInfo
    });

    const requestArticlesInfo = new RequestArticlesInfo({
      page: 1,
      count: 5, // Change this number for more Information
      returnInfo: returnInfo
    });

    q.setRequestedResult(requestArticlesInfo);
    const response = await er.execQuery(q);

    const articles = response?.articles?.results?.map(article => ({
      title: article.title || 'No Title',
      description: article.body?.substring(0, 150) + '...' || 'No description available',
      imageUrl: article.image || null,
      url: article.url // Include the article URL
    })) || [];

    res.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch articles',
      articles: [] 
    });
  }
}); */


//Articles 

const { EventRegistry, QueryArticles, ArticleInfoFlags, ReturnInfo, RequestArticlesInfo } = require('eventregistry');

app.get('/api/news', async (req, res) => {
  try {
    const er = new EventRegistry({ apiKey: "bcc0bf06-b9a5-4b43-b35a-f36b088f7c3b" });
    
    const q = new QueryArticles({
      keywords: "Generative AI",
      lang: "eng",
      dateStart: "2024-06-01",
      dateEnd: "2024-12-04",
      isDuplicateFilter: "skipDuplicates"
    });

    const articleInfo = new ArticleInfoFlags({
      concepts: true,
      categories: true,
      image: true,
      title: true,
      body: true,
      sourceUri: true,
      url: true,
      links: true
    });

    const returnInfo = new ReturnInfo({
      articleInfo: articleInfo,
      includeArticleImage: true,
      includeArticleLinks: true
    });

    const requestArticlesInfo = new RequestArticlesInfo({
      page: 1,
      count: 5,
      returnInfo: returnInfo,
      sortBy: "date",
      sortByAsc: false
    });

    q.setRequestedResult(requestArticlesInfo);
    const response = await er.execQuery(q);

    const articles = response?.articles?.results?.map(article => ({
      title: article.title || 'No Title',
      description: article.body?.substring(0, 150) + '...' || 'No description available',
      imageUrl: article.image?.url || article.image || null,
      url: article.url || article.links?.[0] || null,
      source: article.source?.uri || null
    })) || [];

    res.json({ 
      articles,
      total: response?.articles?.totalResults || 0
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch articles',
      articles: [] 
    });
  }
});



// Summary data endpoint
app.get('/api/summary', (req, res) => {

  const fetchChartData = async () => {
    try {
      const data = {};

      for (const [key, query] of Object.entries(queries)) {
        const results = await new Promise((resolve, reject) => {
          connection.query(query, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
          });
        });

        data[key] = {
          labels: results.map((row) => row.label),
          values: results.map((row) => row.value),
        };
      }

      res.json(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      res.status(500).json({ error: 'Failed to fetch chart data' });
    }
  };

  fetchChartData();
});


// Reports data endpoint
app.get('/api/register', (req, res) => {
  const queries = {
    doughnut: 'SELECT label, value FROM doughnut_chart_data', //fetch Doughnut data from their the tables 
    bar: 'SELECT label, value FROM bar_chart_data',  //fetch Bar Chart data from their the tables 
    line: 'SELECT label, value FROM line_chart_data',  //fetch Line chart data from the respective tables 
  };

  const fetchChartData = async () => {
    try {
      const data = {};

      for (const [key, query] of Object.entries(queries)) {
        const results = await new Promise((resolve, reject) => {
          connection.query(query, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
          });
        });

        data[key] = {
          labels: results.map((row) => row.label),
          values: results.map((row) => row.value),
        };
      }

      res.json(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      res.status(500).json({ error: 'Failed to fetch chart data' });
    }
  };

  fetchChartData();
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});