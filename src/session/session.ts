import session from "express-session";
import IORedis from "ioredis";
import RedisStore from "connect-redis";

export {expressSession}

const expressSession = session({
    store: new RedisStore({
        client: new IORedis(process.env.REDIS_URL as string)
    }),
    secret: "session-secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
})