import 'dotenv/config';

export const Config = {
    PORT: process.env.PORT || 3000,
    NATS: process.env.NATS || 'nats://localhost:4222',
    REDIS: process.env.REDIS || 'redis://localhost:6379',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_HOST: process.env.REDIS_URL || 'localhost',
    KAFKA_URI: process.env.KAFKA_URI || 'kafka://localhost:9092',
    NATS_URI: process.env.NATS_URI || 'nats://localhost:4222',
};
