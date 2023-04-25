const http = require('http');
const jmespath = require('jmespath');
const fs = require('fs');
const url = require('url')

const characters = JSON.parse(fs.readFileSync('./src/characters.json','utf-8'))

const quotes = jmespath.search(
    JSON.parse(fs.readFileSync('./src/quotes.json','utf-8')),
    "[?length(dialog)>`15`]"
)


function sfc32(seed = null) {

    if (seed === null) {
        seed = Math.random().toString()
    }

    if (typeof seed !== 'string') {
        seed = seed.toString()
    }

    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < seed.length; i++) {
        k = seed.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);

    let [a,b,c,d] =
        [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0]

    return function() {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
        let t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

function shuffle(array, rand) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(rand() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const verifyAnswer = (req, res) => {

    res.writeHead(200, {
        'Content-Type': 'application/json'
    })

    let query = (url.parse(req.url, true)).query

    let quote = jmespath.search(quotes,`[?id=='${query.id}'] | [0]`)

    let answer = query.answer

    let data = {
        'result': (answer === quote["character"]) ? 'right' : 'wrong'
    }

    res.write(JSON.stringify(data),'utf-8')
}

const createQuestion = (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    })

    let query = (url.parse(req.url, true)).query

    const rand = sfc32(query.seed)

    let data = {}

    let subject = quotes[Math.floor(rand()*quotes.length)]

    data.subject = subject["dialog"]
    data.id = subject["_id"]

    data.choices =
        shuffle(
            [
                subject["character"]
            ].concat(
                shuffle([
                    ...new Set(jmespath.search(quotes, `[?character!='${subject["character"]}'].character`))
                ], rand).slice(0,2)
            ),
            rand
        )
        .map((character) =>
            jmespath.search(characters, `[?_id=='${character}'] | [0]`)
        )
        .map((character) => ({
            "id": character["_id"],
            "name": character["name"].replace(/(\(.*\))/,'').trim()
        }))

    res.write(JSON.stringify(data),'utf-8')
}


const server = http.createServer((req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    switch (true) {
        case req.url.match(/^\/question/) !== null:
            createQuestion(req,res)
            break;
        case req.url.match(/^\/verify/) !== null:
            verifyAnswer(req,res)
            break;
        default:
            res.writeHead(200, {'Content-Type': 'text/plain'})
            res.write('Welcome','utf-8')
    }

    res.end()
    // res.end(body)
})

const port = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'

// Run the server and report out to the logs
server.listen(
    { port, host },() => {
        console.log(`Your app is listening on http://${host}:${port}`);
    }
);
