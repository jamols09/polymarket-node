import mongoose from 'mongoose';

const mongodbUri = process.env.MONGODB_URI || null;

export const dbconnect = () => {
  if (mongodbUri) {
    mongoose
      .connect(mongodbUri, {
        dbName: `${process.env.MONGO_DB_NAME}`,
        connectTimeoutMS: 360000,
        socketTimeoutMS: 360000,
      })
      .then(() => console.log('DB connection successfull!'))
      .catch((e) => console.log('DB connection error: ', e));
  }

  return null;
};
