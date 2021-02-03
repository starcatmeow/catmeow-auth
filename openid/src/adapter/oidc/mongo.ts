import { MongoClient, Db } from 'mongodb';
import { CollectionSet } from './collection_set'
import Config from '../../config'
export class Mongo {
    static dbName = "auth";
    static client: MongoClient;
    static db: Db;
    static async setup(): Promise<any> {
        Mongo.client = await MongoClient.connect(Config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        Mongo.db = Mongo.client.db(Mongo.dbName);
        const collectionSet = new CollectionSet(Mongo.db);
        collectionSet.createIndexes();
    }
}