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
