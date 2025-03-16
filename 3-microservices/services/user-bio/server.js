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
