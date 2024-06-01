import mongoose from "mongoose";

// Locale database connector
async function dbConnectLocal() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_LOCAL);
    console.log("Connected");
    return conn;
  } catch (error) {
    console.log(error);
  }
}

// // Remote database connector
// const MONGO_URI = process.env.MONGO_URI_REMOTE;
// const cached = {};

// async function dbConnectMongo() {
//   if (!MONGO_URI) {
//     throw new Error(
//       "Please define the MONGO_URI environment variable inside .env.local"
//     );
//   }
//   if (cached.connection) {
//     return cached.connection;
//   }
//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };
//     cached.promise = mongoose.connect(MONGO_URI, opts);
//     console.log("Database connected successfully");
//   }
//   try {
//     cached.connection = await cached.promise;
//   } catch (e) {
//     cached.promise = undefined;
//     throw e;
//   }
//   return cached.connection;
// }

// Remote database connector
const MONGO_URI = process.env.MONGO_URI_REMOTE;
const cached = global.mongoose || { conn: null, promise: null };

async function dbConnectMongo() {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("Database connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

global.mongoose = cached;

export { dbConnectLocal, dbConnectMongo };
