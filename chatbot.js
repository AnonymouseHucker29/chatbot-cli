require('dotenv').config();

const blueColor = '\x1b[34m';
const greenColor = '\x1b[32m';
const redColor = '\x1b[31m';

const prompt = (msg) => {
    process.stdout.write(msg);
    return new Promise((resolve) => {
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
};

async function chatGPT() {

    const { ChatGPTUnofficialProxyAPI } = await import('chatgpt');
    const { oraPromise } = await import('ora');

    const api = new ChatGPTUnofficialProxyAPI({
        accessToken: process.env.OPENAI_ACCESS_TOKEN,
        apiReverseProxyUrl: process.env.REVERSE_PROXY_URL,
    })

    let user = await prompt('Your name: ');
    process.stdout.write('\033c');
    console.log(redColor + `Welcome to ChatGPT but diff (low budget version), ${user}! Ask me anything!\nType 'exit' to quit.\n\n`);

    let conversationId;
    let parentMessageId;

    while (true) {
        const input = await prompt(blueColor + `${user}: `);
        console.log('\n');

        if (input.toLowerCase() === 'exit') {
            return;
        } else {
            const apiResponse = await oraPromise(api.sendMessage(input, {
                conversationId: conversationId,
                parentMessageId: parentMessageId,
                role: 'system',
            }));

            console.log(greenColor + 'BrentGPT: ' + apiResponse.text + '\n\n');

            conversationId = apiResponse.conversationId;
            parentMessageId = apiResponse.parentMessageId;
        }
    }
}

chatGPT().catch((err) => {
    console.error(err)
    process.exit(1)
})