import { Config } from '@config/config';
import { connect, StringCodec } from 'nats';
export async function publishMessage(subject: string, message: string) {
    const nc = await connect({ servers: Config.NATS_URI });
    const sc = StringCodec();
    nc.publish(subject, sc.encode(message));
    await nc.drain();
}
