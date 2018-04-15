const https = require('https');
const express = require('express');
var http = require('http').Server(express);
require('dotenv').config();
const querystring = require('querystring');

const app = express();

const clientId = process.env.SPOTIFY_APPID;
const clientSecret = process.env.SPOTIFY_APPSECRET;
const port = process.env.PORT;
const clientaddress = process.env.URLCLIENT;

const address = process.env.URL;
const callbackUri = `http://${address}/callback`;
const loginUri = `http://${address}/login?id=`;
const userSecrets = {};
const tokens = {};
const pending = {};
const playlist = {
    current: {},
    list: [],
    playing: false,
    skip: () => {
        clearTimeout(playlist.current);
        playlist.list.splice(0, 1);
        playlist.callbackmusical();
    },
    callbackmusical: () => {
        playlist.playing = false;
        if (playlist.list.length > 0) {
            playlist.playing = true;

            playForChat(Object.keys(tokens), playlist.list[0].uri);

            playlist.current = setTimeout(() => {
                playlist.list.splice(0, 1);
                playlist.callbackmusical()
            }, playlist.list[0].duration_ms);

            io.emit('playlist', playlist.list);
            console.log(playlist.list);
        }
    },

    addsong: (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            playlist.list.push(JSON.parse(chunk));
            io.emit('playlist', playlist.list);
            if (!playlist.playing)
                playlist.callbackmusical();
        });
        res.on('end', () => {
        });
    },
};


const authHandler = id => (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        tokens[id] = JSON.parse(chunk);
    });
    res.on('end', () => {
    });
};

const verboseHandler = (res) => {
    // console.log(`STATUS: ${res.statusCode}`);
    // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        // console.log('No more data in response.');
    });
};

function httpsRequest(options, body, handler) {
    const req = https.request(options, handler);
    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    req.write(body);
    req.end();
}

const toxww = (object) => {
    let xww = '';
    Object.keys(object).forEach((element) => {
        xww += `${element}=${object[element]}&`;
    });
    return xww.substr(0, xww.length - 1);
};

function play(token, songURI) {
    const options = {
        hostname: 'api.spotify.com',
        path: '/v1/me/player/play',
        method: 'PUT',
        headers: {
            Authorization: ` Bearer  ${token.access_token}`,
        },
    };
    httpsRequest(options, `{"uris":["${songURI}"]}}`, verboseHandler);
}


function addSong(token, songID) {
    const options = {
        hostname: 'api.spotify.com',
        path: `/v1/tracks/${songID}`,
        method: 'GET',
        headers: {
            Authorization: ` Bearer  ${token.access_token}`,
        },
    };

    console.log(options);
    httpsRequest(options, '{}', playlist.addsong);
}

function pause(token) {
    const options = {
        hostname: 'api.spotify.com',
        path: '/v1/me/player/pause',
        method: 'PUT',
        headers: {
            Authorization: ` Bearer  ${token}`,
        },
    };
    httpsRequest(options, '{}', verboseHandler);
}

function requestTokens(code, state) {
    const options = {
        hostname: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    const body = toxww({
        code,
        redirect_uri: callbackUri,
        grant_type: 'authorization_code',
    });
    httpsRequest(options, body, authHandler(state));
}

function playForChat(usernames, songURI) {
    usernames.forEach((username) => {
        play(tokens[username], songURI);
    });
}

function pauseForChat(usernames) {
    usernames.forEach((username) => {
        pause(tokens[username]);
    });
}

const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


function addToPending(user) {
    //  TODO: remove other pending
    //  TODO: remove after X time
    const hash = user + generateRandomString(16);
    pending[hash] = user;
    return hash;
}

function startRegister(user) {
    const hash = addToPending(user);
    return hash;
}

function clearObject(obj) {
    for (var member in obj) delete obj[member];
}

function spotserver() {
    app.get('/reset', (req, res) => {
        clearObject(userSecrets);
        clearObject(tokens);
        clearObject(pending);
        clearTimeout(playlist.current);
        playlist.current = {};
        playlist.list = [];
        playlist.playing = false;
        socket.emit('playlist', playlist.list);
        res.send('success.jpg');
    });

    app.get('/addSong', (req, res) => {
        if (!req.query.song || !req.query.username) { res.send('no_song.jpg'); return; }
        addSong(tokens[req.query.username], req.query.song.split(':')[2]);//spotify:track:3Z9PJ6xiEGmcqo2hESEB5n
        res.send('success.jpg');
    });
    app.get('/skip', (req, res) => {
        playlist.skip();
        res.send('success.jpg');
    });
    app.get('/login', (req, res) => {
        if (!req.query.username) { res.send('no_username.jpg'); return; }

        const state = startRegister(req.query.username);

        const scope = 'user-read-private user-read-email user-modify-playback-state';

        res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope,
            redirect_uri: callbackUri,
            state,
        })}`);
    });
    app.get('/', (req, res) => res.send('Hello World!'));

    app.get('/callback', (req, res) => {
        if (!(req.query.state in pending)) { res.send("nope2_jpg"); return; }
        const code = req.query.code || null;
        const state = req.query.state || null;
        if (state === null) {
            res.redirect(`/#${querystring.stringify({
                error: 'state_mismatch',
            })}`);
        } else {
            requestTokens(code, pending[state]);
            userSecrets[state.substr(0, state.length - 16)] = state;
            res.redirect(`${clientaddress}/auth?${querystring.stringify({
                username: state.substr(0, state.length - 16),
                token: state,
            })}`);
        }
    });


    const server = app.listen(port, () => console.log(`listening on port ${port}!`));
    io = require('socket.io').listen(server);

    io.on('connection', function (socket) {
        socket.emit('playlist', playlist.list);
        console.log('a user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
}

spotserver();
