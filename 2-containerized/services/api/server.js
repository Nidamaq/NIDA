const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const moment = require("moment");
const db = require("./db.json");

const app = new Koa();
const router = new Router();

// Log requests
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log("%s %s - %sms", ctx.method, ctx.url, ms);
});

// Existing routes
router.get("/api/users", async (ctx) => {
  ctx.body = db.users;
});

router.get("/api/users/:userId", async (ctx) => {
  const id = parseInt(ctx.params.userId);
  ctx.body = db.users.find((user) => user.id == id);
});

router.get("/api/threads", async (ctx) => {
  ctx.body = db.threads;
});

router.get("/api/threads/:threadId", async (ctx) => {
  const id = parseInt(ctx.params.threadId);
  ctx.body = db.threads.find((thread) => thread.id == id);
});

router.get("/api/posts", async (ctx) => {
  ctx.body = db.posts;
});

router.get("/api/posts/in-thread/:threadId", async (ctx) => {
  const id = parseInt(ctx.params.threadId);
  ctx.body = db.posts.filter((post) => post.thread == id);
});

router.get("/api/posts/by-user/:userId", async (ctx) => {
  const id = parseInt(ctx.params.userId);
  ctx.body = db.posts.filter((post) => post.user == id);
});

// New Services

// 1. Posts Summary Service
router.get("/api/posts-summary", async (ctx) => {
  const fromDate = ctx.query.from
    ? moment(ctx.query.from)
    : moment().subtract(1, "month");
  const toDate = ctx.query.to ? moment(ctx.query.to) : moment();

  const postSummary = db.posts.filter((post) => {
    const postDate = moment(post.timestamp);
    return postDate.isBetween(fromDate, toDate);
  }).length;

  ctx.body = {
    totalPosts: postSummary,
    from: fromDate.format(),
    to: toDate.format(),
  };
});

// 2. Peak Hours Analyzer Service
router.get("/api/peak-hours", async (ctx) => {
  const postHours = db.posts.map((post) => moment(post.timestamp).hour());
  const peakHour = postHours.reduce((acc, hour) => {
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const maxPosts = Math.max(...Object.values(peakHour));
  const peakTime = Object.keys(peakHour).find(
    (hour) => peakHour[hour] === maxPosts
  );

  ctx.body = { peakHour: peakTime, totalPosts: maxPosts };
});

//3. Get user bio and username by userId (GET)
router.get('/api/user-bio/:userId', async (ctx) => { 
  const id = parseInt(ctx.params.userId);
  const user = db.users.find((user) => user.id === id);

  if (user) {
    ctx.body = { username: user.username, bio: user.bio };
  } else {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
  }
});


// API ready message
router.get("/api/", async (ctx) => {
  ctx.body = "API ready to receive requests";
});

router.get("/", async (ctx) => {
  ctx.body = "Ready to receive requests";
});

// Body parser middleware
app.use(bodyParser());

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
