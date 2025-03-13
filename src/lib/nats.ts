import { connect } from 'nats';
import { Config } from '../config/config';

const main = async () => {
    const nc = await connect({
        servers: [Config.NATS],
    });
};
