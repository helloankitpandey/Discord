import { Config } from '@config/config';
import { connect, StringCodec } from 'nats';
export async function publishMessage(subject: string, message: string) {
    const nc = await connect({
        servers: [Config.NATS_URI],
        user: Config.NATS_USER,
        pass: Config.NATS_PASSWORD,
    });
    const sc = StringCodec();
    nc.publish(subject, sc.encode(message));
    await nc.drain();
}

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
