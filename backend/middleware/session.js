import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false, // don't save session if not modified
  saveUninitialized: false, // don't create empty sessions
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: "Softzia", // session collection in this DB
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000, // 24h
    httpOnly: true,
    secure: false, // set true if using HTTPS in production
  },
});

export default sessionMiddleware;
