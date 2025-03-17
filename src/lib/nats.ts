import { connect } from 'nats';
import { Config } from '../config/config';

const main = async () => {
    const nc = await connect({
        servers: [Config.NATS],
        user: Config.NATS_USER,
        pass: Config.NATS_PASSWORD,
    });
    return nc;
};
