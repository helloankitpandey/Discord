import { Config } from '@config/config';
import { connect, StringCodec } from 'nats';

const sc = StringCodec();

export async function subscribeMessage(
    subject: string,
    callback: (message: string) => void
) {
    const nc = await connect({
        servers: [Config.NATS_URI],
        user: Config.NATS_USER,
        pass: Config.NATS_PASSWORD,
    });
    const sc = StringCodec();
    const sub = nc.subscribe(subject);

    (async () => {
        for await (const m of sub) {
            callback(sc.decode(m.data));
        }
    })();
}

export async function publishMessage(topic: string, payload: any) {
    try {
        const nc = await connect({
            servers: Config.NATS_URI,
            user: Config.NATS_USER,
            pass: Config.NATS_PASSWORD,
        });
        const js = nc.jetstream();

        const message =
            typeof payload === 'string' ? payload : JSON.stringify(payload);
        const pubAck = await js.publish(topic, sc.encode(message));
        await nc.drain();
    } catch (err) {
        console.error('❌ Failed to publish message:', err);
    }
}
