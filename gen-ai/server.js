const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const PORT = 3000;
const secretKey = 'My super secret key';
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());

let users = [
  { id: 1, username: 'Mrinal', password: bcrypt.hashSync('Mrinal', saltRounds), firstname: 'Mrinal',lastame: 'Raj' },
  { id: 2, username: 'HW7', password: bcrypt.hashSync('100', saltRounds), firstname: 'HW7' ,lastname: 'Alex' }
];

const industryData = {
  labels: ['Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education'],
  values: [78, 85, 65, 72, 58]
};


const performanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  values: [65, 75, 85, 89, 92, 95]
};


const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(req.token, secretKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};


/// Login Code 
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  
  if (user && await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1m' });
    res.json({
      accessToken,
      firstname: user.firstname,
      lastname: user.lastname
    });
  } else {
    res.status(401).json({ error: 'Invalid login credentials' });
  }
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