import {createClient} from "redis";
import config from "../../config";
import {Service} from "typedi";

@Service()
export class RedisService {
    private readonly redisClient;

    constructor() {
        this.redisClient = createClient(({
            url: config.redis_uri
        }));

        this.redisClient.connect();

        this.redisClient.on('connect', () => {
            console.log('Redis connection successful');
        });

        this.redisClient.on('error', (error) => {
            console.error('Redis connection error ' + error);
        });
    }

    async set(key: string, value: any): boolean {
        return await this.redisClient.set(key, value);
    }

    async get(key: string): any {
        return await this.redisClient.get(key);
    }

    async close() {
        try {
            await this.redisClient.disconnect();
            console.log('Redis disconnection successful');
        } catch (error) {
            console.error(`Redis disconnection error => ${error}`);
        }
    }
}
