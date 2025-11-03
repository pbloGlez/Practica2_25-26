import { Db, MongoClient } from 'mongodb';

let client: MongoClient;
let db: Db;

export const connecToMongo = async (): Promise<void> => {
    try {
        const urlMongo = "mongodb+srv://pablo:12345@cluster0.zljgl1a.mongodb.net/?appName=Cluster0";
        client = new MongoClient(urlMongo);
        await client.connect();
        db = client.db("myDbLibros");
        console.log("Mongo cargado");
    } catch (err) {
        console.log("Error al cargar mongo");
        process.exit(1);
    }
}
export const getDb = (): Db => db;