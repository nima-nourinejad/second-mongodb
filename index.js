const mongoose = require("mongoose");

async function clearDatabase() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (const { name } of collections) {
      await db.collection(name).deleteMany({});
      console.log(`Cleared all documents from ${name}`);
    }

    console.log(`All collections in ${db.databaseName} cleared successfully.`);
  } catch (err) {
    console.error("Error clearing the database: ", err);
  }
}

async function clearCollection(name) {
  try {
    const db = mongoose.connection.db;
    await db.collection(name).deleteMany({});
    console.log(`Cleared all documents from ${name}`);
  } catch (err) {
    console.error(`Error clearing collection ${name}: `, err);
  }
}

async function dropCollection(name) {
  try {
    const db = mongoose.connection.db;
    await db.collection(name).drop();
    console.log(`Dropped collection ${name}`);
  } catch (err) {
    console.error(`Error dropping collection ${name}: `, err);
  }
}

async function forgetModelAndSchema(name) {
  try {
    delete mongoose.models[name];
    delete mongoose.modelSchemas[name];
    console.log(`Forgot model and schema for ${name}`);
  } catch (err) {
    console.error(`Error forgetting model and schema for ${name}: `, err);
  }
}

async function reloadDatabase() {
  try {
    await createDocument("Document 1", "Author 1", ["tag1", "tag2"], true);
    await createDocument("Document 2", "nima", ["tag3", "tag4"], false);
    console.log("Database reloaded successfully.");
  } catch (err) {
    console.error("Error reloading the database: ", err);
  }
}

async function connectToDatabase() {
  try {
    const connectionString = "mongodb://localhost";
    const dbName = "dbName";
    await mongoose.connect(`${connectionString}/${dbName}`);
    console.log(`Connected to MongoDB at ${connectionString}/${dbName}`);
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err);
  }
}

async function dropAllCollections() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (const { name } of collections) {
      await db.collection(name).drop();
      console.log(`Dropped collection ${name}`);
    }

    console.log(`All collections in ${db.databaseName} dropped successfully.`);
  } catch (err) {
    console.error("Error dropping all collections: ", err);
  }
}

async function fullProcess() {
  await connectToDatabase();
  //   await clearDatabase();
  //   await clearCollection("collectionName_s_WillBeAdded" + "s");
  //   await dropCollection("collectionName_s_WillBeAdded" + "s");
  await dropAllCollections();
  await reloadDatabase();
  await getDocuments();
}

const schema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Model = mongoose.model("collectionName_s_WillBeAdded", schema);

async function createDocument(
  documentName,
  documentAuthor,
  documentTags,
  documentIsPublished
) {
  try {
    const document = new Model({
      name: documentName,
      author: documentAuthor,
      tags: documentTags,
      isPublished: documentIsPublished,
    });

    const result = await document.save();
    console.log("document : saved");
  } catch (err) {
    console.error("Error creating document: ", err);
  }
}

async function getDocuments() {
  try {
    const documents = await Model.find({ author: "nima" })
      .limit(10)
      .sort({ name: 1 })
      .select({ name: 1, tags: 1 });
    console.log("From find");
    console.log(documents);
  } catch (err) {
    console.error("Error getting documents: ", err);
  }
}

fullProcess();