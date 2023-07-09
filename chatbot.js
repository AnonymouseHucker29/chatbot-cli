import dotenv from 'dotenv';
import { ChatGPTUnofficialProxyAPI } from 'chatgpt';
import { oraPromise } from 'ora';

dotenv.config();

const blueColor = '\x1b[34m';
const greenColor = '\x1b[32m';
const redColor = '\x1b[31m';
const resetColor = '\x1b[0m';

const prompt = (msg) => {
    process.stdout.write(msg);
    return new Promise((resolve) => {
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
};

async function chatGPT() {

    const api = new ChatGPTUnofficialProxyAPI({
        accessToken: process.env.OPENAI_ACCESS_TOKEN,
        apiReverseProxyUrl: process.env.REVERSE_PROXY_URL,
    })

    let user = await prompt('Your name: ');
    console.clear();
    console.log(redColor + `Welcome to ChatGPT but diff (low budget version), ${user}! Ask me anything!\nType 'exit' to quit.\n`);

    let conversationId;
    let parentMessageId;

    while (true) {

        const input = await prompt(blueColor + `${user}: `);
        console.log('');

        if (input.toLowerCase() === 'exit') {
            console.log(resetColor);
            return;
        } else {
            const apiResponse = await oraPromise(api.sendMessage(input, {
                conversationId: conversationId,
                parentMessageId: parentMessageId,
                role: 'user',
            }));

            console.log(greenColor + 'BrentGPT: ' + apiResponse.text + '\n');

            conversationId = apiResponse.conversationId;
            parentMessageId = apiResponse.parentMessageId;
        }
    }
}

chatGPT().catch((err) => {
    console.error(err)
    process.exit(1)
})