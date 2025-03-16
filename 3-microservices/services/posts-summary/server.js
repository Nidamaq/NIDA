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

//Posts Summary Service
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
