import { kafkaClient } from '@db/kafka';

export default function kafkProducer(topic: KafkaTopic) {
    const kafka = kafkaClient();
    const producer = kafka.producer();
    return async (key: string, message: any) => {
        try {
            await producer.connect();
            await producer.send({
                topic: topic,
                messages: [{ key, value: message }],
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
}
