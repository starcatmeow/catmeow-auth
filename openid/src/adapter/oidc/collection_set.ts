import { snakeCase } from 'lodash';
import { Db } from 'mongodb';

const grantable = new Set([
    'access_token',
    'authorization_code',
    'refresh_token',
    'device_code',
]);

const allCollections: string[] = [
    "Session",
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "ClientCredentials",
    "Client",
    "InitialAccessToken",
    "RegistrationAccessToken",
    "DeviceCode",
    "Interaction",
    "ReplayDetection",
    "PushedAuthorizationRequest"
];

export class CollectionSet {
    constructor(private readonly db: Db){}
    createIndexes(): Promise<any> {
        const createIndexesPromises = allCollections
            .map((coll: string) => snakeCase(coll))
            .map((coll: string) => this.createIndexesForCollection(coll));
        return Promise.all(createIndexesPromises);
    }
    private createIndexesForCollection(name: string): Promise<any> {
        return this.db.collection(name)
            .createIndexes([
                ...(grantable.has(name) ? [{ key: { 'payload.grantId': 1 } }] : []),
                ...(name === 'device_code' ? [{ key: { 'payload.userCode': 1 }, unique: true }] : []),
                ...(name === 'session' ? [{ key: { 'payload.uid': 1 }, unique: true }] : []),
                { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
            ]);
    }
}