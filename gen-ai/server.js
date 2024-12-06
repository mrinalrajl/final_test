const express = require('express');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');
const mysql=require('mysql')


const app = express();
const PORT = 3000;
const secretKey = 'My super secret key';
const saltRounds = 10; 

var verifyToken = function(req, res, next) {
  var tokenData = req.header('authorization').split(" ")[1];
  if (!tokenData) {
      return res.status(400).send({ data: "Token NOT found" });
  }

  var authValue = req.header('authorization').split(" ")[1];
  if (authValue) {
      tokenCheck = authValue;
      try {
          tokenStatus = jwt.verify(tokenCheck, secretKey);
          if (!tokenStatus) {
              return res.status(400).send("No token available to decode");
          }
          if (!tokenStatus.username) {
              return res.status(400).send("Unauthorized User");
          }
          next();
      } catch (err) {
          res.json({
              success: false,
              myContent: err.toString() + " Please login again!"
          });
      }
  } else {
      return res.status(400).send("No header present");
  }
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const jwtMW = expressjwt({
  secret: secretKey,
  algorithms: ['HS256']
});

var connection = mysql.createConnection({
  host: 'sql5.freemysqlhosting.net',
  user: 'sql5750146',
  password: 'ShIFsPHghE',
  database: 'sql5750146'
}); 


// Database connection
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
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



/*let users = [
  { id: 1, username: 'Mrinal', password: bcrypt.hashSync('Mrinal', saltRounds), firstname: 'Mrinal',lastame: 'Raj' },
  { id: 2, username: 'HW7', password: bcrypt.hashSync('100', saltRounds), firstname: 'HW7' ,lastname: 'Alex' }
];*/

const industryData = {
  labels: ['Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education'],
  values: [78, 85, 65, 72, 58]
};


const performanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  values: [65, 75, 85, 89, 92, 95]
};  





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
      if (password==user.password) {
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
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, firstname, lastname } = req.body;

    // Check if user already exists
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      firstname,
      lastname
    };

    // Save user (in a real app, you'd save to a database)
    users.push(newUser);

    // Create and send JWT token
    const token = jwt.sign({ userId: newUser.id }, secretKey, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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



///reports

app.get('/api/industry-adoption', (req, res) => {
  res.json({
    labels: industryData.labels,
    values: industryData.values
  });
});

app.get('/api/performance-trends', (req, res) => {
  res.json({
    labels: performanceData.labels,
    values: performanceData.values
  });
});




app.get('/api/summary-data', (req, res) => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [50, 60, 70, 85, 90, 100]
  };
  res.json(data);
});

app.get('/api/reports-data', (req, res) => {
  const data = {
    categories: ['Healthcare', 'Finance', 'Retail', 'Education', 'Tech'],
    adoption_rates: [80, 75, 65, 85, 90]
  };
  res.json(data);
});

// Summary data endpoint
app.get('/api/summary', (req, res) => {
  res.json(summaryData);
});

// Reports data endpoint
app.get('/api/reports', (req, res) => {
  res.json(reportsData);
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});