/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 7981:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(7373), exports);
__exportStar(__webpack_require__(6096), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2824:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkeldjsClient = void 0;
const dgram_1 = __importDefault(__webpack_require__(6200));
const dns_1 = __importDefault(__webpack_require__(881));
const util_1 = __importDefault(__webpack_require__(1669));
const constant_1 = __webpack_require__(492);
const data_1 = __webpack_require__(727);
const protocol_1 = __webpack_require__(2602);
const util_2 = __webpack_require__(5131);
const state_1 = __webpack_require__(2347);
const events_1 = __webpack_require__(780);
const lookupDns = util_1.default.promisify(dns_1.default.lookup);
const ServerCertificate = `
-----BEGIN CERTIFICATE-----
MIIDbTCCAlWgAwIBAgIUf8xD1G/d5NK1MTjQAYGqd1AmBvcwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAgFw0yMTAyMDIxNzE4MDFaGA8yMjk0
MTExODE3MTgwMVowRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUx
ITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBAL7GFDbZdXwPYXeHWRi2GfAXkaLCgxuSADfa1pI2
vJkvgMTK1miSt3jNSg/o6VsjSOSL461nYmGCF6Ho3fMhnefOhKaaWu0VxF0GR1bd
e836YWzhWINQRwmoVD/Wx1NUjLRlTa8g/W3eE5NZFkWI70VOPRJpR9SqjNHwtPbm
Ki41PVgJIc3m/7cKOEMrMYNYoc6E9ehwLdJLQ5olJXnMoGjHo2d59hC8KW2V1dY9
sacNPUjbFZRWeQ0eJ7kbn8m3a5EuF34VEC7DFcP4NCWWI7HO5/KYE+mUNn0qxgua
r32qFnoaKZr9dXWRWJSm2XecBgqQmeF/90gdbohNNHGC/iMCAwEAAaNTMFEwHQYD
VR0OBBYEFAJAdUS5AZE3U3SPQoG06Ahq3wBbMB8GA1UdIwQYMBaAFAJAdUS5AZE3
U3SPQoG06Ahq3wBbMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEB
ALUoaAEuJf4kQ1bYVA2ax2QipkUM8PL9zoNiDjUw6ZlwMFi++XCQm8XDap45aaeZ
MnXGBqIBWElezoH6BNSbdGwci/ZhxXHG/qdHm7zfCTNaLBe2+sZkGic1x6bZPFtK
ZUjGy7LmxsXOxqGMgPhAV4JbN1+LTmOkOutfHiXKe4Z1zu09mOo9sWfGCkbIyERX
QQILBYSIkg3hU4R4xMOjvxcDrOZja6fSNyi2sgidTfe5OCKC2ovU7OmsQqzb7mFv
e+7kpIUp6AZNc49n6GWtGeOoL7JUAqMOIO+R++YQN7/dgaGDPuu0PpmgI2gPLNW1
ZwHJ755zQQRX528xg9vfykY=
-----END CERTIFICATE-----`;
/**
 * Represents a programmable Among Us client.
 *
 * See {@link SkeldjsClientEvents} for events to listen to.
 */
class SkeldjsClient extends state_1.SkeldjsStateManager {
    /**
     * Create a new Skeldjs client instance.
     * @param version The version of the client.
     * @param options Additional client options.
     * @example
     *```typescript
     * const client = new SkeldjsClient("2021.3.5.0");
     * ```
     */
    constructor(version, options = { allowHost: true }) {
        super({ doFixedUpdate: true });
        this._nonce = 0;
        this.options = options;
        if (version instanceof util_2.VersionInfo) {
            this.version = version;
        }
        else {
            this.version = util_2.VersionInfo.from(version);
        }
        this.packets_recv = [];
        this.packets_sent = [];
        this._reset();
        this.stream = [];
        this.decoder.on([protocol_1.ReliablePacket, protocol_1.HelloPacket, protocol_1.PingPacket], (message) => {
            this.packets_recv.unshift(message.nonce);
            this.packets_recv.splice(8);
            this.ack(message.nonce);
        });
        this.decoder.on(protocol_1.DisconnectPacket, (message) => {
            this.disconnect(message.reason, message.message);
        });
        this.decoder.on(protocol_1.AcknowledgePacket, (message) => {
            const sent = this.packets_sent.find((s) => s.nonce === message.nonce);
            if (sent)
                sent.ackd = true;
            for (const missing of message.missingPackets) {
                if (missing < this.packets_recv.length) {
                    this.ack(this.packets_recv[missing]);
                }
            }
        });
        this.decoder.on(protocol_1.RemovePlayerMessage, async (message) => {
            if (message.clientid === this.clientid) {
                await this.disconnect(constant_1.DisconnectReason.None);
            }
        });
    }
    getNextNonce() {
        this._nonce++;
        return this._nonce;
    }
    get me() {
        return this.players.get(this.clientid);
    }
    get amhost() {
        return this.hostid === this.clientid && this.options.allowHost || false;
    }
    async ack(nonce) {
        await this.send(new protocol_1.AcknowledgePacket(nonce, this.packets_sent
            .filter((packet) => packet.ackd)
            .map((_, i) => i)));
    }
    async connect(host, username, token, port = 22023, pem = ServerCertificate) {
        await this.disconnect();
        if (host in data_1.MatchmakingServers) {
            return await this.connect(data_1.MatchmakingServers[host][0], username, token, 22023, pem);
        }
        const ip = await lookupDns(host);
        this.ip = ip.address;
        this.port = port;
        this.token = token;
        this.socket = dgram_1.default.createSocket("udp4");
        this.connected = true;
        this.socket.on("message", this.handleInboundMessage.bind(this));
        const ev = await this.emit(new events_1.ClientConnectEvent(this, this.ip, this.port));
        if (!ev.canceled) {
            if (typeof username === "string") {
                await this.identify(username, this.token);
            }
        }
    }
    _reset() {
        if (this.socket) {
            this.socket.close();
            this.socket.removeAllListeners();
        }
        this.ip = undefined;
        this.port = undefined;
        this.socket = undefined;
        this.sent_disconnect = false;
        this.connected = false;
        this.identified = false;
        this.username = undefined;
        this.packets_sent = [];
        this.packets_recv = [];
        super._reset();
    }
    /**
     * Disconnect from the server currently connected to.
     */
    async disconnect(reason, message) {
        if (this.connected) {
            if (this.identified && !this.sent_disconnect) {
                await this.send(new protocol_1.DisconnectPacket(reason, message, true));
                this.sent_disconnect = true;
            }
            this.emit(new events_1.ClientDisconnectEvent(this, reason, message || data_1.DisconnectMessages[reason]));
            this._reset();
        }
    }
    /**
     * Identify with the connected server. (Can be done before in the {@link SkeldjsClient.connect} method)
     * @param username The username to identify with.
     * @example
     *```typescript
     * await client.identify("weakeyes");
     * ```
     */
    async identify(username, token) {
        const nonce = this.getNextNonce();
        await this.send(new protocol_1.HelloPacket(nonce, this.version, username, token || 0));
        await this.decoder.waitf(protocol_1.AcknowledgePacket, ack => ack.nonce === nonce);
        this.identified = true;
        this.username = username;
        this.token = token;
    }
    _send(buffer) {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return resolve(0);
            }
            this.socket.send(buffer, this.port, this.ip, (err, written) => {
                if (err)
                    return reject(err);
                resolve(written);
            });
        });
    }
    /**
     * Send a packet to the connected server.
     */
    async send(packet) {
        if (!this.socket) {
            return;
        }
        if (packet.tag === constant_1.SendOption.Reliable ||
            packet.tag === constant_1.SendOption.Hello ||
            packet.tag === constant_1.SendOption.Ping) {
            const writer = util_2.HazelWriter.alloc(512);
            writer.uint8(packet.tag);
            writer.write(packet, protocol_1.MessageDirection.Serverbound, this.decoder);
            writer.realloc(writer.cursor);
            await this._send(writer.buffer);
            if (packet.nonce !== undefined) {
                const sent = {
                    nonce: packet.nonce,
                    ackd: false,
                };
                this.packets_sent.unshift(sent);
                this.packets_sent.splice(8);
                let attempts = 0;
                const interval = setInterval(async () => {
                    if (sent.ackd) {
                        return clearInterval(interval);
                    }
                    else {
                        if (!this.packets_sent.find((packet) => sent.nonce === packet.nonce)) {
                            return clearInterval(interval);
                        }
                        if (++attempts > 8) {
                            await this.disconnect();
                            clearInterval(interval);
                        }
                        if ((await this._send(writer.buffer)) === null) {
                            await this.disconnect();
                            clearInterval(interval);
                        }
                    }
                }, 1500);
            }
        }
        else {
            const writer = util_2.HazelWriter.alloc(512);
            writer.uint8(packet.tag);
            writer.write(packet, protocol_1.MessageDirection.Serverbound, this.decoder);
            writer.realloc(writer.cursor);
            await this._send(writer.buffer);
        }
    }
    /**
     * Broadcast a message to a specific player or to all players in the game.
     * @param messages The messages to broadcast.
     * @param reliable Whether or not the message should be acknowledged by the server.
     * @param recipient The optional recipient of the messages.
     * @param payload Additional payloads to be sent to the server. (Not necessarily broadcasted to all players, or even the recipient.)
     */
    async broadcast(messages, reliable = true, recipient = null, payloads = []) {
        if (recipient) {
            const children = [
                ...(messages.length
                    ? [new protocol_1.GameDataToMessage(this.code, recipient.id, messages)]
                    : []),
                ...payloads,
            ];
            await this.send(reliable
                ? new protocol_1.ReliablePacket(this.getNextNonce(), children)
                : new protocol_1.UnreliablePacket(children));
        }
        else {
            const children = [
                ...(messages.length
                    ? [new protocol_1.GameDataMessage(this.code, messages)]
                    : []),
                ...payloads,
            ];
            await this.send(reliable
                ? new protocol_1.ReliablePacket(this.getNextNonce(), children)
                : new protocol_1.UnreliablePacket(children));
        }
    }
    /**
     * Spawn your own player if `doSpawn = false` was used in the {@link SkeldjsClient.joinGame} method.
     * @example
     * ```typescript
     * // Spawn your player 5 seconds after joining a game without spawning.
     * await client.joinGame("ABCDEF", false);
     *
     * setTimeout(() => {
     *   await client.spawnSelf();
     * }, 5000)
     * ```
     */
    async spawnSelf() {
        if (!this.me || this.me.inScene) {
            return;
        }
        if (this.amhost) {
            this.spawnPrefab(constant_1.SpawnType.Player, this.me);
        }
        else {
            await this.send(new protocol_1.ReliablePacket(this.getNextNonce(), [
                new protocol_1.GameDataMessage(this.code, [
                    new protocol_1.SceneChangeMessage(this.clientid, "OnlineGame"),
                ]),
            ]));
            await this.me.wait("player.spawn");
        }
    }
    /**
     * Join a room given the 4 or 6 digit code.
     * @param code The code of the room to join.
     * @param doSpawn Whether or not to spawn the player. If false, the client will be unaware of any existing objects in the game until {@link SkeldjsClient.spawnSelf} is called.
     * @returns The code of the room joined.
     * @example
     *```typescript
     * await client.joinGame("ABCDEF");
     * ```
     */
    async joinGame(code, doSpawn = true) {
        if (typeof code === "undefined") {
            throw new Error("No code provided.");
        }
        if (typeof code === "string") {
            return this.joinGame(util_2.Code2Int(code), doSpawn);
        }
        if (!this.ip) {
            throw new Error("Tried to join while not connected.");
        }
        if (!this.identified) {
            throw new Error("Tried to join while not identified.");
        }
        if (this.me && this.code !== code) {
            const username = this.username;
            await this.disconnect();
            await this.connect(this.ip, username, this.token, this.port);
        }
        await this.send(new protocol_1.ReliablePacket(this.getNextNonce(), [new protocol_1.JoinGameMessage(code)]));
        const { message } = await Promise.race([
            this.decoder.waitf(protocol_1.JoinGameMessage, (message) => message.error !== undefined),
            this.decoder.wait(protocol_1.RedirectMessage),
            this.decoder.wait(protocol_1.JoinedGameMessage),
            this.decoder.wait(protocol_1.DisconnectPacket),
        ]);
        switch (message.tag) {
            case constant_1.RootMessageTag.JoinGame:
                throw new Error("Join error: Failed to join game, code: " +
                    message.error +
                    " (Message: " +
                    data_1.DisconnectMessages[message.error] +
                    ")");
            case constant_1.RootMessageTag.Redirect:
                const username = this.username;
                await this.disconnect();
                await this.connect(message.ip, username, this.token, message.port);
                return await this.joinGame(code, doSpawn);
            case constant_1.RootMessageTag.JoinedGame:
                if (doSpawn) {
                    await this.spawnSelf();
                }
                return this.code;
            case constant_1.SendOption.Disconnect:
                throw new Error("Join error: Failed to join game, code: " +
                    message.reason +
                    " (Message: " +
                    data_1.DisconnectMessages[message.reason] +
                    ")");
                break;
        }
    }
    /**
     * Create a game with given settings.
     * @param host_settings The settings to create the game with.
     * @param doJoin Whether or not to join the game after created.
     * @returns The game code of the room.
     * @example
     *```typescript
     * // Create a game on The Skeld with an English chat with 2 impostors.
     * await client.createGame({
     *   map: GameMap.TheSkeld,
     *   keywords: GameKeyword.English,
     *   numImpostors: 2
     * });
     * ```
     */
    async createGame(host_settings = {}, doJoin = true, chatMode = constant_1.QuickChatMode.FreeChat) {
        const settings = new protocol_1.GameOptions(Object.assign(Object.assign({}, host_settings), { version: 2 }));
        await this.send(new protocol_1.ReliablePacket(this.getNextNonce(), [
            new protocol_1.HostGameMessage(settings, chatMode),
        ]));
        const { message } = await Promise.race([
            this.decoder.waitf(protocol_1.JoinGameMessage, (message) => message.error !== undefined),
            this.decoder.wait(protocol_1.RedirectMessage),
            this.decoder.wait(protocol_1.HostGameMessage),
        ]);
        switch (message.tag) {
            case constant_1.RootMessageTag.JoinGame:
                throw new Error("Join error: Failed to create game, code: " +
                    message.error +
                    " (Message: " +
                    data_1.DisconnectMessages[message.error] +
                    ")");
            case constant_1.RootMessageTag.Redirect:
                const username = this.username;
                await this.disconnect();
                await this.connect(message.ip, username, this.token, message.port);
                return await this.createGame(host_settings, doJoin);
            case constant_1.RootMessageTag.HostGame:
                this.settings.patch(settings);
                if (doJoin) {
                    await this.joinGame(message.code);
                    return message.code;
                }
                else {
                    return message.code;
                }
        }
    }
    /**
     * Search for public games.
     * @param maps The maps of games to look for. If a number, it will be a bitfield of the maps, else, it will be an array of the maps.
     * @param impostors The number of impostors to look for. 0 for any amount.
     * @param keyword The language of the game to look for, use {@link GameKeyword.All} for any.
     * @returns An array of game listings.
     * @example
     *```typescript
     * // Search for games and join a random one.
     * const client = new SkeldjsClient("2021.3.5.0");

     * await client.connect("EU", "weakeyes");

     * const games = await client.findGames();
     * const game = games[Math.floor(Math.random() * games.length)];

     * const code = await game.join();
     * ```
     */
    async findGames(maps = 0x7 /* all maps */, impostors = 0 /* any impostors */, keyword = constant_1.GameKeyword.All, quickchat = constant_1.QuickChatMode.QuickChat) {
        if (Array.isArray(maps)) {
            return await this.findGames(maps.reduce((acc, cur) => acc | (1 << cur), 0) /* convert to bitfield */, impostors, keyword);
        }
        const options = new protocol_1.GameOptions({
            map: maps,
            numImpostors: 0,
            keywords: constant_1.GameKeyword.English,
        });
        await this.send(new protocol_1.ReliablePacket(this.getNextNonce(), [
            new protocol_1.GetGameListMessage(options, quickchat),
        ]));
        const { message } = await this.decoder.wait(protocol_1.GetGameListMessage);
        return message.gameList;
    }
}
exports.SkeldjsClient = SkeldjsClient;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 8316:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientEvent = void 0;
const events_1 = __webpack_require__(3418);
class ClientEvent extends events_1.CancelableEvent {
    constructor(client) {
        super();
        this.client = client;
    }
}
exports.ClientEvent = ClientEvent;
//# sourceMappingURL=ClientEvent.js.map

/***/ }),

/***/ 7049:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientConnectEvent = void 0;
const ClientEvent_1 = __webpack_require__(8316);
/**
 * Emitted when the client connects to a server, before it identifies.
 */
class ClientConnectEvent extends ClientEvent_1.ClientEvent {
    constructor(client, ip, port) {
        super(client);
        this.eventName = "client.connect";
        this.ip = ip;
        this.port = port;
    }
}
exports.ClientConnectEvent = ClientConnectEvent;
ClientConnectEvent.eventNamee = "client.connect";
//# sourceMappingURL=Connect.js.map

/***/ }),

/***/ 625:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientDisconnectEvent = void 0;
const constant_1 = __webpack_require__(492);
const ClientEvent_1 = __webpack_require__(8316);
/**
 * Emitted when client disconnects from the server.
 */
class ClientDisconnectEvent extends ClientEvent_1.ClientEvent {
    constructor(client, reason = constant_1.DisconnectReason.None, message) {
        super(client);
        this.eventName = "client.disconnect";
        this.reason = reason;
        this.message = message;
    }
}
exports.ClientDisconnectEvent = ClientDisconnectEvent;
ClientDisconnectEvent.eventNamee = "client.disconnect";
//# sourceMappingURL=Disconnect.js.map

/***/ }),

/***/ 2749:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientIdentifyEvent = void 0;
const ClientEvent_1 = __webpack_require__(8316);
class ClientIdentifyEvent extends ClientEvent_1.ClientEvent {
    constructor(client, username, token) {
        super(client);
        this.eventName = "client.identify";
        this.username = username;
        this.token = token;
    }
}
exports.ClientIdentifyEvent = ClientIdentifyEvent;
ClientIdentifyEvent.eventName = "client.identify";
//# sourceMappingURL=Identify.js.map

/***/ }),

/***/ 6569:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientJoinEvent = void 0;
const ClientEvent_1 = __webpack_require__(8316);
/**
 * Emitted when the client joins a game.
 */
class ClientJoinEvent extends ClientEvent_1.ClientEvent {
    constructor() {
        super(...arguments);
        this.eventName = "client.join";
    }
}
exports.ClientJoinEvent = ClientJoinEvent;
ClientJoinEvent.eventNamee = "client.join";
//# sourceMappingURL=Join.js.map

/***/ }),

/***/ 780:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(8316), exports);
__exportStar(__webpack_require__(7049), exports);
__exportStar(__webpack_require__(625), exports);
__exportStar(__webpack_require__(2749), exports);
__exportStar(__webpack_require__(6569), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7373:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(2824), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 492:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(2701), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8338:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerDataFlags = void 0;
exports.PlayerDataFlags = {
    IsDisconnected: 1,
    IsImpostor: 2,
    IsDead: 4,
};
//# sourceMappingURL=PlayerDataFlags.js.map

/***/ }),

/***/ 5822:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VoteState = void 0;
exports.VoteState = {
    VotedFor: 0xf,
    DidReport: 0x20,
    DidVote: 0x40,
    IsDead: 0x80,
};
//# sourceMappingURL=VoteState.js.map

/***/ }),

/***/ 2151:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(8338), exports);
__exportStar(__webpack_require__(5822), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5776:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimePlatform = void 0;
var RuntimePlatform;
(function (RuntimePlatform) {
    RuntimePlatform[RuntimePlatform["OSXEditor"] = 0] = "OSXEditor";
    RuntimePlatform[RuntimePlatform["OSXPlayer"] = 1] = "OSXPlayer";
    RuntimePlatform[RuntimePlatform["WindowsPlayer"] = 2] = "WindowsPlayer";
    RuntimePlatform[RuntimePlatform["WindowsEditor"] = 3] = "WindowsEditor";
    RuntimePlatform[RuntimePlatform["IPhonePlayer"] = 4] = "IPhonePlayer";
    RuntimePlatform[RuntimePlatform["Android"] = 5] = "Android";
    RuntimePlatform[RuntimePlatform["LinuxPlayer"] = 6] = "LinuxPlayer";
    RuntimePlatform[RuntimePlatform["LinuxEditor"] = 7] = "LinuxEditor";
    RuntimePlatform[RuntimePlatform["WebGLPlayer"] = 8] = "WebGLPlayer";
    RuntimePlatform[RuntimePlatform["WSAPlayerX86"] = 9] = "WSAPlayerX86";
    RuntimePlatform[RuntimePlatform["WSAPlayerX64"] = 10] = "WSAPlayerX64";
    RuntimePlatform[RuntimePlatform["WSAPlayerARM"] = 11] = "WSAPlayerARM";
    RuntimePlatform[RuntimePlatform["PS4"] = 12] = "PS4";
    RuntimePlatform[RuntimePlatform["XboxOne"] = 13] = "XboxOne";
    RuntimePlatform[RuntimePlatform["tvOS"] = 14] = "tvOS";
    RuntimePlatform[RuntimePlatform["Switch"] = 15] = "Switch";
    RuntimePlatform[RuntimePlatform["Lumin"] = 16] = "Lumin";
    RuntimePlatform[RuntimePlatform["Stadia"] = 17] = "Stadia";
    RuntimePlatform[RuntimePlatform["CloudRendering"] = 18] = "CloudRendering";
    RuntimePlatform[RuntimePlatform["PS5"] = 19] = "PS5";
})(RuntimePlatform = exports.RuntimePlatform || (exports.RuntimePlatform = {}));
//# sourceMappingURL=RuntimePlatform.js.map

/***/ }),

/***/ 2255:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(2845), exports);
__exportStar(__webpack_require__(9539), exports);
__exportStar(__webpack_require__(1344), exports);
__exportStar(__webpack_require__(1411), exports);
__exportStar(__webpack_require__(6489), exports);
__exportStar(__webpack_require__(5776), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8592:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirshipLadder = void 0;
var AirshipLadder;
(function (AirshipLadder) {
    AirshipLadder[AirshipLadder["UpperGapRoomToLowerGapRoom"] = 0] = "UpperGapRoomToLowerGapRoom";
    AirshipLadder[AirshipLadder["LowerGapRoomToUpperGapRoom"] = 1] = "LowerGapRoomToUpperGapRoom";
    AirshipLadder[AirshipLadder["MeetingRoomToGapRoom"] = 2] = "MeetingRoomToGapRoom";
    AirshipLadder[AirshipLadder["GapRoomToMeetingRoom"] = 3] = "GapRoomToMeetingRoom";
    AirshipLadder[AirshipLadder["MainHallToElectrical"] = 4] = "MainHallToElectrical";
    AirshipLadder[AirshipLadder["ElectricalToMainHall"] = 5] = "ElectricalToMainHall";
})(AirshipLadder = exports.AirshipLadder || (exports.AirshipLadder = {}));
//# sourceMappingURL=AirshipLadder.js.map

/***/ }),

/***/ 4585:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirshipTask = void 0;
var AirshipTask;
(function (AirshipTask) {
    AirshipTask[AirshipTask["ElectricalFixWiring"] = 0] = "ElectricalFixWiring";
    AirshipTask[AirshipTask["MeetingRoomEnterIdCode"] = 1] = "MeetingRoomEnterIdCode";
    AirshipTask[AirshipTask["ElectricalResetBreakers"] = 3] = "ElectricalResetBreakers";
    AirshipTask[AirshipTask["VaultRoomDownloadData"] = 4] = "VaultRoomDownloadData";
    AirshipTask[AirshipTask["BrigDownloadData"] = 5] = "BrigDownloadData";
    AirshipTask[AirshipTask["CargoBayDownloadData"] = 6] = "CargoBayDownloadData";
    AirshipTask[AirshipTask["GapRoomDownloadData"] = 7] = "GapRoomDownloadData";
    AirshipTask[AirshipTask["RecordsDownloadData"] = 8] = "RecordsDownloadData";
    AirshipTask[AirshipTask["CargoBayUnlockSafe"] = 9] = "CargoBayUnlockSafe";
    AirshipTask[AirshipTask["VentilationStartFans"] = 10] = "VentilationStartFans";
    AirshipTask[AirshipTask["MainHallEmptyGarbage"] = 11] = "MainHallEmptyGarbage";
    AirshipTask[AirshipTask["MedicalEmptyGarbage"] = 12] = "MedicalEmptyGarbage";
    AirshipTask[AirshipTask["KitchenEmptyGarbage"] = 13] = "KitchenEmptyGarbage";
    AirshipTask[AirshipTask["MainHallDevelopPhotos"] = 14] = "MainHallDevelopPhotos";
    AirshipTask[AirshipTask["CargoBayFuelEngines"] = 15] = "CargoBayFuelEngines";
    AirshipTask[AirshipTask["SecurityRewindTapes"] = 16] = "SecurityRewindTapes";
    AirshipTask[AirshipTask["VaultRoomPolishRuby"] = 17] = "VaultRoomPolishRuby";
    AirshipTask[AirshipTask["ElectricalCalibrateDistributor"] = 18] = "ElectricalCalibrateDistributor";
    AirshipTask[AirshipTask["CockpitStabilizeSteering"] = 19] = "CockpitStabilizeSteering";
    AirshipTask[AirshipTask["ArmoryDownloadData"] = 20] = "ArmoryDownloadData";
    AirshipTask[AirshipTask["CockpitDownloadData"] = 21] = "CockpitDownloadData";
    AirshipTask[AirshipTask["CommunicationsDownloadData"] = 22] = "CommunicationsDownloadData";
    AirshipTask[AirshipTask["MedicalDownloadData"] = 23] = "MedicalDownloadData";
    AirshipTask[AirshipTask["ViewingDeckDownloadData"] = 24] = "ViewingDeckDownloadData";
    AirshipTask[AirshipTask["ElectricalDivertPowerToArmory"] = 25] = "ElectricalDivertPowerToArmory";
    AirshipTask[AirshipTask["ElectricalDivertPowerToCockpit"] = 26] = "ElectricalDivertPowerToCockpit";
    AirshipTask[AirshipTask["ElectricalDivertPowerToGapRoom"] = 27] = "ElectricalDivertPowerToGapRoom";
    AirshipTask[AirshipTask["ElectricalDivertPowerToMainHall"] = 28] = "ElectricalDivertPowerToMainHall";
    AirshipTask[AirshipTask["ElectricalDivertPowerToMeetingRoom"] = 29] = "ElectricalDivertPowerToMeetingRoom";
    AirshipTask[AirshipTask["ElectricalDivertPowerToShowers"] = 30] = "ElectricalDivertPowerToShowers";
    AirshipTask[AirshipTask["ElectricalDivertPowerToEngine"] = 31] = "ElectricalDivertPowerToEngine";
    AirshipTask[AirshipTask["ShowersPickUpTowels"] = 32] = "ShowersPickUpTowels";
    AirshipTask[AirshipTask["LoungeCleanToilet"] = 33] = "LoungeCleanToilet";
    AirshipTask[AirshipTask["VaultRoomDressMannequin"] = 34] = "VaultRoomDressMannequin";
    AirshipTask[AirshipTask["RecordsSortRecords"] = 35] = "RecordsSortRecords";
    AirshipTask[AirshipTask["ArmoryPutAwayPistols"] = 36] = "ArmoryPutAwayPistols";
    AirshipTask[AirshipTask["ArmoryPutAwayRifles"] = 37] = "ArmoryPutAwayRifles";
    AirshipTask[AirshipTask["MainHallDecontaminate"] = 38] = "MainHallDecontaminate";
    AirshipTask[AirshipTask["KitchenMakeBurger"] = 39] = "KitchenMakeBurger";
    AirshipTask[AirshipTask["ShowersFixShower"] = 40] = "ShowersFixShower";
})(AirshipTask = exports.AirshipTask || (exports.AirshipTask = {}));
//# sourceMappingURL=AirshipTask.js.map

/***/ }),

/***/ 291:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirshipVent = void 0;
var AirshipVent;
(function (AirshipVent) {
    AirshipVent[AirshipVent["Vault"] = 0] = "Vault";
    AirshipVent[AirshipVent["Cockpit"] = 1] = "Cockpit";
    AirshipVent[AirshipVent["ViewingDeck"] = 2] = "ViewingDeck";
    AirshipVent[AirshipVent["Engine"] = 3] = "Engine";
    AirshipVent[AirshipVent["Kitchen"] = 4] = "Kitchen";
    AirshipVent[AirshipVent["UpperMainHall"] = 5] = "UpperMainHall";
    AirshipVent[AirshipVent["LowerMainHall"] = 6] = "LowerMainHall";
    AirshipVent[AirshipVent["RightGapRoom"] = 7] = "RightGapRoom";
    AirshipVent[AirshipVent["LeftGapRoom"] = 8] = "LeftGapRoom";
    AirshipVent[AirshipVent["Showers"] = 9] = "Showers";
    AirshipVent[AirshipVent["Records"] = 10] = "Records";
    AirshipVent[AirshipVent["CargoBay"] = 11] = "CargoBay";
})(AirshipVent = exports.AirshipVent || (exports.AirshipVent = {}));
//# sourceMappingURL=AirshipVent.js.map

/***/ }),

/***/ 5024:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MiraHQTask = void 0;
var MiraHQTask;
(function (MiraHQTask) {
    MiraHQTask[MiraHQTask["HallwayFixWiring"] = 0] = "HallwayFixWiring";
    MiraHQTask[MiraHQTask["AdminEnterIDCode"] = 1] = "AdminEnterIDCode";
    MiraHQTask[MiraHQTask["MedBaySubmitScan"] = 2] = "MedBaySubmitScan";
    MiraHQTask[MiraHQTask["BalconyClearAsteroids"] = 3] = "BalconyClearAsteroids";
    MiraHQTask[MiraHQTask["ElectricalDivertPowerToAdmin"] = 4] = "ElectricalDivertPowerToAdmin";
    MiraHQTask[MiraHQTask["ElectricalDivertPowerToCafeteria"] = 5] = "ElectricalDivertPowerToCafeteria";
    MiraHQTask[MiraHQTask["ElectricalDivertPowerToCommunications"] = 6] = "ElectricalDivertPowerToCommunications";
    MiraHQTask[MiraHQTask["ElectricalDivertPowerToLaunchpad"] = 7] = "ElectricalDivertPowerToLaunchpad";
    MiraHQTask[MiraHQTask["ElectricalDivertPowerToMedBay"] = 8] = "ElectricalDivertPowerToMedBay";
    MiraHQTask[MiraHQTask["ElectricalDivertPowerToOffice"] = 9] = "ElectricalDivertPowerToOffice";
    MiraHQTask[MiraHQTask["StorageWaterPlants"] = 10] = "StorageWaterPlants";
    MiraHQTask[MiraHQTask["ReactorStartReactor"] = 11] = "ReactorStartReactor";
    MiraHQTask[MiraHQTask["ElectricalDivertPowerToGreenhouse"] = 12] = "ElectricalDivertPowerToGreenhouse";
    MiraHQTask[MiraHQTask["AdminChartCourse"] = 13] = "AdminChartCourse";
    MiraHQTask[MiraHQTask["GreenhouseCleanO2Filter"] = 14] = "GreenhouseCleanO2Filter";
    MiraHQTask[MiraHQTask["LaunchpadFuelEngines"] = 15] = "LaunchpadFuelEngines";
    MiraHQTask[MiraHQTask["LaboratoryAssembleArtifact"] = 16] = "LaboratoryAssembleArtifact";
    MiraHQTask[MiraHQTask["LaboratorySortSamples"] = 17] = "LaboratorySortSamples";
    MiraHQTask[MiraHQTask["AdminPrimeShields"] = 18] = "AdminPrimeShields";
    MiraHQTask[MiraHQTask["CafeteriaEmptyGarbage"] = 19] = "CafeteriaEmptyGarbage";
    MiraHQTask[MiraHQTask["BalconyMeasureWeather"] = 20] = "BalconyMeasureWeather";
    MiraHQTask[MiraHQTask["ElectricalDivertPowerToLaboratory"] = 21] = "ElectricalDivertPowerToLaboratory";
    MiraHQTask[MiraHQTask["CafeteriaBuyBeverage"] = 22] = "CafeteriaBuyBeverage";
    MiraHQTask[MiraHQTask["OfficeProcessData"] = 23] = "OfficeProcessData";
    MiraHQTask[MiraHQTask["LaunchpadRunDiagnostics"] = 24] = "LaunchpadRunDiagnostics";
    MiraHQTask[MiraHQTask["ReactorUnlockManifolds"] = 25] = "ReactorUnlockManifolds";
})(MiraHQTask = exports.MiraHQTask || (exports.MiraHQTask = {}));
//# sourceMappingURL=MiraHQTask.js.map

/***/ }),

/***/ 4958:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MiraHQVent = void 0;
var MiraHQVent;
(function (MiraHQVent) {
    MiraHQVent[MiraHQVent["Balcony"] = 1] = "Balcony";
    MiraHQVent[MiraHQVent["Cafeteria"] = 2] = "Cafeteria";
    MiraHQVent[MiraHQVent["Reactor"] = 3] = "Reactor";
    MiraHQVent[MiraHQVent["Laboratory"] = 4] = "Laboratory";
    MiraHQVent[MiraHQVent["Office"] = 5] = "Office";
    MiraHQVent[MiraHQVent["Admin"] = 6] = "Admin";
    MiraHQVent[MiraHQVent["Greenhouse"] = 7] = "Greenhouse";
    MiraHQVent[MiraHQVent["MedBay"] = 8] = "MedBay";
    MiraHQVent[MiraHQVent["Decontamination"] = 9] = "Decontamination";
    MiraHQVent[MiraHQVent["LockerRoom"] = 10] = "LockerRoom";
    MiraHQVent[MiraHQVent["Launchpad"] = 11] = "Launchpad";
})(MiraHQVent = exports.MiraHQVent || (exports.MiraHQVent = {}));
//# sourceMappingURL=MiraHQVent.js.map

/***/ }),

/***/ 1541:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolusTask = void 0;
var PolusTask;
(function (PolusTask) {
    PolusTask[PolusTask["OfficeSwipeCard"] = 0] = "OfficeSwipeCard";
    PolusTask[PolusTask["DropshipInsertKeys"] = 1] = "DropshipInsertKeys";
    PolusTask[PolusTask["OfficeScanBoardingPass"] = 2] = "OfficeScanBoardingPass";
    PolusTask[PolusTask["ElectricalFixWiring"] = 3] = "ElectricalFixWiring";
    PolusTask[PolusTask["WeaponsDownloadData"] = 4] = "WeaponsDownloadData";
    PolusTask[PolusTask["OfficeDownloadData"] = 5] = "OfficeDownloadData";
    PolusTask[PolusTask["ElectricalDownloadData"] = 6] = "ElectricalDownloadData";
    PolusTask[PolusTask["SpecimenRoomDownloadData"] = 7] = "SpecimenRoomDownloadData";
    PolusTask[PolusTask["O2DownloadData"] = 8] = "O2DownloadData";
    PolusTask[PolusTask["SpecimenRoomStartReactor"] = 9] = "SpecimenRoomStartReactor";
    PolusTask[PolusTask["StorageFuelEngines"] = 10] = "StorageFuelEngines";
    PolusTask[PolusTask["BoilerRoomOpenWaterways"] = 11] = "BoilerRoomOpenWaterways";
    PolusTask[PolusTask["MedBayInspectSample"] = 12] = "MedBayInspectSample";
    PolusTask[PolusTask["BoilerRoomReplaceWaterJug"] = 13] = "BoilerRoomReplaceWaterJug";
    PolusTask[PolusTask["OutsideFixWeatherNodeNODE_GI"] = 14] = "OutsideFixWeatherNodeNODE_GI";
    PolusTask[PolusTask["OutsideFixWeatherNodeNODE_IRO"] = 15] = "OutsideFixWeatherNodeNODE_IRO";
    PolusTask[PolusTask["OutsideFixWeatherNodeNODE_PD"] = 16] = "OutsideFixWeatherNodeNODE_PD";
    PolusTask[PolusTask["OutsideFixWeatherNodeNODE_TB"] = 17] = "OutsideFixWeatherNodeNODE_TB";
    PolusTask[PolusTask["CommunicationsRebootWiFi"] = 18] = "CommunicationsRebootWiFi";
    PolusTask[PolusTask["O2MonitorTree"] = 19] = "O2MonitorTree";
    PolusTask[PolusTask["SpecimenRoomUnlockManifolds"] = 20] = "SpecimenRoomUnlockManifolds";
    PolusTask[PolusTask["SpecimenRoomStoreArtifacts"] = 21] = "SpecimenRoomStoreArtifacts";
    PolusTask[PolusTask["O2FillCanisters"] = 22] = "O2FillCanisters";
    PolusTask[PolusTask["O2EmptyGarbage"] = 23] = "O2EmptyGarbage";
    PolusTask[PolusTask["DropshipChartCourse"] = 24] = "DropshipChartCourse";
    PolusTask[PolusTask["MedBaySubmitScan"] = 25] = "MedBaySubmitScan";
    PolusTask[PolusTask["WeaponsClearAsteroids"] = 26] = "WeaponsClearAsteroids";
    PolusTask[PolusTask["OutsideFixWeatherNodeNODE_CA"] = 27] = "OutsideFixWeatherNodeNODE_CA";
    PolusTask[PolusTask["OutsideFixWeatherNodeNODE_MLG"] = 28] = "OutsideFixWeatherNodeNODE_MLG";
    PolusTask[PolusTask["LaboratoryAlignTelescope"] = 29] = "LaboratoryAlignTelescope";
    PolusTask[PolusTask["LaboratoryRepairDrill"] = 30] = "LaboratoryRepairDrill";
    PolusTask[PolusTask["LaboratoryRecordTemperature"] = 31] = "LaboratoryRecordTemperature";
    PolusTask[PolusTask["OutsideRecordTemperature"] = 32] = "OutsideRecordTemperature";
})(PolusTask = exports.PolusTask || (exports.PolusTask = {}));
//# sourceMappingURL=PolusTask.js.map

/***/ }),

/***/ 2769:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolusVent = void 0;
var PolusVent;
(function (PolusVent) {
    PolusVent[PolusVent["Security"] = 0] = "Security";
    PolusVent[PolusVent["Electrical"] = 1] = "Electrical";
    PolusVent[PolusVent["O2"] = 2] = "O2";
    PolusVent[PolusVent["Communications"] = 3] = "Communications";
    PolusVent[PolusVent["Office"] = 4] = "Office";
    PolusVent[PolusVent["Admin"] = 5] = "Admin";
    PolusVent[PolusVent["Laboratory"] = 6] = "Laboratory";
    PolusVent[PolusVent["LavaPool"] = 7] = "LavaPool";
    PolusVent[PolusVent["Storage"] = 8] = "Storage";
    PolusVent[PolusVent["RightSeismic"] = 9] = "RightSeismic";
    PolusVent[PolusVent["LeftSeismic"] = 10] = "LeftSeismic";
    PolusVent[PolusVent["OutsideAdmin"] = 11] = "OutsideAdmin";
})(PolusVent = exports.PolusVent || (exports.PolusVent = {}));
//# sourceMappingURL=PolusVent.js.map

/***/ }),

/***/ 5863:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskLength = void 0;
var TaskLength;
(function (TaskLength) {
    TaskLength[TaskLength["Common"] = 0] = "Common";
    TaskLength[TaskLength["Short"] = 1] = "Short";
    TaskLength[TaskLength["Long"] = 2] = "Long";
})(TaskLength = exports.TaskLength || (exports.TaskLength = {}));
//# sourceMappingURL=TaskLength.js.map

/***/ }),

/***/ 1747:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskType = void 0;
var TaskType;
(function (TaskType) {
    TaskType[TaskType["SubmitScan"] = 0] = "SubmitScan";
    TaskType[TaskType["PrimeShields"] = 1] = "PrimeShields";
    TaskType[TaskType["FuelEngines"] = 2] = "FuelEngines";
    TaskType[TaskType["ChartCourse"] = 3] = "ChartCourse";
    TaskType[TaskType["StartReactor"] = 4] = "StartReactor";
    TaskType[TaskType["SwipeCard"] = 5] = "SwipeCard";
    TaskType[TaskType["ClearAsteroids"] = 6] = "ClearAsteroids";
    TaskType[TaskType["UploadData"] = 7] = "UploadData";
    TaskType[TaskType["InspectSample"] = 8] = "InspectSample";
    TaskType[TaskType["EmptyChute"] = 9] = "EmptyChute";
    TaskType[TaskType["EmptyGarbage"] = 10] = "EmptyGarbage";
    TaskType[TaskType["AlignEngineOutput"] = 11] = "AlignEngineOutput";
    TaskType[TaskType["FixWiring"] = 12] = "FixWiring";
    TaskType[TaskType["CalibrateDistributor"] = 13] = "CalibrateDistributor";
    TaskType[TaskType["DivertPower"] = 14] = "DivertPower";
    TaskType[TaskType["UnlockManifolds"] = 15] = "UnlockManifolds";
    TaskType[TaskType["ResetReactor"] = 16] = "ResetReactor";
    TaskType[TaskType["FixLights"] = 17] = "FixLights";
    TaskType[TaskType["CleanO2Filter"] = 18] = "CleanO2Filter";
    TaskType[TaskType["FixComms"] = 19] = "FixComms";
    TaskType[TaskType["RestoreO2"] = 20] = "RestoreO2";
    TaskType[TaskType["StabilizeSteering"] = 21] = "StabilizeSteering";
    TaskType[TaskType["AssembleArtifact"] = 22] = "AssembleArtifact";
    TaskType[TaskType["SortSamples"] = 23] = "SortSamples";
    TaskType[TaskType["MeasureWeather"] = 24] = "MeasureWeather";
    TaskType[TaskType["EnterIdCode"] = 25] = "EnterIdCode";
    TaskType[TaskType["BuyBeverage"] = 26] = "BuyBeverage";
    TaskType[TaskType["ProcessData"] = 27] = "ProcessData";
    TaskType[TaskType["RunDiagnostics"] = 28] = "RunDiagnostics";
    TaskType[TaskType["WaterPlants"] = 29] = "WaterPlants";
    TaskType[TaskType["MonitorO2"] = 30] = "MonitorO2";
    TaskType[TaskType["StoreArtifacts"] = 31] = "StoreArtifacts";
    TaskType[TaskType["FillCanisters"] = 32] = "FillCanisters";
    TaskType[TaskType["ActivateWeatherNodes"] = 33] = "ActivateWeatherNodes";
    TaskType[TaskType["InsertKeys"] = 34] = "InsertKeys";
    TaskType[TaskType["ResetSeismic"] = 35] = "ResetSeismic";
    TaskType[TaskType["ScanBoardingPass"] = 36] = "ScanBoardingPass";
    TaskType[TaskType["OpenWaterways"] = 37] = "OpenWaterways";
    TaskType[TaskType["ReplaceWaterJug"] = 38] = "ReplaceWaterJug";
    TaskType[TaskType["RepairDrill"] = 39] = "RepairDrill";
    TaskType[TaskType["AlignTelescope"] = 40] = "AlignTelescope";
    TaskType[TaskType["RecordTemperature"] = 41] = "RecordTemperature";
    TaskType[TaskType["RebootWifi"] = 42] = "RebootWifi";
    TaskType[TaskType["PolishRuby"] = 43] = "PolishRuby";
    TaskType[TaskType["ResetBreakers"] = 44] = "ResetBreakers";
    TaskType[TaskType["Decontaminate"] = 45] = "Decontaminate";
    TaskType[TaskType["MakeBurger"] = 46] = "MakeBurger";
    TaskType[TaskType["UnlockSafe"] = 47] = "UnlockSafe";
    TaskType[TaskType["SortRecords"] = 48] = "SortRecords";
    TaskType[TaskType["PutAwayPistols"] = 49] = "PutAwayPistols";
    TaskType[TaskType["FixShower"] = 50] = "FixShower";
    TaskType[TaskType["CleanToilet"] = 51] = "CleanToilet";
    TaskType[TaskType["DressMannequin"] = 52] = "DressMannequin";
    TaskType[TaskType["PickUpTowels"] = 53] = "PickUpTowels";
    TaskType[TaskType["RewindTapes"] = 54] = "RewindTapes";
    TaskType[TaskType["StartFans"] = 55] = "StartFans";
    TaskType[TaskType["DevelopPhotos"] = 56] = "DevelopPhotos";
    TaskType[TaskType["GetBiggolSword"] = 57] = "GetBiggolSword";
    TaskType[TaskType["PutAwayRifles"] = 58] = "PutAwayRifles";
    TaskType[TaskType["StopCharles"] = 59] = "StopCharles";
})(TaskType = exports.TaskType || (exports.TaskType = {}));
//# sourceMappingURL=TaskType.js.map

/***/ }),

/***/ 5570:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TheSkeldTask = void 0;
var TheSkeldTask;
(function (TheSkeldTask) {
    TheSkeldTask[TheSkeldTask["AdminSwipeCard"] = 0] = "AdminSwipeCard";
    TheSkeldTask[TheSkeldTask["ElectricalFixWiring"] = 1] = "ElectricalFixWiring";
    TheSkeldTask[TheSkeldTask["WeaponsClearAsteroids"] = 2] = "WeaponsClearAsteroids";
    TheSkeldTask[TheSkeldTask["EnginesAlignEngineOutput"] = 3] = "EnginesAlignEngineOutput";
    TheSkeldTask[TheSkeldTask["MedBaySubmitScan"] = 4] = "MedBaySubmitScan";
    TheSkeldTask[TheSkeldTask["MedBayInspectSample"] = 5] = "MedBayInspectSample";
    TheSkeldTask[TheSkeldTask["StorageFuelEngines"] = 6] = "StorageFuelEngines";
    TheSkeldTask[TheSkeldTask["ReactorStartReactor"] = 7] = "ReactorStartReactor";
    TheSkeldTask[TheSkeldTask["O2EmptyChute"] = 8] = "O2EmptyChute";
    TheSkeldTask[TheSkeldTask["CafeteriaEmptyGarbage"] = 9] = "CafeteriaEmptyGarbage";
    TheSkeldTask[TheSkeldTask["CommunicationsDownloadData"] = 10] = "CommunicationsDownloadData";
    TheSkeldTask[TheSkeldTask["ElectricalCalibrateDistributor"] = 11] = "ElectricalCalibrateDistributor";
    TheSkeldTask[TheSkeldTask["NavigationChartCourse"] = 12] = "NavigationChartCourse";
    TheSkeldTask[TheSkeldTask["O2CleanO2Filter"] = 13] = "O2CleanO2Filter";
    TheSkeldTask[TheSkeldTask["ReactorUnlockManifolds"] = 14] = "ReactorUnlockManifolds";
    TheSkeldTask[TheSkeldTask["ElectricalDownloadData"] = 15] = "ElectricalDownloadData";
    TheSkeldTask[TheSkeldTask["NavigationStabilizeSteering"] = 16] = "NavigationStabilizeSteering";
    TheSkeldTask[TheSkeldTask["WeaponsDownloadData"] = 17] = "WeaponsDownloadData";
    TheSkeldTask[TheSkeldTask["ShieldsPrimeShields"] = 18] = "ShieldsPrimeShields";
    TheSkeldTask[TheSkeldTask["CafeteriaDownloadData"] = 19] = "CafeteriaDownloadData";
    TheSkeldTask[TheSkeldTask["NavigationDownloadData"] = 20] = "NavigationDownloadData";
    TheSkeldTask[TheSkeldTask["ElectricalDivertPowerToShields"] = 21] = "ElectricalDivertPowerToShields";
    TheSkeldTask[TheSkeldTask["ElectricalDivertPowerToWeapons"] = 22] = "ElectricalDivertPowerToWeapons";
    TheSkeldTask[TheSkeldTask["ElectricalDivertPowerToCommunications"] = 23] = "ElectricalDivertPowerToCommunications";
    TheSkeldTask[TheSkeldTask["ElectricalDivertPowerToUpperEngine"] = 24] = "ElectricalDivertPowerToUpperEngine";
    TheSkeldTask[TheSkeldTask["ElectricalDivertPowerToO2"] = 25] = "ElectricalDivertPowerToO2";
    TheSkeldTask[TheSkeldTask["ElectricalDivertPowerToNavigation"] = 26] = "ElectricalDivertPowerToNavigation";
    TheSkeldTask[TheSkeldTask["ElectricalDivertPowerToLowerEngine"] = 27] = "ElectricalDivertPowerToLowerEngine";
    TheSkeldTask[TheSkeldTask["ElectricalDivertPowerToSecurity"] = 28] = "ElectricalDivertPowerToSecurity";
})(TheSkeldTask = exports.TheSkeldTask || (exports.TheSkeldTask = {}));
//# sourceMappingURL=TheSkeldTask.js.map

/***/ }),

/***/ 7210:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TheSkeldVent = void 0;
var TheSkeldVent;
(function (TheSkeldVent) {
    TheSkeldVent[TheSkeldVent["Admin"] = 0] = "Admin";
    TheSkeldVent[TheSkeldVent["RightHallway"] = 1] = "RightHallway";
    TheSkeldVent[TheSkeldVent["Cafeteria"] = 2] = "Cafeteria";
    TheSkeldVent[TheSkeldVent["Electrical"] = 3] = "Electrical";
    TheSkeldVent[TheSkeldVent["UpperEngine"] = 4] = "UpperEngine";
    TheSkeldVent[TheSkeldVent["Security"] = 5] = "Security";
    TheSkeldVent[TheSkeldVent["MedBay"] = 6] = "MedBay";
    TheSkeldVent[TheSkeldVent["Weapons"] = 7] = "Weapons";
    TheSkeldVent[TheSkeldVent["LowerReactor"] = 8] = "LowerReactor";
    TheSkeldVent[TheSkeldVent["LowerEngine"] = 9] = "LowerEngine";
    TheSkeldVent[TheSkeldVent["Shields"] = 10] = "Shields";
    TheSkeldVent[TheSkeldVent["UpperReactor"] = 11] = "UpperReactor";
    TheSkeldVent[TheSkeldVent["UpperNavigation"] = 12] = "UpperNavigation";
    TheSkeldVent[TheSkeldVent["LowerNavigation"] = 13] = "LowerNavigation";
})(TheSkeldVent = exports.TheSkeldVent || (exports.TheSkeldVent = {}));
//# sourceMappingURL=TheSkeldVent.js.map

/***/ }),

/***/ 2845:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(8592), exports);
__exportStar(__webpack_require__(4585), exports);
__exportStar(__webpack_require__(291), exports);
__exportStar(__webpack_require__(5024), exports);
__exportStar(__webpack_require__(4958), exports);
__exportStar(__webpack_require__(1541), exports);
__exportStar(__webpack_require__(2769), exports);
__exportStar(__webpack_require__(5863), exports);
__exportStar(__webpack_require__(1747), exports);
__exportStar(__webpack_require__(5570), exports);
__exportStar(__webpack_require__(7210), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3831:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpawnFlag = void 0;
var SpawnFlag;
(function (SpawnFlag) {
    SpawnFlag[SpawnFlag["None"] = 0] = "None";
    SpawnFlag[SpawnFlag["IsClientCharacter"] = 1] = "IsClientCharacter";
})(SpawnFlag = exports.SpawnFlag || (exports.SpawnFlag = {}));
//# sourceMappingURL=SpawnFlag.js.map

/***/ }),

/***/ 4042:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpawnType = void 0;
var SpawnType;
(function (SpawnType) {
    SpawnType[SpawnType["ShipStatus"] = 0] = "ShipStatus";
    SpawnType[SpawnType["MeetingHud"] = 1] = "MeetingHud";
    SpawnType[SpawnType["LobbyBehaviour"] = 2] = "LobbyBehaviour";
    SpawnType[SpawnType["GameData"] = 3] = "GameData";
    SpawnType[SpawnType["Player"] = 4] = "Player";
    SpawnType[SpawnType["Headquarters"] = 5] = "Headquarters";
    SpawnType[SpawnType["PlanetMap"] = 6] = "PlanetMap";
    SpawnType[SpawnType["AprilShipStatus"] = 7] = "AprilShipStatus";
    SpawnType[SpawnType["Airship"] = 8] = "Airship";
})(SpawnType = exports.SpawnType || (exports.SpawnType = {}));
//# sourceMappingURL=SpawnType.js.map

/***/ }),

/***/ 2392:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SystemType = void 0;
var SystemType;
(function (SystemType) {
    SystemType[SystemType["Hallway"] = 0] = "Hallway";
    SystemType[SystemType["Storage"] = 1] = "Storage";
    SystemType[SystemType["Cafeteria"] = 2] = "Cafeteria";
    SystemType[SystemType["Reactor"] = 3] = "Reactor";
    SystemType[SystemType["UpperEngine"] = 4] = "UpperEngine";
    SystemType[SystemType["Navigations"] = 5] = "Navigations";
    SystemType[SystemType["Administrator"] = 6] = "Administrator";
    SystemType[SystemType["Electrical"] = 7] = "Electrical";
    SystemType[SystemType["O2"] = 8] = "O2";
    SystemType[SystemType["Shields"] = 9] = "Shields";
    SystemType[SystemType["MedBay"] = 10] = "MedBay";
    SystemType[SystemType["Security"] = 11] = "Security";
    SystemType[SystemType["Weapons"] = 12] = "Weapons";
    SystemType[SystemType["LowerEngine"] = 13] = "LowerEngine";
    SystemType[SystemType["Communications"] = 14] = "Communications";
    SystemType[SystemType["ShipTasks"] = 15] = "ShipTasks";
    SystemType[SystemType["Doors"] = 16] = "Doors";
    SystemType[SystemType["Sabotage"] = 17] = "Sabotage";
    SystemType[SystemType["Decontamination"] = 18] = "Decontamination";
    SystemType[SystemType["Launchpad"] = 19] = "Launchpad";
    SystemType[SystemType["LockerRoom"] = 20] = "LockerRoom";
    SystemType[SystemType["Laboratory"] = 21] = "Laboratory";
    SystemType[SystemType["Balcony"] = 22] = "Balcony";
    SystemType[SystemType["Office"] = 23] = "Office";
    SystemType[SystemType["Greenhouse"] = 24] = "Greenhouse";
    SystemType[SystemType["Dropship"] = 25] = "Dropship";
    SystemType[SystemType["Decontamination2"] = 26] = "Decontamination2";
    SystemType[SystemType["Outside"] = 27] = "Outside";
    SystemType[SystemType["Specimens"] = 28] = "Specimens";
    SystemType[SystemType["BoilerRoom"] = 29] = "BoilerRoom";
    SystemType[SystemType["VaultRoom"] = 30] = "VaultRoom";
    SystemType[SystemType["Cockpit"] = 31] = "Cockpit";
    SystemType[SystemType["Armory"] = 32] = "Armory";
    SystemType[SystemType["Kitchen"] = 33] = "Kitchen";
    SystemType[SystemType["ViewingDeck"] = 34] = "ViewingDeck";
    SystemType[SystemType["HallOfPortraits"] = 35] = "HallOfPortraits";
    SystemType[SystemType["CargoBay"] = 36] = "CargoBay";
    SystemType[SystemType["Ventilation"] = 37] = "Ventilation";
    SystemType[SystemType["Showers"] = 38] = "Showers";
    SystemType[SystemType["Engine"] = 39] = "Engine";
    SystemType[SystemType["Brig"] = 40] = "Brig";
    SystemType[SystemType["MeetingRoom"] = 41] = "MeetingRoom";
    SystemType[SystemType["Records"] = 42] = "Records";
    SystemType[SystemType["Lounge"] = 43] = "Lounge";
    SystemType[SystemType["GapRoom"] = 44] = "GapRoom";
    SystemType[SystemType["MainHall"] = 45] = "MainHall";
    SystemType[SystemType["Medical"] = 46] = "Medical";
})(SystemType = exports.SystemType || (exports.SystemType = {}));
//# sourceMappingURL=SystemType.js.map

/***/ }),

/***/ 9539:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(3831), exports);
__exportStar(__webpack_require__(4042), exports);
__exportStar(__webpack_require__(2392), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7871:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Color = void 0;
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
    Color[Color["Green"] = 2] = "Green";
    Color[Color["Pink"] = 3] = "Pink";
    Color[Color["Orange"] = 4] = "Orange";
    Color[Color["Yellow"] = 5] = "Yellow";
    Color[Color["Grey"] = 6] = "Grey";
    Color[Color["White"] = 7] = "White";
    Color[Color["Purple"] = 8] = "Purple";
    Color[Color["Brown"] = 9] = "Brown";
    Color[Color["Cyan"] = 10] = "Cyan";
    Color[Color["LightGreen"] = 11] = "LightGreen";
})(Color = exports.Color || (exports.Color = {}));
//# sourceMappingURL=Color.js.map

/***/ }),

/***/ 9418:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Hat = void 0;
var Hat;
(function (Hat) {
    Hat[Hat["None"] = 0] = "None";
    Hat[Hat["Astronaut"] = 1] = "Astronaut";
    Hat[Hat["BaseballCap"] = 2] = "BaseballCap";
    Hat[Hat["BrainSlug"] = 3] = "BrainSlug";
    Hat[Hat["BushHat"] = 4] = "BushHat";
    Hat[Hat["CaptainHat"] = 5] = "CaptainHat";
    Hat[Hat["DoubleTopHat"] = 6] = "DoubleTopHat";
    Hat[Hat["Flowerpot"] = 7] = "Flowerpot";
    Hat[Hat["Goggles"] = 8] = "Goggles";
    Hat[Hat["HardHat"] = 9] = "HardHat";
    Hat[Hat["MilitaryHat"] = 10] = "MilitaryHat";
    Hat[Hat["PaperHat"] = 11] = "PaperHat";
    Hat[Hat["PartyHat"] = 12] = "PartyHat";
    Hat[Hat["PoliceHat"] = 13] = "PoliceHat";
    Hat[Hat["Stethoscope"] = 14] = "Stethoscope";
    Hat[Hat["TopHat"] = 15] = "TopHat";
    Hat[Hat["TowelWizard"] = 16] = "TowelWizard";
    Hat[Hat["Ushanka"] = 17] = "Ushanka";
    Hat[Hat["Viking"] = 18] = "Viking";
    Hat[Hat["WallGuardCap"] = 19] = "WallGuardCap";
    Hat[Hat["Snowman"] = 20] = "Snowman";
    Hat[Hat["ReindeerAntlers"] = 21] = "ReindeerAntlers";
    Hat[Hat["ChristmasLights"] = 22] = "ChristmasLights";
    Hat[Hat["SantaHat"] = 23] = "SantaHat";
    Hat[Hat["ChristmasTree"] = 24] = "ChristmasTree";
    Hat[Hat["ChristmasPresent"] = 25] = "ChristmasPresent";
    Hat[Hat["CandyCanes"] = 26] = "CandyCanes";
    Hat[Hat["ElfHat"] = 27] = "ElfHat";
    Hat[Hat["NewYears2018"] = 28] = "NewYears2018";
    Hat[Hat["WhiteHat"] = 29] = "WhiteHat";
    Hat[Hat["Crown"] = 30] = "Crown";
    Hat[Hat["Eyebrows"] = 31] = "Eyebrows";
    Hat[Hat["Halo"] = 32] = "Halo";
    Hat[Hat["HeroCap"] = 33] = "HeroCap";
    Hat[Hat["PipCap"] = 34] = "PipCap";
    Hat[Hat["Plunger"] = 35] = "Plunger";
    Hat[Hat["ScubaMask"] = 36] = "ScubaMask";
    Hat[Hat["HenryStickmin"] = 37] = "HenryStickmin";
    Hat[Hat["StrawHat"] = 38] = "StrawHat";
    Hat[Hat["TenGallonHat"] = 39] = "TenGallonHat";
    Hat[Hat["ThirdEye"] = 40] = "ThirdEye";
    Hat[Hat["ToiletPaper"] = 41] = "ToiletPaper";
    Hat[Hat["ToppatClanLeader"] = 42] = "ToppatClanLeader";
    Hat[Hat["BlackFedora"] = 43] = "BlackFedora";
    Hat[Hat["SkiGoggles"] = 44] = "SkiGoggles";
    Hat[Hat["HearingProtection"] = 45] = "HearingProtection";
    Hat[Hat["HazmatMask"] = 46] = "HazmatMask";
    Hat[Hat["FaceMask"] = 47] = "FaceMask";
    Hat[Hat["SecurityHatGlasses"] = 48] = "SecurityHatGlasses";
    Hat[Hat["SafariHat"] = 49] = "SafariHat";
    Hat[Hat["Banana"] = 50] = "Banana";
    Hat[Hat["Beanie"] = 51] = "Beanie";
    Hat[Hat["BearEars"] = 52] = "BearEars";
    Hat[Hat["Cheese"] = 53] = "Cheese";
    Hat[Hat["Cherry"] = 54] = "Cherry";
    Hat[Hat["Egg"] = 55] = "Egg";
    Hat[Hat["GreenFedora"] = 56] = "GreenFedora";
    Hat[Hat["Flamingo"] = 57] = "Flamingo";
    Hat[Hat["Flower"] = 58] = "Flower";
    Hat[Hat["KnightHelmet"] = 59] = "KnightHelmet";
    Hat[Hat["Plant"] = 60] = "Plant";
    Hat[Hat["BatEyes"] = 61] = "BatEyes";
    Hat[Hat["BatWings"] = 62] = "BatWings";
    Hat[Hat["Horns"] = 63] = "Horns";
    Hat[Hat["Mohawk"] = 64] = "Mohawk";
    Hat[Hat["Pumpkin"] = 65] = "Pumpkin";
    Hat[Hat["ScaryPaperBag"] = 66] = "ScaryPaperBag";
    Hat[Hat["WitchHat"] = 67] = "WitchHat";
    Hat[Hat["WolfEars"] = 68] = "WolfEars";
    Hat[Hat["PirateHat"] = 69] = "PirateHat";
    Hat[Hat["PlagueDoctor"] = 70] = "PlagueDoctor";
    Hat[Hat["Machete"] = 71] = "Machete";
    Hat[Hat["HockeyMask"] = 72] = "HockeyMask";
    Hat[Hat["MinerHelmet"] = 73] = "MinerHelmet";
    Hat[Hat["WinterCap"] = 74] = "WinterCap";
    Hat[Hat["ArchaeologistHat"] = 75] = "ArchaeologistHat";
    Hat[Hat["Antenna"] = 76] = "Antenna";
    Hat[Hat["Balloon"] = 77] = "Balloon";
    Hat[Hat["BirdNest"] = 78] = "BirdNest";
    Hat[Hat["BlackBelt"] = 79] = "BlackBelt";
    Hat[Hat["CautionSign"] = 80] = "CautionSign";
    Hat[Hat["ChefHat"] = 81] = "ChefHat";
    Hat[Hat["CopHat"] = 82] = "CopHat";
    Hat[Hat["DoRag"] = 83] = "DoRag";
    Hat[Hat["DumSticker"] = 84] = "DumSticker";
    Hat[Hat["Fez"] = 85] = "Fez";
    Hat[Hat["GeneralHat"] = 86] = "GeneralHat";
    Hat[Hat["PompadourHair"] = 87] = "PompadourHair";
    Hat[Hat["HunterHat"] = 88] = "HunterHat";
    Hat[Hat["JungleHat"] = 89] = "JungleHat";
    Hat[Hat["MiniCrewmate"] = 90] = "MiniCrewmate";
    Hat[Hat["NinjaMask"] = 91] = "NinjaMask";
    Hat[Hat["RamHorns"] = 92] = "RamHorns";
    Hat[Hat["MiniCrewmateSnowman"] = 93] = "MiniCrewmateSnowman";
    Hat[Hat["GeoffKeighleyMask"] = 94] = "GeoffKeighleyMask";
    Hat[Hat["DavePandaCap"] = 95] = "DavePandaCap";
    Hat[Hat["EllieRoseHair"] = 96] = "EllieRoseHair";
    Hat[Hat["SvenSvenssonHat"] = 97] = "SvenSvenssonHat";
    Hat[Hat["BurtCurtisHat"] = 98] = "BurtCurtisHat";
    Hat[Hat["EllryMohawk"] = 99] = "EllryMohawk";
    Hat[Hat["ThomasChestershireMonocles"] = 100] = "ThomasChestershireMonocles";
    Hat[Hat["Wizardhat"] = 101] = "Wizardhat";
    Hat[Hat["FrederickMuensterHat"] = 102] = "FrederickMuensterHat";
    Hat[Hat["MrMacbethhat"] = 103] = "MrMacbethhat";
    Hat[Hat["ToppatHenryStickminHat"] = 104] = "ToppatHenryStickminHat";
    Hat[Hat["ToppatEllieRoseHat"] = 105] = "ToppatEllieRoseHat";
    Hat[Hat["GeoffreyPlumbHat"] = 106] = "GeoffreyPlumbHat";
    Hat[Hat["AngryEyebrows"] = 107] = "AngryEyebrows";
    Hat[Hat["ChocolateIceCream"] = 108] = "ChocolateIceCream";
    Hat[Hat["HeartPin"] = 109] = "HeartPin";
    Hat[Hat["Ponytail"] = 110] = "Ponytail";
    Hat[Hat["RubberGlove"] = 111] = "RubberGlove";
    Hat[Hat["UnicornHat"] = 112] = "UnicornHat";
    Hat[Hat["Zipper"] = 113] = "Zipper";
    Hat[Hat["RightHandManHat"] = 114] = "RightHandManHat";
})(Hat = exports.Hat || (exports.Hat = {}));
//# sourceMappingURL=Hat.js.map

/***/ }),

/***/ 9684:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pet = void 0;
var Pet;
(function (Pet) {
    Pet[Pet["None"] = 0] = "None";
    Pet[Pet["Alien"] = 1] = "Alien";
    Pet[Pet["MiniCrewmate"] = 2] = "MiniCrewmate";
    Pet[Pet["Dog"] = 3] = "Dog";
    Pet[Pet["HenryStickmin"] = 4] = "HenryStickmin";
    Pet[Pet["Hamster"] = 5] = "Hamster";
    Pet[Pet["Robot"] = 6] = "Robot";
    Pet[Pet["Ufo"] = 7] = "Ufo";
    Pet[Pet["EllieRose"] = 8] = "EllieRose";
    Pet[Pet["Squig"] = 9] = "Squig";
    Pet[Pet["Bedcrab"] = 10] = "Bedcrab";
    Pet[Pet["Glitch"] = 11] = "Glitch";
})(Pet = exports.Pet || (exports.Pet = {}));
//# sourceMappingURL=Pet.js.map

/***/ }),

/***/ 2397:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportOutcome = void 0;
var ReportOutcome;
(function (ReportOutcome) {
    ReportOutcome[ReportOutcome["NotReportedUnknown"] = 0] = "NotReportedUnknown";
    ReportOutcome[ReportOutcome["NotReportedNoAccount"] = 1] = "NotReportedNoAccount";
    ReportOutcome[ReportOutcome["NotReportedNotFound"] = 2] = "NotReportedNotFound";
    ReportOutcome[ReportOutcome["NotReportedRateLimit"] = 3] = "NotReportedRateLimit";
    ReportOutcome[ReportOutcome["Reported"] = 4] = "Reported";
})(ReportOutcome = exports.ReportOutcome || (exports.ReportOutcome = {}));
//# sourceMappingURL=ReportOutcome.js.map

/***/ }),

/***/ 4034:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportReason = void 0;
var ReportReason;
(function (ReportReason) {
    ReportReason[ReportReason["InappropriateName"] = 0] = "InappropriateName";
    ReportReason[ReportReason["InappropriateChat"] = 1] = "InappropriateChat";
    ReportReason[ReportReason["CheatingHacking"] = 2] = "CheatingHacking";
    ReportReason[ReportReason["HarassmentMisconduct"] = 3] = "HarassmentMisconduct";
})(ReportReason = exports.ReportReason || (exports.ReportReason = {}));
//# sourceMappingURL=ReportReason.js.map

/***/ }),

/***/ 9086:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Skin = void 0;
var Skin;
(function (Skin) {
    Skin[Skin["None"] = 0] = "None";
    Skin[Skin["Astronaut"] = 1] = "Astronaut";
    Skin[Skin["Captain"] = 2] = "Captain";
    Skin[Skin["Mechanic"] = 3] = "Mechanic";
    Skin[Skin["Military"] = 4] = "Military";
    Skin[Skin["Police"] = 5] = "Police";
    Skin[Skin["Scientist"] = 6] = "Scientist";
    Skin[Skin["SuitBlack"] = 7] = "SuitBlack";
    Skin[Skin["SuitWhite"] = 8] = "SuitWhite";
    Skin[Skin["WallGuard"] = 9] = "WallGuard";
    Skin[Skin["Hazmat"] = 10] = "Hazmat";
    Skin[Skin["SecurityGuard"] = 11] = "SecurityGuard";
    Skin[Skin["Tarmac"] = 12] = "Tarmac";
    Skin[Skin["Miner"] = 13] = "Miner";
    Skin[Skin["Winter"] = 14] = "Winter";
    Skin[Skin["Archaeologist"] = 15] = "Archaeologist";
    Skin[Skin["Prisoner"] = 16] = "Prisoner";
    Skin[Skin["CCC"] = 17] = "CCC";
    Skin[Skin["RightHandManReborn"] = 18] = "RightHandManReborn";
})(Skin = exports.Skin || (exports.Skin = {}));
//# sourceMappingURL=Skin.js.map

/***/ }),

/***/ 1344:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(7871), exports);
__exportStar(__webpack_require__(9418), exports);
__exportStar(__webpack_require__(9684), exports);
__exportStar(__webpack_require__(2397), exports);
__exportStar(__webpack_require__(4034), exports);
__exportStar(__webpack_require__(9086), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8012:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatNoteType = void 0;
var ChatNoteType;
(function (ChatNoteType) {
    ChatNoteType[ChatNoteType["DidVote"] = 0] = "DidVote";
})(ChatNoteType = exports.ChatNoteType || (exports.ChatNoteType = {}));
//# sourceMappingURL=ChatNoteType.js.map

/***/ }),

/***/ 4719:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DisconnectReason = void 0;
var DisconnectReason;
(function (DisconnectReason) {
    DisconnectReason[DisconnectReason["None"] = 0] = "None";
    DisconnectReason[DisconnectReason["GameFull"] = 1] = "GameFull";
    DisconnectReason[DisconnectReason["GameStarted"] = 2] = "GameStarted";
    DisconnectReason[DisconnectReason["GameNotFound"] = 3] = "GameNotFound";
    DisconnectReason[DisconnectReason["IncorrectVersion"] = 5] = "IncorrectVersion";
    DisconnectReason[DisconnectReason["Banned"] = 6] = "Banned";
    DisconnectReason[DisconnectReason["Kicked"] = 7] = "Kicked";
    DisconnectReason[DisconnectReason["Custom"] = 8] = "Custom";
    DisconnectReason[DisconnectReason["InvalidName"] = 9] = "InvalidName";
    DisconnectReason[DisconnectReason["Hacking"] = 10] = "Hacking";
    DisconnectReason[DisconnectReason["NotAuthorized"] = 11] = "NotAuthorized";
    DisconnectReason[DisconnectReason["Destroy"] = 16] = "Destroy";
    DisconnectReason[DisconnectReason["Error"] = 17] = "Error";
    DisconnectReason[DisconnectReason["IncorrectGame"] = 18] = "IncorrectGame";
    DisconnectReason[DisconnectReason["ServerRequest"] = 19] = "ServerRequest";
    DisconnectReason[DisconnectReason["ServerFull"] = 20] = "ServerFull";
    DisconnectReason[DisconnectReason["FocusLostBackground"] = 207] = "FocusLostBackground";
    DisconnectReason[DisconnectReason["IntentionalLeaving"] = 208] = "IntentionalLeaving";
    DisconnectReason[DisconnectReason["FocusLost"] = 209] = "FocusLost";
    DisconnectReason[DisconnectReason["NewConnection"] = 210] = "NewConnection";
})(DisconnectReason = exports.DisconnectReason || (exports.DisconnectReason = {}));
//# sourceMappingURL=DisconnectReason.js.map

/***/ }),

/***/ 5428:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameDataMessageTag = void 0;
var GameDataMessageTag;
(function (GameDataMessageTag) {
    GameDataMessageTag[GameDataMessageTag["Data"] = 1] = "Data";
    GameDataMessageTag[GameDataMessageTag["RPC"] = 2] = "RPC";
    GameDataMessageTag[GameDataMessageTag["Spawn"] = 4] = "Spawn";
    GameDataMessageTag[GameDataMessageTag["Despawn"] = 5] = "Despawn";
    GameDataMessageTag[GameDataMessageTag["SceneChange"] = 6] = "SceneChange";
    GameDataMessageTag[GameDataMessageTag["Ready"] = 7] = "Ready";
    GameDataMessageTag[GameDataMessageTag["ChangeSettings"] = 8] = "ChangeSettings";
    GameDataMessageTag[GameDataMessageTag["ClientInfo"] = 205] = "ClientInfo";
})(GameDataMessageTag = exports.GameDataMessageTag || (exports.GameDataMessageTag = {}));
//# sourceMappingURL=GameDataMessageTag.js.map

/***/ }),

/***/ 4676:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetGameListTag = void 0;
var GetGameListTag;
(function (GetGameListTag) {
    GetGameListTag[GetGameListTag["GameList"] = 0] = "GameList";
    GetGameListTag[GetGameListTag["GameCounts"] = 1] = "GameCounts";
})(GetGameListTag = exports.GetGameListTag || (exports.GetGameListTag = {}));
//# sourceMappingURL=GetGameListTag.js.map

/***/ }),

/***/ 8126:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RootMessageTag = void 0;
var RootMessageTag;
(function (RootMessageTag) {
    RootMessageTag[RootMessageTag["HostGame"] = 0] = "HostGame";
    RootMessageTag[RootMessageTag["JoinGame"] = 1] = "JoinGame";
    RootMessageTag[RootMessageTag["StartGame"] = 2] = "StartGame";
    RootMessageTag[RootMessageTag["RemoveGame"] = 3] = "RemoveGame";
    RootMessageTag[RootMessageTag["RemovePlayer"] = 4] = "RemovePlayer";
    RootMessageTag[RootMessageTag["GameData"] = 5] = "GameData";
    RootMessageTag[RootMessageTag["GameDataTo"] = 6] = "GameDataTo";
    RootMessageTag[RootMessageTag["JoinedGame"] = 7] = "JoinedGame";
    RootMessageTag[RootMessageTag["EndGame"] = 8] = "EndGame";
    RootMessageTag[RootMessageTag["GetGameList"] = 9] = "GetGameList";
    RootMessageTag[RootMessageTag["AlterGame"] = 10] = "AlterGame";
    RootMessageTag[RootMessageTag["KickPlayer"] = 11] = "KickPlayer";
    RootMessageTag[RootMessageTag["WaitForHost"] = 12] = "WaitForHost";
    RootMessageTag[RootMessageTag["Redirect"] = 13] = "Redirect";
    RootMessageTag[RootMessageTag["MasterServerList"] = 14] = "MasterServerList";
    RootMessageTag[RootMessageTag["GetGameListV2"] = 16] = "GetGameListV2";
    RootMessageTag[RootMessageTag["ReportPlayer"] = 17] = "ReportPlayer";
})(RootMessageTag = exports.RootMessageTag || (exports.RootMessageTag = {}));
//# sourceMappingURL=RootMessageTag.js.map

/***/ }),

/***/ 9303:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RpcMessageTag = void 0;
var RpcMessageTag;
(function (RpcMessageTag) {
    RpcMessageTag[RpcMessageTag["PlayAnimation"] = 0] = "PlayAnimation";
    RpcMessageTag[RpcMessageTag["CompleteTask"] = 1] = "CompleteTask";
    RpcMessageTag[RpcMessageTag["SyncSettings"] = 2] = "SyncSettings";
    RpcMessageTag[RpcMessageTag["SetInfected"] = 3] = "SetInfected";
    RpcMessageTag[RpcMessageTag["Exiled"] = 4] = "Exiled";
    RpcMessageTag[RpcMessageTag["CheckName"] = 5] = "CheckName";
    RpcMessageTag[RpcMessageTag["SetName"] = 6] = "SetName";
    RpcMessageTag[RpcMessageTag["CheckColor"] = 7] = "CheckColor";
    RpcMessageTag[RpcMessageTag["SetColor"] = 8] = "SetColor";
    RpcMessageTag[RpcMessageTag["SetHat"] = 9] = "SetHat";
    RpcMessageTag[RpcMessageTag["SetSkin"] = 10] = "SetSkin";
    RpcMessageTag[RpcMessageTag["ReportDeadBody"] = 11] = "ReportDeadBody";
    RpcMessageTag[RpcMessageTag["MurderPlayer"] = 12] = "MurderPlayer";
    RpcMessageTag[RpcMessageTag["SendChat"] = 13] = "SendChat";
    RpcMessageTag[RpcMessageTag["StartMeeting"] = 14] = "StartMeeting";
    RpcMessageTag[RpcMessageTag["SetScanner"] = 15] = "SetScanner";
    RpcMessageTag[RpcMessageTag["SendChatNote"] = 16] = "SendChatNote";
    RpcMessageTag[RpcMessageTag["SetPet"] = 17] = "SetPet";
    RpcMessageTag[RpcMessageTag["SetStartCounter"] = 18] = "SetStartCounter";
    RpcMessageTag[RpcMessageTag["EnterVent"] = 19] = "EnterVent";
    RpcMessageTag[RpcMessageTag["ExitVent"] = 20] = "ExitVent";
    RpcMessageTag[RpcMessageTag["SnapTo"] = 21] = "SnapTo";
    RpcMessageTag[RpcMessageTag["Close"] = 22] = "Close";
    RpcMessageTag[RpcMessageTag["VotingComplete"] = 23] = "VotingComplete";
    RpcMessageTag[RpcMessageTag["CastVote"] = 24] = "CastVote";
    RpcMessageTag[RpcMessageTag["ClearVote"] = 25] = "ClearVote";
    RpcMessageTag[RpcMessageTag["AddVote"] = 26] = "AddVote";
    RpcMessageTag[RpcMessageTag["CloseDoorsOfType"] = 27] = "CloseDoorsOfType";
    RpcMessageTag[RpcMessageTag["RepairSystem"] = 28] = "RepairSystem";
    RpcMessageTag[RpcMessageTag["SetTasks"] = 29] = "SetTasks";
    RpcMessageTag[RpcMessageTag["ClimbLadder"] = 31] = "ClimbLadder";
    RpcMessageTag[RpcMessageTag["UsePlatform"] = 32] = "UsePlatform";
})(RpcMessageTag = exports.RpcMessageTag || (exports.RpcMessageTag = {}));
//# sourceMappingURL=RpcMessageTag.js.map

/***/ }),

/***/ 4011:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendOption = void 0;
var SendOption;
(function (SendOption) {
    SendOption[SendOption["Unreliable"] = 0] = "Unreliable";
    SendOption[SendOption["Reliable"] = 1] = "Reliable";
    SendOption[SendOption["Hello"] = 8] = "Hello";
    SendOption[SendOption["Disconnect"] = 9] = "Disconnect";
    SendOption[SendOption["Acknowledge"] = 10] = "Acknowledge";
    SendOption[SendOption["Ping"] = 12] = "Ping";
})(SendOption = exports.SendOption || (exports.SendOption = {}));
//# sourceMappingURL=SendOption.js.map

/***/ }),

/***/ 1411:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(8012), exports);
__exportStar(__webpack_require__(4719), exports);
__exportStar(__webpack_require__(5428), exports);
__exportStar(__webpack_require__(4676), exports);
__exportStar(__webpack_require__(8126), exports);
__exportStar(__webpack_require__(9303), exports);
__exportStar(__webpack_require__(4011), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1439:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlterGameTag = void 0;
var AlterGameTag;
(function (AlterGameTag) {
    AlterGameTag[AlterGameTag["ChangePrivacy"] = 1] = "ChangePrivacy";
})(AlterGameTag = exports.AlterGameTag || (exports.AlterGameTag = {}));
//# sourceMappingURL=AlterGameTag.js.map

/***/ }),

/***/ 7751:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameKeyword = void 0;
var GameKeyword;
(function (GameKeyword) {
    GameKeyword[GameKeyword["All"] = 0] = "All";
    GameKeyword[GameKeyword["Other"] = 1] = "Other";
    GameKeyword[GameKeyword["Spanish"] = 2] = "Spanish";
    GameKeyword[GameKeyword["Korean"] = 4] = "Korean";
    GameKeyword[GameKeyword["Russian"] = 8] = "Russian";
    GameKeyword[GameKeyword["Portuguese"] = 16] = "Portuguese";
    GameKeyword[GameKeyword["Arabic"] = 32] = "Arabic";
    GameKeyword[GameKeyword["Filipino"] = 64] = "Filipino";
    GameKeyword[GameKeyword["Polish"] = 128] = "Polish";
    GameKeyword[GameKeyword["English"] = 256] = "English";
})(GameKeyword = exports.GameKeyword || (exports.GameKeyword = {}));
//# sourceMappingURL=GameKeyword.js.map

/***/ }),

/***/ 589:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameMap = void 0;
var GameMap;
(function (GameMap) {
    GameMap[GameMap["TheSkeld"] = 0] = "TheSkeld";
    GameMap[GameMap["MiraHQ"] = 1] = "MiraHQ";
    GameMap[GameMap["Polus"] = 2] = "Polus";
    GameMap[GameMap["AprilFoolsTheSkeld"] = 3] = "AprilFoolsTheSkeld";
    GameMap[GameMap["Airship"] = 4] = "Airship";
})(GameMap = exports.GameMap || (exports.GameMap = {}));
//# sourceMappingURL=GameMap.js.map

/***/ }),

/***/ 3158:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameOverReason = void 0;
var GameOverReason;
(function (GameOverReason) {
    GameOverReason[GameOverReason["HumansByVote"] = 0] = "HumansByVote";
    GameOverReason[GameOverReason["HumansByTask"] = 1] = "HumansByTask";
    GameOverReason[GameOverReason["ImpostorByVote"] = 2] = "ImpostorByVote";
    GameOverReason[GameOverReason["ImpostorByKill"] = 3] = "ImpostorByKill";
    GameOverReason[GameOverReason["ImpostorBySabotage"] = 4] = "ImpostorBySabotage";
    GameOverReason[GameOverReason["ImpostorDisconnect"] = 5] = "ImpostorDisconnect";
    GameOverReason[GameOverReason["HumansDisconnect"] = 6] = "HumansDisconnect";
})(GameOverReason = exports.GameOverReason || (exports.GameOverReason = {}));
//# sourceMappingURL=GameOverReason.js.map

/***/ }),

/***/ 845:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState[GameState["NotStarted"] = 0] = "NotStarted";
    GameState[GameState["Started"] = 1] = "Started";
    GameState[GameState["Ended"] = 2] = "Ended";
    GameState[GameState["Destroyed"] = 3] = "Destroyed";
})(GameState = exports.GameState || (exports.GameState = {}));
//# sourceMappingURL=GameState.js.map

/***/ }),

/***/ 3497:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KillDistance = void 0;
var KillDistance;
(function (KillDistance) {
    KillDistance[KillDistance["Short"] = 0] = "Short";
    KillDistance[KillDistance["Medium"] = 1] = "Medium";
    KillDistance[KillDistance["Long"] = 2] = "Long";
})(KillDistance = exports.KillDistance || (exports.KillDistance = {}));
//# sourceMappingURL=KillDistance.js.map

/***/ }),

/***/ 7956:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LimboStates = void 0;
var LimboStates;
(function (LimboStates) {
    LimboStates[LimboStates["PreSpawn"] = 0] = "PreSpawn";
    LimboStates[LimboStates["NotLimbo"] = 1] = "NotLimbo";
    LimboStates[LimboStates["WaitingForHost"] = 2] = "WaitingForHost";
})(LimboStates = exports.LimboStates || (exports.LimboStates = {}));
//# sourceMappingURL=LimboState.js.map

/***/ }),

/***/ 7001:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuickChatMode = void 0;
var QuickChatMode;
(function (QuickChatMode) {
    QuickChatMode[QuickChatMode["FreeChat"] = 1] = "FreeChat";
    QuickChatMode[QuickChatMode["QuickChat"] = 2] = "QuickChat";
})(QuickChatMode = exports.QuickChatMode || (exports.QuickChatMode = {}));
//# sourceMappingURL=QuickChatMode.js.map

/***/ }),

/***/ 8269:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskBarUpdate = void 0;
var TaskBarUpdate;
(function (TaskBarUpdate) {
    TaskBarUpdate[TaskBarUpdate["Always"] = 0] = "Always";
    TaskBarUpdate[TaskBarUpdate["Meetings"] = 1] = "Meetings";
    TaskBarUpdate[TaskBarUpdate["Never"] = 2] = "Never";
})(TaskBarUpdate = exports.TaskBarUpdate || (exports.TaskBarUpdate = {}));
//# sourceMappingURL=TaskBarMode.js.map

/***/ }),

/***/ 6489:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(1439), exports);
__exportStar(__webpack_require__(7751), exports);
__exportStar(__webpack_require__(3158), exports);
__exportStar(__webpack_require__(845), exports);
__exportStar(__webpack_require__(3497), exports);
__exportStar(__webpack_require__(7956), exports);
__exportStar(__webpack_require__(589), exports);
__exportStar(__webpack_require__(7001), exports);
__exportStar(__webpack_require__(8269), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2701:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(2151), exports);
__exportStar(__webpack_require__(2255), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6096:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(7952), exports);
__exportStar(__webpack_require__(492), exports);
__exportStar(__webpack_require__(727), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6851:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Heritable = void 0;
const events_1 = __webpack_require__(3418);
/**
 * Represents a basic identifiable entity with components.
 *
 * See {@link HeritableEvents} for events to listen to.
 */
class Heritable extends events_1.EventEmitter {
    constructor(room, id) {
        super();
        this.id = id;
        this.room = room;
        this.components = [];
    }
    async emit(event) {
        if (this.room !== this)
            this.room.emit(event);
        return super.emit(event);
    }
    /**
     * Get a certain component from the object.
     * @param component The component class to get.
     */
    getComponent(component) {
        if (typeof component == "number") {
            return this.components.find((com) => com && com.netid === component);
        }
        for (let i = 0; i < this.components.length; i++) {
            const c = this.components[i];
            if (Array.isArray(component)) {
                if (c &&
                    component.some((com) => c.classname === com.classname)) {
                    return c;
                }
            }
            else {
                if (c && c.classname === component.classname) {
                    return c;
                }
            }
        }
        return undefined;
    }
}
exports.Heritable = Heritable;
//# sourceMappingURL=Heritable.js.map

/***/ }),

/***/ 461:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Hostable = void 0;
const protocol_1 = __webpack_require__(2602);
const util_1 = __webpack_require__(5131);
const constant_1 = __webpack_require__(492);
const component_1 = __webpack_require__(1514);
const Heritable_1 = __webpack_require__(6851);
const Networkable_1 = __webpack_require__(8565);
const PlayerData_1 = __webpack_require__(1379);
const prefabs_1 = __webpack_require__(2493);
const events_1 = __webpack_require__(9256);
/**
 * Represents an object capable of hosting games.
 *
 * See {@link HostableEvents} for events to listen to.
 */
class Hostable extends Heritable_1.Heritable {
    constructor(options = {}) {
        super(null, -2);
        this.options = options;
        this.code = 0;
        this.hostid = -1;
        this.counter = -1;
        this.privacy = "private";
        this.settings = new protocol_1.GameOptions();
        this.objects = new Map();
        this.players = new Map();
        this.netobjects = new Map();
        this.stream = [];
        this.objects.set(-2, this);
        this.room = this;
        this._incr_netid = 0;
        this._destroyed = false;
        this._started = false;
        this.decoder = new protocol_1.PacketDecoder();
        this.last_fixed_update = 0;
        if (options.doFixedUpdate) {
            this._interval = setInterval(this.FixedUpdate.bind(this), Hostable.FixedUpdateInterval);
        }
        this.decoder.on(protocol_1.AlterGameMessage, async (message) => {
            if (message.alterTag === constant_1.AlterGameTag.ChangePrivacy) {
                const messagePrivacy = message.value ? "public" : "private";
                const oldPrivacy = this.privacy;
                const ev = await this.emit(new events_1.RoomSetPrivacyEvent(this, message, oldPrivacy, messagePrivacy));
                if (ev.alteredPrivacy !== messagePrivacy) {
                    await this.broadcast([], true, undefined, [
                        new protocol_1.AlterGameMessage(this.code, constant_1.AlterGameTag.ChangePrivacy, ev.alteredPrivacy === "public" ? 1 : 0)
                    ]);
                }
                if (ev.alteredPrivacy !== oldPrivacy) {
                    this._setPrivacy(ev.alteredPrivacy);
                }
            }
        });
        this.decoder.on(protocol_1.DataMessage, message => {
            const component = this.netobjects.get(message.netid);
            if (component) {
                const reader = util_1.HazelReader.from(message.data);
                component.Deserialize(reader);
            }
        });
        this.decoder.on(protocol_1.RpcMessage, async (message) => {
            const component = this.netobjects.get(message.netid);
            if (component) {
                try {
                    await component.HandleRpc(message.data);
                }
                catch (e) {
                    void e;
                }
            }
        });
        this.decoder.on(protocol_1.SpawnMessage, message => {
            for (let i = 0; i < message.components.length; i++) {
                const spawn_component = message.components[i];
                const owner = this.objects.get(message.ownerid);
                if (owner) {
                    const component = new prefabs_1.SpawnPrefabs[message.spawnType][i](this, spawn_component.netid, message.ownerid);
                    const reader = util_1.HazelReader.from(spawn_component.data);
                    component.Deserialize(reader, true);
                    if (this.netobjects.get(component.netid))
                        continue;
                    this.spawnComponent(component);
                }
            }
        });
        this.decoder.on(protocol_1.DespawnMessage, message => {
            const component = this.netobjects.get(message.netid);
            if (component) {
                this._despawnComponent(component);
            }
        });
        this.decoder.on(protocol_1.SceneChangeMessage, async (message) => {
            var _a, _b;
            const player = this.players.get(message.clientid);
            if (player) {
                if (message.scene === "OnlineGame") {
                    player.inScene = true;
                    const ev = await this.emit(new events_1.PlayerSceneChangeEvent(this, player, message));
                    if (ev.canceled) {
                        player.inScene = false;
                    }
                    else {
                        if (this.amhost) {
                            await this.broadcast(this._getExistingObjectSpawn(), true, player);
                            this.spawnPrefab(constant_1.SpawnType.Player, player.id);
                            (_b = (_a = this.me) === null || _a === void 0 ? void 0 : _a.control) === null || _b === void 0 ? void 0 : _b.syncSettings(this.settings);
                        }
                    }
                }
            }
        });
        this.decoder.on(protocol_1.ReadyMessage, message => {
            const player = this.players.get(message.clientid);
            if (player) {
                player.ready();
            }
        });
    }
    destroy() {
        if (this._interval)
            clearInterval(this._interval);
        this._destroyed = true;
    }
    getNextNetId() {
        this._incr_netid++;
        return this._incr_netid;
    }
    /**
     * The current client in the room.
     */
    get me() {
        return undefined;
    }
    /**
     * The host of the room.
     */
    get host() {
        return this.players.get(this.hostid);
    }
    /**
     * Whether or not a game has started.
     */
    get started() {
        return this._started;
    }
    get destroyed() {
        return this._destroyed;
    }
    /**
     * Whether or not the current client is the host of the room.
     */
    get amhost() {
        return false;
    }
    /**
     * The shipstatus object for the room.
     */
    get shipstatus() {
        return this.getComponent([
            component_1.SkeldShipStatus,
            component_1.MiraShipStatus,
            component_1.PolusShipStatus,
            component_1.AprilShipStatus,
            component_1.AirshipStatus,
        ]);
    }
    /**
     * The meeting hud object for the room.
     */
    get meetinghud() {
        return this.getComponent(component_1.MeetingHud);
    }
    /**
     * The lobby behaviour object for the room.
     */
    get lobbybehaviour() {
        return this.getComponent(component_1.LobbyBehaviour);
    }
    /**
     * The game data object for the room.
     */
    get gamedata() {
        return this.getComponent(component_1.GameData);
    }
    /**
     * The vote ban system object for the room.
     */
    get votebansystem() {
        return this.getComponent(component_1.VoteBanSystem);
    }
    async broadcast(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messages, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reliable = true, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    recipient = undefined, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    payloads = []
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ) { }
    async FixedUpdate() {
        var _a;
        const delta = Date.now() - this.last_fixed_update;
        this.last_fixed_update = Date.now();
        for (const [, component] of this.netobjects) {
            if (component &&
                (component.ownerid === ((_a = this.me) === null || _a === void 0 ? void 0 : _a.id) || this.amhost)) {
                component.FixedUpdate(delta / 1000);
                if (component.dirtyBit) {
                    component.PreSerialize();
                    const writer = util_1.HazelWriter.alloc(0);
                    if (component.Serialize(writer, false)) {
                        this.stream.push(new protocol_1.DataMessage(component.netid, writer.buffer));
                    }
                    component.dirtyBit = 0;
                }
            }
        }
        const ev = await this.emit(new events_1.RoomFixedUpdateEvent(this, this.stream));
        if (this.stream.length) {
            const stream = this.stream;
            this.stream = [];
            if (!ev.canceled)
                await this.broadcast(stream);
        }
    }
    /**
     * Resolve a player by some identifier.
     * @param player The identifier to resolve to a player.
     * @returns The resolved player.
     * @example
     *```typescript
     * // Resolve a player by their clientid.
     * const player = room.resolvePlayer(11013);
     * ```
     */
    resolvePlayer(player) {
        const clientid = this.resolvePlayerClientID(player);
        if (clientid === undefined)
            return undefined;
        return this.players.get(clientid);
    }
    /**
     * Resolve a player ID by some identifier.
     * @param player The identifier to resolve to a player ID.
     * @returns The resolved player ID.
     */
    resolvePlayerId(player) {
        if (typeof player === "undefined") {
            return undefined;
        }
        if (typeof player === "number") {
            return player;
        }
        return player.playerId;
    }
    /**
     * Resolve a clientid by some identifier.
     * @param player The identifier to resolve to a client ID.
     * @returns The resolved client ID.
     */
    resolvePlayerClientID(player) {
        if (typeof player === "undefined") {
            return undefined;
        }
        if (typeof player === "number") {
            return player;
        }
        if (player instanceof Networkable_1.Networkable) {
            return player.ownerid;
        }
        if (player instanceof PlayerData_1.PlayerData) {
            return player.id;
        }
        return undefined;
    }
    /**
     * Set the code of the room.
     * @example
     *```typescript
     * room.setCode("ABCDEF");
     * ```
     */
    setCode(code) {
        if (typeof code === "string") {
            return this.setCode(util_1.Code2Int(code));
        }
        this.code = code;
    }
    _setPrivacy(privacy) {
        this.privacy = privacy;
    }
    /**
     * Change the the privacy of the room.
     * @param tag The tag to change.
     * @param value The new value of the tag.
     * @example
     *```typescript
     * room.setAlterGameTag(AlterGameTag.ChangePrivacy, 1); // 0 for private, 1 for public.
     * ```
     */
    async setPrivacy(privacy) {
        const oldPrivacy = this.privacy;
        this._setPrivacy(privacy);
        const ev = await this.emit(new events_1.RoomSetPrivacyEvent(this, undefined, oldPrivacy, privacy));
        this._setPrivacy(ev.alteredPrivacy);
        if (ev.alteredPrivacy !== oldPrivacy) {
            await this.broadcast([], true, undefined, [
                new protocol_1.AlterGameMessage(this.code, constant_1.AlterGameTag.ChangePrivacy, this.privacy === "public" ? 1 : 0),
            ]);
        }
    }
    /**
     * Change the settings of the room. If the host, it will broadcast these changes.
     * @param settings The settings to set to (Can be partial).
     * @example
     *```typescript
     * room.syncSettings({
     *   crewmateVision: 0.5,
     *   votingTime: 120
     * });
     * ```
     */
    setSettings(settings) {
        var _a;
        this.settings.patch(settings);
        if (this.amhost) {
            if ((_a = this.me) === null || _a === void 0 ? void 0 : _a.control) {
                this.me.control.syncSettings(this.settings);
            }
        }
    }
    /**
     * Set the host of the room. If the current client is the host, it will conduct required host changes.
     * e.g. Spawning objects if they are not already spawned.
     * @param host The new host of the room.
     */
    async setHost(host) {
        const before = this.hostid;
        const resolved_id = this.resolvePlayerClientID(host);
        if (!resolved_id)
            return;
        this.hostid = resolved_id;
        if (this.amhost) {
            if (!this.lobbybehaviour) {
                this.spawnPrefab(constant_1.SpawnType.LobbyBehaviour, -2);
            }
            if (!this.gamedata) {
                this.spawnPrefab(constant_1.SpawnType.GameData, -2);
            }
        }
        if (before !== this.hostid && this.host) {
            await this.host.emit(new events_1.PlayerSetHostEvent(this, this.host));
        }
    }
    async _addPlayer(player) {
        await player.emit(new events_1.PlayerJoinEvent(this, player));
    }
    /**
     * Handle when a client joins the game.
     * @param clientid The ID of the client that joined the game.
     */
    async handleJoin(clientid) {
        if (this.objects.has(clientid))
            return null;
        const player = new PlayerData_1.PlayerData(this, clientid);
        this.players.set(clientid, player);
        this.objects.set(clientid, player);
        await this._addPlayer(player);
        return player;
    }
    _removePlayer(player) {
        player.emit(new events_1.PlayerLeaveEvent(this, player));
    }
    /**
     * Handle when a client leaves the game.
     * @param resolvable The client that left the game.
     */
    async handleLeave(resolvable) {
        const player = this.resolvePlayer(resolvable);
        if (!player)
            return null;
        if (player.playerId !== undefined) {
            if (this.gamedata && this.gamedata.players.get(player.playerId)) {
                this.gamedata.remove(player.playerId);
            }
        }
        if (this.votebansystem && this.votebansystem.voted.get(player.id)) {
            this.votebansystem.voted.delete(player.id);
        }
        for (let i = 0; i < player.components.length; i++) {
            const component = player.components[i];
            if (component)
                await this.despawnComponent(component);
        }
        this.players.delete(player.id);
        this.objects.delete(player.id);
        this._removePlayer(player);
        return player;
    }
    /**
     * Handle when the game is started.
     */
    async _handleStart() {
        var _a, _b, _c, _d;
        if (this._started)
            return;
        this._started = true;
        if (this.amhost) {
            await Promise.all([
                Promise.race([
                    Promise.all([...this.players.values()].map((player) => {
                        if (player.isReady) {
                            return Promise.resolve();
                        }
                        return new Promise((resolve) => {
                            player.once("player.ready", () => {
                                resolve();
                            });
                        });
                    })),
                    util_1.sleep(3000),
                ]),
                (_a = this.me) === null || _a === void 0 ? void 0 : _a.ready(),
            ]);
            const removes = [];
            for (const [clientId, player] of this.players) {
                if (!player.isReady) {
                    await this.handleLeave(player);
                    removes.push(clientId);
                }
            }
            if (removes.length) {
                await this.broadcast([], true, undefined, removes.map((clientid) => {
                    return new protocol_1.RemovePlayerMessage(this.code, clientid, constant_1.DisconnectReason.Error);
                }));
            }
            if (this.lobbybehaviour)
                await this.despawnComponent(this.lobbybehaviour);
            const ship_prefabs = [
                constant_1.SpawnType.ShipStatus,
                constant_1.SpawnType.Headquarters,
                constant_1.SpawnType.PlanetMap,
                constant_1.SpawnType.AprilShipStatus,
                constant_1.SpawnType.Airship
            ];
            await this.emit(new events_1.RoomGameStartEvent(this));
            this.spawnPrefab(ship_prefabs[(_b = this.settings) === null || _b === void 0 ? void 0 : _b.map] || 0, -2);
            await ((_c = this.shipstatus) === null || _c === void 0 ? void 0 : _c.selectImpostors());
            for (const [, player] of this.players) {
                (_d = this.room.gamedata) === null || _d === void 0 ? void 0 : _d.setTasks(player, [1, 2, 3]);
            }
        }
        else {
            await this.emit(new events_1.RoomGameStartEvent(this));
            if (this.me)
                await this.me.ready();
        }
    }
    async _endGame(reason) {
        this._started = false;
        await this.emit(new events_1.RoomGameEndEvent(this, reason));
    }
    /**
     * Handle when the game is ended.
     * @param reason The reason for why the game ended.
     */
    async handleEnd(reason) {
        await this._endGame(reason);
    }
    /**
     * Begin a "Game starts in X" countdown from 5 to 0 (Usually before starting a game).
     */
    async beginCountdown() {
        if (!this.me)
            return;
        const control = this.me.control;
        if (!control)
            return;
        control.setStartCounter(5);
        await util_1.sleep(1000);
        control.setStartCounter(4);
        await util_1.sleep(1000);
        control.setStartCounter(3);
        await util_1.sleep(1000);
        control.setStartCounter(2);
        await util_1.sleep(1000);
        control.setStartCounter(1);
        await util_1.sleep(1000);
        control.setStartCounter(0);
        util_1.sleep(1000).then(() => {
            if (!this.me)
                return;
            control.setStartCounter(-1);
        });
    }
    /**
     * Start a game.
     */
    async requestStartGame() {
        await this.broadcast([], true, undefined, [new protocol_1.StartGameMessage(this.code)]);
    }
    /**
     * End the current game.
     */
    async endGame(reason) {
        return await this.handleEnd(reason);
    }
    /**
     * Handle a client readying up.
     * @param player The client that readied.
     */
    async handleReady(player) {
        const resolved = this.resolvePlayer(player);
        if (resolved) {
            await resolved.ready();
        }
    }
    /**
     * Spawn a component (Not broadcasted to all clients, see {@link Hostable.spawnPrefab}).
     * @param component The component being spawned.
     * @example
     *```typescript
     * const meetinghud = new MeetingHud(
     *   this,
     *   this.getNextNetId(),
     *   ownerid,
     *   {
     *     dirtyBit: 0,
     *     states: new Map(),
     *   }
     * );
     *
     * this.spawnComponent(meetinghud);
     * ```
     */
    spawnComponent(component) {
        var _a;
        if (this.netobjects.get(component.netid)) {
            return;
        }
        this.netobjects.set(component.netid, component);
        (_a = component.owner) === null || _a === void 0 ? void 0 : _a.components.push(component);
        component.emit(new events_1.NetworkableSpawnEvent(this, component));
    }
    _despawnComponent(component) {
        var _a;
        this.netobjects.delete(component.netid);
        component.emit(new events_1.NetworkableDespawnEvent(this, component));
        (_a = component.owner) === null || _a === void 0 ? void 0 : _a.components.splice(component.owner.components.indexOf(component), 1, null);
    }
    /**
     * Despawn a component.
     * @param component The component being despawned.
     * @example
     *```typescript
     * room.despawnComponent(room.meetinghud);
     * ```
     */
    despawnComponent(component) {
        this._despawnComponent(component);
        this.stream.push(new protocol_1.DespawnMessage(component.netid));
    }
    /**
     * Get an available player ID.
     * @returns The player ID that was found.
     * @example
     *```typescript
     * // Get an available player ID and add it to the gamedata.
     * const playerId = room.getAvailablePlayerID();
     * room.gamedata.add(playerId);
     * ```
     */
    getAvailablePlayerID() {
        for (let i = 0;; i++) {
            if (!this.getPlayerByPlayerId(i)) {
                return i;
            }
        }
    }
    /**
     * Spawn a prefab of an object.
     * @param type The type of object to spawn.
     * @param owner The owner or ID of the owner of the object to spawn.
     * @returns The object that was spawned.
     * @example
     *```typescript
     * room.spawnPrefab(SpawnType.Player, client.me);
     * ```
     */
    spawnPrefab(type, owner) {
        const ownerid = typeof owner === "number" ? owner : owner.id;
        const object = {
            type,
            ownerid,
            flags: type === constant_1.SpawnType.Player ? 1 : 0,
            components: [],
        };
        switch (type) {
            case constant_1.SpawnType.ShipStatus: {
                const shipstatus = new component_1.SkeldShipStatus(this, this.getNextNetId(), ownerid);
                object.components.push(shipstatus);
                break;
            }
            case constant_1.SpawnType.MeetingHud:
                const meetinghud = new component_1.MeetingHud(this, this.getNextNetId(), ownerid, {
                    states: new Map(),
                });
                object.components.push(meetinghud);
                break;
            case constant_1.SpawnType.LobbyBehaviour:
                const lobbybehaviour = new component_1.LobbyBehaviour(this, this.getNextNetId(), ownerid, {});
                object.components.push(lobbybehaviour);
                break;
            case constant_1.SpawnType.GameData:
                const gamedata = new component_1.GameData(this, this.getNextNetId(), ownerid, {
                    players: new Map(),
                });
                for (const [, player] of this.players) {
                    if (player.playerId)
                        gamedata.add(player.playerId);
                }
                const votebansystem = new component_1.VoteBanSystem(this, this.getNextNetId(), ownerid, {
                    voted: new Map(),
                });
                object.components.push(gamedata);
                object.components.push(votebansystem);
                break;
            case constant_1.SpawnType.Player:
                const playerId = this.getAvailablePlayerID();
                if (this.gamedata)
                    this.gamedata.add(playerId);
                const control = new component_1.PlayerControl(this, this.getNextNetId(), ownerid, {
                    isNew: true,
                    playerId,
                });
                const physics = new component_1.PlayerPhysics(this, this.getNextNetId(), ownerid, {
                    ventid: -1,
                });
                const transform = new component_1.CustomNetworkTransform(this, this.getNextNetId(), ownerid, {
                    seqId: 1,
                    position: util_1.Vector2.null,
                    velocity: util_1.Vector2.null,
                });
                object.components.push(control);
                object.components.push(physics);
                object.components.push(transform);
                break;
            case constant_1.SpawnType.Headquarters:
                const headquarters = new component_1.MiraShipStatus(this, this.getNextNetId(), ownerid);
                object.components.push(headquarters);
                break;
            case constant_1.SpawnType.PlanetMap:
                const planetmap = new component_1.PolusShipStatus(this, this.getNextNetId(), ownerid);
                object.components.push(planetmap);
                break;
            case constant_1.SpawnType.AprilShipStatus:
                const aprilshipstatus = new component_1.AprilShipStatus(this, this.getNextNetId(), ownerid);
                object.components.push(aprilshipstatus);
                break;
            case constant_1.SpawnType.Airship:
                const airship = new component_1.AirshipStatus(this, this.getNextNetId(), ownerid);
                object.components.push(airship);
                break;
        }
        for (const component of object.components) {
            this.spawnComponent(component);
        }
        this.stream.push(new protocol_1.SpawnMessage(type, object.ownerid, object.flags, object.components.map((component) => {
            const writer = util_1.HazelWriter.alloc(0);
            writer.write(component, true);
            return new protocol_1.ComponentSpawnData(component.netid, writer.buffer);
        })));
        return object;
    }
    /**
     * Get a player by their player ID.
     * @param playerId The player ID of the player.
     * @returns The player that was found, or null if they do not exist.
     * @example
     * ```typescript
     * const player = room.getPlayerByPlayerId(1);
     * ```
     */
    getPlayerByPlayerId(playerId) {
        for (const [, player] of this.players) {
            if (player.playerId === playerId)
                return player;
        }
        return undefined;
    }
    /**
     * Get a player by one of their components' netids.
     * @param netid The network ID of the component of the player to search.
     * @returns The player that was found, or null if they do not exist.
     * @example
     * ```typescript
     * const player = room.getPlayerByNetId(34);
     * ```
     */
    getPlayerByNetId(netid) {
        for (const [, player] of this.players) {
            if (player.components.find((component) => (component === null || component === void 0 ? void 0 : component.netid) === netid))
                return player;
        }
        return undefined;
    }
    _getExistingObjectSpawn() {
        const messages = [];
        for (const [, netobj] of this.netobjects) {
            let message = messages.find((msg) => msg.spawnType === netobj.type &&
                msg.ownerid === netobj.ownerid);
            if (!message) {
                message = new protocol_1.SpawnMessage(netobj.type, netobj.ownerid, netobj.classname === "PlayerControl"
                    ? constant_1.SpawnFlag.IsClientCharacter
                    : constant_1.SpawnFlag.None, []);
                messages.push(message);
            }
            const writer = util_1.HazelWriter.alloc(0);
            writer.write(netobj, true);
            message.components.push(new protocol_1.ComponentSpawnData(netobj.netid, writer.buffer));
        }
        return messages;
    }
}
exports.Hostable = Hostable;
/**
 * How often a FixedUpdate should be called.
 */
Hostable.FixedUpdateInterval = 1 / 50;
//# sourceMappingURL=Hostable.js.map

/***/ }),

/***/ 8565:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Networkable = void 0;
const util_1 = __webpack_require__(5131);
const events_1 = __webpack_require__(3418);
/**
 * Represents a basic networkable object in Among Us.
 *
 * See {@link NetworkableEvents} for events to listen to.
 */
class Networkable extends events_1.EventEmitter {
    constructor(room, netid, ownerid, data) {
        super();
        /**
         * The dirty state of this component.
         */
        this.dirtyBit = 0;
        this.room = room;
        this.netid = netid;
        this.ownerid = ownerid;
        if (data) {
            if (data instanceof util_1.HazelReader) {
                this.Deserialize(data, true);
            }
            else {
                this.patch(data);
            }
        }
    }
    patch(data) {
        Object.assign(this, data);
    }
    async emit(event) {
        if (this.owner) {
            this.owner.emit(event);
        }
        return super.emit(event);
    }
    get owner() {
        return this.room.objects.get(this.ownerid);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Deserialize(reader, spawn = false) { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Serialize(writer, spawn = false) {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    PreSerialize() { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    async HandleRpc(rpc) { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    FixedUpdate(delta) { }
    /**
     * Spawn this component if does not exist in the room it belongs in.
     */
    spawn() {
        return this.room.spawnComponent(this);
    }
    /**
     * Despawns the component from the room it belongs in.
     */
    despawn() {
        return this.room.despawnComponent(this);
    }
}
exports.Networkable = Networkable;
//# sourceMappingURL=Networkable.js.map

/***/ }),

/***/ 1379:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerData = void 0;
const protocol_1 = __webpack_require__(2602);
const component_1 = __webpack_require__(1514);
const Heritable_1 = __webpack_require__(6851);
const events_1 = __webpack_require__(9256);
/**
 * Represents the player of a client connected to the room.
 *
 * See {@link PlayerDataEvents} for events to listen to.
 */
class PlayerData extends Heritable_1.Heritable {
    constructor(room, clientid) {
        super(room, clientid);
        this.stream = [];
        this.isReady = false;
        this.inScene = false;
        this.left = false;
        this.on("component.spawn", () => {
            if (this.spawned) {
                this.emit(new events_1.PlayerSpawnEvent(this.room, this));
            }
        });
    }
    /**
     * The player's control component.
     */
    get control() {
        return this.getComponent(component_1.PlayerControl);
    }
    /**
     * The player's physics component.
     */
    get physics() {
        return this.getComponent(component_1.PlayerPhysics);
    }
    /**
     * The player's movement component.
     */
    get transform() {
        return this.getComponent(component_1.CustomNetworkTransform);
    }
    /**
     * The player's game data.
     */
    get data() {
        var _a, _b;
        if (this.playerId === undefined)
            return undefined;
        return (_b = (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.players) === null || _b === void 0 ? void 0 : _b.get(this.playerId);
    }
    /**
     * The player ID of the player.
     */
    get playerId() {
        var _a;
        return (_a = this.control) === null || _a === void 0 ? void 0 : _a.playerId;
    }
    /**
     * Whether or not the player has fully spawned.
     */
    get spawned() {
        return !!(this.control && this.physics && this.transform);
    }
    /**
     * Whether or not the player is the host of the room they belong in.
     */
    get ishost() {
        return this.room.hostid === this.id;
    }
    /**
     * Whether or not the player is the current client's player.
     */
    get isme() {
        var _a;
        return this.id === ((_a = this.room.me) === null || _a === void 0 ? void 0 : _a.id);
    }
    /**
     * Mark as readied up to start the game.
     */
    async ready() {
        this.isReady = true;
        await this.emit(new events_1.PlayerReadyEvent(this.room, this));
        if (this.isme && !this.ishost) {
            await this.room.broadcast([new protocol_1.ReadyMessage(this.id)]);
        }
    }
}
exports.PlayerData = PlayerData;
//# sourceMappingURL=PlayerData.js.map

/***/ }),

/***/ 8708:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirshipStatus = void 0;
const constant_1 = __webpack_require__(492);
const InnerShipStatus_1 = __webpack_require__(3585);
const system_1 = __webpack_require__(7735);
/**
 * Represents a room object for the Airship map.
 *
 * See {@link ShipStatusEvents} for events to listen to.
 */
class AirshipStatus extends InnerShipStatus_1.InnerShipStatus {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.Airship;
        this.classname = "Airship";
    }
    Setup() {
        this.systems = {
            [constant_1.SystemType.Electrical]: new system_1.SwitchSystem(this, {
                expected: [false, false, false, false, false],
                actual: [false, false, false, false, false],
                brightness: 100,
            }),
            [constant_1.SystemType.Security]: new system_1.SecurityCameraSystem(this, {
                players: new Set(),
            }),
            [constant_1.SystemType.Communications]: new system_1.HudOverrideSystem(this, {
                sabotaged: false,
            }),
            [constant_1.SystemType.Decontamination]: new system_1.ElectricalDoorsSystem(this, {
                doors: [],
            }),
            [constant_1.SystemType.Decontamination2]: new system_1.AutoDoorsSystem(this, {
                dirtyBit: 0,
                doors: [],
            }),
            [constant_1.SystemType.Sabotage]: new system_1.SabotageSystem(this, {
                cooldown: 0,
            }),
            [constant_1.SystemType.GapRoom]: new system_1.MovingPlatformSystem(this, {
                target: undefined,
                side: system_1.MovingPlatformSide.Left,
                useId: 0,
            }),
        };
    }
}
exports.AirshipStatus = AirshipStatus;
AirshipStatus.type = constant_1.SpawnType.Airship;
AirshipStatus.classname = "Airship";
AirshipStatus.roomDoors = {
    [constant_1.SystemType.Communications]: [0, 1, 2, 3],
    [constant_1.SystemType.Brig]: [4, 5, 6],
    [constant_1.SystemType.Kitchen]: [7, 8, 9],
    [constant_1.SystemType.MainHall]: [10, 11],
    [constant_1.SystemType.Records]: [12, 13, 14],
    [constant_1.SystemType.Lounge]: [15, 16, 17],
    [constant_1.SystemType.Medical]: [19, 20]
};
//# sourceMappingURL=AirshipStatus.js.map

/***/ }),

/***/ 6115:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AprilShipStatus = void 0;
const constant_1 = __webpack_require__(492);
const InnerShipStatus_1 = __webpack_require__(3585);
const system_1 = __webpack_require__(7735);
const AutoOpenDoor_1 = __webpack_require__(7699);
/**
 * Represents a room object for the April Fools' version of the The Skeld map.
 *
 * See {@link ShipStatusEvents} for events to listen to.
 */
class AprilShipStatus extends InnerShipStatus_1.InnerShipStatus {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.AprilShipStatus;
        this.classname = "AprilShipStatus";
    }
    async HandleRpc(rpc) {
        switch (rpc.tag) {
            case constant_1.RpcMessageTag.CloseDoorsOfType:
                await this._handleCloseDoorsOfType(rpc);
                break;
            default:
                await super.HandleRpc(rpc);
                break;
        }
    }
    async _handleCloseDoorsOfType(rpc) {
        const doorsinRoom = AprilShipStatus.roomDoors[rpc.systemid];
        for (const doorId of doorsinRoom) {
            this.systems[constant_1.SystemType.Doors].closeDoor(doorId);
        }
    }
    Setup() {
        this.systems = {
            [constant_1.SystemType.Reactor]: new system_1.ReactorSystem(this, {
                timer: 10000,
                completed: new Set(),
            }),
            [constant_1.SystemType.Electrical]: new system_1.SwitchSystem(this, {
                expected: [false, false, false, false, false],
                actual: [false, false, false, false, false],
                brightness: 100,
            }),
            [constant_1.SystemType.O2]: new system_1.LifeSuppSystem(this, {
                timer: 10000,
                completed: new Set(),
            }),
            [constant_1.SystemType.MedBay]: new system_1.MedScanSystem(this, {
                queue: [],
            }),
            [constant_1.SystemType.Security]: new system_1.SecurityCameraSystem(this, {
                players: new Set(),
            }),
            [constant_1.SystemType.Communications]: new system_1.HudOverrideSystem(this, {
                sabotaged: false,
            }),
            [constant_1.SystemType.Doors]: new system_1.AutoDoorsSystem(this, {
                dirtyBit: 0,
                doors: [],
            }),
            [constant_1.SystemType.Sabotage]: new system_1.SabotageSystem(this, {
                cooldown: 0,
            }),
        };
        const autodoor = this.systems[constant_1.SystemType.Doors];
        autodoor.doors = [
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 0, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 1, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 2, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 3, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 4, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 5, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 6, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 7, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 8, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 9, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 10, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 11, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 12, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoor, 13, true),
        ];
    }
}
exports.AprilShipStatus = AprilShipStatus;
AprilShipStatus.type = constant_1.SpawnType.AprilShipStatus;
AprilShipStatus.classname = "AprilShipStatus";
AprilShipStatus.roomDoors = {
    [constant_1.SystemType.UpperEngine]: [2, 5],
    [constant_1.SystemType.Cafeteria]: [0, 3, 8],
    [constant_1.SystemType.MedBay]: [10],
    [constant_1.SystemType.Security]: [6],
    [constant_1.SystemType.Electrical]: [9],
    [constant_1.SystemType.Storage]: [1, 7, 12],
    [constant_1.SystemType.LowerEngine]: [4, 11]
};
//# sourceMappingURL=AprilShipStatus.js.map

/***/ }),

/***/ 2965:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomNetworkTransform = void 0;
const util_1 = __webpack_require__(5131);
const protocol_1 = __webpack_require__(2602);
const constant_1 = __webpack_require__(492);
const Networkable_1 = __webpack_require__(8565);
const net_1 = __webpack_require__(2031);
const events_1 = __webpack_require__(9256);
/**
 * Represents player component for networking movement.
 *
 * See {@link CustomNetworkTransformEvents} for events to listen to.
 */
class CustomNetworkTransform extends Networkable_1.Networkable {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.Player;
        this.classname = "CustomNetworkTransform";
        this.oldSeqId || (this.oldSeqId = 0);
        this.seqId || (this.seqId = 0);
        this.position || (this.position = util_1.Vector2.null);
        this.velocity || (this.velocity = util_1.Vector2.null);
    }
    get player() {
        return this.owner;
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn = false) {
        const newSeqId = reader.uint16();
        if (!net_1.NetworkUtils.seqIdGreaterThan(newSeqId, this.seqId)) {
            return;
        }
        this.seqId = newSeqId;
        this.position = reader.vector();
        this.velocity = reader.vector();
        this.emit(new events_1.PlayerMoveEvent(this.room, this.player, new util_1.Vector2(this.position), new util_1.Vector2(this.velocity)));
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn = false) {
        writer.uint16(this.seqId);
        writer.vector(this.position);
        writer.vector(this.velocity);
        this.dirtyBit = 0;
        return true;
    }
    async HandleRpc(rpc) {
        switch (rpc.tag) {
            case constant_1.RpcMessageTag.SnapTo:
                await this._handleSnapTo(rpc);
                break;
        }
    }
    /**
     * Move to a position (lerps towards).
     * @param position The position to move towards.
     * @param velocity The velocity to display moving at.
     * @example
     *```typescript
     * // Follow the host
     * host.transform.on("player.move", ev => {
     *   player.transform.move(ev.position.x, ev.position.y);
     * });
     * ```
     */
    async move(x, y, velocity = util_1.Vector2.null) {
        this.seqId += 1;
        if (this.seqId > 2 ** 16 - 1) {
            this.seqId = 1;
        }
        this.position.x = x;
        this.position.y = y;
        this.velocity = velocity;
        this.dirtyBit = 1;
        const writer = util_1.HazelWriter.alloc(10);
        this.Serialize(writer, false);
        await this.room.broadcast([new protocol_1.DataMessage(this.netid, writer.buffer)], false);
        this.emit(new events_1.PlayerMoveEvent(this.room, this.player, new util_1.Vector2(this.position), new util_1.Vector2(this.velocity)));
    }
    async _handleSnapTo(rpc) {
        if (net_1.NetworkUtils.seqIdGreaterThan(rpc.sequenceid, this.seqId)) {
            const oldPosition = this.position;
            this.seqId = rpc.sequenceid;
            this.position = rpc.position;
            this.velocity = util_1.Vector2.null;
            const newPosition = new util_1.Vector2(this.position);
            const ev = await this.emit(new events_1.PlayerSnapToEvent(this.room, this.player, rpc, oldPosition, newPosition));
            if (ev.alteredPosition.x !== newPosition.x ||
                ev.alteredPosition.y !== newPosition.y) {
                this.position = new util_1.Vector2(ev.alteredPosition);
                this.snapTo(ev.alteredPosition);
            }
        }
    }
    _snapTo(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
    _rpcSnapTo(position) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SnapToMessage(new util_1.Vector2(position), this.seqId)));
    }
    snapTo(x, y) {
        this.seqId += 1;
        if (this.seqId > 2 ** 16 - 1) {
            this.seqId = 1;
        }
        this.dirtyBit = 0;
        if (x instanceof util_1.Vector2) {
            this._snapTo(x.x, x.y);
        }
        else if (y) {
            this._snapTo(x, y);
        }
        this._rpcSnapTo(this.position);
    }
}
exports.CustomNetworkTransform = CustomNetworkTransform;
CustomNetworkTransform.type = constant_1.SpawnType.Player;
CustomNetworkTransform.classname = "CustomNetworkTransform";
//# sourceMappingURL=CustomNetworkTransform.js.map

/***/ }),

/***/ 2146:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameData = void 0;
const constant_1 = __webpack_require__(492);
const protocol_1 = __webpack_require__(2602);
const Networkable_1 = __webpack_require__(8565);
const PlayerInfo_1 = __webpack_require__(8428);
const events_1 = __webpack_require__(9256);
/**
 * Represents a room object containing data about players.
 *
 * See {@link GameDataEvents} for events to listen to.
 */
class GameData extends Networkable_1.Networkable {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.GameData;
        this.classname = "GameData";
        this.players || (this.players = new Map);
    }
    get owner() {
        return super.owner;
    }
    resolvePlayerData(resolvable) {
        const resolved = this.room.resolvePlayerId(resolvable);
        if (!resolved)
            return null;
        return this.players.get(resolved);
    }
    Deserialize(reader, spawn = false) {
        if (!this.players)
            this.players = new Map();
        if (spawn) {
            const num_players = reader.upacked();
            for (let i = 0; i < num_players; i++) {
                const playerId = reader.uint8();
                const player = PlayerInfo_1.PlayerInfo.Deserialize(reader, this, playerId);
                this.players.set(player.playerId, player);
            }
        }
        else {
            while (reader.left) {
                const [playerId, preader] = reader.message();
                const player = this.players.get(playerId);
                if (player) {
                    player.Deserialize(preader);
                }
                else {
                    const player = PlayerInfo_1.PlayerInfo.Deserialize(preader, this, playerId);
                    this.players.set(player.playerId, player);
                }
            }
        }
    }
    Serialize(writer, spawn = false) {
        let flag = false;
        if (spawn) {
            writer.upacked(this.players.size);
        }
        for (const [playerid, player] of this.players) {
            if ((1 << playerid) & this.dirtyBit || spawn) {
                if (spawn) {
                    writer.uint8(player.playerId);
                    writer.write(player);
                }
                else {
                    writer.begin(player.playerId);
                    writer.write(player);
                    writer.end();
                }
                flag = true;
            }
        }
        this.dirtyBit = 0;
        return flag;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async HandleRpc(rpc) {
        switch (rpc.tag) {
            case constant_1.RpcMessageTag.SetTasks:
                this._handleSetTasks(rpc);
                break;
        }
    }
    /**
     * Make the player data dirty and update on the next FixedUpdate.
     * @param resolvable The player to make dirty.
     */
    update(resolvable) {
        const player = this.resolvePlayerData(resolvable);
        if (player) {
            this.dirtyBit |= 1 << player.playerId;
        }
    }
    /**
     * Change the name of a player (Will not update on clients, use {@link PlayerControl.setName}).
     * @param resolvable The player to change the name of.
     * @param name The name to change to.
     * @example
     *```typescript
     * room.gamedata.setName(player, "weakeyes");
     * ```
     */
    setName(resolvable, name) {
        const player = this.resolvePlayerData(resolvable);
        if (player) {
            player.name = name;
            this.update(player);
        }
    }
    /**
     * Change the colour of a player (Will not update on clients, use {@link PlayerControl.setColor}).
     * @param resolvable The player to change the colour of.
     * @param color The colour to change to.
     * @example
     *```typescript
     * room.gamedata.setColor(player, ColorID.Blue);
     * ```
     */
    setColor(resolvable, color) {
        const player = this.resolvePlayerData(resolvable);
        if (player) {
            player.color = color;
            this.update(player);
        }
    }
    /**
     * Change the hat of a player.
     * @param resolvable The player to change the hat of.
     * @param hat The hat to change to.
     * @example
     *```typescript
     * room.gamedata.setHat(player, HatID.TopHat);
     * ```
     */
    setHat(resolvable, hat) {
        const player = this.resolvePlayerData(resolvable);
        if (player) {
            player.hat = hat;
            this.update(player);
        }
    }
    /**
     * Change the skin of a player.
     * @param resolvable The player to change the skin of.
     * @param skin The skin to change to.
     * @example
     *```typescript
     * room.gamedata.setSkin(player, SkinID.Mechanic);
     * ```
     */
    setSkin(resolvable, skin) {
        const player = this.resolvePlayerData(resolvable);
        if (player) {
            player.skin = skin;
            this.update(player);
        }
    }
    /**
     * Change the pet of a player.
     * @param resolvable The player to change the pet of.
     * @param skin The pet to change to.
     * @example
     *```typescript
     * room.gamedata.setPet(player, PetID.MiniCrewmate);
     * ```
     */
    setPet(resolvable, pet) {
        const player = this.resolvePlayerData(resolvable);
        if (player) {
            player.pet = pet;
            this.update(player);
        }
    }
    async _handleSetTasks(rpc) {
        const playerData = this.players.get(rpc.playerid);
        if (playerData) {
            const oldTasks = playerData.taskIds;
            this._setTasks(playerData, rpc.taskids);
            const playerTasks = playerData.taskIds;
            const ev = await this.emit(new events_1.GameDataSetTasksEvent(this.room, this, playerData, oldTasks, playerTasks));
            playerData.taskIds = ev.alteredTasks;
            if (ev.alteredTasks !== playerTasks) {
                this._rpcSetTasks(playerData, playerData.taskIds);
            }
        }
    }
    _setTasks(player, taskIds) {
        player.taskIds = taskIds;
        player.taskStates = taskIds.map((id, i) => new PlayerInfo_1.TaskState(i, false));
        this.update(player);
    }
    _rpcSetTasks(player, taskIds) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SetTasksMessage(player.playerId, taskIds)));
    }
    /**
     * Set the tasks of a player.
     * @param player The player to set the tasks of.
     * @param taskIds The tasks to set.
     * @example
     *```typescript
     * room.gamedata.setTasks(player, [
     *   TheSkeldTask.ReactorUnlockManifolds,
     *   TheSkeldTask.ElectricDownloadData,
     *   TheSkeldTask.ShieldsPrimeShields,
     *   TheSkeldTask.NavigationDownloadData
     * ]);
     * ```
     */
    async setTasks(player, taskIds) {
        const playerData = this.resolvePlayerData(player);
        if (playerData) {
            const oldTasks = playerData.taskIds;
            this._setTasks(playerData, taskIds);
            const ev = await this.emit(new events_1.GameDataSetTasksEvent(this.room, this, playerData, oldTasks, playerData.taskIds));
            playerData.taskIds = ev.alteredTasks;
            if (playerData.taskIds !== oldTasks) {
                this._rpcSetTasks(playerData, taskIds);
                this.update(playerData);
            }
        }
    }
    /**
     * Mark a player's task as complete.
     * @param resolvable The player of the tasks to mark complete.
     * @param taskIdx The index of the player's tasks to mark complete.
     * @example
     *```typescript
     * // Complete all of a player's tasks.
     * for (let i = 0; i < player.data.tasks.length; i++) {
     *   room.gamedata.completeTask(player, i);
     * }
     * ```
     */
    completeTask(resolvable, taskIdx) {
        const player = this.resolvePlayerData(resolvable);
        if (player) {
            const task = player.taskStates[taskIdx];
            if (task) {
                task.completed = true;
            }
        }
    }
    /**
     * Add a player to player data.
     * @param playerId The player ID of the player to add.
     * @example
     *```typescript
     * // Get an available player ID and add it to the gamedata.
     * const playerId = room.getAvailablePlayerID();
     * room.gamedata.add(playerId);
     * ```
     */
    async add(playerId) {
        const playerInfo = PlayerInfo_1.PlayerInfo.createDefault(this, playerId);
        this.players.set(playerId, playerInfo);
        const ev = await this.emit(new events_1.GameDataAddPlayerEvent(this.room, this, playerInfo));
        if (ev.reverted) {
            this.players.delete(playerId);
        }
        else {
            this.update(playerId);
        }
        return playerInfo;
    }
    /**
     * Remove player data from the game data.
     * @param resolvable The player to remove.
     */
    async remove(resolvable) {
        const playerInfo = this.resolvePlayerData(resolvable);
        if (playerInfo) {
            const wasMarked = this.dirtyBit & (1 << playerInfo.playerId);
            if (wasMarked) {
                this.dirtyBit ^= 1 << playerInfo.playerId;
            }
            this.players.delete(playerInfo.playerId);
            const ev = await this.emit(new events_1.GameDataRemovePlayerEvent(this.room, this, playerInfo));
            if (ev.reverted) {
                this.players.set(playerInfo.playerId, playerInfo);
                this.update(playerInfo.playerId);
            }
        }
    }
}
exports.GameData = GameData;
GameData.type = constant_1.SpawnType.GameData;
GameData.classname = "GameData";
//# sourceMappingURL=GameData.js.map

/***/ }),

/***/ 3585:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InnerShipStatus = void 0;
const constant_1 = __webpack_require__(492);
const Networkable_1 = __webpack_require__(8565);
const events_1 = __webpack_require__(9256);
class InnerShipStatus extends Networkable_1.Networkable {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Setup() { }
    Deserialize(reader, spawn = false) {
        if (!this.systems)
            this.Setup();
        while (reader.left) {
            const [tag, mreader] = reader.message();
            const system = this.systems[tag];
            if (system) {
                system.Deserialize(mreader, spawn);
            }
        }
    }
    /* eslint-disable-next-line */
    Serialize(writer, spawn = false) {
        if (!this.systems)
            this.Setup();
        const systems = Object.values(this.systems);
        for (let i = 0; i < systems.length; i++) {
            const system = systems[i];
            if (system === null || system === void 0 ? void 0 : system.dirty) {
                writer.begin(system.systemType);
                system.Serialize(writer, spawn);
                writer.end();
                system.dirty = false;
            }
        }
        this.dirtyBit = 0;
        return true;
    }
    async HandleRpc(rpc) {
        switch (rpc.tag) {
            case constant_1.RpcMessageTag.RepairSystem:
                await this._handleRepairSystem(rpc);
                break;
        }
    }
    FixedUpdate(delta) {
        if (!this.systems)
            this.Setup();
        const systems = Object.values(this.systems);
        for (let i = 0; i < systems.length; i++) {
            const system = systems[i];
            system === null || system === void 0 ? void 0 : system.Detoriorate(delta);
        }
    }
    async _handleRepairSystem(rpc) {
        const system = this.systems[rpc.systemid];
        const player = this.room.getPlayerByNetId(rpc.netid);
        if (system && player) {
            await system.HandleRepair(player, rpc.amount, rpc);
        }
    }
    async selectImpostors() {
        var _a, _b;
        const available = [...this.room.players.values()].filter((player) => player.data && !player.data.isDisconnected && !player.data.isDead);
        const max = available.length < 7 ? 1 : available.length < 9 ? 2 : 3;
        const impostors = [];
        for (let i = 0; i < Math.min(this.room.settings.numImpostors, max); i++) {
            const random = ~~(available.length - 1);
            impostors.push(available[random]);
            available.splice(random, 1);
        }
        const ev = await this.emit(new events_1.RoomSelectImpostorsEvent(this.room, impostors));
        if (!ev.canceled) {
            await ((_b = (_a = this.room.host) === null || _a === void 0 ? void 0 : _a.control) === null || _b === void 0 ? void 0 : _b.setImpostors(ev.alteredImpostors));
        }
    }
}
exports.InnerShipStatus = InnerShipStatus;
//# sourceMappingURL=InnerShipStatus.js.map

/***/ }),

/***/ 6350:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LobbyBehaviour = void 0;
const constant_1 = __webpack_require__(492);
const Networkable_1 = __webpack_require__(8565);
/**
 * Represents a room object for the Lobby map.
 *
 * See {@link LobbyBehaviourEvents} for events to listen to.
 */
class LobbyBehaviour extends Networkable_1.Networkable {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.LobbyBehaviour;
        this.classname = "LobbyBehaviour";
    }
    get owner() {
        return super.owner;
    }
}
exports.LobbyBehaviour = LobbyBehaviour;
LobbyBehaviour.type = constant_1.SpawnType.LobbyBehaviour;
LobbyBehaviour.classname = "LobbyBehaviour";
//# sourceMappingURL=LobbyBehaviour.js.map

/***/ }),

/***/ 7290:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MeetingHud = void 0;
const util_1 = __webpack_require__(5131);
const constant_1 = __webpack_require__(492);
const protocol_1 = __webpack_require__(2602);
const Networkable_1 = __webpack_require__(8565);
const PlayerVoteState_1 = __webpack_require__(5332);
const events_1 = __webpack_require__(9256);
class MeetingHud extends Networkable_1.Networkable {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.MeetingHud;
        this.classname = "MeetingHud";
        this.dirtyBit || (this.dirtyBit = 0);
        this.states || (this.states = new Map);
    }
    get owner() {
        return super.owner;
    }
    Deserialize(reader, spawn = false) {
        if (spawn) {
            this.dirtyBit = 0;
            this.states = new Map();
            for (let i = 0; i < this.states.size; i++) {
                this.states.set(i, PlayerVoteState_1.PlayerVoteState.Deserialize(reader, this.room, i));
            }
        }
        else {
            const mask = reader.upacked();
            for (let i = 0; i < this.states.size; i++) {
                if (mask & (1 << i)) {
                    this.states.set(i, PlayerVoteState_1.PlayerVoteState.Deserialize(reader, this.room, i));
                }
            }
        }
    }
    Serialize(writer, spawn = false) {
        if (spawn) {
            for (const [, state] of this.states) {
                state.Serialize(writer);
            }
        }
        else {
            writer.upacked(this.dirtyBit);
            for (const [playerId, state] of this.states) {
                if (this.dirtyBit & (1 << playerId)) {
                    state.Serialize(writer);
                }
            }
        }
        this.dirtyBit = 0;
        return true;
    }
    async HandleRpc(rpc) {
        switch (rpc.tag) {
            case constant_1.RpcMessageTag.Close:
                await this._handleClose(rpc);
                break;
            case constant_1.RpcMessageTag.VotingComplete:
                await this._handleVotingComplete(rpc);
                break;
            case constant_1.RpcMessageTag.CastVote:
                await this._handleCastVote(rpc);
                break;
            case constant_1.RpcMessageTag.ClearVote:
                await this._handleClearVote(rpc);
                break;
        }
    }
    async _handleClose(rpc) {
        await this.emit(new events_1.MeetingHudCloseEvent(this.room, this, rpc));
    }
    _close() {
        this.room.netobjects.delete(this.netid);
        this.room.components.splice(this.room.components.indexOf(this), 1, null);
    }
    _rpcClose() {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.CloseMessage()));
    }
    /**
     * Close the meeting hud for all clients.
     */
    close() {
        this._close();
        this._rpcClose();
    }
    async _handleCastVote(rpc) {
        var _a, _b;
        const voter = this.states.get(rpc.votingid);
        const player = this.room.getPlayerByPlayerId(rpc.votingid);
        const suspect = rpc.suspectid === 0xff
            ? undefined
            : this.room.getPlayerByPlayerId(rpc.suspectid);
        if (player && voter && (suspect || rpc.suspectid === 0xff)) {
            this._castVote(voter, suspect);
            const ev = await this.emit(new events_1.MeetingHudVoteCastEvent(this.room, this, rpc, voter, suspect));
            if (ev.reverted) {
                if (player) {
                    await this.clearVote(player);
                }
            }
            else {
                (_b = (_a = this.room.me) === null || _a === void 0 ? void 0 : _a.control) === null || _b === void 0 ? void 0 : _b.sendChatNote(player, constant_1.ChatNoteType.DidVote);
                const states = [...this.states];
                if (states.every(([, state]) => state.voted && !state.dead)) {
                    let tie = false;
                    let exiled;
                    let exiled_votes = 0;
                    for (const [, state] of states) {
                        let num = 0;
                        for (const [, state2] of states) {
                            if (state2.votedFor === state.player) {
                                num++;
                            }
                        }
                        if (num) {
                            if (num > exiled_votes) {
                                tie = false;
                                exiled = state.player;
                                exiled_votes = num;
                            }
                            else if (num === exiled_votes) {
                                tie = true;
                            }
                        }
                    }
                    this.votingComplete(tie, exiled);
                    util_1.sleep(5000).then(() => {
                        this.close();
                    });
                }
            }
        }
    }
    _castVote(voting, suspect) {
        if (suspect)
            voting.votedFor = suspect;
        voting.voted = true;
        this.dirtyBit |= 1 << voting.playerId;
    }
    /**
     * Cast a vote on behalf of a user (or yourself).
     * @param voting The player who is voting.
     * @param suspect The player to vote for.
     * @example
     *```typescript
     * // Make everyone vote a certain player.
     * for ([ clientid, player ] of room.players) {
     *   if (player !== suspect) {
     *     room.meetinghud.castVote(player, suspect);
     *   }
     * }
     * ```
     */
    async castVote(voting, suspect) {
        var _a, _b;
        const player = this.room.resolvePlayer(voting);
        const _suspect = suspect === "skip" ? undefined : this.room.resolvePlayer(suspect);
        if (player && player.playerId !== undefined) {
            const votingState = this.states.get(player.playerId);
            if (votingState && _suspect) {
                this._castVote(votingState, _suspect);
                await this.emit(new events_1.MeetingHudVoteCastEvent(this.room, this, undefined, votingState, _suspect));
                (_b = (_a = this.room.me) === null || _a === void 0 ? void 0 : _a.control) === null || _b === void 0 ? void 0 : _b.sendChatNote(player, constant_1.ChatNoteType.DidVote);
            }
        }
    }
    async _handleClearVote(rpc) {
        void rpc;
        const player = this.room.me;
        if (player && player.playerId !== undefined) {
            const voter = this.states.get(player.playerId);
            if (voter === null || voter === void 0 ? void 0 : voter.voted) {
                this._clearVote(voter);
                await this.emit(new events_1.MeetingHudClearVoteEvent(this.room, this, rpc, voter));
            }
        }
    }
    _clearVote(voter) {
        if (voter.voted) {
            voter.votedFor = undefined;
            voter.voted = false;
            this.dirtyBit |= 1 << voter.playerId;
        }
    }
    async _rpcClearVote(voter) {
        await this.room.broadcast([
            new protocol_1.RpcMessage(this.netid, new protocol_1.ClearVoteMessage()),
        ], true, this.room.getPlayerByPlayerId(voter.playerId));
    }
    /**
     * Remove someone's vote (usually due to the player they voted for getting disconnected).
     * @param resolvable The player to remove the vote of.
     */
    async clearVote(voter) {
        const player = this.room.resolvePlayer(voter);
        if (player && player.playerId !== undefined) {
            const _voter = this.states.get(player.playerId);
            if (_voter) {
                this._clearVote(_voter);
                await this.emit(new events_1.MeetingHudClearVoteEvent(this.room, this, undefined, _voter));
                await this._rpcClearVote(_voter);
            }
        }
    }
    async _handleVotingComplete(rpc) {
        const exiled = rpc.exiledid === 0xff
            ? undefined
            : this.room.getPlayerByPlayerId(rpc.exiledid);
        this._votingComplete(rpc.states, rpc.tie, exiled);
        await this.emit(new events_1.MeetingHudVotingCompleteEvent(this.room, this, rpc, rpc.tie, new Map(rpc.states.map((state, i) => [
            i,
            PlayerVoteState_1.PlayerVoteState.from(this.room, i, state),
        ])), exiled));
    }
    _votingComplete(states, tie, exiled) {
        for (let i = 0; i < states.length; i++) {
            const state = this.states.get(i);
            if (state) {
                state.patch(states[i]);
            }
        }
        this.tie = tie;
        this.exiled = exiled;
    }
    _rpcVotingComplete(states, tie, exiled) {
        var _a;
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.VotingCompleteMessage(states, exiled ? (_a = exiled.playerId) !== null && _a !== void 0 ? _a : 0 : 0, tie)));
    }
    votingComplete(tie, exiled) {
        const _exiled = exiled ? this.room.resolvePlayer(exiled) : undefined;
        const voteStates = new Array(this.room.players.size);
        for (const [playerid, state] of this.states) {
            voteStates[playerid] = state.byte;
        }
        this._votingComplete(voteStates, tie, _exiled);
        this._rpcVotingComplete(voteStates, tie, _exiled);
        this.emit(new events_1.MeetingHudVotingCompleteEvent(this.room, this, undefined, tie, this.states, _exiled));
    }
}
exports.MeetingHud = MeetingHud;
MeetingHud.type = constant_1.SpawnType.MeetingHud;
MeetingHud.classname = "MeetingHud";
//# sourceMappingURL=MeetingHud.js.map

/***/ }),

/***/ 322:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MiraShipStatus = void 0;
const constant_1 = __webpack_require__(492);
const InnerShipStatus_1 = __webpack_require__(3585);
const system_1 = __webpack_require__(7735);
/**
 * Represents a room object for the Mira HQ map.
 *
 * See {@link ShipStatusEvents} for events to listen to.
 */
class MiraShipStatus extends InnerShipStatus_1.InnerShipStatus {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.Headquarters;
        this.classname = "Headquarters";
    }
    get owner() {
        return super.owner;
    }
    Setup() {
        this.systems = {
            [constant_1.SystemType.Reactor]: new system_1.ReactorSystem(this, {
                timer: 10000,
                completed: new Set(),
            }),
            [constant_1.SystemType.Electrical]: new system_1.SwitchSystem(this, {
                expected: [false, false, false, false, false],
                actual: [false, false, false, false, false],
                brightness: 100,
            }),
            [constant_1.SystemType.O2]: new system_1.LifeSuppSystem(this, {
                timer: 10000,
                completed: new Set(),
            }),
            [constant_1.SystemType.MedBay]: new system_1.MedScanSystem(this, {
                queue: [],
            }),
            [constant_1.SystemType.Communications]: new system_1.HqHudSystem(this, {
                active: [],
                completed: new Set([0, 1]),
            }),
            [constant_1.SystemType.Sabotage]: new system_1.SabotageSystem(this, {
                cooldown: 0,
            }),
            [constant_1.SystemType.Decontamination]: new system_1.DeconSystem(this, {
                timer: 10000,
                state: 0,
            }),
        };
    }
}
exports.MiraShipStatus = MiraShipStatus;
MiraShipStatus.type = constant_1.SpawnType.Headquarters;
MiraShipStatus.classname = "Headquarters";
//# sourceMappingURL=MiraShipStatus.js.map

/***/ }),

/***/ 6793:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerControl = void 0;
const util_1 = __webpack_require__(5131);
const protocol_1 = __webpack_require__(2602);
const constant_1 = __webpack_require__(492);
const Networkable_1 = __webpack_require__(8565);
const events_1 = __webpack_require__(9256);
const MeetingHud_1 = __webpack_require__(7290);
const PlayerVoteState_1 = __webpack_require__(5332);
const MovingPlatformSystem_1 = __webpack_require__(7968);
/**
 * Represents a player object for interacting with the game and other players.
 *
 * See {@link PlayerControlEvents} for events to listen to.
 */
class PlayerControl extends Networkable_1.Networkable {
    constructor(room, netid, ownerid, data) {
        var _a;
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.Player;
        this.classname = "PlayerControl";
        this.lastStartCounter = 0;
        (_a = this.isNew) !== null && _a !== void 0 ? _a : (this.isNew = true);
        this.playerId || (this.playerId = 0);
    }
    get player() {
        return this.owner;
    }
    Deserialize(reader, spawn = false) {
        if (spawn) {
            this.isNew = reader.bool();
        }
        this.playerId = reader.uint8();
    }
    Serialize(writer, spawn = false) {
        if (spawn) {
            writer.bool(this.isNew);
            this.isNew = false;
        }
        writer.uint8(this.playerId);
        return true;
    }
    async HandleRpc(rpc) {
        switch (rpc.tag) {
            case constant_1.RpcMessageTag.CompleteTask:
                await this._handleCompleteTask(rpc);
                break;
            case constant_1.RpcMessageTag.SyncSettings:
                await this._handleSyncSettings(rpc);
                break;
            case constant_1.RpcMessageTag.SetInfected:
                await this._handleSetImpostors(rpc);
                break;
            case constant_1.RpcMessageTag.CheckName:
                if (this.room.amhost) {
                    await this._handleCheckName(rpc);
                }
                break;
            case constant_1.RpcMessageTag.CheckColor:
                if (this.room.amhost) {
                    await this._handleCheckColor(rpc);
                }
                break;
            case constant_1.RpcMessageTag.SetName:
                await this._handleSetName(rpc);
                break;
            case constant_1.RpcMessageTag.SetColor:
                await this._handleSetColor(rpc);
                break;
            case constant_1.RpcMessageTag.SetHat:
                await this._handleSetHat(rpc);
                break;
            case constant_1.RpcMessageTag.SetSkin:
                await this._handleSetSkin(rpc);
                break;
            case constant_1.RpcMessageTag.ReportDeadBody:
                if (this.room.amhost) {
                    await this._handleReportDeadBody(rpc);
                }
                break;
            case constant_1.RpcMessageTag.MurderPlayer:
                await this._handleMurderPlayer(rpc);
                break;
            case constant_1.RpcMessageTag.SendChat:
                await this._handleSendChat(rpc);
                break;
            case constant_1.RpcMessageTag.StartMeeting:
                await this._handleStartMeeting(rpc);
                break;
            case constant_1.RpcMessageTag.SetPet:
                await this._handleSetPet(rpc);
                break;
            case constant_1.RpcMessageTag.SetStartCounter:
                await this._handleSetStartCounter(rpc);
                break;
            case constant_1.RpcMessageTag.UsePlatform:
                await this._handleUsePlatform(rpc);
                break;
        }
    }
    async _handleCompleteTask(rpc) {
        var _a;
        if (!((_a = this.player.data) === null || _a === void 0 ? void 0 : _a.taskStates))
            return;
        this._completeTask(rpc.taskidx);
        await this.emit(new events_1.PlayerCompleteTaskEvent(this.room, this.player, rpc, this.player.data.taskStates[rpc.taskidx]));
    }
    _completeTask(taskIdx) {
        var _a;
        (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.completeTask(this.playerId, taskIdx);
    }
    async _rpcCompleteTask(taskIdx) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.CompleteTaskMessage(taskIdx)));
    }
    completeTask(taskIdx) {
        var _a;
        if (!((_a = this.player.data) === null || _a === void 0 ? void 0 : _a.taskStates[taskIdx]))
            return;
        this.emit(new events_1.PlayerCompleteTaskEvent(this.room, this.player, undefined, this.player.data.taskStates[taskIdx]));
        this._completeTask(taskIdx);
        this._rpcCompleteTask(taskIdx);
    }
    async _handleSyncSettings(rpc) {
        if (!rpc.options)
            return;
        this._syncSettings(rpc.options);
        const ev = await this.emit(new events_1.PlayerSyncSettingsEvent(this.room, this.player, rpc, rpc.options));
        if (ev.isDirty) {
            this._syncSettings(ev.alteredSettings);
            this._rpcSyncSettings(ev.alteredSettings);
        }
    }
    _syncSettings(settings) {
        this.room.settings.patch(settings);
    }
    async _rpcSyncSettings(settings) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SyncSettingsMessage(settings)));
    }
    async syncSettings(settings) {
        this._syncSettings(settings);
        const ev = await this.emit(new events_1.PlayerSyncSettingsEvent(this.room, this.player, undefined, settings));
        this._syncSettings(ev.alteredSettings);
        this._syncSettings(settings);
        this._rpcSyncSettings(settings);
    }
    async _handleSetImpostors(rpc) {
        const impostors = rpc.impostors
            .map((id) => this.room.getPlayerByPlayerId(id))
            .filter((player) => player && player.data);
        this._setImpostors(impostors);
        const ev = await this.emit(new events_1.PlayerSetImpostorsEvent(this.room, this.player, rpc, impostors));
        if (ev.isDirty) {
            this._setImpostors(ev.alteredImpostors);
            this._rpcSetImpostors(ev.alteredImpostors);
        }
    }
    _setImpostors(impostors) {
        var _a;
        for (const impostor of impostors) {
            if (impostor.data)
                impostor.data.setImpostor(true);
            (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.update(impostor);
        }
    }
    _rpcSetImpostors(impostors) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SetInfectedMessage(impostors.map(impostor => impostor.playerId))));
    }
    async setImpostors(impostors) {
        this._setImpostors(impostors);
        const ev = await this.emit(new events_1.PlayerSetImpostorsEvent(this.room, this.player, undefined, impostors));
        if (ev.isDirty)
            this._setImpostors(ev.alteredImpostors);
        this._rpcSetImpostors(impostors);
    }
    async _handleCheckName(rpc) {
        if (!this.room.gamedata)
            return;
        let new_name = rpc.name;
        const players = [...this.room.gamedata.players.values()];
        if (players.some((player) => player.playerId !== this.playerId &&
            player.name.toLowerCase() === new_name.toLowerCase())) {
            for (let i = 1; i < 100; i++) {
                new_name = rpc.name + " " + i;
                if (!players.some((player) => player.playerId !== this.playerId &&
                    player.name.toLowerCase() === new_name.toLowerCase())) {
                    break;
                }
            }
        }
        const ev = await this.emit(new events_1.PlayerCheckNameEvent(this.room, this.player, rpc, rpc.name, new_name));
        if (!ev.canceled) {
            await this.setName(ev.alteredName);
        }
    }
    async _rpcCheckName(name) {
        await this.room.broadcast([
            new protocol_1.RpcMessage(this.netid, new protocol_1.CheckNameMessage(name)),
        ], true, this.room.host);
    }
    async checkName(name) {
        await this._rpcCheckName(name);
    }
    async _handleSetName(rpc) {
        var _a;
        const playerInfo = (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.players.get(this.playerId);
        if (!playerInfo)
            return;
        const oldName = playerInfo.name;
        playerInfo.name = rpc.name;
        const ev = await this.emit(new events_1.PlayerSetNameEvent(this.room, this.player, rpc, oldName, rpc.name));
        playerInfo.name = ev.alteredName;
        if (ev.alteredName !== rpc.name) {
            this._rpcSetName(ev.alteredName);
        }
    }
    _rpcSetName(name) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SetNameMessage(name)));
    }
    async setName(name) {
        var _a;
        const playerInfo = (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.players.get(this.playerId);
        if (!playerInfo)
            return;
        const oldName = playerInfo.name;
        playerInfo.name = name;
        const ev = await this.emit(new events_1.PlayerSetNameEvent(this.room, this.player, undefined, oldName, name));
        playerInfo.name = ev.alteredName;
        if (playerInfo.name !== oldName) {
            this._rpcSetName(playerInfo.name);
        }
    }
    async _handleCheckColor(rpc) {
        if (!this.room.gamedata)
            return;
        let new_color = rpc.color;
        const players = [...this.room.gamedata.players.values()];
        while (players.some((player) => player.playerId !== this.playerId &&
            player.color === rpc.color)) {
            new_color++;
            if (new_color > 11) {
                new_color = 0;
            }
        }
        const ev = await this.emit(new events_1.PlayerCheckColorEvent(this.room, this.player, rpc, rpc.color, new_color));
        if (!ev.canceled) {
            this.setColor(ev.alteredColor);
        }
    }
    async _rpcCheckColor(color) {
        await this.room.broadcast([
            new protocol_1.RpcMessage(this.netid, new protocol_1.CheckColorMessage(color)),
        ], true, this.room.host);
    }
    async checkColor(color) {
        await this._rpcCheckColor(color);
    }
    async _handleSetColor(rpc) {
        var _a;
        const playerInfo = (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.players.get(this.playerId);
        if (!playerInfo)
            return;
        const oldColor = playerInfo.color;
        playerInfo.color = rpc.color;
        const ev = await this.emit(new events_1.PlayerSetColorEvent(this.room, this.player, rpc, oldColor, rpc.color));
        playerInfo.color = ev.alteredColor;
        if (ev.alteredColor !== rpc.color) {
            this._rpcSetColor(ev.alteredColor);
        }
    }
    _rpcSetColor(color) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SetColorMessage(color)));
    }
    async setColor(color) {
        var _a;
        const playerInfo = (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.players.get(this.playerId);
        if (!playerInfo)
            return;
        const oldColor = playerInfo.color;
        playerInfo.color = color;
        const ev = await this.emit(new events_1.PlayerSetColorEvent(this.room, this.player, undefined, oldColor, color));
        playerInfo.color = ev.alteredColor;
        if (playerInfo.color !== oldColor) {
            this._rpcSetColor(playerInfo.color);
        }
    }
    async _handleSetHat(rpc) {
        var _a;
        const playerInfo = (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.players.get(this.playerId);
        if (!playerInfo)
            return;
        const oldHat = playerInfo.hat;
        playerInfo.hat = rpc.hat;
        const ev = await this.emit(new events_1.PlayerSetHatEvent(this.room, this.player, rpc, oldHat, rpc.hat));
        playerInfo.hat = ev.alteredHat;
        if (ev.alteredHat !== rpc.hat) {
            this._rpcSetHat(ev.alteredHat);
        }
    }
    _rpcSetHat(hat) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SetHatMessage(hat)));
    }
    async setHat(hat) {
        var _a;
        const playerInfo = (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.players.get(this.playerId);
        if (!playerInfo)
            return;
        const oldHat = playerInfo.hat;
        playerInfo.hat = hat;
        const ev = await this.emit(new events_1.PlayerSetHatEvent(this.room, this.player, undefined, oldHat, hat));
        playerInfo.hat = ev.alteredHat;
        if (playerInfo.hat !== oldHat) {
            this._rpcSetHat(playerInfo.hat);
        }
    }
    async _handleSetSkin(rpc) {
        var _a;
        const playerInfo = (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.players.get(this.playerId);
        if (!playerInfo)
            return;
        const oldSkin = playerInfo.skin;
        playerInfo.skin = rpc.skin;
        const ev = await this.emit(new events_1.PlayerSetSkinEvent(this.room, this.player, rpc, oldSkin, rpc.skin));
        playerInfo.skin = ev.alteredSkin;
        if (ev.alteredSkin !== rpc.skin) {
            this._rpcSetSkin(ev.alteredSkin);
        }
    }
    _rpcSetSkin(skin) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SetSkinMessage(skin)));
    }
    async setSkin(skin) {
        var _a;
        const playerInfo = (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.players.get(this.playerId);
        if (!playerInfo)
            return;
        const oldSkin = playerInfo.skin;
        playerInfo.skin = skin;
        const ev = await this.emit(new events_1.PlayerSetSkinEvent(this.room, this.player, undefined, oldSkin, skin));
        playerInfo.skin = ev.alteredSkin;
        if (playerInfo.skin !== oldSkin) {
            this._rpcSetSkin(playerInfo.skin);
        }
    }
    async _handleReportDeadBody(rpc) {
        var _a, _b, _c;
        const reportedBody = rpc.bodyid === 0xff
            ? "emergency"
            : this.room.getPlayerByPlayerId(rpc.bodyid);
        if (!reportedBody)
            return;
        const ev = await this.emit(new events_1.PlayerReportDeadBodyEvent(this.room, this.player, rpc, reportedBody));
        if (!ev.canceled) {
            (_c = (_b = (_a = this.room) === null || _a === void 0 ? void 0 : _a.host) === null || _b === void 0 ? void 0 : _b.control) === null || _c === void 0 ? void 0 : _c.startMeeting(this.player, ev.alteredBody);
        }
    }
    async _rpcReportDeadBody(body) {
        if (body !== "emergency" && body.playerId === undefined) {
            return this._rpcReportDeadBody("emergency");
        }
        await this.room.broadcast([
            new protocol_1.RpcMessage(this.netid, new protocol_1.ReportDeadBodyMessage(body === "emergency"
                ? 0xff
                : body.playerId))
        ], true, this.room.host);
    }
    async reportDeadBody(body) {
        const ev = await this.emit(new events_1.PlayerReportDeadBodyEvent(this.room, this.player, undefined, body));
        if (!ev.canceled) {
            await this._rpcReportDeadBody(ev.alteredBody);
        }
    }
    async _handleMurderPlayer(rpc) {
        var _a;
        const victim = this.room.getPlayerByNetId(rpc.victimid);
        if (!victim || victim.playerId === undefined)
            return;
        if (victim.data) {
            victim.data.setDead(true);
            (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.update(victim.playerId);
        }
        await this.emit(new events_1.PlayerMurderEvent(this.room, this.player, rpc, victim));
    }
    _rpcMurderPlayer(victim) {
        if (!victim.control)
            return;
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.MurderPlayerMessage(victim.control.netid)));
    }
    murderPlayer(victim) {
        var _a;
        if (victim.playerId === undefined)
            return;
        if (victim.data) {
            victim.data.setDead(true);
            (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.update(victim.playerId);
        }
        this.emit(new events_1.PlayerMurderEvent(this.room, this.player, undefined, victim));
        this._rpcMurderPlayer(victim);
    }
    async _handleSendChat(rpc) {
        await this.emit(new events_1.PlayerSendChatEvent(this.room, this.player, rpc, rpc.message));
    }
    _rpcSendChat(message) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SendChatMessage(message)));
    }
    sendChat(message) {
        this.emit(new events_1.PlayerSendChatEvent(this.room, this.player, undefined, message));
        this._rpcSendChat(message);
    }
    _rpcSendChatNote(player, type) {
        if (player.playerId === undefined)
            return;
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SendChatNoteMessage(player.playerId, type)));
    }
    sendChatNote(player, type) {
        this._rpcSendChatNote(player, type);
    }
    async _handleStartMeeting(rpc) {
        const reportedBody = rpc.bodyid === 0xff
            ? "emergency"
            : this.room.getPlayerByPlayerId(rpc.bodyid);
        if (!reportedBody)
            return;
        await this.emit(new events_1.PlayerStartMeetingEvent(this.room, this.player, rpc, reportedBody));
        this._startMeeting(this.player);
    }
    _startMeeting(caller) {
        const meetinghud = new MeetingHud_1.MeetingHud(this.room, this.room.getNextNetId(), this.room.id, {
            states: new Map([...this.room.players]
                .filter(([, player]) => player.data && player.spawned && player.playerId !== undefined)
                .map(([, player]) => {
                var _a;
                return [
                    player.playerId,
                    new PlayerVoteState_1.PlayerVoteState(this.room, player.playerId, undefined, player === caller, false, (_a = player.data) === null || _a === void 0 ? void 0 : _a.isDead),
                ];
            })),
        });
        this.room.spawnComponent(meetinghud);
        const writer = util_1.HazelWriter.alloc(0);
        writer.write(meetinghud, true);
        this.room.stream.push(new protocol_1.SpawnMessage(constant_1.SpawnType.MeetingHud, -2, constant_1.SpawnFlag.None, [
            new protocol_1.ComponentSpawnData(meetinghud.netid, writer.buffer),
        ]));
    }
    _rpcStartMeeting(player) {
        if (player !== "emergency" && player.playerId === undefined) {
            return this._rpcStartMeeting("emergency");
        }
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.StartMeetingMessage(player === "emergency"
            ? 0xff
            : player.playerId)));
    }
    startMeeting(caller, body) {
        this.emit(new events_1.PlayerStartMeetingEvent(this.room, this.player, undefined, body));
        this._rpcStartMeeting(body);
        this._startMeeting(caller);
    }
    async _handleSetPet(rpc) {
        var _a;
        const playerInfo = (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.players.get(this.playerId);
        if (!playerInfo)
            return;
        const oldPet = playerInfo.pet;
        playerInfo.pet = rpc.pet;
        const ev = await this.emit(new events_1.PlayerSetPetEvent(this.room, this.player, rpc, oldPet, rpc.pet));
        playerInfo.pet = ev.alteredPet;
        if (ev.alteredPet !== rpc.pet) {
            this._rpcSetPet(ev.alteredPet);
        }
    }
    _rpcSetPet(pet) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SetPetMessage(pet)));
    }
    async setPet(pet) {
        var _a;
        const playerInfo = (_a = this.room.gamedata) === null || _a === void 0 ? void 0 : _a.players.get(this.playerId);
        if (!playerInfo)
            return;
        const oldPet = playerInfo.pet;
        playerInfo.pet = pet;
        const ev = await this.emit(new events_1.PlayerSetPetEvent(this.room, this.player, undefined, oldPet, pet));
        playerInfo.pet = ev.alteredPet;
        if (playerInfo.pet !== oldPet) {
            this._rpcSetPet(playerInfo.pet);
        }
    }
    async _handleSetStartCounter(rpc) {
        const oldCounter = this.room.counter;
        this._setStartCounter(rpc.counter);
        const ev = await this.emit(new events_1.PlayerSetStartCounterEvent(this.room, this.player, rpc, oldCounter, rpc.counter));
        this.room.counter = ev.alteredCounter;
        if (this.room.counter !== rpc.counter) {
            await this._rpcSetStartCounter(ev.alteredCounter);
        }
    }
    _setStartCounter(counter) {
        this.lastStartCounter++;
        this.room.counter = counter;
    }
    _rpcSetStartCounter(counter) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.SetStartCounterMessage(this.lastStartCounter, counter)));
    }
    async setStartCounter(counter) {
        this._setStartCounter(counter);
        const ev = await this.emit(new events_1.PlayerSetStartCounterEvent(this.room, this.player, undefined, this.room.counter, counter));
        if (ev.alteredCounter !== counter) {
            this.room.counter = ev.alteredCounter;
        }
        this._rpcSetStartCounter(ev.alteredCounter);
    }
    async _handleUsePlatform(rpc) {
        void rpc;
        this._usePlatform();
    }
    _usePlatform() {
        const airship = this.room.shipstatus;
        if (!airship || airship.type !== constant_1.SpawnType.Airship)
            return;
        const movingPlatform = airship.systems[constant_1.SystemType.GapRoom];
        if (movingPlatform) {
            movingPlatform.setTarget(this.player, movingPlatform.side === MovingPlatformSystem_1.MovingPlatformSide.Left
                ? MovingPlatformSystem_1.MovingPlatformSide.Right
                : MovingPlatformSystem_1.MovingPlatformSide.Left);
        }
    }
    _rpcUsePlatform() {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.UsePlatformMessage));
    }
    usePlatform() {
        this._usePlatform();
        this._rpcUsePlatform();
    }
}
exports.PlayerControl = PlayerControl;
PlayerControl.type = constant_1.SpawnType.Player;
PlayerControl.classname = "PlayerControl";
//# sourceMappingURL=PlayerControl.js.map

/***/ }),

/***/ 8071:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerPhysics = void 0;
const constant_1 = __webpack_require__(492);
const protocol_1 = __webpack_require__(2602);
const Networkable_1 = __webpack_require__(8565);
const net_1 = __webpack_require__(2031);
const events_1 = __webpack_require__(9256);
/**
 * Represents a player object for handling vent entering and exiting.
 *
 * See {@link PlayerPhysicsEvents} for events to listen to.
 */
class PlayerPhysics extends Networkable_1.Networkable {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.Player;
        this.classname = "PlayerPhysics";
        this.ventid || (this.ventid = 0);
        this.ladderClimbSeqId = 0;
    }
    get player() {
        return this.owner;
    }
    async HandleRpc(rpc) {
        switch (rpc.tag) {
            case constant_1.RpcMessageTag.EnterVent:
                await this._handleEnterVent(rpc);
                break;
            case constant_1.RpcMessageTag.ExitVent: {
                await this._handleExitVent(rpc);
                break;
            }
            case constant_1.RpcMessageTag.ClimbLadder:
                await this._handleClimbLadder(rpc);
                break;
        }
    }
    async _handleEnterVent(rpc) {
        this._enterVent(rpc.ventid);
        await this.emit(new events_1.PlayerEnterVentEvent(this.room, this.player, rpc, rpc.ventid));
    }
    _enterVent(ventid) {
        this.ventid = ventid;
    }
    _rpcEnterVent(ventid) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.EnterVentMessage(ventid)));
    }
    /**
     * Enter a vent.
     * @param ventid The ID of the vent to enter.
     * @example
     *```typescript
     * client.me.physics.enterVent(PolusVent.Office);
     * ```
     */
    enterVent(ventid) {
        this._enterVent(ventid);
        this.emit(new events_1.PlayerEnterVentEvent(this.room, this.player, undefined, ventid));
        this._rpcEnterVent(ventid);
    }
    async _handleExitVent(rpc) {
        this._exitVent(rpc.ventid);
        await this.emit(new events_1.PlayerExitVentEvent(this.room, this.player, rpc, rpc.ventid));
    }
    _exitVent(ventid) {
        this.ventid = -1;
    }
    _rpcExitVent(ventid) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.ExitVentMessage(ventid)));
    }
    /**
     * Exit a vent (Does not have to be the same vent or in the same network as the vent you entered).
     * @param ventid The ID of the vent to exit.
     * @example
     *```typescript
     * client.me.physics.enterVent(PolusVent.Office);
     * ```
     */
    exitVent(ventid) {
        this._exitVent(ventid);
        this.emit(new events_1.PlayerExitVentEvent(this.room, this.player, undefined, ventid));
        this._rpcExitVent(ventid);
    }
    async _handleClimbLadder(rpc) {
        if (net_1.NetworkUtils.seqIdGreaterThan(rpc.sequenceid, this.ladderClimbSeqId, 1)) {
            this.ladderClimbSeqId = rpc.sequenceid;
            await this.emit(new events_1.PlayerClimbLadderEvent(this.room, this.player, rpc, rpc.ladderid));
        }
    }
    _rpcClimbLadder(ladderid) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.ClimbLadderMessage(ladderid, this.ladderClimbSeqId)));
    }
    climbLadder(ladderid) {
        this.ladderClimbSeqId++;
        if (this.ladderClimbSeqId > 255)
            this.ladderClimbSeqId = 0;
        this._rpcClimbLadder(ladderid);
    }
}
exports.PlayerPhysics = PlayerPhysics;
PlayerPhysics.type = constant_1.SpawnType.Player;
PlayerPhysics.classname = "PlayerPhysics";
//# sourceMappingURL=PlayerPhysics.js.map

/***/ }),

/***/ 991:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolusShipStatus = void 0;
const constant_1 = __webpack_require__(492);
const InnerShipStatus_1 = __webpack_require__(3585);
const system_1 = __webpack_require__(7735);
const Door_1 = __webpack_require__(3505);
/**
 * Represents a room object for the Polus map.
 *
 * See {@link ShipStatusEvents} for events to listen to.
 */
class PolusShipStatus extends InnerShipStatus_1.InnerShipStatus {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.PlanetMap;
        this.classname = "PlanetMap";
    }
    async HandleRpc(rpc) {
        switch (rpc.tag) {
            case constant_1.RpcMessageTag.CloseDoorsOfType:
                await this._handleCloseDoorsOfType(rpc);
                break;
            default:
                await super.HandleRpc(rpc);
                break;
        }
    }
    async _handleCloseDoorsOfType(rpc) {
        const doorsinRoom = PolusShipStatus.roomDoors[rpc.systemid];
        for (const doorId of doorsinRoom) {
            this.systems[constant_1.SystemType.Doors].closeDoor(doorId);
        }
    }
    Setup() {
        this.systems = {
            [constant_1.SystemType.Electrical]: new system_1.SwitchSystem(this, {
                expected: [false, false, false, false, false],
                actual: [false, false, false, false, false],
                brightness: 100,
            }),
            [constant_1.SystemType.MedBay]: new system_1.MedScanSystem(this, {
                queue: [],
            }),
            [constant_1.SystemType.Security]: new system_1.SecurityCameraSystem(this, {
                players: new Set(),
            }),
            [constant_1.SystemType.Communications]: new system_1.HudOverrideSystem(this, {
                sabotaged: false,
            }),
            [constant_1.SystemType.Doors]: new system_1.DoorsSystem(this, {
                doors: [],
                cooldowns: new Map(),
            }),
            [constant_1.SystemType.Sabotage]: new system_1.SabotageSystem(this, {
                cooldown: 0,
            }),
            [constant_1.SystemType.Decontamination]: new system_1.DeconSystem(this, {
                timer: 10000,
                state: 0,
            }),
            [constant_1.SystemType.Decontamination2]: new system_1.DeconSystem(this, {
                timer: 10000,
                state: 0,
            }),
            [constant_1.SystemType.Laboratory]: new system_1.ReactorSystem(this, {
                timer: 10000,
                completed: new Set(),
            }),
        };
        const doorsystem = this.systems[constant_1.SystemType.Doors];
        doorsystem.doors = [
            new Door_1.Door(doorsystem, 0, true),
            new Door_1.Door(doorsystem, 1, true),
            new Door_1.Door(doorsystem, 2, true),
            new Door_1.Door(doorsystem, 3, true),
            new Door_1.Door(doorsystem, 4, true),
            new Door_1.Door(doorsystem, 5, true),
            new Door_1.Door(doorsystem, 6, true),
            new Door_1.Door(doorsystem, 7, true),
            new Door_1.Door(doorsystem, 8, true),
            new Door_1.Door(doorsystem, 9, true),
            new Door_1.Door(doorsystem, 10, true),
            new Door_1.Door(doorsystem, 11, true),
        ];
    }
}
exports.PolusShipStatus = PolusShipStatus;
PolusShipStatus.type = constant_1.SpawnType.PlanetMap;
PolusShipStatus.classname = "PlanetMap";
PolusShipStatus.roomDoors = {
    [constant_1.SystemType.Electrical]: [0, 1, 2],
    [constant_1.SystemType.O2]: [3, 4],
    [constant_1.SystemType.Weapons]: [5],
    [constant_1.SystemType.Communications]: [7],
    [constant_1.SystemType.Office]: [7, 8],
    [constant_1.SystemType.Laboratory]: [9, 10],
    [constant_1.SystemType.Storage]: [11],
    [constant_1.SystemType.Decontamination]: [12, 13, 14, 15]
};
//# sourceMappingURL=PolusShipStatus.js.map

/***/ }),

/***/ 7994:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkeldShipStatus = void 0;
const constant_1 = __webpack_require__(492);
const InnerShipStatus_1 = __webpack_require__(3585);
const system_1 = __webpack_require__(7735);
const AutoOpenDoor_1 = __webpack_require__(7699);
/**
 * Represents a room object for the The Skeld map.
 *
 * See {@link ShipStatusEvents} for events to listen to.
 */
class SkeldShipStatus extends InnerShipStatus_1.InnerShipStatus {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.ShipStatus;
        this.classname = "ShipStatus";
    }
    async HandleRpc(rpc) {
        switch (rpc.tag) {
            case constant_1.RpcMessageTag.CloseDoorsOfType:
                await this._handleCloseDoorsOfType(rpc);
                break;
            default:
                await super.HandleRpc(rpc);
                break;
        }
    }
    async _handleCloseDoorsOfType(rpc) {
        const doorsinRoom = SkeldShipStatus.roomDoors[rpc.systemid];
        for (const doorId of doorsinRoom) {
            this.systems[constant_1.SystemType.Doors].closeDoor(doorId);
        }
    }
    Setup() {
        this.systems = {
            [constant_1.SystemType.Reactor]: new system_1.ReactorSystem(this, {
                timer: 10000,
                completed: new Set(),
            }),
            [constant_1.SystemType.Electrical]: new system_1.SwitchSystem(this, {
                expected: [false, false, false, false, false],
                actual: [false, false, false, false, false],
                brightness: 255,
            }),
            [constant_1.SystemType.O2]: new system_1.LifeSuppSystem(this, {
                timer: 10000,
                completed: new Set(),
            }),
            [constant_1.SystemType.MedBay]: new system_1.MedScanSystem(this, {
                queue: [],
            }),
            [constant_1.SystemType.Security]: new system_1.SecurityCameraSystem(this, {
                players: new Set(),
            }),
            [constant_1.SystemType.Communications]: new system_1.HudOverrideSystem(this, {
                sabotaged: false,
            }),
            [constant_1.SystemType.Doors]: new system_1.AutoDoorsSystem(this, {
                dirtyBit: 0,
                doors: [],
            }),
            [constant_1.SystemType.Sabotage]: new system_1.SabotageSystem(this, {
                cooldown: 0,
            }),
        };
        const autodoorsystem = this.systems[constant_1.SystemType.Doors];
        autodoorsystem.doors = [
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 0, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 1, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 2, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 3, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 4, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 5, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 6, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 7, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 8, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 9, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 10, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 11, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 12, true),
            new AutoOpenDoor_1.AutoOpenDoor(autodoorsystem, 13, true),
        ];
    }
}
exports.SkeldShipStatus = SkeldShipStatus;
SkeldShipStatus.type = constant_1.SpawnType.ShipStatus;
SkeldShipStatus.classname = "ShipStatus";
SkeldShipStatus.roomDoors = {
    [constant_1.SystemType.Storage]: [1, 7, 12],
    [constant_1.SystemType.Cafeteria]: [0, 3, 8],
    [constant_1.SystemType.UpperEngine]: [2, 5],
    [constant_1.SystemType.Electrical]: [9],
    [constant_1.SystemType.MedBay]: [10],
    [constant_1.SystemType.Security]: [6],
    [constant_1.SystemType.LowerEngine]: [4, 11]
};
//# sourceMappingURL=SkeldShipStatus.js.map

/***/ }),

/***/ 9743:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VoteBanSystem = void 0;
const constant_1 = __webpack_require__(492);
const Networkable_1 = __webpack_require__(8565);
const protocol_1 = __webpack_require__(2602);
/**
 * Represents a room object for handling vote kicks.
 *
 * See {@link VoteBanSystemEvents} for events to listen to.
 */
class VoteBanSystem extends Networkable_1.Networkable {
    constructor(room, netid, ownerid, data) {
        super(room, netid, ownerid, data);
        this.type = constant_1.SpawnType.GameData;
        this.classname = "VoteBanSystem";
        this.voted = new Map();
    }
    get owner() {
        return super.owner;
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn = false) {
        const num_players = reader.upacked();
        for (let i = 0; i < num_players; i++) {
            const clientid = reader.uint32();
            if (this.voted.get(clientid)) {
                this.voted.set(clientid, [undefined, undefined, undefined]);
            }
            this.voted.set(clientid, [undefined, undefined, undefined]);
            for (let i = 0; i < 3; i++) {
                reader.upacked();
            }
        }
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn = false) {
        writer.upacked(this.voted.size);
        for (const [clientid, voters] of this.voted) {
            writer.uint32(clientid);
            for (let i = 0; i < 3; i++) {
                if (voters[i])
                    writer.upacked(voters[i].id);
            }
        }
        return true;
    }
    async HandleRpc(rpc) {
        switch (rpc.tag) {
            case constant_1.RpcMessageTag.AddVote:
                this._handleAddVote(rpc);
                break;
        }
    }
    _handleAddVote(rpc) {
        const voting = this.room.players.get(rpc.votingid);
        const target = this.room.players.get(rpc.targetid);
        if (voting && target) {
            this._addVote(voting, target);
        }
    }
    _addVote(voter, target) {
        const voted = this.voted.get(target.id);
        if (voted) {
            const next = voted.indexOf(undefined);
            if (~next) {
                voted[next] = voter;
                this.dirtyBit = 1;
            }
            if (this.room.amhost && voted.every((v) => v !== null)) {
                this.room.broadcast([], true, undefined, [
                    new protocol_1.KickPlayerMessage(this.room.code, target.id, false, constant_1.DisconnectReason.None),
                ]);
            }
        }
        else {
            this.voted.set(target.id, [voter, undefined, undefined]);
            this.dirtyBit = 1;
        }
    }
    _rpcAddVote(voter, target) {
        this.room.stream.push(new protocol_1.RpcMessage(this.netid, new protocol_1.AddVoteMessage(voter.id, target.id)));
    }
    /**
     * Add the vote of a player to vote for another player to be kicked.
     * @param voter The player to count the vote as.
     * @param target The player to vote to be kicked.
     * @example
     *```typescript
     * room.votebansystem.addVote(client.me, player);
     * ```
     */
    addVote(voter, target) {
        const _voter = this.room.resolvePlayer(voter);
        const _target = this.room.resolvePlayer(target);
        if (_voter && _target) {
            this._addVote(_voter, _target);
            this._rpcAddVote(_voter, _target);
        }
    }
}
exports.VoteBanSystem = VoteBanSystem;
VoteBanSystem.type = constant_1.SpawnType.GameData;
VoteBanSystem.classname = "VoteBanSystem";
//# sourceMappingURL=VoteBanSystem.js.map

/***/ }),

/***/ 1514:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(8708), exports);
__exportStar(__webpack_require__(6115), exports);
__exportStar(__webpack_require__(2965), exports);
__exportStar(__webpack_require__(2146), exports);
__exportStar(__webpack_require__(3585), exports);
__exportStar(__webpack_require__(6350), exports);
__exportStar(__webpack_require__(7290), exports);
__exportStar(__webpack_require__(322), exports);
__exportStar(__webpack_require__(6793), exports);
__exportStar(__webpack_require__(8071), exports);
__exportStar(__webpack_require__(991), exports);
__exportStar(__webpack_require__(7994), exports);
__exportStar(__webpack_require__(9743), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9209:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SecurityCameraJoinEvent = void 0;
const events_1 = __webpack_require__(3418);
class SecurityCameraJoinEvent extends events_1.RevertableEvent {
    constructor(room, security, message, player) {
        super();
        this.room = room;
        this.security = security;
        this.message = message;
        this.player = player;
        this.eventName = "security.cameras.join";
    }
}
exports.SecurityCameraJoinEvent = SecurityCameraJoinEvent;
SecurityCameraJoinEvent.eventName = "security.cameras.join";
//# sourceMappingURL=Join.js.map

/***/ }),

/***/ 7730:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SecurityCameraLeaveEvent = void 0;
const events_1 = __webpack_require__(3418);
class SecurityCameraLeaveEvent extends events_1.RevertableEvent {
    constructor(room, security, message, player) {
        super();
        this.room = room;
        this.security = security;
        this.message = message;
        this.player = player;
        this.eventName = "security.cameras.leave";
    }
}
exports.SecurityCameraLeaveEvent = SecurityCameraLeaveEvent;
SecurityCameraLeaveEvent.eventName = "security.cameras.leave";
//# sourceMappingURL=Leave.js.map

/***/ }),

/***/ 894:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DoorsDoorCloseEvent = void 0;
const events_1 = __webpack_require__(3418);
class DoorsDoorCloseEvent extends events_1.RevertableEvent {
    constructor(room, doorsystem, message, player, door) {
        super();
        this.room = room;
        this.doorsystem = doorsystem;
        this.message = message;
        this.player = player;
        this.door = door;
        this.eventName = "doors.close";
        this._alteredDoor = door;
    }
    get alteredDoor() {
        return this._alteredDoor;
    }
    setDoor(door) {
        if (typeof door === "number") {
            return this.setDoor(this.doorsystem.doors[door]);
        }
        this._alteredDoor === door;
    }
}
exports.DoorsDoorCloseEvent = DoorsDoorCloseEvent;
DoorsDoorCloseEvent.eventName = "doors.close";
//# sourceMappingURL=Close.js.map

/***/ }),

/***/ 7382:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DoorsDoorOpenEvent = void 0;
const events_1 = __webpack_require__(3418);
class DoorsDoorOpenEvent extends events_1.RevertableEvent {
    constructor(room, doorsystem, message, player, door) {
        super();
        this.room = room;
        this.doorsystem = doorsystem;
        this.message = message;
        this.player = player;
        this.door = door;
        this.eventName = "doors.open";
        this._alteredDoor = door;
    }
    get alteredDoor() {
        return this._alteredDoor;
    }
    setDoor(door) {
        if (typeof door === "number") {
            return this.setDoor(this.doorsystem.doors[door]);
        }
        this._alteredDoor === door;
    }
}
exports.DoorsDoorOpenEvent = DoorsDoorOpenEvent;
DoorsDoorOpenEvent.eventName = "doors.open";
//# sourceMappingURL=Open.js.map

/***/ }),

/***/ 8097:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ElectricalSwitchFlipEvent = void 0;
const events_1 = __webpack_require__(3418);
class ElectricalSwitchFlipEvent extends events_1.RevertableEvent {
    constructor(room, switchsystem, message, player, switchId, flipped) {
        super();
        this.room = room;
        this.switchsystem = switchsystem;
        this.message = message;
        this.player = player;
        this.switchId = switchId;
        this.flipped = flipped;
        this.eventName = "electrical.switchflip";
        this._alteredSwitchId = switchId;
        this._alteredFlipped = flipped;
    }
    get alteredSwitchId() {
        return this._alteredSwitchId;
    }
    get alteredFlipped() {
        return this._alteredFlipped;
    }
    setSwitchId(switchId) {
        this._alteredSwitchId = switchId;
    }
    setFlipped(flipped) {
        this._alteredFlipped = flipped;
    }
}
exports.ElectricalSwitchFlipEvent = ElectricalSwitchFlipEvent;
ElectricalSwitchFlipEvent.eventName = "electrical.switchflip";
//# sourceMappingURL=SwitchFlip.js.map

/***/ }),

/***/ 6992:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameDataAddPlayerEvent = void 0;
const events_1 = __webpack_require__(3418);
class GameDataAddPlayerEvent extends events_1.RevertableEvent {
    constructor(room, gamedata, player) {
        super();
        this.room = room;
        this.gamedata = gamedata;
        this.player = player;
        this.eventName = "gamedata.addplayer";
    }
}
exports.GameDataAddPlayerEvent = GameDataAddPlayerEvent;
GameDataAddPlayerEvent.eventName = "gamedata.addplayer";
//# sourceMappingURL=AddPlayer.js.map

/***/ }),

/***/ 6501:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameDataRemovePlayerEvent = void 0;
const events_1 = __webpack_require__(3418);
class GameDataRemovePlayerEvent extends events_1.RevertableEvent {
    constructor(room, gamedata, player) {
        super();
        this.room = room;
        this.gamedata = gamedata;
        this.player = player;
        this.eventName = "gamedata.removeplayer";
    }
}
exports.GameDataRemovePlayerEvent = GameDataRemovePlayerEvent;
GameDataRemovePlayerEvent.eventName = "gamedata.removeplayer";
//# sourceMappingURL=RemovePlayer.js.map

/***/ }),

/***/ 1084:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameDataSetTasksEvent = void 0;
const events_1 = __webpack_require__(3418);
class GameDataSetTasksEvent extends events_1.BasicEvent {
    constructor(room, gamedata, player, oldTasks, newTasks) {
        super();
        this.room = room;
        this.gamedata = gamedata;
        this.player = player;
        this.oldTasks = oldTasks;
        this.newTasks = newTasks;
        this.eventName = "gamedata.settasks";
        this._alteredTasks = newTasks;
    }
    get alteredTasks() {
        return this._alteredTasks;
    }
    revert() {
        return this.setTasks(this.oldTasks);
    }
    setTasks(tasks) {
        this._alteredTasks = tasks;
    }
}
exports.GameDataSetTasksEvent = GameDataSetTasksEvent;
GameDataSetTasksEvent.eventName = "gamedata.settasks";
//# sourceMappingURL=SetTasks.js.map

/***/ }),

/***/ 762:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HqHudConsoleCloseEvent = void 0;
const events_1 = __webpack_require__(3418);
class HqHudConsoleCloseEvent extends events_1.RevertableEvent {
    constructor(room, hqhud, message, player, consoleId) {
        super();
        this.room = room;
        this.hqhud = hqhud;
        this.message = message;
        this.player = player;
        this.consoleId = consoleId;
        this.eventName = "hqhud.consoles.close";
        this._alteredConsoleId = consoleId;
        this._atleredPlayer = player;
    }
    get alteredConsoleId() {
        return this._alteredConsoleId;
    }
    get alteredPlayer() {
        return this._atleredPlayer;
    }
    setConsoleId(consoleId) {
        this._alteredConsoleId = consoleId;
    }
    setPlayer(player) {
        this._atleredPlayer = player;
    }
}
exports.HqHudConsoleCloseEvent = HqHudConsoleCloseEvent;
HqHudConsoleCloseEvent.eventName = "hqhud.consoles.close";
//# sourceMappingURL=ConsoleClose.js.map

/***/ }),

/***/ 8111:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HqHudConsoleCompleteEvent = void 0;
const events_1 = __webpack_require__(3418);
class HqHudConsoleCompleteEvent extends events_1.RevertableEvent {
    constructor(room, hqhud, message, player, consoleId) {
        super();
        this.room = room;
        this.hqhud = hqhud;
        this.message = message;
        this.player = player;
        this.consoleId = consoleId;
        this.eventName = "hqhud.consoles.complete";
        this._alteredConsoleId = consoleId;
    }
    get alteredConsoleId() {
        return this._alteredConsoleId;
    }
    setConsoleId(consoleId) {
        this._alteredConsoleId = consoleId;
    }
}
exports.HqHudConsoleCompleteEvent = HqHudConsoleCompleteEvent;
HqHudConsoleCompleteEvent.eventName = "hqhud.consoles.complete";
//# sourceMappingURL=ConsoleComplete.js.map

/***/ }),

/***/ 8500:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HqHudConsoleOpenEvent = void 0;
const events_1 = __webpack_require__(3418);
class HqHudConsoleOpenEvent extends events_1.RevertableEvent {
    constructor(room, hqhud, message, player, consoleId) {
        super();
        this.room = room;
        this.hqhud = hqhud;
        this.message = message;
        this.player = player;
        this.consoleId = consoleId;
        this.eventName = "hqhud.consoles.open";
        this._alteredConsoleId = consoleId;
        this._atleredPlayer = player;
    }
    get alteredConsoleId() {
        return this._alteredConsoleId;
    }
    get alteredPlayer() {
        return this._atleredPlayer;
    }
    setConsoleId(consoleId) {
        this._alteredConsoleId = consoleId;
    }
    setPlayer(player) {
        this._atleredPlayer = player;
    }
}
exports.HqHudConsoleOpenEvent = HqHudConsoleOpenEvent;
HqHudConsoleOpenEvent.eventName = "hqhud.consoles.open";
//# sourceMappingURL=ConsoleOpen.js.map

/***/ }),

/***/ 5287:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HqHudConsolesResetEvent = void 0;
const events_1 = __webpack_require__(3418);
class HqHudConsolesResetEvent extends events_1.RevertableEvent {
    constructor(room, hqhud, message, player) {
        super();
        this.room = room;
        this.hqhud = hqhud;
        this.message = message;
        this.player = player;
        this.eventName = "hqhud.consoles.reset";
    }
}
exports.HqHudConsolesResetEvent = HqHudConsolesResetEvent;
HqHudConsolesResetEvent.eventName = "hqhud.consoles.reset";
//# sourceMappingURL=ConsolesReset.js.map

/***/ }),

/***/ 9256:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(894), exports);
__exportStar(__webpack_require__(7382), exports);
__exportStar(__webpack_require__(6992), exports);
__exportStar(__webpack_require__(6501), exports);
__exportStar(__webpack_require__(1084), exports);
__exportStar(__webpack_require__(762), exports);
__exportStar(__webpack_require__(8111), exports);
__exportStar(__webpack_require__(8500), exports);
__exportStar(__webpack_require__(5287), exports);
__exportStar(__webpack_require__(9209), exports);
__exportStar(__webpack_require__(7730), exports);
__exportStar(__webpack_require__(502), exports);
__exportStar(__webpack_require__(2203), exports);
__exportStar(__webpack_require__(712), exports);
__exportStar(__webpack_require__(1455), exports);
__exportStar(__webpack_require__(1879), exports);
__exportStar(__webpack_require__(6783), exports);
__exportStar(__webpack_require__(8245), exports);
__exportStar(__webpack_require__(1928), exports);
__exportStar(__webpack_require__(7203), exports);
__exportStar(__webpack_require__(8984), exports);
__exportStar(__webpack_require__(1444), exports);
__exportStar(__webpack_require__(6143), exports);
__exportStar(__webpack_require__(8278), exports);
__exportStar(__webpack_require__(4414), exports);
__exportStar(__webpack_require__(8534), exports);
__exportStar(__webpack_require__(6012), exports);
__exportStar(__webpack_require__(9995), exports);
__exportStar(__webpack_require__(1787), exports);
__exportStar(__webpack_require__(8087), exports);
__exportStar(__webpack_require__(2964), exports);
__exportStar(__webpack_require__(5192), exports);
__exportStar(__webpack_require__(6836), exports);
__exportStar(__webpack_require__(5196), exports);
__exportStar(__webpack_require__(6769), exports);
__exportStar(__webpack_require__(5585), exports);
__exportStar(__webpack_require__(4781), exports);
__exportStar(__webpack_require__(3539), exports);
__exportStar(__webpack_require__(2099), exports);
__exportStar(__webpack_require__(9647), exports);
__exportStar(__webpack_require__(1748), exports);
__exportStar(__webpack_require__(7883), exports);
__exportStar(__webpack_require__(7240), exports);
__exportStar(__webpack_require__(214), exports);
__exportStar(__webpack_require__(2514), exports);
__exportStar(__webpack_require__(3391), exports);
__exportStar(__webpack_require__(1696), exports);
__exportStar(__webpack_require__(8165), exports);
__exportStar(__webpack_require__(5513), exports);
__exportStar(__webpack_require__(8826), exports);
__exportStar(__webpack_require__(1890), exports);
__exportStar(__webpack_require__(2430), exports);
__exportStar(__webpack_require__(5035), exports);
__exportStar(__webpack_require__(4840), exports);
__exportStar(__webpack_require__(8255), exports);
__exportStar(__webpack_require__(5766), exports);
__exportStar(__webpack_require__(7469), exports);
__exportStar(__webpack_require__(8097), exports);
__exportStar(__webpack_require__(5953), exports);
__exportStar(__webpack_require__(3604), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 502:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MedScanJoinQueueEvent = void 0;
const events_1 = __webpack_require__(3418);
class MedScanJoinQueueEvent extends events_1.RevertableEvent {
    constructor(room, medscan, message, player) {
        super();
        this.room = room;
        this.medscan = medscan;
        this.message = message;
        this.player = player;
        this.eventName = "medscan.joinqueue";
        this._alteredPlayer = player;
    }
    get alteredPlayer() {
        return this._alteredPlayer;
    }
    setPlayer(player) {
        this._alteredPlayer = player;
    }
}
exports.MedScanJoinQueueEvent = MedScanJoinQueueEvent;
MedScanJoinQueueEvent.eventName = "medscan.joinqueue";
//# sourceMappingURL=JoinQueue.js.map

/***/ }),

/***/ 2203:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MedScanLeaveQueueEvent = void 0;
const events_1 = __webpack_require__(3418);
class MedScanLeaveQueueEvent extends events_1.RevertableEvent {
    constructor(room, medscan, message, player) {
        super();
        this.room = room;
        this.medscan = medscan;
        this.message = message;
        this.player = player;
        this.eventName = "medscan.leavequeue";
        this._alteredPlayer = player;
    }
    get alteredPlayer() {
        return this._alteredPlayer;
    }
    setPlayer(player) {
        this._alteredPlayer = player;
    }
}
exports.MedScanLeaveQueueEvent = MedScanLeaveQueueEvent;
MedScanLeaveQueueEvent.eventName = "medscan.leavequeue";
//# sourceMappingURL=LeaveQueue.js.map

/***/ }),

/***/ 1879:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MeetingHudClearVoteEvent = void 0;
const events_1 = __webpack_require__(3418);
class MeetingHudClearVoteEvent extends events_1.BasicEvent {
    constructor(room, meetinghud, message, player) {
        super();
        this.room = room;
        this.meetinghud = meetinghud;
        this.message = message;
        this.player = player;
        this.eventName = "meeting.clearvote";
    }
}
exports.MeetingHudClearVoteEvent = MeetingHudClearVoteEvent;
MeetingHudClearVoteEvent.eventName = "meeting.clearvote";
//# sourceMappingURL=ClearVote.js.map

/***/ }),

/***/ 712:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MeetingHudCloseEvent = void 0;
const events_1 = __webpack_require__(3418);
class MeetingHudCloseEvent extends events_1.CancelableEvent {
    constructor(room, meetinghud, message) {
        super();
        this.room = room;
        this.meetinghud = meetinghud;
        this.message = message;
        this.eventName = "meeting.close";
    }
}
exports.MeetingHudCloseEvent = MeetingHudCloseEvent;
MeetingHudCloseEvent.eventName = "meeting.close";
//# sourceMappingURL=Close.js.map

/***/ }),

/***/ 1455:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MeetingHudVoteCastEvent = void 0;
const events_1 = __webpack_require__(3418);
class MeetingHudVoteCastEvent extends events_1.RevertableEvent {
    constructor(room, meetinghud, message, voter, suspect) {
        super();
        this.room = room;
        this.meetinghud = meetinghud;
        this.message = message;
        this.voter = voter;
        this.suspect = suspect;
        this.eventName = "meeting.castvote";
        this._alteredVoter = voter;
        this._alteredSuspect = suspect;
    }
    get didSkip() {
        return this._alteredSuspect === undefined;
    }
    get alteredVoter() {
        return this._alteredVoter;
    }
    get alteredSuspect() {
        return this._alteredSuspect;
    }
    setVoter(voter) {
        this._alteredVoter = voter;
    }
    setSuspect(suspect) {
        this._alteredSuspect = suspect;
    }
}
exports.MeetingHudVoteCastEvent = MeetingHudVoteCastEvent;
MeetingHudVoteCastEvent.eventName = "meeting.castvote";
//# sourceMappingURL=VoteCast.js.map

/***/ }),

/***/ 6783:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MeetingHudVotingCompleteEvent = void 0;
const events_1 = __webpack_require__(3418);
class MeetingHudVotingCompleteEvent extends events_1.BasicEvent {
    constructor(room, meetinghud, message, tie, voteStates, ejected) {
        super();
        this.room = room;
        this.meetinghud = meetinghud;
        this.message = message;
        this.tie = tie;
        this.voteStates = voteStates;
        this.ejected = ejected;
        this.eventName = "meeting.votingcomplete";
    }
}
exports.MeetingHudVotingCompleteEvent = MeetingHudVotingCompleteEvent;
MeetingHudVotingCompleteEvent.eventName = "meeting.votingcomplete";
//# sourceMappingURL=VotingComplete.js.map

/***/ }),

/***/ 6143:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MovingPlatformPlayerUpdateEvent = void 0;
const events_1 = __webpack_require__(3418);
class MovingPlatformPlayerUpdateEvent extends events_1.RevertableEvent {
    constructor(room, movingplatform, message, player, side) {
        super();
        this.room = room;
        this.movingplatform = movingplatform;
        this.message = message;
        this.player = player;
        this.side = side;
        this.eventName = "movingplatform.updateplayer";
        this._alteredPlayer = player;
        this._alteredSide = side;
    }
    get alteredPlayer() {
        return this._alteredPlayer;
    }
    get alteredSide() {
        return this._alteredSide;
    }
    setPlayer(player) {
        this._alteredPlayer = player;
    }
    setSide(side) {
        this._alteredSide = side;
    }
}
exports.MovingPlatformPlayerUpdateEvent = MovingPlatformPlayerUpdateEvent;
MovingPlatformPlayerUpdateEvent.eventName = "movingplatform.updateplayer";
//# sourceMappingURL=PlayerUpdate.js.map

/***/ }),

/***/ 8245:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NetworkableDespawnEvent = void 0;
const events_1 = __webpack_require__(3418);
class NetworkableDespawnEvent extends events_1.BasicEvent {
    constructor(room, networkable) {
        super();
        this.room = room;
        this.networkable = networkable;
        this.eventName = "component.despawn";
    }
}
exports.NetworkableDespawnEvent = NetworkableDespawnEvent;
NetworkableDespawnEvent.eventName = "component.despawn";
//# sourceMappingURL=Despawn.js.map

/***/ }),

/***/ 1928:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NetworkableSpawnEvent = void 0;
const events_1 = __webpack_require__(3418);
class NetworkableSpawnEvent extends events_1.BasicEvent {
    constructor(room, networkable) {
        super();
        this.room = room;
        this.networkable = networkable;
        this.eventName = "component.spawn";
    }
}
exports.NetworkableSpawnEvent = NetworkableSpawnEvent;
NetworkableSpawnEvent.eventName = "component.spawn";
//# sourceMappingURL=Spawn.js.map

/***/ }),

/***/ 7203:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.O2ConsoleCompleteEvent = void 0;
const events_1 = __webpack_require__(3418);
class O2ConsoleCompleteEvent extends events_1.RevertableEvent {
    constructor(room, oxygen, message, player, consoleId) {
        super();
        this.room = room;
        this.oxygen = oxygen;
        this.message = message;
        this.player = player;
        this.consoleId = consoleId;
        this.eventName = "o2.consoles.complete";
        this._alteredConsoleId = consoleId;
    }
    get alteredConsoleId() {
        return this._alteredConsoleId;
    }
    setConsole(consoleId) {
        this._alteredConsoleId = consoleId;
    }
}
exports.O2ConsoleCompleteEvent = O2ConsoleCompleteEvent;
O2ConsoleCompleteEvent.eventName = "o2.consoles.complete";
//# sourceMappingURL=ConsoleComplete.js.map

/***/ }),

/***/ 8984:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.O2ConsolesClearEvent = void 0;
const events_1 = __webpack_require__(3418);
class O2ConsolesClearEvent extends events_1.RevertableEvent {
    constructor(room, oxygen, message, player) {
        super();
        this.room = room;
        this.oxygen = oxygen;
        this.message = message;
        this.player = player;
        this.eventName = "o2.consoles.clear";
    }
}
exports.O2ConsolesClearEvent = O2ConsolesClearEvent;
O2ConsolesClearEvent.eventName = "o2.consoles.clear";
//# sourceMappingURL=ConsolesClear.js.map

/***/ }),

/***/ 1444:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.O2ConsolesResetEvent = void 0;
const events_1 = __webpack_require__(3418);
class O2ConsolesResetEvent extends events_1.RevertableEvent {
    constructor(room, oxygen, message, player) {
        super();
        this.room = room;
        this.oxygen = oxygen;
        this.message = message;
        this.player = player;
        this.eventName = "o2.consoles.reset";
    }
}
exports.O2ConsolesResetEvent = O2ConsolesResetEvent;
O2ConsolesResetEvent.eventNamee = "o2.consoles.reset";
//# sourceMappingURL=ConsolesReset.js.map

/***/ }),

/***/ 4414:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerCheckColorEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerCheckColorEvent extends events_1.CancelableEvent {
    constructor(room, player, message, originalColor, alteredColor) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.originalColor = originalColor;
        this.alteredColor = alteredColor;
        this.eventName = "player.checkcolor";
    }
    setColor(color) {
        this.alteredColor = color;
    }
}
exports.PlayerCheckColorEvent = PlayerCheckColorEvent;
PlayerCheckColorEvent.eventName = "player.checkcolor";
//# sourceMappingURL=CheckColor.js.map

/***/ }),

/***/ 8534:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerCheckNameEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerCheckNameEvent extends events_1.CancelableEvent {
    constructor(room, player, message, originalName, alteredName) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.originalName = originalName;
        this.alteredName = alteredName;
        this.eventName = "player.checkname";
    }
    setName(name) {
        this.alteredName = name;
    }
}
exports.PlayerCheckNameEvent = PlayerCheckNameEvent;
PlayerCheckNameEvent.eventName = "player.checkname";
//# sourceMappingURL=CheckName.js.map

/***/ }),

/***/ 6012:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerClimbLadderEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerClimbLadderEvent extends events_1.BasicEvent {
    constructor(room, player, message, ladderid) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.ladderid = ladderid;
        this.eventName = "player.climbladder";
    }
}
exports.PlayerClimbLadderEvent = PlayerClimbLadderEvent;
PlayerClimbLadderEvent.eventName = "player.climbladder";
//# sourceMappingURL=ClimbLadder.js.map

/***/ }),

/***/ 9995:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerCompleteTaskEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerCompleteTaskEvent extends events_1.BasicEvent {
    constructor(room, player, message, task) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.task = task;
        this.eventName = "player.completetask";
    }
}
exports.PlayerCompleteTaskEvent = PlayerCompleteTaskEvent;
PlayerCompleteTaskEvent.eventName = "player.completetask";
//# sourceMappingURL=CompleteTask.js.map

/***/ }),

/***/ 1787:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerEnterVentEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerEnterVentEvent extends events_1.BasicEvent {
    constructor(room, player, message, ventid) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.ventid = ventid;
        this.eventName = "player.entervent";
    }
}
exports.PlayerEnterVentEvent = PlayerEnterVentEvent;
PlayerEnterVentEvent.eventName = "player.entervent";
//# sourceMappingURL=EnterVent.js.map

/***/ }),

/***/ 8087:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerExitVentEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerExitVentEvent extends events_1.BasicEvent {
    constructor(room, player, message, ventid) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.ventid = ventid;
        this.eventName = "player.exitvent";
    }
}
exports.PlayerExitVentEvent = PlayerExitVentEvent;
PlayerExitVentEvent.eventName = "player.exitvent";
//# sourceMappingURL=ExitVent.js.map

/***/ }),

/***/ 2964:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerJoinEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerJoinEvent extends events_1.BasicEvent {
    constructor(room, player) {
        super();
        this.room = room;
        this.player = player;
        this.eventName = "player.join";
    }
}
exports.PlayerJoinEvent = PlayerJoinEvent;
PlayerJoinEvent.eventName = "player.join";
//# sourceMappingURL=Join.js.map

/***/ }),

/***/ 5192:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerLeaveEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerLeaveEvent extends events_1.BasicEvent {
    constructor(room, player) {
        super();
        this.room = room;
        this.player = player;
        this.eventName = "player.leave";
    }
}
exports.PlayerLeaveEvent = PlayerLeaveEvent;
PlayerLeaveEvent.eventName = "player.leave";
//# sourceMappingURL=Leave.js.map

/***/ }),

/***/ 6836:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerMoveEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerMoveEvent extends events_1.BasicEvent {
    constructor(room, player, position, velocity) {
        super();
        this.room = room;
        this.player = player;
        this.position = position;
        this.velocity = velocity;
        this.eventName = "player.move";
    }
}
exports.PlayerMoveEvent = PlayerMoveEvent;
PlayerMoveEvent.eventName = "player.move";
//# sourceMappingURL=Move.js.map

/***/ }),

/***/ 5196:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerMurderEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerMurderEvent extends events_1.BasicEvent {
    constructor(room, player, message, victim) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.victim = victim;
        this.eventName = "player.murder";
    }
}
exports.PlayerMurderEvent = PlayerMurderEvent;
PlayerMurderEvent.eventName = "player.murder";
//# sourceMappingURL=Murder.js.map

/***/ }),

/***/ 6769:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerReadyEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerReadyEvent extends events_1.BasicEvent {
    constructor(room, player) {
        super();
        this.room = room;
        this.player = player;
        this.eventName = "player.ready";
    }
}
exports.PlayerReadyEvent = PlayerReadyEvent;
PlayerReadyEvent.eventName = "player.ready";
//# sourceMappingURL=Ready.js.map

/***/ }),

/***/ 5585:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerReportDeadBodyEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerReportDeadBodyEvent extends events_1.CancelableEvent {
    constructor(room, player, message, body) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.body = body;
        this.eventName = "player.reportbody";
        this._alteredBody = body;
    }
    get alteredBody() {
        return this._alteredBody;
    }
    setEmergency() {
        return this.setBody("emergency");
    }
    setBody(body) {
        this._alteredBody = body;
    }
}
exports.PlayerReportDeadBodyEvent = PlayerReportDeadBodyEvent;
PlayerReportDeadBodyEvent.eventName = "player.reportbody";
//# sourceMappingURL=ReportDeadBody.js.map

/***/ }),

/***/ 4781:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSceneChangeEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerSceneChangeEvent extends events_1.CancelableEvent {
    constructor(room, player, message) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.eventName = "player.scenechange";
    }
}
exports.PlayerSceneChangeEvent = PlayerSceneChangeEvent;
PlayerSceneChangeEvent.eventNamee = "player.scenechange";
//# sourceMappingURL=SceneChange.js.map

/***/ }),

/***/ 8278:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSendChatEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerSendChatEvent extends events_1.BasicEvent {
    constructor(room, player, message, chatMessage) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.chatMessage = chatMessage;
        this.eventName = "player.chat";
    }
}
exports.PlayerSendChatEvent = PlayerSendChatEvent;
PlayerSendChatEvent.eventName = "player.chat";
//# sourceMappingURL=SendChat.js.map

/***/ }),

/***/ 3539:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSetColorEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerSetColorEvent extends events_1.BasicEvent {
    constructor(room, player, message, oldColor, newColor) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.oldColor = oldColor;
        this.newColor = newColor;
        this.eventName = "player.setcolor";
        this._alteredColor = newColor;
    }
    get alteredColor() {
        return this._alteredColor;
    }
    revert() {
        this.setColor(this.oldColor);
    }
    setColor(color) {
        this._alteredColor = color;
    }
}
exports.PlayerSetColorEvent = PlayerSetColorEvent;
PlayerSetColorEvent.eventName = "player.setcolor";
//# sourceMappingURL=SetColor.js.map

/***/ }),

/***/ 2099:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSetHatEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerSetHatEvent extends events_1.BasicEvent {
    constructor(room, player, message, oldHat, newHat) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.oldHat = oldHat;
        this.newHat = newHat;
        this.eventName = "player.sethat";
        this._atleredHat = newHat;
    }
    get alteredHat() {
        return this._atleredHat;
    }
    revert() {
        this.setHat(this.oldHat);
    }
    setHat(hat) {
        this._atleredHat = hat;
    }
}
exports.PlayerSetHatEvent = PlayerSetHatEvent;
PlayerSetHatEvent.eventName = "player.sethat";
//# sourceMappingURL=SetHat.js.map

/***/ }),

/***/ 9647:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSetHostEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerSetHostEvent extends events_1.BasicEvent {
    constructor(room, player) {
        super();
        this.room = room;
        this.player = player;
        this.eventName = "player.sethost";
        this._alteredHost = player;
    }
    get alteredHost() {
        return this._alteredHost;
    }
    setHost(player) {
        this._alteredHost = player;
    }
}
exports.PlayerSetHostEvent = PlayerSetHostEvent;
PlayerSetHostEvent.eventName = "player.sethost";
//# sourceMappingURL=SetHost.js.map

/***/ }),

/***/ 1748:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSetImpostorsEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerSetImpostorsEvent extends events_1.BasicEvent {
    constructor(room, player, message, impostors) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.impostors = impostors;
        this.eventName = "player.setimpostors";
        this._alteredImpostors = [...impostors];
        this._isDirty = false;
    }
    get alteredImpostors() {
        return this._alteredImpostors;
    }
    get isDirty() {
        return this._isDirty;
    }
    setImpostors(impostors) {
        this._alteredImpostors = impostors;
        this._isDirty = true;
    }
}
exports.PlayerSetImpostorsEvent = PlayerSetImpostorsEvent;
PlayerSetImpostorsEvent.eventName = "player.setimpostors";
//# sourceMappingURL=SetImpostors.js.map

/***/ }),

/***/ 7883:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSetNameEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerSetNameEvent extends events_1.BasicEvent {
    constructor(room, player, message, oldName, newName) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.oldName = oldName;
        this.newName = newName;
        this.eventName = "player.setname";
        this._alteredName = newName;
    }
    get alteredName() {
        return this._alteredName;
    }
    revert() {
        this.setName(this.oldName);
    }
    setName(name) {
        this._alteredName = name;
    }
}
exports.PlayerSetNameEvent = PlayerSetNameEvent;
PlayerSetNameEvent.eventName = "player.setname";
//# sourceMappingURL=SetName.js.map

/***/ }),

/***/ 7240:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSetPetEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerSetPetEvent extends events_1.BasicEvent {
    constructor(room, player, message, oldPet, newPet) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.oldPet = oldPet;
        this.newPet = newPet;
        this.eventName = "player.setpet";
        this._alteredPet = newPet;
    }
    get alteredPet() {
        return this._alteredPet;
    }
    revert() {
        this.setPet(this.oldPet);
    }
    setPet(pet) {
        this._alteredPet = pet;
    }
}
exports.PlayerSetPetEvent = PlayerSetPetEvent;
PlayerSetPetEvent.eventName = "player.setpet";
//# sourceMappingURL=SetPet.js.map

/***/ }),

/***/ 214:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSetSkinEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerSetSkinEvent extends events_1.BasicEvent {
    constructor(room, player, message, oldSkin, newSkin) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.oldSkin = oldSkin;
        this.newSkin = newSkin;
        this.eventName = "player.setskin";
        this._alteredSkin = newSkin;
    }
    get alteredSkin() {
        return this._alteredSkin;
    }
    revert() {
        this.setSkin(this.oldSkin);
    }
    setSkin(skin) {
        this._alteredSkin = skin;
    }
}
exports.PlayerSetSkinEvent = PlayerSetSkinEvent;
PlayerSetSkinEvent.eventName = "player.setskin";
//# sourceMappingURL=SetSkin.js.map

/***/ }),

/***/ 3391:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSetStartCounterEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerSetStartCounterEvent extends events_1.BasicEvent {
    constructor(room, player, message, oldCounter, newCounter) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.oldCounter = oldCounter;
        this.newCounter = newCounter;
        this.eventName = "player.setstartcounter";
        this._alteredCounter = newCounter;
    }
    get alteredCounter() {
        return this._alteredCounter;
    }
    revert() {
        this.setCounter(this.oldCounter);
    }
    setCounter(counter) {
        this._alteredCounter = counter;
    }
}
exports.PlayerSetStartCounterEvent = PlayerSetStartCounterEvent;
PlayerSetStartCounterEvent.eventName = "player.setstartcounter";
//# sourceMappingURL=SetStartCounter.js.map

/***/ }),

/***/ 1696:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSnapToEvent = void 0;
const events_1 = __webpack_require__(3418);
const util_1 = __webpack_require__(5131);
class PlayerSnapToEvent extends events_1.BasicEvent {
    constructor(room, player, message, oldPosition, newPosition) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
        this.eventName = "player.snapto";
        this._alteredPosition = new util_1.Vector2(newPosition);
    }
    get alteredPosition() {
        return this._alteredPosition;
    }
    revert() {
        this.setPosition(this.oldPosition);
    }
    setPosition(position) {
        this._alteredPosition.x = position.x;
        this._alteredPosition.y = position.y;
    }
}
exports.PlayerSnapToEvent = PlayerSnapToEvent;
PlayerSnapToEvent.eventName = "player.snapto";
//# sourceMappingURL=SnapTo.js.map

/***/ }),

/***/ 8165:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSpawnEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerSpawnEvent extends events_1.BasicEvent {
    constructor(room, player) {
        super();
        this.room = room;
        this.player = player;
        this.eventName = "player.spawn";
    }
}
exports.PlayerSpawnEvent = PlayerSpawnEvent;
PlayerSpawnEvent.eventName = "player.spawn";
//# sourceMappingURL=Spawn.js.map

/***/ }),

/***/ 2514:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerStartMeetingEvent = void 0;
const events_1 = __webpack_require__(3418);
class PlayerStartMeetingEvent extends events_1.BasicEvent {
    constructor(room, player, message, body) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.body = body;
        this.eventName = "player.startmeeting";
    }
}
exports.PlayerStartMeetingEvent = PlayerStartMeetingEvent;
PlayerStartMeetingEvent.eventName = "player.startmeeting";
//# sourceMappingURL=StartMeeting.js.map

/***/ }),

/***/ 5513:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSyncSettingsEvent = void 0;
const events_1 = __webpack_require__(3418);
const protocol_1 = __webpack_require__(2602);
class PlayerSyncSettingsEvent extends events_1.BasicEvent {
    constructor(room, player, message, settings) {
        super();
        this.room = room;
        this.player = player;
        this.message = message;
        this.settings = settings;
        this.eventName = "player.syncsettings";
        this._alteredSettings = new protocol_1.GameOptions(settings);
        this._isDirty = false;
    }
    get alteredSettings() {
        return this._alteredSettings;
    }
    get isDirty() {
        return this._isDirty;
    }
    setSettings(options) {
        this._alteredSettings.patch(options);
        this._isDirty = true;
    }
}
exports.PlayerSyncSettingsEvent = PlayerSyncSettingsEvent;
PlayerSyncSettingsEvent.eventName = "player.syncsettings";
//# sourceMappingURL=SyncSettings.js.map

/***/ }),

/***/ 8826:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReactorConsoleAddEvent = void 0;
const events_1 = __webpack_require__(3418);
class ReactorConsoleAddEvent extends events_1.RevertableEvent {
    constructor(room, reactor, message, player, consoleId) {
        super();
        this.room = room;
        this.reactor = reactor;
        this.message = message;
        this.player = player;
        this.consoleId = consoleId;
        this.eventName = "reactor.consoles.add";
        this._alteredConsoleId = consoleId;
    }
    get alteredConsoleId() {
        return this._alteredConsoleId;
    }
    setConsole(consoleId) {
        this._alteredConsoleId = consoleId;
    }
}
exports.ReactorConsoleAddEvent = ReactorConsoleAddEvent;
ReactorConsoleAddEvent.eventName = "reactor.consoles.add";
//# sourceMappingURL=ConsoleAdd.js.map

/***/ }),

/***/ 1890:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReactorConsoleRemoveEvent = void 0;
const events_1 = __webpack_require__(3418);
class ReactorConsoleRemoveEvent extends events_1.RevertableEvent {
    constructor(room, reactor, message, player, consoleId) {
        super();
        this.room = room;
        this.reactor = reactor;
        this.message = message;
        this.player = player;
        this.consoleId = consoleId;
        this.eventName = "reactor.consoles.remove";
        this._alteredConsoleId = consoleId;
    }
    get alteredConsoleId() {
        return this._alteredConsoleId;
    }
    setConsole(consoleId) {
        this._alteredConsoleId = consoleId;
    }
}
exports.ReactorConsoleRemoveEvent = ReactorConsoleRemoveEvent;
ReactorConsoleRemoveEvent.eventName = "reactor.consoles.remove";
//# sourceMappingURL=ConsoleRemove.js.map

/***/ }),

/***/ 2430:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReactorConsolesResetEvent = void 0;
const events_1 = __webpack_require__(3418);
class ReactorConsolesResetEvent extends events_1.RevertableEvent {
    constructor(room, reactor, message, player) {
        super();
        this.room = room;
        this.reactor = reactor;
        this.message = message;
        this.player = player;
        this.eventName = "reactor.consoles.reset";
    }
}
exports.ReactorConsolesResetEvent = ReactorConsolesResetEvent;
ReactorConsolesResetEvent.eventName = "reactor.consoles.reset";
//# sourceMappingURL=ConsolesReset.js.map

/***/ }),

/***/ 5035:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomFixedUpdateEvent = void 0;
const events_1 = __webpack_require__(3418);
class RoomFixedUpdateEvent extends events_1.CancelableEvent {
    constructor(room, stream) {
        super();
        this.room = room;
        this.stream = stream;
        this.eventName = "room.fixedupdate";
    }
}
exports.RoomFixedUpdateEvent = RoomFixedUpdateEvent;
RoomFixedUpdateEvent.eventName = "room.fixedupdate";
//# sourceMappingURL=FixedUpdate.js.map

/***/ }),

/***/ 4840:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomGameEndEvent = void 0;
const events_1 = __webpack_require__(3418);
class RoomGameEndEvent extends events_1.BasicEvent {
    constructor(room, reason) {
        super();
        this.room = room;
        this.reason = reason;
        this.eventName = "room.gameend";
    }
}
exports.RoomGameEndEvent = RoomGameEndEvent;
RoomGameEndEvent.eventName = "room.gameend";
//# sourceMappingURL=GameEnd.js.map

/***/ }),

/***/ 8255:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomGameStartEvent = void 0;
const events_1 = __webpack_require__(3418);
class RoomGameStartEvent extends events_1.BasicEvent {
    constructor(room) {
        super();
        this.room = room;
        this.eventName = "room.gamestart";
    }
}
exports.RoomGameStartEvent = RoomGameStartEvent;
RoomGameStartEvent.eventName = "room.gamestart";
//# sourceMappingURL=GameStart.js.map

/***/ }),

/***/ 5766:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomSelectImpostorsEvent = void 0;
const events_1 = __webpack_require__(3418);
class RoomSelectImpostorsEvent extends events_1.CancelableEvent {
    constructor(room, impostors) {
        super();
        this.room = room;
        this.impostors = impostors;
        this.eventName = "room.selectimpostors";
        this._alteredImpostors = impostors;
    }
    get alteredImpostors() {
        return this._alteredImpostors;
    }
    setImpostors(impostors) {
        this._alteredImpostors = impostors;
    }
}
exports.RoomSelectImpostorsEvent = RoomSelectImpostorsEvent;
RoomSelectImpostorsEvent.eventName = "room.selectimpostors";
//# sourceMappingURL=SelectImpostors.js.map

/***/ }),

/***/ 7469:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomSetPrivacyEvent = void 0;
const events_1 = __webpack_require__(3418);
class RoomSetPrivacyEvent extends events_1.BasicEvent {
    constructor(room, message, oldPrivacy, newPrivacy) {
        super();
        this.room = room;
        this.message = message;
        this.oldPrivacy = oldPrivacy;
        this.newPrivacy = newPrivacy;
        this.eventName = "room.setprivacy";
        this._alteredPrivacy = newPrivacy;
    }
    get alteredPrivacy() {
        return this._alteredPrivacy;
    }
    revert() {
        this.setPrivacy(this.oldPrivacy);
    }
    setPrivacy(privacy) {
        this._alteredPrivacy = privacy;
    }
}
exports.RoomSetPrivacyEvent = RoomSetPrivacyEvent;
RoomSetPrivacyEvent.eventName = "room.setprivacy";
//# sourceMappingURL=SetPrivacy.js.map

/***/ }),

/***/ 5953:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SystemRepairEvent = void 0;
const events_1 = __webpack_require__(3418);
class SystemRepairEvent extends events_1.RevertableEvent {
    constructor(room, system, message, player) {
        super();
        this.room = room;
        this.system = system;
        this.message = message;
        this.player = player;
        this.eventName = "system.repair";
    }
}
exports.SystemRepairEvent = SystemRepairEvent;
SystemRepairEvent.eventName = "system.repair";
//# sourceMappingURL=Repair.js.map

/***/ }),

/***/ 3604:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SystemSabotageEvent = void 0;
const events_1 = __webpack_require__(3418);
class SystemSabotageEvent extends events_1.RevertableEvent {
    constructor(room, system, message, player) {
        super();
        this.room = room;
        this.system = system;
        this.message = message;
        this.player = player;
        this.eventName = "system.sabotage";
    }
}
exports.SystemSabotageEvent = SystemSabotageEvent;
SystemSabotageEvent.eventName = "system.sabotage";
//# sourceMappingURL=Sabotage.js.map

/***/ }),

/***/ 7952:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(1514), exports);
__exportStar(__webpack_require__(9256), exports);
__exportStar(__webpack_require__(7735), exports);
__exportStar(__webpack_require__(7699), exports);
__exportStar(__webpack_require__(3505), exports);
__exportStar(__webpack_require__(2311), exports);
__exportStar(__webpack_require__(8428), exports);
__exportStar(__webpack_require__(5332), exports);
__exportStar(__webpack_require__(6851), exports);
__exportStar(__webpack_require__(461), exports);
__exportStar(__webpack_require__(8565), exports);
__exportStar(__webpack_require__(1379), exports);
__exportStar(__webpack_require__(461), exports);
__exportStar(__webpack_require__(2493), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7699:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutoOpenDoor = void 0;
const Door_1 = __webpack_require__(3505);
/**
 * Represents an auto opening door for the {@link AutoDoorsSystem}.
 *
 * See {@link DoorEvents} for events to listen to.
 */
class AutoOpenDoor extends Door_1.Door {
    constructor(system, id, isOpen) {
        super(system, id, isOpen);
        this.system = system;
        this.id = id;
        this.timer = 0;
    }
    DoUpdate(delta) {
        this.timer -= delta;
        if (this.timer < 0) {
            this.system.openDoor(this.id);
            return true;
        }
        return false;
    }
}
exports.AutoOpenDoor = AutoOpenDoor;
//# sourceMappingURL=AutoOpenDoor.js.map

/***/ }),

/***/ 3505:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Door = void 0;
const events_1 = __webpack_require__(3418);
/**
 * Represents a manual door for the {@link DoorsSystem} or {@link ElectricalDoorsSystem}.
 *
 * See {@link DoorEvents} for events to listen to.
 */
class Door extends events_1.EventEmitter {
    constructor(system, id, isOpen) {
        super();
        this.system = system;
        this.id = id;
        this.isOpen = isOpen;
    }
    async emit(event) {
        if (this.system) {
            this.system.emit(event);
        }
        return super.emit(event);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Deserialize(reader, spawn) {
        this.isOpen = reader.bool(); // Use setter to emit events.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Serialize(writer, spawn) {
        writer.bool(this.isOpen);
    }
    /**
     * Force the door open.
     */
    async open() {
        await this.system.openDoor(this.id);
    }
    /**
     * Force the door to close.
     */
    async close() {
        await this.system.closeDoor(this.id);
    }
}
exports.Door = Door;
//# sourceMappingURL=Door.js.map

/***/ }),

/***/ 2311:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=HostableOptions.js.map

/***/ }),

/***/ 8428:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerInfo = exports.TaskState = void 0;
const constant_1 = __webpack_require__(492);
class TaskState {
    constructor(taskidx, completed) {
        this.taskidx = taskidx;
        this.completed = completed;
    }
    static Deserialize(reader) {
        const task = new TaskState(0, false);
        task.Deserialize(reader);
        return task;
    }
    Deserialize(reader) {
        this.taskidx = reader.upacked();
        this.completed = reader.bool();
    }
    Serialize(writer) {
        writer.upacked(this.taskidx);
        writer.bool(this.completed);
    }
}
exports.TaskState = TaskState;
class PlayerInfo {
    constructor(gamedata, playerId, name = "", color = -1, hat = constant_1.Hat.None, pet = constant_1.Pet.None, skin = constant_1.Skin.None, flags = 0, taskIds = [], taskStates = []) {
        this.gamedata = gamedata;
        this.playerId = playerId;
        this.name = name;
        this.color = color;
        this.hat = hat;
        this.pet = pet;
        this.skin = skin;
        this.flags = flags;
        this.taskIds = taskIds;
        this.taskStates = taskStates;
    }
    get player() {
        return this.gamedata.room.getPlayerByPlayerId(this.playerId);
    }
    get isDisconnected() {
        return (this.flags & constant_1.PlayerDataFlags.IsDisconnected)
            === constant_1.PlayerDataFlags.IsDisconnected;
    }
    get isImpostor() {
        return (this.flags & constant_1.PlayerDataFlags.IsImpostor)
            === constant_1.PlayerDataFlags.IsImpostor;
    }
    get isDead() {
        return (this.flags & constant_1.PlayerDataFlags.IsDead)
            === constant_1.PlayerDataFlags.IsDead;
    }
    static createDefault(gamedata, playerId) {
        return new PlayerInfo(gamedata, playerId, "", constant_1.Color.Red, constant_1.Hat.None, constant_1.Pet.None, constant_1.Skin.None, 0, [], []);
    }
    static Deserialize(reader, gamedata, playerId) {
        const player = this.createDefault(gamedata, playerId);
        player.Deserialize(reader);
        return player;
    }
    Deserialize(reader) {
        this.name = reader.string();
        this.color = reader.packed();
        this.hat = reader.upacked();
        this.pet = reader.upacked();
        this.skin = reader.upacked();
        this.flags = reader.byte();
        this.taskStates = [];
        const num_tasks = reader.uint8();
        this.taskStates = reader.lread(num_tasks, TaskState);
    }
    Serialize(writer) {
        var _a;
        writer.string(this.name || "");
        writer.packed(this.color || 0);
        writer.upacked(this.hat || 0);
        writer.upacked(this.pet || 0);
        writer.upacked(this.skin || 0);
        writer.byte(this.flags || 0);
        writer.uint8(((_a = this.taskStates) === null || _a === void 0 ? void 0 : _a.length) || 0);
        writer.lwrite(false, this.taskStates || []);
    }
    clone(playerId) {
        return new PlayerInfo(this.gamedata, playerId, this.name, this.color, this.hat, this.pet, this.skin, this.flags, [...this.taskIds], [...this.taskStates.map(state => new TaskState(state.taskidx, state.completed))]);
    }
    setDisconnected(isDisconnected) {
        if (isDisconnected) {
            this.setFlags(this.flags | constant_1.PlayerDataFlags.IsDisconnected);
        }
        else {
            this.setFlags(this.flags & ~constant_1.PlayerDataFlags.IsDisconnected);
        }
    }
    setImpostor(isImpostor) {
        if (isImpostor) {
            this.setFlags(this.flags | constant_1.PlayerDataFlags.IsImpostor);
        }
        else {
            this.setFlags(this.flags & ~constant_1.PlayerDataFlags.IsImpostor);
        }
    }
    setDead(isDead) {
        if (isDead) {
            this.setFlags(this.flags | constant_1.PlayerDataFlags.IsDead);
        }
        else {
            this.setFlags(this.flags & ~constant_1.PlayerDataFlags.IsDead);
        }
    }
    setName(name) {
        this.name = name;
        this.gamedata.update(this);
    }
    setColor(color) {
        this.color = color;
        this.gamedata.update(this);
    }
    setHat(hat) {
        this.hat = hat;
        this.gamedata.update(this);
    }
    setPet(pet) {
        this.pet = pet;
        this.gamedata.update(this);
    }
    setSkin(skin) {
        this.skin = skin;
        this.gamedata.update(this);
    }
    setFlags(flags) {
        this.flags = flags;
        this.gamedata.update(this);
    }
    setTaskIds(taskIds) {
        this.taskIds = taskIds;
        this.gamedata.update(this);
    }
    setTaskStates(taskStates) {
        this.taskStates = taskStates;
        this.gamedata.update(this);
    }
    completeTask(state) {
        state.completed = true;
        this.gamedata.update(this);
    }
}
exports.PlayerInfo = PlayerInfo;
//# sourceMappingURL=PlayerInfo.js.map

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerVoteState = void 0;
const constant_1 = __webpack_require__(492);
/**
 * Represents a player's voting state.
 */
class PlayerVoteState {
    constructor(room, playerId, votedFor, reported = false, voted = false, dead = false) {
        this.room = room;
        this.playerId = playerId;
        this.votedFor = votedFor;
        this.reported = reported;
        this.voted = voted;
        this.dead = dead;
    }
    static from(room, playerId, byte) {
        const state = new PlayerVoteState(room, playerId);
        state.patch(byte);
        return state;
    }
    get player() {
        return this.room.getPlayerByPlayerId(this.playerId);
    }
    get didSkip() {
        return this.voted && !this.votedFor;
    }
    get byte() {
        return ((this.votedFor ? this.votedFor.playerId || 0 : 0) |
            (this.reported ? constant_1.VoteState.DidReport : 0) |
            (this.voted ? constant_1.VoteState.DidVote : 0) |
            (this.dead ? constant_1.VoteState.IsDead : 0));
    }
    patch(byte) {
        this.votedFor = this.room.getPlayerByPlayerId((byte & constant_1.VoteState.VotedFor) - 1);
        this.reported = (byte & constant_1.VoteState.DidReport) > 0;
        this.voted = (byte & constant_1.VoteState.DidVote) > 0;
        this.dead = (byte & constant_1.VoteState.IsDead) > 0;
    }
    static Deserialize(reader, room, playerId) {
        const byte = reader.uint8();
        return PlayerVoteState.from(room, playerId, byte);
    }
    Serialize(writer) {
        writer.uint8(this.byte);
    }
}
exports.PlayerVoteState = PlayerVoteState;
//# sourceMappingURL=PlayerVoteState.js.map

/***/ }),

/***/ 2493:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpawnPrefabs = void 0;
const component_1 = __webpack_require__(1514);
exports.SpawnPrefabs = [
    [component_1.SkeldShipStatus],
    [component_1.MeetingHud],
    [component_1.LobbyBehaviour],
    [component_1.GameData, component_1.VoteBanSystem],
    [component_1.PlayerControl, component_1.PlayerPhysics, component_1.CustomNetworkTransform],
    [component_1.MiraShipStatus],
    [component_1.PolusShipStatus],
    [component_1.AprilShipStatus],
    [component_1.AirshipStatus],
];
//# sourceMappingURL=prefabs.js.map

/***/ }),

/***/ 106:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutoDoorsSystem = void 0;
const constant_1 = __webpack_require__(492);
const data_1 = __webpack_require__(727);
const SystemStatus_1 = __webpack_require__(6775);
const AutoOpenDoor_1 = __webpack_require__(7699);
const events_1 = __webpack_require__(9256);
/**
 * Represents a system for doors that open after a period of time.
 *
 * See {@link AutoDoorsSystemEvents} for events to listen to.
 */
class AutoDoorsSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        super(ship, data);
        this.systemType = constant_1.SystemType.Doors;
        this.dirtyBit || (this.dirtyBit = 0);
        this.doors || (this.doors = []);
        this.doors = this.doors.map((door, i) => typeof door === "boolean"
            ? new AutoOpenDoor_1.AutoOpenDoor(this, i, door)
            : door);
    }
    Deserialize(reader, spawn) {
        if (spawn) {
            for (let i = 0; i < data_1.MapDoors[constant_1.GameMap.TheSkeld]; i++) {
                const open = reader.bool();
                this.doors.push(new AutoOpenDoor_1.AutoOpenDoor(this, i, open));
            }
        }
        else {
            const mask = reader.upacked();
            for (let i = 0; i < data_1.MapDoors[constant_1.GameMap.TheSkeld]; i++) {
                if (mask & (1 << i)) {
                    const isOpen = reader.bool();
                    if (isOpen) {
                        this.openDoor(i);
                    }
                    else {
                        this.closeDoor(i);
                    }
                }
            }
        }
    }
    Serialize(writer, spawn) {
        if (spawn) {
            for (let i = 0; i < this.doors.length; i++) {
                this.doors[i].Serialize(writer, spawn);
            }
        }
        else {
            writer.upacked(this.dirtyBit);
            for (let i = 0; i < this.doors.length; i++) {
                if (this.dirtyBit & (1 << i)) {
                    this.doors[i].Serialize(writer, spawn);
                }
            }
        }
        this.dirtyBit = 0;
    }
    async _openDoor(doorId, player, rpc) {
        const door = this.doors[doorId];
        if (!door)
            return;
        door.isOpen = true;
        this.dirtyBit |= 1 << doorId;
        this.dirty = true;
        const ev = await door.emit(new events_1.DoorsDoorOpenEvent(this.room, this, rpc, player, door));
        if (ev.reverted) {
            door.isOpen = false;
            return;
        }
        if (ev.alteredDoor !== door) {
            door.isOpen = false;
            ev.alteredDoor.isOpen = true;
        }
    }
    async openDoor(doorId) {
        if (!this.room.me)
            return;
        await this._openDoor(doorId, this.room.me, undefined);
    }
    async _closeDoor(doorId, player, rpc) {
        const door = this.doors[doorId];
        if (!door)
            return;
        door.isOpen = false;
        door.timer = 10;
        this.dirtyBit |= 1 << doorId;
        this.dirty = true;
        const ev = await door.emit(new events_1.DoorsDoorCloseEvent(this.room, this, rpc, player, door));
        if (ev.reverted) {
            door.isOpen = true;
            return;
        }
        if (ev.alteredDoor !== door) {
            door.isOpen = true;
            ev.alteredDoor.isOpen = false;
        }
    }
    async closeDoor(doorId) {
        if (!this.room.me)
            return;
        this._closeDoor(doorId, this.room.me, undefined);
    }
    async HandleRepair(player, amount, rpc) {
        const doorId = amount & 0x1f;
        await this._openDoor(doorId, player, rpc);
    }
    Detoriorate(delta) {
        for (const door of this.doors) {
            if (!door.isOpen && door.DoUpdate(delta)) {
                this.dirty = true;
            }
        }
    }
}
exports.AutoDoorsSystem = AutoDoorsSystem;
AutoDoorsSystem.systemType = constant_1.SystemType.Doors;
//# sourceMappingURL=AutoDoorsSystem.js.map

/***/ }),

/***/ 3769:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeconSystem = exports.DeconState = void 0;
const constant_1 = __webpack_require__(492);
const SystemStatus_1 = __webpack_require__(6775);
exports.DeconState = {
    Enter: 0x1,
    Closed: 0x2,
    Exit: 0x4,
    HeadingUp: 0x8,
};
/**
 * Represents a system responsible for the decontamination doors.
 *
 * See {@link DeconSystemEvents} for events to listen to.
 */
class DeconSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        var _a;
        super(ship, data);
        this.systemType = constant_1.SystemType.Decontamination;
        (_a = this.timer) !== null && _a !== void 0 ? _a : (this.timer = 10000);
        this.state || (this.state = 0);
    }
    Deserialize(reader, spawn) {
        if (!spawn) {
            this.timer = reader.byte();
            this.state = reader.byte();
        }
    }
    Serialize(writer, spawn) {
        if (!spawn) {
            writer.byte(this.timer);
            writer.byte(this.state);
        }
    }
}
exports.DeconSystem = DeconSystem;
DeconSystem.systemType = constant_1.SystemType.Decontamination;
//# sourceMappingURL=DeconSystem.js.map

/***/ }),

/***/ 6551:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DoorsSystem = void 0;
const constant_1 = __webpack_require__(492);
const SystemStatus_1 = __webpack_require__(6775);
const Door_1 = __webpack_require__(3505);
const events_1 = __webpack_require__(9256);
/**
 * Represents a system for doors that must be manually opened.
 *
 * See {@link DoorsSystemEvents} for events to listen to.
 */
class DoorsSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        super(ship, data);
        this.systemType = constant_1.SystemType.Doors;
        this.cooldowns || (this.cooldowns = new Map);
        this.doors || (this.doors = []);
        this.doors = this.doors.map((door, i) => typeof door === "boolean"
            ? new Door_1.Door(this, i, door)
            : door);
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn) {
        const num_cooldown = reader.upacked();
        for (let i = 0; i < num_cooldown; i++) {
            const doorId = reader.uint8();
            const cooldown = reader.float();
            this.cooldowns.set(doorId, cooldown);
        }
        for (const door of this.doors) {
            door.Deserialize(reader, false);
            if (door.isOpen) {
                this._openDoor(door.id, undefined, undefined);
            }
            else {
                this._closeDoor(door.id, undefined, undefined);
            }
        }
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn) {
        writer.upacked(this.cooldowns.size);
        for (const [doorId, cooldown] of this.cooldowns) {
            writer.uint8(doorId);
            writer.float(cooldown);
        }
        for (const door of this.doors) {
            writer.bool(door.isOpen);
        }
    }
    async _openDoor(doorId, player, rpc) {
        const door = this.doors[doorId];
        if (!door)
            return;
        door.isOpen = true;
        this.dirty = true;
        const ev = await door.emit(new events_1.DoorsDoorOpenEvent(this.room, this, rpc, player, door));
        if (ev.reverted) {
            door.isOpen = false;
            return;
        }
        if (ev.alteredDoor !== door) {
            door.isOpen = false;
            ev.alteredDoor.isOpen = true;
        }
    }
    async openDoor(doorId) {
        if (!this.room.me)
            return;
        await this._openDoor(doorId, this.room.me, undefined);
    }
    async _closeDoor(doorId, player, rpc) {
        const door = this.doors[doorId];
        if (!door)
            return;
        door.isOpen = false;
        this.dirty = true;
        const ev = await door.emit(new events_1.DoorsDoorCloseEvent(this.room, this, rpc, player, door));
        if (ev.reverted) {
            door.isOpen = true;
            return;
        }
        if (ev.alteredDoor !== door) {
            door.isOpen = true;
            ev.alteredDoor.isOpen = false;
        }
    }
    async closeDoor(doorId) {
        if (!this.room.me)
            return;
        this._closeDoor(doorId, this.room.me, undefined);
    }
    async HandleRepair(player, amount, rpc) {
        const doorId = amount & 0x1f;
        await this._openDoor(doorId, player, rpc);
    }
}
exports.DoorsSystem = DoorsSystem;
DoorsSystem.systemType = constant_1.SystemType.Doors;
//# sourceMappingURL=DoorsSystem.js.map

/***/ }),

/***/ 2508:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ElectricalDoorsSystem = void 0;
const constant_1 = __webpack_require__(492);
const SystemStatus_1 = __webpack_require__(6775);
const Door_1 = __webpack_require__(3505);
const events_1 = __webpack_require__(9256);
/**
 * Represents a system for doors that must be manually opened.
 *
 * See {@link ElectricalDoorsSystemEvents} for events to listen to.
 */
class ElectricalDoorsSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        super(ship, data);
        this.systemType = constant_1.SystemType.Decontamination;
        this.doors || (this.doors = []);
        this.doors = this.doors.map((door, i) => typeof door === "boolean"
            ? new Door_1.Door(this, i, door)
            : door);
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn) {
        const dirtyBit = reader.uint32();
        for (let i = 0; i < this.doors.length; i++) {
            this.doors[i].isOpen = (dirtyBit & (1 << i)) > 0;
        }
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn) {
        let dirtyBit = 0;
        for (let i = 0; i < this.doors.length; i++) {
            dirtyBit |= this.doors[i].isOpen << i;
        }
        writer.uint32(dirtyBit);
        this.dirty = spawn;
    }
    async _openDoor(doorId, player, rpc) {
        const door = this.doors[doorId];
        if (!door)
            return;
        door.isOpen = true;
        this.dirty = true;
        const ev = await door.emit(new events_1.DoorsDoorOpenEvent(this.room, this, rpc, player, door));
        if (ev.reverted) {
            door.isOpen = false;
            return;
        }
        if (ev.alteredDoor !== door) {
            door.isOpen = false;
            ev.alteredDoor.isOpen = true;
        }
    }
    async openDoor(doorId) {
        if (!this.room.me)
            return;
        await this._openDoor(doorId, this.room.me, undefined);
    }
    async _closeDoor(doorId, player, rpc) {
        const door = this.doors[doorId];
        if (!door)
            return;
        door.isOpen = false;
        this.dirty = true;
        const ev = await door.emit(new events_1.DoorsDoorCloseEvent(this.room, this, rpc, player, door));
        if (ev.reverted) {
            door.isOpen = true;
            return;
        }
        if (ev.alteredDoor !== door) {
            door.isOpen = true;
            ev.alteredDoor.isOpen = false;
        }
    }
    async closeDoor(doorId) {
        if (!this.room.me)
            return;
        this._closeDoor(doorId, this.room.me, undefined);
    }
    async HandleRepair(player, amount, rpc) {
        const doorId = amount & 0x1f;
        await this._openDoor(doorId, player, rpc);
    }
}
exports.ElectricalDoorsSystem = ElectricalDoorsSystem;
ElectricalDoorsSystem.systemType = constant_1.SystemType.Decontamination;
//# sourceMappingURL=ElectricalDoorsSystem.js.map

/***/ }),

/***/ 5803:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HqHudSystem = exports.HqHudSystemRepairTag = void 0;
const constant_1 = __webpack_require__(492);
const SystemStatus_1 = __webpack_require__(6775);
const events_1 = __webpack_require__(9256);
exports.HqHudSystemRepairTag = {
    CompleteConsole: 0x10,
    CloseConsole: 0x20,
    OpenConsole: 0x40,
    Sabotage: 0x80,
};
/**
 * Represents a system responsible for handling communication consoles on Mira HQ.
 *
 * See {@link HqHudSystemEvents} for events to listen to.
 */
class HqHudSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        var _a;
        super(ship, data);
        this.systemType = constant_1.SystemType.Communications;
        (_a = this.timer) !== null && _a !== void 0 ? _a : (this.timer = 10000);
        this.active || (this.active = []);
        this.completed || (this.completed = new Set);
    }
    get sabotaged() {
        return this.completed.size < 2;
    }
    _getIdx(consoleId, playerId) {
        return this.active.findIndex((pair) => pair.consoleid === consoleId && pair.playerid === playerId);
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn) {
        const num_active = reader.upacked();
        const before_active = this.active;
        this.active = [];
        for (let i = 0; i < num_active; i++) {
            const playerId = reader.uint8();
            const consoleId = reader.uint8();
            const player = this.ship.room.getPlayerByPlayerId(playerId);
            if (player) {
                this._openConsole(consoleId, player, undefined);
            }
        }
        for (let i = 0; i < before_active.length; i++) {
            const console = before_active[i];
            const idx = this._getIdx(console.consoleid, console.playerid);
            const player = this.ship.room.getPlayerByPlayerId(console.playerid);
            if (player && idx === -1) {
                this._closeConsole(console.consoleid, player, undefined);
            }
        }
        const before_completed = this.completed.size;
        const num_completed = reader.upacked();
        for (let i = 0; i < num_completed; i++) {
            this._completeConsole(reader.uint8(), undefined, undefined);
        }
        if (before_completed === 2 && num_completed === 0) {
            this.emit(new events_1.SystemSabotageEvent(this.room, this, undefined, undefined));
        }
        if (before_completed < 2 && num_completed === 2) {
            this.emit(new events_1.SystemRepairEvent(this.room, this, undefined, undefined));
        }
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn) {
        writer.upacked(this.active.length);
        for (let i = 0; i < this.active.length; i++) {
            const active = this.active[i];
            writer.uint8(active.playerid);
            writer.uint8(active.consoleid);
        }
        const completed = [...this.completed];
        writer.upacked(completed.length);
        for (let i = 0; i < completed.length; i++) {
            writer.uint8(completed[i]);
        }
    }
    async HandleSabotage(player, rpc) {
        const oldTimer = this.timer;
        const oldActive = this.active;
        const oldCompleted = this.completed;
        this.timer = -1;
        this.active = [];
        this.completed = new Set;
        this.dirty = true;
        const ev = await this.emit(new events_1.SystemSabotageEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.timer = oldTimer;
            this.active = oldActive;
            this.completed = oldCompleted;
        }
    }
    async _resetConsoles(player, rpc) {
        const oldCompleted = this.completed;
        this.completed = new Set;
        this.dirty = true;
        const ev = await this.emit(new events_1.HqHudConsolesResetEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.completed = oldCompleted;
        }
    }
    async _openConsole(consoleid, player, rpc) {
        if (player.playerId === undefined)
            return;
        const idx = this._getIdx(consoleid, player.playerId);
        if (idx === -1) {
            const consoleEntry = { consoleid, playerid: player.playerId };
            this.active.push(consoleEntry);
            this.dirty = true;
            const ev = await this.emit(new events_1.HqHudConsoleOpenEvent(this.room, this, rpc, player, consoleid));
            if (ev.reverted) {
                const newIdx = this.active.indexOf(consoleEntry);
                if (newIdx > -1)
                    this.active.splice(newIdx, 1);
                return;
            }
            if (ev.alteredConsoleId !== consoleid) {
                consoleEntry.consoleid = ev.alteredConsoleId;
            }
        }
    }
    /**
     * Mark the console as being used by your player.
     * @param consoleId The ID of the console to mark as being used.
     */
    async openConsole(consoleId) {
        if (!this.room.me)
            return;
        this._openConsole(consoleId, this.room.me, undefined);
    }
    async _closeConsole(consoleid, player, rpc) {
        if (player.playerId === undefined)
            return;
        const idx = this._getIdx(consoleid, player.playerId);
        if (idx > -1) {
            const consoleEntry = this.active[idx];
            this.active.splice(idx, 1);
            this.dirty = true;
            const ev = await this.emit(new events_1.HqHudConsoleCloseEvent(this.room, this, rpc, player, consoleid));
            if (ev.reverted) {
                this.active.splice(idx, 0, consoleEntry);
            }
        }
    }
    /**
     * Mark the console as no longer being used by your player.
     * @param consoleId The ID of the console to mark as not being used.
     */
    async closeConsole(consoleId) {
        if (!this.room.me)
            return;
        await this._closeConsole(consoleId, this.room.me, undefined);
    }
    async _completeConsole(consoleid, player, rpc) {
        if (!this.completed.has(consoleid)) {
            this.completed.add(consoleid);
            this.dirty = true;
            const ev = await this.emit(new events_1.HqHudConsoleCompleteEvent(this.room, this, rpc, player, consoleid));
            if (ev.reverted) {
                this.completed.delete(consoleid);
            }
        }
    }
    /**
     * Mark a console as completed.
     * @param consoleId The ID of the console to mark as completed.
     */
    async completeConsole(consoleId) {
        if (!this.ship.room.me)
            return;
        await this._completeConsole(consoleId, this.room.me, undefined);
    }
    async _repair(player, rpc) {
        const completedBefore = this.completed;
        this.completed = new Set([0, 1]);
        this.dirty = true;
        const ev = await this.emit(new events_1.SystemRepairEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.completed = completedBefore;
        }
    }
    async repair() {
        if (!this.room.me)
            return;
        if (this.room.amhost) {
            await this._repair(this.room.me, undefined);
        }
        else {
            await this.completeConsole(0);
            await this.completeConsole(1);
        }
    }
    async HandleRepair(player, amount, rpc) {
        const consoleId = amount & 0xf;
        const tags = amount & 0xf0;
        switch (tags) {
            case exports.HqHudSystemRepairTag.CompleteConsole:
                await this._completeConsole(consoleId, player, rpc);
                if (this.completed.size >= 2) {
                    await this._repair(player, rpc);
                }
                break;
            case exports.HqHudSystemRepairTag.CloseConsole:
                await this._closeConsole(consoleId, player, rpc);
                break;
            case exports.HqHudSystemRepairTag.OpenConsole:
                await this._openConsole(consoleId, player, rpc);
                break;
            case exports.HqHudSystemRepairTag.Sabotage:
                await this.HandleSabotage(player, rpc);
                break;
        }
    }
    Detoriorate(delta) {
        this.timer -= delta;
        if (this.timer < 0) {
            this.timer = 10;
            this.dirty = true;
            this._resetConsoles(undefined, undefined);
        }
    }
}
exports.HqHudSystem = HqHudSystem;
HqHudSystem.systemType = constant_1.SystemType.Communications;
//# sourceMappingURL=HqHudSystem.js.map

/***/ }),

/***/ 1324:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HudOverrideSystem = void 0;
const constant_1 = __webpack_require__(492);
const SystemStatus_1 = __webpack_require__(6775);
const events_1 = __webpack_require__(9256);
/**
 * Represents a system responsible for handling communication sabotages on The Skeld and Polus.
 *
 * See {@link HudOverrideSystemEvents} for events to listen to.
 */
class HudOverrideSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        super(ship, data);
        this.systemType = constant_1.SystemType.Communications;
        this._sabotaged = false;
    }
    /**
     * Whether or not communications is sabotaged.
     */
    get sabotaged() {
        return this._sabotaged;
    }
    patch(data) {
        this._sabotaged = data.sabotaged;
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn) {
        const before = this.sabotaged;
        this._sabotaged = reader.bool();
        if (!before && this._sabotaged)
            this.emit(new events_1.SystemSabotageEvent(this.room, this, undefined, undefined)).then(ev => {
                if (ev.reverted) {
                    this.repair();
                }
            });
        if (before && !this._sabotaged)
            this.emit(new events_1.SystemRepairEvent(this.room, this, undefined, undefined)).then(ev => {
                if (ev.reverted) {
                    this.sabotage();
                }
            });
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn) {
        writer.bool(this.sabotaged);
    }
    async HandleSabotage(player, rpc) {
        this._sabotaged = true;
        this.dirty = true;
        const ev = await this.emit(new events_1.SystemSabotageEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this._sabotaged = false;
        }
    }
    async _repair(player, rpc) {
        this._sabotaged = false;
        this.dirty = true;
        const ev = await this.emit(new events_1.SystemRepairEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this._sabotaged = true;
        }
    }
    async repair() {
        if (!this.room.me)
            return;
        await this._repair(this.room.me, undefined);
    }
    async HandleRepair(player, amount, rpc) {
        if (amount === 0) {
            await this._repair(player, rpc);
        }
    }
}
exports.HudOverrideSystem = HudOverrideSystem;
HudOverrideSystem.systemType = constant_1.SystemType.Communications;
//# sourceMappingURL=HudOverrideSystem.js.map

/***/ }),

/***/ 6360:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LifeSuppSystem = void 0;
const constant_1 = __webpack_require__(492);
const SystemStatus_1 = __webpack_require__(6775);
const events_1 = __webpack_require__(9256);
/**
 * Represents a system responsible for handling oxygen consoles.
 *
 * See {@link LifeSuppSystemEvents} for events to listen to.
 */
class LifeSuppSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        var _a;
        super(ship, data);
        this.systemType = constant_1.SystemType.O2;
        this.lastUpdate = 0;
        (_a = this.timer) !== null && _a !== void 0 ? _a : (this.timer = 10000);
        this.completed || (this.completed = new Set);
    }
    get sabotaged() {
        return this.timer < 10000;
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn) {
        const timer = this.timer;
        this.timer = reader.float();
        const num_consoles = reader.upacked();
        if (this.completed.size > 0 && num_consoles === 0) {
            this._clearConsoles(undefined, undefined);
        }
        else {
            for (let i = 0; i < num_consoles; i++) {
                const consoleId = reader.upacked();
                this._completeConsole(consoleId, undefined, undefined);
            }
        }
        if (timer === 10000 && this.timer < 10000) {
            this.emit(new events_1.SystemSabotageEvent(this.room, this, undefined, undefined));
        }
        else if (timer < 10000 && this.timer === 10000) {
            this.emit(new events_1.SystemRepairEvent(this.room, this, undefined, undefined));
        }
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn) {
        writer.float(this.timer);
        writer.upacked(this.completed.size);
        for (const console of this.completed) {
            writer.upacked(console);
        }
    }
    async HandleSabotage(player, rpc) {
        this.timer = 45;
        const oldCompleted = this.completed;
        this._clearConsoles(player, rpc);
        const ev = await this.emit(new events_1.SystemSabotageEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.timer = 10000;
            this.completed = oldCompleted;
        }
    }
    async _clearConsoles(player, rpc) {
        const completedBefore = new Set(this.completed);
        this.completed = new Set;
        this.dirty = true;
        const ev = await this.emit(new events_1.O2ConsolesClearEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.completed = completedBefore;
        }
    }
    async clearConsoles() {
        if (!this.room.me)
            return;
        await this._clearConsoles(this.room.me, undefined);
    }
    async _completeConsole(consoleid, player, rpc) {
        this.completed.add(consoleid);
        this.dirty = true;
        const ev = await this.emit(new events_1.O2ConsoleCompleteEvent(this.room, this, undefined, player, consoleid));
        if (ev.reverted) {
            return this.completed.delete(ev.consoleId);
        }
        if (ev.alteredConsoleId !== consoleid) {
            this.completed.delete(consoleid);
            this.completed.add(ev.alteredConsoleId);
        }
    }
    /**
     * Mark a console as being complete.
     * @param consoleId The ID of the console to mark as complete.
     */
    async completeConsole(consoleid) {
        if (!this.room.me)
            return;
        await this._completeConsole(consoleid, this.room.me, undefined);
    }
    async _repair(player, rpc) {
        const oldTimer = this.timer;
        const oldCompleted = this.completed;
        this.timer = 10000;
        this.completed = new Set;
        this.dirty = true;
        const ev = await this.emit(new events_1.O2ConsolesResetEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.timer = oldTimer;
            this.completed = oldCompleted;
        }
    }
    async repair() {
        if (!this.room.me)
            return;
        this._repair(this.room.me, undefined);
    }
    async HandleRepair(player, amount, rpc) {
        const consoleId = amount & 0x3;
        if (amount & 0x40) {
            await this._completeConsole(consoleId, player, rpc);
            if (this.completed.size >= 2) {
                await this._repair(player, rpc);
            }
        }
        else if (amount & 0x10) {
            await this._repair(player, rpc);
        }
    }
    Detoriorate(delta) {
        if (!this.sabotaged)
            return;
        this.timer -= delta;
        this.lastUpdate += delta;
        if (this.lastUpdate > 2) {
            this.lastUpdate = 0;
            this.dirty = true;
        }
    }
}
exports.LifeSuppSystem = LifeSuppSystem;
LifeSuppSystem.systemType = constant_1.SystemType.O2;
//# sourceMappingURL=LifeSuppSystem.js.map

/***/ }),

/***/ 3997:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MedScanSystem = void 0;
const constant_1 = __webpack_require__(492);
const SystemStatus_1 = __webpack_require__(6775);
const events_1 = __webpack_require__(9256);
/**
 * Represents a system responsible for handling the medbay scan queue.
 *
 * See {@link MedScanSystemEvents} for events to listen to.
 */
class MedScanSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        super(ship, data);
        this.systemType = constant_1.SystemType.MedBay;
        this.queue || (this.queue = []);
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn) {
        const num_players = reader.upacked();
        this.queue = [];
        for (let i = 0; i < num_players; i++) {
            const player = this.ship.room.getPlayerByPlayerId(reader.uint8());
            if (player)
                this.queue.push(player);
        }
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn) {
        writer.upacked(this.queue.length);
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].playerId)
                writer.uint8(this.queue[i].playerId);
        }
    }
    _removeFromQueue(player) {
        const idx = this.queue.indexOf(player);
        if (~idx) {
            this.queue.splice(idx, 1);
        }
    }
    async _joinQueue(player, rpc) {
        this._removeFromQueue(player);
        this.queue.push(player);
        const ev = await this.emit(new events_1.MedScanJoinQueueEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this._removeFromQueue(player);
        }
    }
    async addToQueue(player) {
        await this._joinQueue(player, undefined);
    }
    async joinQueue() {
        if (!this.room.me)
            return;
        await this.addToQueue(this.room.me);
    }
    async _leaveQueue(player, rpc) {
        this._removeFromQueue(player);
        const ev = await this.emit(new events_1.MedScanLeaveQueueEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.queue.push(player);
        }
    }
    async removeFromQueue(player) {
        await this._leaveQueue(player, undefined);
    }
    async leaveQueue() {
        if (!this.room.me)
            return;
        await this.removeFromQueue(this.room.me);
    }
    async HandleRepair(player, amount, rpc) {
        const playerId = amount & 0x1f;
        const resolved = this.ship.room.getPlayerByPlayerId(playerId);
        if (resolved) {
            if (amount & 0x80) {
                await this._joinQueue(resolved, rpc);
            }
            else if (amount & 0x40) {
                await this._leaveQueue(resolved, rpc);
            }
        }
    }
}
exports.MedScanSystem = MedScanSystem;
MedScanSystem.systemType = constant_1.SystemType.MedBay;
//# sourceMappingURL=MedScanSystem.js.map

/***/ }),

/***/ 7968:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MovingPlatformSystem = exports.MovingPlatformSide = void 0;
const constant_1 = __webpack_require__(492);
const protocol_1 = __webpack_require__(2602);
const SystemStatus_1 = __webpack_require__(6775);
const net_1 = __webpack_require__(2031);
const events_1 = __webpack_require__(9256);
var MovingPlatformSide;
(function (MovingPlatformSide) {
    MovingPlatformSide[MovingPlatformSide["Right"] = 0] = "Right";
    MovingPlatformSide[MovingPlatformSide["Left"] = 1] = "Left";
})(MovingPlatformSide = exports.MovingPlatformSide || (exports.MovingPlatformSide = {}));
/**
 * Represents a system for doors that must be manually opened.
 *
 * See {@link MovingPlatformSystemEvents} for events to listen to.
 */
class MovingPlatformSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        super(ship, data);
        this.systemType = constant_1.SystemType.Decontamination;
        this.useId || (this.useId = 0);
        this.target || (this.target = undefined);
        this.side || (this.side = MovingPlatformSide.Right);
    }
    get oppositeSide() {
        return this.side === MovingPlatformSide.Left
            ? MovingPlatformSide.Right
            : MovingPlatformSide.Left;
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn) {
        if (spawn) {
            this.useId = reader.uint8();
            const targetId = reader.uint8();
            this._setTarget(reader.uint8(), targetId === 255
                ? undefined
                : this.ship.room.getPlayerByNetId(targetId), undefined);
        }
        else {
            const newSid = reader.uint8();
            if (net_1.NetworkUtils.seqIdGreaterThan(newSid, this.useId, 1)) {
                this.useId = newSid;
                const targetId = reader.uint8();
                this._setTarget(reader.uint8(), targetId === 255
                    ? undefined
                    : this.ship.room.getPlayerByNetId(targetId), undefined);
            }
        }
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn) {
        var _a, _b, _c;
        this.useId++;
        if (this.useId > 255)
            this.useId = 0;
        writer.uint8(this.useId);
        writer.uint8((_c = (_b = (_a = this.target) === null || _a === void 0 ? void 0 : _a.control) === null || _b === void 0 ? void 0 : _b.netid) !== null && _c !== void 0 ? _c : 255);
        writer.uint8(this.side);
        this.dirty = spawn;
    }
    async _setTarget(side, player, rpc) {
        const oldTarget = player;
        const oldSide = this.side;
        this.target = player;
        this.side = side;
        this.dirty = true;
        const ev = await this.emit(new events_1.MovingPlatformPlayerUpdateEvent(this.room, this, rpc, player, side));
        if (ev.reverted) {
            this.target = oldTarget;
            this.side = oldSide;
            return;
        }
        this.target = ev.alteredPlayer;
        this.side = ev.alteredSide;
    }
    async setTarget(player, side) {
        var _a;
        const resolved = this.ship.room.resolvePlayer(player);
        if (!resolved)
            return;
        if (this.target === resolved)
            return;
        if (this.side === side)
            return;
        const oldTarget = this.target;
        const oldSide = this.side;
        await this._setTarget(side, oldTarget, undefined);
        if (this.target !== oldTarget || this.side !== oldSide) {
            if ((_a = this.target) === null || _a === void 0 ? void 0 : _a.control) {
                this.ship.room.stream.push(new protocol_1.RpcMessage(this.target.control.netid, new protocol_1.UsePlatformMessage()));
            }
        }
    }
    async getOn() {
        if (!this.room.me)
            return;
        await this.setTarget(this.room.me, this.oppositeSide);
    }
}
exports.MovingPlatformSystem = MovingPlatformSystem;
MovingPlatformSystem.systemType = constant_1.SystemType.Decontamination;
//# sourceMappingURL=MovingPlatformSystem.js.map

/***/ }),

/***/ 1927:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReactorSystem = void 0;
const constant_1 = __webpack_require__(492);
const SystemStatus_1 = __webpack_require__(6775);
const events_1 = __webpack_require__(9256);
/**
 * Represents a system responsible for handling reactor consoles.
 *
 * See {@link ReactorSystemEvents} for events to listen to.
 */
class ReactorSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        var _a;
        super(ship, data);
        this.systemType = constant_1.SystemType.Reactor;
        this._lastUpdate = 0;
        (_a = this.timer) !== null && _a !== void 0 ? _a : (this.timer = 10000);
        this.completed || (this.completed = new Set);
    }
    get sabotaged() {
        return this.timer < 10000;
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn) {
        this.timer = reader.float();
        const num_consoles = reader.upacked();
        this.completed.clear();
        for (let i = 0; i < num_consoles; i++) {
            this.completed.add(reader.upacked());
        }
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn) {
        writer.float(this.timer);
        const completed = [...this.completed];
        writer.upacked(completed.length);
        for (let i = 0; i < completed.length; i++) {
            writer.upacked(completed[i]);
        }
    }
    async _addConsole(player, consoleid, rpc) {
        this.completed.add(consoleid);
        this.dirty = true;
        const ev = await this.emit(new events_1.ReactorConsoleAddEvent(this.room, this, undefined, player, consoleid));
        if (ev.reverted) {
            return this.completed.delete(ev.consoleId);
        }
        if (ev.alteredConsoleId !== consoleid) {
            this.completed.delete(consoleid);
            this.completed.add(ev.alteredConsoleId);
        }
    }
    async addConsole(consoleId) {
        if (!this.room.me)
            return;
        await this._addConsole(this.room.me, consoleId, undefined);
    }
    async _removeConsole(player, consoleid, rpc) {
        this.completed.delete(consoleid);
        this.dirty = true;
        const ev = await this.emit(new events_1.ReactorConsoleRemoveEvent(this.room, this, undefined, player, consoleid));
        if (ev.reverted) {
            return this.completed.add(ev.consoleId);
        }
        if (ev.alteredConsoleId !== consoleid) {
            this.completed.add(consoleid);
            this.completed.delete(ev.alteredConsoleId);
        }
    }
    async removeConsole(consoleId) {
        if (!this.room.me)
            return;
        await this._removeConsole(this.room.me, consoleId, undefined);
    }
    async _repair(player, rpc) {
        const oldTimer = this.timer;
        const oldCompleted = this.completed;
        this.timer = 10000;
        this.completed = new Set;
        this.dirty = true;
        const ev = await this.emit(new events_1.ReactorConsolesResetEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.timer = oldTimer;
            this.completed = oldCompleted;
        }
    }
    async repair() {
        if (!this.room.me)
            return;
        await this._repair(this.room.me, undefined);
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    async HandleRepair(player, amount, rpc) {
        const consoleId = amount & 0x3;
        if (amount & 0x40) {
            await this._addConsole(player, consoleId, rpc);
        }
        else if (amount & 0x20) {
            await this._removeConsole(player, consoleId, rpc);
        }
        else if (amount & 0x1) {
            await this._repair(player, rpc);
        }
        this.dirty = true;
    }
    Detoriorate(delta) {
        if (!this.sabotaged)
            return;
        this.timer -= delta;
        this._lastUpdate += delta;
        if (this._lastUpdate > 2) {
            this._lastUpdate = 0;
            this.dirty = true;
        }
    }
}
exports.ReactorSystem = ReactorSystem;
ReactorSystem.systemType = constant_1.SystemType.Reactor;
//# sourceMappingURL=ReactorSystem.js.map

/***/ }),

/***/ 5680:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SabotageSystem = void 0;
const constant_1 = __webpack_require__(492);
const SystemStatus_1 = __webpack_require__(6775);
/**
 * Represents a system responsible for handling system sabotages.
 *
 * See {@link SabotageSystemEvents} for events to listen to.
 */
class SabotageSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        var _a;
        super(ship, data);
        this.systemType = constant_1.SystemType.Sabotage;
        (_a = this.cooldown) !== null && _a !== void 0 ? _a : (this.cooldown = 10000);
    }
    get anySabotaged() {
        return Object.values(this.ship.systems).some(system => system === null || system === void 0 ? void 0 : system.sabotaged);
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn) {
        this.cooldown = reader.float();
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn) {
        writer.float(this.cooldown);
    }
    async HandleRepair(player, amount, rpc) {
        const system = this.ship.systems[amount];
        if (system) {
            await system.HandleSabotage(player, rpc);
            this.cooldown = 30;
            this.dirty = true;
        }
    }
    Detoriorate(delta) {
        if (this.cooldown > 0 && !this.anySabotaged) {
            this.cooldown -= delta;
            if (this.cooldown <= 0) {
                this.dirty = true;
            }
        }
    }
}
exports.SabotageSystem = SabotageSystem;
SabotageSystem.systemType = constant_1.SystemType.Sabotage;
//# sourceMappingURL=SabotageSystem.js.map

/***/ }),

/***/ 195:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SecurityCameraSystem = void 0;
const constant_1 = __webpack_require__(492);
const SystemStatus_1 = __webpack_require__(6775);
const events_1 = __webpack_require__(9256);
/**
 * Represents a system responsible for handling players entering and leaving security cameras.
 *
 * See {@link SecurityCameraSystemEvents} for events to listen to.
 */
class SecurityCameraSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        super(ship, data);
        this.systemType = constant_1.SystemType.Security;
        this.players || (this.players = new Set);
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader, spawn) {
        const num_players = reader.upacked();
        const before = new Set([...this.players]);
        this.players.clear();
        for (let i = 0; i < num_players; i++) {
            const player = this.ship.room.getPlayerByPlayerId(reader.uint8());
            if (player && !before.has(player)) {
                this._addPlayer(player, undefined);
            }
        }
        for (const player of before) {
            if (!this.players.has(player)) {
                this._removePlayer(player, undefined);
            }
        }
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer, spawn) {
        const players = [...this.players];
        writer.upacked(players.length);
        for (let i = 0; i < players.length; i++) {
            if (players[i].playerId)
                writer.uint8(players[i].playerId);
        }
    }
    async _addPlayer(player, rpc) {
        this.players.add(player);
        this.dirty = true;
        const ev = await this.emit(new events_1.SecurityCameraJoinEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.players.delete(player);
        }
    }
    /**
     * Add a player to the security cameras.
     * @param player The player to add.
     * @example
     *```typescript
     * security.addPlayer(client.me);
     * ```
     */
    async addPlayer(player) {
        await this._addPlayer(player, undefined);
    }
    async join() {
        if (!this.room.me)
            return;
        await this.addPlayer(this.room.me);
    }
    async _removePlayer(player, rpc) {
        this.players.delete(player);
        this.dirty = true;
        const ev = await this.emit(new events_1.SecurityCameraLeaveEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.players.add(player);
        }
    }
    /**
     * Remove a player from the security cameras.
     * @param player The player to remove.
     * @example
     *```typescript
     * security.removePlayer(client.me);
     * ```
     */
    async removePlayer(player) {
        await this._removePlayer(player, undefined);
    }
    async leave() {
        if (!this.room.me)
            return;
        await this.removePlayer(this.room.me);
    }
    async HandleRepair(player, amount, rpc) {
        if (amount === 1) {
            await this._addPlayer(player, rpc);
        }
        else {
            await this._removePlayer(player, rpc);
        }
    }
}
exports.SecurityCameraSystem = SecurityCameraSystem;
SecurityCameraSystem.systemType = constant_1.SystemType.Security;
//# sourceMappingURL=SecurityCameraSystem.js.map

/***/ }),

/***/ 9409:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SwitchSystem = void 0;
const constant_1 = __webpack_require__(492);
const SystemStatus_1 = __webpack_require__(6775);
const events_1 = __webpack_require__(9256);
/**
 * Represents a system responsible for handling switches in Electrical.
 *
 * See {@link SwitchSystemEvents} for events to listen to.
 */
class SwitchSystem extends SystemStatus_1.SystemStatus {
    constructor(ship, data) {
        var _a;
        super(ship, data);
        this.systemType = constant_1.SystemType.Electrical;
        this.expected || (this.expected = [false, false, false, false, false]);
        this.actual || (this.actual = [false, false, false, false, false]);
        (_a = this.brightness) !== null && _a !== void 0 ? _a : (this.brightness = 100);
    }
    get sabotaged() {
        return this.actual[0] !== this.expected[0]
            || this.actual[1] !== this.expected[1]
            || this.actual[2] !== this.expected[2]
            || this.actual[3] !== this.expected[3]
            || this.actual[4] !== this.expected[4];
    }
    Deserialize(reader, spawn) {
        const before = this.sabotaged;
        this.expected = SwitchSystem.readSwitches(reader.byte());
        this.actual = SwitchSystem.readSwitches(reader.byte());
        if (!before && this.sabotaged) {
            this.emit(new events_1.SystemSabotageEvent(this.room, this, undefined, undefined));
        }
        if (before && !this.sabotaged) {
            this.emit(new events_1.SystemRepairEvent(this.room, this, undefined, undefined));
        }
        this.brightness = reader.uint8();
    }
    Serialize(writer, spawn) {
        writer.byte(SwitchSystem.writeSwitches(this.expected));
        writer.byte(SwitchSystem.writeSwitches(this.actual));
        writer.uint8(this.brightness);
    }
    async HandleSabotage(player, rpc) {
        if (this.sabotaged)
            return;
        const oldActual = this.actual;
        const oldExpected = this.expected;
        while (!this.sabotaged) {
            this.actual = new Array(5).fill(false).map(f => Math.random() > 0.5);
            this.expected = new Array(5).fill(false).map(f => Math.random() > 0.5);
        }
        const ev = await this.emit(new events_1.SystemSabotageEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.actual = oldActual;
            this.expected = oldExpected;
        }
    }
    async HandleRepair(player, amount, rpc) {
        await this._setSwitch(amount, !this.actual[amount], player, rpc);
    }
    async _setSwitch(num, value, player, rpc) {
        if (this.actual[num] === value)
            return;
        const beforeFlipped = this.actual[num];
        this.actual[num] = value;
        this.dirty = true;
        const ev = await this.emit(new events_1.ElectricalSwitchFlipEvent(this.room, this, rpc, player, num, value));
        if (ev.reverted) {
            this.actual[num] = beforeFlipped;
            return;
        }
        if (ev.alteredFlipped !== value) {
            this.actual[num] = ev.alteredFlipped;
        }
        if (ev.alteredSwitchId !== num) {
            this.actual[num] = beforeFlipped;
            this.actual[ev.alteredSwitchId] = ev.alteredFlipped;
        }
    }
    /**
     * Set the value of a switch as flipped or not flipped
     * @param num The ID of the switch to flip.
     * @param value Whether the switch is flipped.
     * @example
     *```typescript
     * // Randomise each switch.
     * for (let i = 0; i < 5; i++) {
     *   electrical.setSwitch(i, Math.random() > 0.5);
     * }
     * ```
     */
    setSwitch(num, value) {
        if (this.actual[num] === value)
            return;
        this.flip(num);
    }
    /**
     * Invert the position of a switch.
     * @param num The ID of the switch to invert.
     * @example
     *```typescript
     * // Invert the position of each switch.
     * for (let i = 0; i < 5; i++) {
     *   electrical.flip(i);
     * }
     * ```
     */
    flip(num) {
        if (!this.room.me)
            return;
        this._setSwitch(num, !this.actual[num], this.room.me, undefined);
    }
    async _repair(player, rpc) {
        const oldActual = this.actual;
        this.actual = [...this.expected];
        const ev = await this.emit(new events_1.SystemRepairEvent(this.room, this, rpc, player));
        if (ev.reverted) {
            this.actual = oldActual;
        }
    }
    async repair() {
        if (!this.room.me)
            return;
        await this._repair(this.room.me, undefined);
    }
    /**
     * Read the value of each switch from a byte.
     * @param byte The byte to read from.
     * @returns An array of the value of each switch.
     * @example
     *```typescript
     * console.log(readSwitches(0x5));
     * // [ true, false, true, false, false ]
     * ```
     */
    static readSwitches(byte) {
        const vals = [false, false, false, false, false];
        vals[0] = !!(byte & 0x1);
        vals[1] = !!(byte & 0x2);
        vals[2] = !!(byte & 0x4);
        vals[3] = !!(byte & 0x8);
        vals[4] = !!(byte & 0x10);
        return vals;
    }
    /**
     * Write the value of each switch to a byte.
     * @param switches An array of the value of each switch.
     * @returns The byte representation of the switches.
     * @example
     *```typescript
     * console.log(writeSwitches([ false, true, false, false, true ]));
     * // 0x12 (18)
     * ```
     */
    static writeSwitches(switches) {
        return (~~switches[0] |
            (~~switches[1] << 1) |
            (~~switches[2] << 2) |
            (~~switches[3] << 3) |
            (~~switches[4] << 4));
    }
    Detoriorate() {
        if (this.sabotaged) {
            if (this.brightness > 0) {
                this.brightness -= 15;
                if (this.brightness < 0)
                    this.brightness = 0;
                this.dirty = true;
            }
        }
    }
}
exports.SwitchSystem = SwitchSystem;
SwitchSystem.systemType = constant_1.SystemType.Electrical;
//# sourceMappingURL=SwitchSystem.js.map

/***/ }),

/***/ 6775:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SystemStatus = void 0;
const util_1 = __webpack_require__(5131);
const events_1 = __webpack_require__(3418);
class SystemStatus extends events_1.EventEmitter {
    constructor(ship, data) {
        super();
        this.ship = ship;
        if (data) {
            if (data instanceof util_1.HazelReader) {
                this.Deserialize(data, true);
            }
            else {
                this.patch(data);
            }
        }
        this._dirty = false;
    }
    get dirty() {
        return this._dirty;
    }
    set dirty(isDirty) {
        this._dirty = isDirty;
        this.ship.dirtyBit = 1;
    }
    patch(data) {
        Object.assign(this, data);
    }
    /**
     * Whether or not this system is sabotaged.
     */
    get sabotaged() {
        return false;
    }
    /**
     * Return the room that this system belongs to.
     */
    get room() {
        return this.ship.room;
    }
    async emit(event) {
        if (this.ship) {
            this.ship.emit(event);
        }
        return super.emit(event);
    }
    Deserialize(reader, spawn) {
        void reader, spawn;
    }
    Serialize(writer, spawn) {
        void writer, spawn;
    }
    async HandleRepair(player, amount, rpc) {
        void player, amount, rpc;
    }
    Detoriorate(delta) {
        void delta;
    }
    async HandleSabotage(player, rpc) {
        void player, rpc;
    }
    async sabotage() { }
    async repair() { }
}
exports.SystemStatus = SystemStatus;
//# sourceMappingURL=SystemStatus.js.map

/***/ }),

/***/ 7735:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(106), exports);
__exportStar(__webpack_require__(3769), exports);
__exportStar(__webpack_require__(6551), exports);
__exportStar(__webpack_require__(2508), exports);
__exportStar(__webpack_require__(5803), exports);
__exportStar(__webpack_require__(1324), exports);
__exportStar(__webpack_require__(6360), exports);
__exportStar(__webpack_require__(3997), exports);
__exportStar(__webpack_require__(7968), exports);
__exportStar(__webpack_require__(1927), exports);
__exportStar(__webpack_require__(5680), exports);
__exportStar(__webpack_require__(195), exports);
__exportStar(__webpack_require__(9409), exports);
__exportStar(__webpack_require__(6775), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2031:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NetworkUtils = void 0;
class NetworkUtils {
    /**
     * Check whether a given sequence ID is greater than another.
     * @param newSid The new sequence ID.
     * @param oldSid The older sequence ID.
     */
    static seqIdGreaterThan(newSid, oldSid, bytes = 2) {
        if (typeof oldSid !== "number")
            return true;
        const threshold = 2 ** (bytes * 8 - 1);
        const num = oldSid + threshold;
        if (oldSid < num) {
            return newSid > oldSid && newSid <= num;
        }
        return newSid > oldSid || newSid <= num;
    }
}
exports.NetworkUtils = NetworkUtils;
//# sourceMappingURL=net.js.map

/***/ }),

/***/ 727:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(5964), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2888:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ColorCodes = void 0;
const constant_1 = __webpack_require__(492);
exports.ColorCodes = {
    [constant_1.Color.Red]: {
        hex: "#c61111",
        rgb: [198, 17, 17],
    },
    [constant_1.Color.Blue]: {
        hex: "#132ed2",
        rgb: [19, 46, 210],
    },
    [constant_1.Color.Green]: {
        hex: "#11802d",
        rgb: [17, 128, 45],
    },
    [constant_1.Color.Pink]: {
        hex: "#ee54bb",
        rgb: [238, 84, 187],
    },
    [constant_1.Color.Orange]: {
        hex: "#f07d0d",
        rgb: [240, 125, 13],
    },
    [constant_1.Color.Yellow]: {
        hex: "#f6f657",
        rgb: [246, 246, 87],
    },
    [constant_1.Color.Grey]: {
        hex: "#3f474e",
        rgb: [63, 71, 78],
    },
    [constant_1.Color.White]: {
        hex: "#d7e1f1",
        rgb: [215, 225, 241],
    },
    [constant_1.Color.Purple]: {
        hex: "#6b2fbc",
        rgb: [107, 47, 188],
    },
    [constant_1.Color.Brown]: {
        hex: "#71491e",
        rgb: [113, 73, 30],
    },
    [constant_1.Color.Cyan]: {
        hex: "#38ffdd",
        rgb: [113, 73, 30],
    },
    [constant_1.Color.LightGreen]: {
        hex: "#50f039",
        rgb: [80, 240, 57],
    },
};
//# sourceMappingURL=Colors.js.map

/***/ }),

/***/ 6287:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DisconnectMessages = void 0;
const constant_1 = __webpack_require__(492);
exports.DisconnectMessages = {
    [constant_1.DisconnectReason.None]: "Forcibly disconnected from server. The remote sent a disconnect request.",
    [constant_1.DisconnectReason.GameFull]: "The game you tried to join is full. Check with the host to see if you can join next round.",
    [constant_1.DisconnectReason.GameStarted]: "The game you tried to join already started. Check with the host to see if you can join next round.",
    [constant_1.DisconnectReason.GameNotFound]: "Could not find the game you're looking for.",
    [constant_1.DisconnectReason.IncorrectVersion]: "You are running an older version of the game. Please update to play with others.",
    [constant_1.DisconnectReason.Banned]: "You were banned from the room. You cannot rejoin that room.",
    [constant_1.DisconnectReason.Kicked]: "You were kicked from the room. You can rejoin if the room hasn't started.",
    [constant_1.DisconnectReason.InvalidName]: "Server refused username",
    [constant_1.DisconnectReason.Hacking]: "You were banned for hacking. Please stop.",
    [constant_1.DisconnectReason.Error]: "You disconnected from the host. If this happens often, check your WiFi strength.",
    [constant_1.DisconnectReason.IncorrectGame]: "Could not find the game you're looking for.",
    [constant_1.DisconnectReason.ServerRequest]: "The server stopped this game. Possibly due to inactivity.",
    [constant_1.DisconnectReason.ServerFull]: "The Among Us servers are overloaded. Sorry! Please try again later!",
};
//# sourceMappingURL=DisconnectMessages.js.map

/***/ }),

/***/ 1078:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KillDistances = void 0;
const constant_1 = __webpack_require__(492);
exports.KillDistances = {
    [constant_1.KillDistance.Short]: 1.0,
    [constant_1.KillDistance.Medium]: 1.8,
    [constant_1.KillDistance.Long]: 2.5,
};
//# sourceMappingURL=KillDistances.js.map

/***/ }),

/***/ 3643:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapDoors = void 0;
const constant_1 = __webpack_require__(492);
exports.MapDoors = {
    [constant_1.GameMap.TheSkeld]: 13,
    [constant_1.GameMap.MiraHQ]: 0,
    [constant_1.GameMap.Polus]: 12,
    [constant_1.GameMap.Airship]: 6,
};
//# sourceMappingURL=MapDoors.js.map

/***/ }),

/***/ 8450:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapTaskData = void 0;
const constant_1 = __webpack_require__(492);
exports.MapTaskData = {
    [constant_1.GameMap.TheSkeld]: {
        [constant_1.TaskType.SwipeCard]: {
            name: "Swipe Card",
            type: constant_1.TaskType.SwipeCard,
            length: constant_1.TaskLength.Common,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.AdminSwipeCard,
                    name: "Admin: Swipe Card",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.FixWiring]: {
            name: "Fix Wiring",
            type: constant_1.TaskType.FixWiring,
            length: constant_1.TaskLength.Common,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.ElectricalFixWiring,
                    name: "Electrical: Fix Wiring",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.ClearAsteroids]: {
            name: "Clear Asteroids",
            type: constant_1.TaskType.ClearAsteroids,
            length: constant_1.TaskLength.Long,
            visual: true,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.WeaponsClearAsteroids,
                    name: "Weapons: Clear Asteroids",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.AlignEngineOutput]: {
            name: "Align Engine Output",
            type: constant_1.TaskType.AlignEngineOutput,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.EnginesAlignEngineOutput,
                    name: "Engines: Align Engine Output",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.SubmitScan]: {
            name: "Submit Scan",
            type: constant_1.TaskType.SubmitScan,
            length: constant_1.TaskLength.Long,
            visual: true,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.MedBaySubmitScan,
                    name: "Medbay: Submit Scan",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.InspectSample]: {
            name: "Inspect Sample",
            type: constant_1.TaskType.InspectSample,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.MedBayInspectSample,
                    name: "Medbay: Inspect Sample",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.FuelEngines]: {
            name: "Fuel Engines",
            type: constant_1.TaskType.FuelEngines,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.StorageFuelEngines,
                    name: "Storage: Fuel Engines",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.StartReactor]: {
            name: "Start Reactor",
            type: constant_1.TaskType.StartReactor,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.ReactorStartReactor,
                    name: "Reactor: Start Reactor",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.EmptyChute]: {
            name: "Empty Chute",
            type: constant_1.TaskType.EmptyChute,
            length: constant_1.TaskLength.Long,
            visual: true,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.O2EmptyChute,
                    name: "O2: Empty Chute",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.EmptyGarbage]: {
            name: "Empty Garbage",
            type: constant_1.TaskType.EmptyGarbage,
            length: constant_1.TaskLength.Long,
            visual: true,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.CafeteriaEmptyGarbage,
                    name: "Cafeteria: Empty Garbage",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.UploadData]: {
            name: "Download Data",
            type: constant_1.TaskType.UploadData,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.CommunicationsDownloadData,
                    name: "Communications: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.TheSkeldTask.ElectricalDownloadData,
                    name: "Electrical: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.TheSkeldTask.WeaponsDownloadData,
                    name: "Weapons: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.TheSkeldTask.CafeteriaDownloadData,
                    name: "Cafeteria: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.TheSkeldTask.NavigationDownloadData,
                    name: "Navigation: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.CalibrateDistributor]: {
            name: "Calibrate Distributor",
            type: constant_1.TaskType.CalibrateDistributor,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.ElectricalCalibrateDistributor,
                    name: "Electrical: Calibrate Distributor",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.ChartCourse]: {
            name: "Chart Course",
            type: constant_1.TaskType.ChartCourse,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.NavigationChartCourse,
                    name: "Navigation: Chart Course",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.CleanO2Filter]: {
            name: "Clean O2 Filter",
            type: constant_1.TaskType.CleanO2Filter,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.O2CleanO2Filter,
                    name: "O2: Clean O2 Filter",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.UnlockManifolds]: {
            name: "Unlock Manifolds",
            type: constant_1.TaskType.UnlockManifolds,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.ReactorUnlockManifolds,
                    name: "Reactor: Unlock Manifolds",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.StabilizeSteering]: {
            name: "Stabilize Steering",
            type: constant_1.TaskType.StabilizeSteering,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.NavigationStabilizeSteering,
                    name: "Navigation: Stabilize Steering",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.PrimeShields]: {
            name: "Prime Shields",
            type: constant_1.TaskType.PrimeShields,
            length: constant_1.TaskLength.Short,
            visual: true,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.ShieldsPrimeShields,
                    name: "Shields: Prime Shields",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.DivertPower]: {
            name: "Divert Power to Shields",
            type: constant_1.TaskType.DivertPower,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.TheSkeldTask.ElectricalDivertPowerToShields,
                    name: "Electrical: Divert Power to Shields",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.TheSkeldTask.ElectricalDivertPowerToWeapons,
                    name: "Electrical: Divert Power to Weapons",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.TheSkeldTask.ElectricalDivertPowerToCommunications,
                    name: "Electrical: Divert Power to Communications",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.TheSkeldTask.ElectricalDivertPowerToUpperEngine,
                    name: "Electrical: Divert Power to Upper Engine",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.TheSkeldTask.ElectricalDivertPowerToO2,
                    name: "Electrical: Divert Power to O2",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.TheSkeldTask.ElectricalDivertPowerToNavigation,
                    name: "Electrical: Divert Power to Navigation",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.TheSkeldTask.ElectricalDivertPowerToLowerEngine,
                    name: "Electrical: Divert Power to Lower Engine",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.TheSkeldTask.ElectricalDivertPowerToSecurity,
                    name: "Electrical: Divert Power to Security",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
    },
    [constant_1.GameMap.MiraHQ]: {
        [constant_1.TaskType.FixWiring]: {
            name: "Fix Wiring",
            type: constant_1.TaskType.FixWiring,
            length: constant_1.TaskLength.Common,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.HallwayFixWiring,
                    name: "Hallway: Fix Wiring",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.EnterIdCode]: {
            name: "Enter ID Code",
            type: constant_1.TaskType.EnterIdCode,
            length: constant_1.TaskLength.Common,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.AdminEnterIDCode,
                    name: "Admin: Enter ID Code",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.SubmitScan]: {
            name: "Submit Scan",
            type: constant_1.TaskType.SubmitScan,
            length: constant_1.TaskLength.Long,
            visual: true,
            consoles: [
                {
                    id: constant_1.MiraHQTask.MedBaySubmitScan,
                    name: "Medbay: Submit Scan",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.ClearAsteroids]: {
            name: "Clear Asteroids",
            type: constant_1.TaskType.ClearAsteroids,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.BalconyClearAsteroids,
                    name: "Balcony: Clear Asteroids",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.DivertPower]: {
            name: "Divert Power to Admin",
            type: constant_1.TaskType.DivertPower,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.ElectricalDivertPowerToAdmin,
                    name: "Electrical: Divert Power to Admin",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.MiraHQTask.ElectricalDivertPowerToCafeteria,
                    name: "Electrical: Divert Power to Cafeteria",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.MiraHQTask.ElectricalDivertPowerToCommunications,
                    name: "Electrical: Divert Power to Communications",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.MiraHQTask.ElectricalDivertPowerToLaunchpad,
                    name: "Electrical: Divert Power to Launchpad",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.MiraHQTask.ElectricalDivertPowerToMedBay,
                    name: "Electrical: Divert Power to Medbay",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.MiraHQTask.ElectricalDivertPowerToOffice,
                    name: "Electrical: Divert Power to Office",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.MiraHQTask.ElectricalDivertPowerToGreenhouse,
                    name: "Electrical: Divert Power to Greenhouse",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.MiraHQTask.ElectricalDivertPowerToLaboratory,
                    name: "Electrical: Divert Power to Laboratory",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.WaterPlants]: {
            name: "Water Plants",
            type: constant_1.TaskType.WaterPlants,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.StorageWaterPlants,
                    name: "Storage: Water Plants",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.StartReactor]: {
            name: "Start Reactor",
            type: constant_1.TaskType.StartReactor,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.ReactorStartReactor,
                    name: "Reactor: Start Reactor",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.ChartCourse]: {
            name: "Chart Course",
            type: constant_1.TaskType.ChartCourse,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.AdminChartCourse,
                    name: "Admin: Chart Course",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.CleanO2Filter]: {
            name: "Clean O2 Filter",
            type: constant_1.TaskType.CleanO2Filter,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.GreenhouseCleanO2Filter,
                    name: "Greenhouse: Clean O2 Filter",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.FuelEngines]: {
            name: "Fuel Engines",
            type: constant_1.TaskType.FuelEngines,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.LaunchpadFuelEngines,
                    name: "Launchpad: Fuel Engines",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.AssembleArtifact]: {
            name: "Assemble Artifact",
            type: constant_1.TaskType.AssembleArtifact,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.LaboratoryAssembleArtifact,
                    name: "Laboratory: Assemble Artifact",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.SortSamples]: {
            name: "Sort Samples",
            type: constant_1.TaskType.SortSamples,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.LaboratorySortSamples,
                    name: "Laboratory: Sort Samples",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.PrimeShields]: {
            name: "Prime Shields",
            type: constant_1.TaskType.PrimeShields,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.AdminPrimeShields,
                    name: "Admin: Prime Shields",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.EmptyGarbage]: {
            name: "Empty Garbage",
            type: constant_1.TaskType.EmptyGarbage,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.CafeteriaEmptyGarbage,
                    name: "Cafeteria: Empty Garbage",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.MeasureWeather]: {
            name: "Measure Weather",
            type: constant_1.TaskType.MeasureWeather,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.BalconyMeasureWeather,
                    name: "Balcony: Measure Weather",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.BuyBeverage]: {
            name: "Buy Beverage",
            type: constant_1.TaskType.BuyBeverage,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.CafeteriaBuyBeverage,
                    name: "Cafeteria: Buy Beverage",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.ProcessData]: {
            name: "Process Data",
            type: constant_1.TaskType.ProcessData,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.OfficeProcessData,
                    name: "Office: Process Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.RunDiagnostics]: {
            name: "Run Diagnostics",
            type: constant_1.TaskType.RunDiagnostics,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.LaunchpadRunDiagnostics,
                    name: "Launchpad: Run Diagnostics",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.UnlockManifolds]: {
            name: "Unlock Manifolds",
            type: constant_1.TaskType.UnlockManifolds,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.MiraHQTask.ReactorUnlockManifolds,
                    name: "Reactor: Unlock Manifolds",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
    },
    [constant_1.GameMap.Polus]: {
        [constant_1.TaskType.SwipeCard]: {
            name: "Swipe Card",
            type: constant_1.TaskType.SwipeCard,
            length: constant_1.TaskLength.Common,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.OfficeSwipeCard,
                    name: "Office: Swipe Card",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.InsertKeys]: {
            name: "Insert Keys",
            type: constant_1.TaskType.InsertKeys,
            length: constant_1.TaskLength.Common,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.DropshipInsertKeys,
                    name: "Dropship: Insert Keys",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.ScanBoardingPass]: {
            name: "Scan Boarding Pass",
            type: constant_1.TaskType.ScanBoardingPass,
            length: constant_1.TaskLength.Common,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.OfficeScanBoardingPass,
                    name: "Office: Scan Boarding Pass",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.FixWiring]: {
            name: "Fix Wiring",
            type: constant_1.TaskType.FixWiring,
            length: constant_1.TaskLength.Common,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.ElectricalFixWiring,
                    name: "Electrical: Fix Wiring",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.UploadData]: {
            name: "Download Data",
            type: constant_1.TaskType.UploadData,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.WeaponsDownloadData,
                    name: "Weapons: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.PolusTask.OfficeDownloadData,
                    name: "Office: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.PolusTask.ElectricalDownloadData,
                    name: "Electrical: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.PolusTask.SpecimenRoomDownloadData,
                    name: "Specimen Room: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.PolusTask.O2DownloadData,
                    name: "O2: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.StartReactor]: {
            name: "Start Reactor",
            type: constant_1.TaskType.StartReactor,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.SpecimenRoomStartReactor,
                    name: "Specimen Room: Start Reactor",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.FuelEngines]: {
            name: "Fuel Engines",
            type: constant_1.TaskType.FuelEngines,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.StorageFuelEngines,
                    name: "Storage: Fuel Engines",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.OpenWaterways]: {
            name: "Open Waterways",
            type: constant_1.TaskType.OpenWaterways,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.BoilerRoomOpenWaterways,
                    name: "Boiler Room: Open Waterways",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.InspectSample]: {
            name: "Inspect Sample",
            type: constant_1.TaskType.InspectSample,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.MedBayInspectSample,
                    name: "Medbay: Inspect Sample",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.ReplaceWaterJug]: {
            name: "Replace Water Jug",
            type: constant_1.TaskType.ReplaceWaterJug,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.BoilerRoomReplaceWaterJug,
                    name: "Boiler Room: Replace Water Jug",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.ActivateWeatherNodes]: {
            name: "Fix Weather Node Node_GI",
            type: constant_1.TaskType.ActivateWeatherNodes,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.OutsideFixWeatherNodeNODE_GI,
                    name: "Outside: Fix Weather Node Node_GI",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.PolusTask.OutsideFixWeatherNodeNODE_IRO,
                    name: "Outside: Fix Weather Node Node_IRO",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.PolusTask.OutsideFixWeatherNodeNODE_PD,
                    name: "Outside: Fix Weather Node Node_PD",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.PolusTask.OutsideFixWeatherNodeNODE_TB,
                    name: "Outside: Fix Weather Node Node_TB",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.PolusTask.OutsideFixWeatherNodeNODE_CA,
                    name: "Outside: Fix Weather Node Node_CA",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.PolusTask.OutsideFixWeatherNodeNODE_MLG,
                    name: "Outside: Fix Weather Node Node_MLG",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.RebootWifi]: {
            name: "Reboot WiFi",
            type: constant_1.TaskType.RebootWifi,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.CommunicationsRebootWiFi,
                    name: "Communications: Reboot WiFi",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.MonitorO2]: {
            name: "Monitor Tree",
            type: constant_1.TaskType.MonitorO2,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.O2MonitorTree,
                    name: "O2: Monitor Tree",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.UnlockManifolds]: {
            name: "Unlock Manifolds",
            type: constant_1.TaskType.UnlockManifolds,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.SpecimenRoomUnlockManifolds,
                    name: "Specimen Room: Unlock Manifolds",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.StoreArtifacts]: {
            name: "Store Artifacts",
            type: constant_1.TaskType.StoreArtifacts,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.SpecimenRoomStoreArtifacts,
                    name: "Specimen Room: Store Artifacts",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.FillCanisters]: {
            name: "Fill Canisters",
            type: constant_1.TaskType.FillCanisters,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.O2FillCanisters,
                    name: "O2: Fill Canisters",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.EmptyGarbage]: {
            name: "Empty Garbage",
            type: constant_1.TaskType.EmptyGarbage,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.O2EmptyGarbage,
                    name: "O2: Empty Garbage",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.ChartCourse]: {
            name: "Chart Course",
            type: constant_1.TaskType.ChartCourse,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.DropshipChartCourse,
                    name: "Dropship: Chart Course",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.SubmitScan]: {
            name: "Submit Scan",
            type: constant_1.TaskType.SubmitScan,
            length: constant_1.TaskLength.Short,
            visual: true,
            consoles: [
                {
                    id: constant_1.PolusTask.MedBaySubmitScan,
                    name: "Medbay: Submit Scan",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.ClearAsteroids]: {
            name: "Clear Asteroids",
            type: constant_1.TaskType.ClearAsteroids,
            length: constant_1.TaskLength.Short,
            visual: true,
            consoles: [
                {
                    id: constant_1.PolusTask.WeaponsClearAsteroids,
                    name: "Weapons: Clear Asteroids",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.AlignTelescope]: {
            name: "Align Telescope",
            type: constant_1.TaskType.AlignTelescope,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.LaboratoryAlignTelescope,
                    name: "Laboratory: Align Telescope",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.RepairDrill]: {
            name: "Repair Drill",
            type: constant_1.TaskType.RepairDrill,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.LaboratoryRepairDrill,
                    name: "Laboratory: Repair Drill",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.RecordTemperature]: {
            name: "Record Temperature",
            type: constant_1.TaskType.RecordTemperature,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.PolusTask.LaboratoryRecordTemperature,
                    name: "Laboratory: Record Temperature",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.PolusTask.OutsideRecordTemperature,
                    name: "Outside: Record Temperature",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
    },
    [constant_1.GameMap.AprilFoolsTheSkeld]: {},
    [constant_1.GameMap.Airship]: {
        [constant_1.TaskType.FixWiring]: {
            name: "Fix Wiring",
            type: constant_1.TaskType.FixWiring,
            length: constant_1.TaskLength.Common,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.ElectricalFixWiring,
                    name: "Electrical: Fix Wiring",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.EnterIdCode]: {
            name: "Enter ID Code",
            type: constant_1.TaskType.EnterIdCode,
            length: constant_1.TaskLength.Common,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.MeetingRoomEnterIdCode,
                    name: "Meeting Room: Enter ID Code",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.ResetBreakers]: {
            name: "Reset Breakers",
            type: constant_1.TaskType.ResetBreakers,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.ElectricalResetBreakers,
                    name: "Electrical: Reset Breakers",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.UploadData]: {
            name: "Download Data",
            type: constant_1.TaskType.UploadData,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.VaultRoomDownloadData,
                    name: "Vault Room: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.BrigDownloadData,
                    name: "Brig: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.CargoBayDownloadData,
                    name: "Cargo Bay: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.GapRoomDownloadData,
                    name: "Gap Room: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.RecordsDownloadData,
                    name: "Records: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.ArmoryDownloadData,
                    name: "Armory: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.CockpitDownloadData,
                    name: "Cockpit: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.CommunicationsDownloadData,
                    name: "Comms: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.MedicalDownloadData,
                    name: "Medical: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.ViewingDeckDownloadData,
                    name: "Viewing Deck: Download Data",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.UnlockSafe]: {
            name: "Unlock Safe",
            type: constant_1.TaskType.UnlockSafe,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.CargoBayUnlockSafe,
                    name: "Cargo Bay: Unlock Safe",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.StartFans]: {
            name: "Start Fans",
            type: constant_1.TaskType.StartFans,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.VentilationStartFans,
                    name: "Ventilation: Start Fans",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.EmptyGarbage]: {
            name: "Empty Garbage",
            type: constant_1.TaskType.EmptyGarbage,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.MainHallEmptyGarbage,
                    name: "Main Hall: Empty Garbage",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.MedicalEmptyGarbage,
                    name: "Medical: Empty Garbage",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.KitchenEmptyGarbage,
                    name: "Kitchen: Empty Garbage",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.DevelopPhotos]: {
            name: "Develop Photos",
            type: constant_1.TaskType.DevelopPhotos,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.MainHallDevelopPhotos,
                    name: "Main Hall: Develop Photos",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.FuelEngines]: {
            name: "Fuel Engines",
            type: constant_1.TaskType.FuelEngines,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.CargoBayFuelEngines,
                    name: "Cargo Bay: Fuel Engines",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.RewindTapes]: {
            name: "Rewind Tapes",
            type: constant_1.TaskType.RewindTapes,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.SecurityRewindTapes,
                    name: "Security: Rewind Tapes",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.PolishRuby]: {
            name: "Polish Ruby",
            type: constant_1.TaskType.PolishRuby,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.VaultRoomPolishRuby,
                    name: "Vault Room: Polish Ruby",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.CalibrateDistributor]: {
            name: "Calibrate Distributor",
            type: constant_1.TaskType.CalibrateDistributor,
            length: constant_1.TaskLength.Long,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.ElectricalCalibrateDistributor,
                    name: "Electrical: Calibrate Distributor",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.StabilizeSteering]: {
            name: "Stabilize Steering",
            type: constant_1.TaskType.StabilizeSteering,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.CockpitStabilizeSteering,
                    name: "Cockpit: Stabilize Steering",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.DivertPower]: {
            name: "Divert Power to Armory",
            type: constant_1.TaskType.DivertPower,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.ElectricalDivertPowerToArmory,
                    name: "Electrical: Divert Power to Armory",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.ElectricalDivertPowerToCockpit,
                    name: "Electrical: Divert Power to Cockpit",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.ElectricalDivertPowerToGapRoom,
                    name: "Electrical: Divert Power to Gap Room",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.ElectricalDivertPowerToMainHall,
                    name: "Electrical: Divert Power to Main Hall",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.ElectricalDivertPowerToMeetingRoom,
                    name: "Electrical: Divert Power to Meeting Room",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.ElectricalDivertPowerToShowers,
                    name: "Electrical: Divert Power to Showers",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    id: constant_1.AirshipTask.ElectricalDivertPowerToEngine,
                    name: "Electrical: Divert Power to Engine",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.PickUpTowels]: {
            name: "Pick Up Towels",
            type: constant_1.TaskType.PickUpTowels,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.ShowersPickUpTowels,
                    name: "Showers: Pick Up Towels",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.CleanToilet]: {
            name: "Clean Toilet",
            type: constant_1.TaskType.CleanToilet,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.LoungeCleanToilet,
                    name: "Lounge: Clean Toilet",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.DressMannequin]: {
            name: "Dress Mannequin",
            type: constant_1.TaskType.DressMannequin,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.VaultRoomDressMannequin,
                    name: "Vault Room: Dress Mannequin",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.SortRecords]: {
            name: "Sort Records",
            type: constant_1.TaskType.SortRecords,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.RecordsSortRecords,
                    name: "Records: Sort Records",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.PutAwayPistols]: {
            name: "Put Away Pistols",
            type: constant_1.TaskType.PutAwayPistols,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.ArmoryPutAwayPistols,
                    name: "Armory: Put Away Pistols",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.PutAwayRifles]: {
            name: "Put Away Rifles",
            type: constant_1.TaskType.PutAwayRifles,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.ArmoryPutAwayRifles,
                    name: "Armory: Put Away Rifles",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.Decontaminate]: {
            name: "Decontaminate",
            type: constant_1.TaskType.Decontaminate,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.MainHallDecontaminate,
                    name: "Main Hall: Decontaminate",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.MakeBurger]: {
            name: "Make Burger",
            type: constant_1.TaskType.MakeBurger,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.KitchenMakeBurger,
                    name: "Kitchen: Make Burger",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
        [constant_1.TaskType.FixShower]: {
            name: "Fix Shower",
            type: constant_1.TaskType.FixShower,
            length: constant_1.TaskLength.Short,
            visual: false,
            consoles: [
                {
                    id: constant_1.AirshipTask.ShowersFixShower,
                    name: "Showers: Fix Shower",
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
            ],
        },
    },
};
//# sourceMappingURL=MapTaskData.js.map

/***/ }),

/***/ 1089:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapVentData = void 0;
const constant_1 = __webpack_require__(492);
/** https://github.com/codyphobe/among-us-protocol/blob/master/07_miscellaneous/04_map_specific_ids_for_vents_and_tasks.md#the-skeld */
exports.MapVentData = {
    [constant_1.GameMap.TheSkeld]: {
        [constant_1.TheSkeldVent.Admin]: {
            id: constant_1.TheSkeldVent.Admin,
            position: {
                x: 2.543373,
                y: -9.59182,
            },
            network: [constant_1.TheSkeldVent.RightHallway, constant_1.TheSkeldVent.Cafeteria],
        },
        [constant_1.TheSkeldVent.RightHallway]: {
            id: constant_1.TheSkeldVent.RightHallway,
            position: {
                x: 9.38308,
                y: -6.0749207,
            },
            network: [constant_1.TheSkeldVent.Admin, constant_1.TheSkeldVent.Cafeteria],
        },
        [constant_1.TheSkeldVent.Cafeteria]: {
            id: constant_1.TheSkeldVent.Cafeteria,
            position: {
                x: 4.258915,
                y: 0.08728027,
            },
            network: [constant_1.TheSkeldVent.Admin, constant_1.TheSkeldVent.RightHallway],
        },
        [constant_1.TheSkeldVent.Electrical]: {
            id: constant_1.TheSkeldVent.Electrical,
            position: {
                x: -9.777372,
                y: -7.6704063,
            },
            network: [constant_1.TheSkeldVent.Security, constant_1.TheSkeldVent.MedBay],
        },
        [constant_1.TheSkeldVent.UpperEngine]: {
            id: constant_1.TheSkeldVent.UpperEngine,
            position: {
                x: -15.288929,
                y: 2.8827324,
            },
            network: [constant_1.TheSkeldVent.UpperReactor],
        },
        [constant_1.TheSkeldVent.Security]: {
            id: constant_1.TheSkeldVent.Security,
            position: {
                x: -12.534981,
                y: -6.586403,
            },
            network: [constant_1.TheSkeldVent.Electrical, constant_1.TheSkeldVent.MedBay],
        },
        [constant_1.TheSkeldVent.MedBay]: {
            id: constant_1.TheSkeldVent.MedBay,
            position: {
                x: -10.608683,
                y: -3.8129234,
            },
            network: [constant_1.TheSkeldVent.Electrical, constant_1.TheSkeldVent.Security],
        },
        [constant_1.TheSkeldVent.Weapons]: {
            id: constant_1.TheSkeldVent.Weapons,
            position: {
                x: 8.819103,
                y: 3.687191,
            },
            network: [constant_1.TheSkeldVent.UpperNavigation],
        },
        [constant_1.TheSkeldVent.LowerReactor]: {
            id: constant_1.TheSkeldVent.LowerReactor,
            position: {
                x: -20.796825,
                y: -6.590065,
            },
            network: [constant_1.TheSkeldVent.LowerEngine],
        },
        [constant_1.TheSkeldVent.LowerEngine]: {
            id: constant_1.TheSkeldVent.LowerEngine,
            position: {
                x: -15.251087,
                y: -13.293049,
            },
            network: [constant_1.TheSkeldVent.LowerReactor],
        },
        [constant_1.TheSkeldVent.Shields]: {
            id: constant_1.TheSkeldVent.Shields,
            position: {
                x: 9.52224,
                y: -13.974211,
            },
            network: [constant_1.TheSkeldVent.LowerNavigation],
        },
        [constant_1.TheSkeldVent.UpperReactor]: {
            id: constant_1.TheSkeldVent.UpperReactor,
            position: {
                x: -21.877165,
                y: -2.6886406,
            },
            network: [constant_1.TheSkeldVent.UpperEngine],
        },
        [constant_1.TheSkeldVent.UpperNavigation]: {
            id: constant_1.TheSkeldVent.UpperNavigation,
            position: {
                x: 16.007935,
                y: -2.8046074,
            },
            network: [constant_1.TheSkeldVent.UpperNavigation],
        },
        [constant_1.TheSkeldVent.LowerNavigation]: {
            id: constant_1.TheSkeldVent.LowerNavigation,
            position: {
                x: 16.007935,
                y: -6.0212097,
            },
            network: [constant_1.TheSkeldVent.Shields],
        },
    },
    [constant_1.GameMap.MiraHQ]: {
        [constant_1.MiraHQVent.Balcony]: {
            id: constant_1.MiraHQVent.Balcony,
            position: {
                x: 23.769283,
                y: -1.576561,
            },
            network: [constant_1.MiraHQVent.Cafeteria, constant_1.MiraHQVent.MedBay],
        },
        [constant_1.MiraHQVent.Cafeteria]: {
            id: constant_1.MiraHQVent.Cafeteria,
            position: {
                x: 23.899899,
                y: 7.5434494,
            },
            network: [constant_1.MiraHQVent.Balcony, constant_1.MiraHQVent.Admin],
        },
        [constant_1.MiraHQVent.Reactor]: {
            id: constant_1.MiraHQVent.Reactor,
            position: {
                x: 0.4791336,
                y: 11.0603485,
            },
            network: [
                constant_1.MiraHQVent.Laboratory,
                constant_1.MiraHQVent.Decontamination,
                constant_1.MiraHQVent.Launchpad,
            ],
        },
        [constant_1.MiraHQVent.Laboratory]: {
            id: constant_1.MiraHQVent.Laboratory,
            position: {
                x: 11.60479,
                y: 14.179291,
            },
            network: [constant_1.MiraHQVent.Reactor, constant_1.MiraHQVent.Office],
        },
        [constant_1.MiraHQVent.Office]: {
            id: constant_1.MiraHQVent.Office,
            position: {
                x: 13.279617,
                y: 20.492867,
            },
            network: [constant_1.MiraHQVent.Laboratory, constant_1.MiraHQVent.Greenhouse],
        },
        [constant_1.MiraHQVent.Admin]: {
            id: constant_1.MiraHQVent.Admin,
            position: {
                x: 22.38987,
                y: 17.59243,
            },
            network: [constant_1.MiraHQVent.Greenhouse],
        },
        [constant_1.MiraHQVent.Greenhouse]: {
            id: constant_1.MiraHQVent.Greenhouse,
            position: {
                x: 17.848782,
                y: 25.59304,
            },
            network: [constant_1.MiraHQVent.Office, constant_1.MiraHQVent.Admin],
        },
        [constant_1.MiraHQVent.MedBay]: {
            id: constant_1.MiraHQVent.MedBay,
            position: {
                x: 15.409779,
                y: -1.4569321,
            },
            network: [constant_1.MiraHQVent.Balcony, constant_1.MiraHQVent.LockerRoom],
        },
        [constant_1.MiraHQVent.Decontamination]: {
            id: constant_1.MiraHQVent.Decontamination,
            position: {
                x: 6.8293304,
                y: 3.5077438,
            },
            network: [constant_1.MiraHQVent.LockerRoom, constant_1.MiraHQVent.Reactor],
        },
        [constant_1.MiraHQVent.LockerRoom]: {
            id: constant_1.MiraHQVent.LockerRoom,
            position: {
                x: 4.289009,
                y: 0.8929596,
            },
            network: [constant_1.MiraHQVent.Decontamination, constant_1.MiraHQVent.Launchpad],
        },
        [constant_1.MiraHQVent.Launchpad]: {
            id: constant_1.MiraHQVent.Launchpad,
            position: {
                x: -6.1811256,
                y: 3.9227905,
            },
            network: [constant_1.MiraHQVent.Reactor],
        },
    },
    [constant_1.GameMap.Polus]: {
        [constant_1.PolusVent.Security]: {
            id: constant_1.PolusVent.Security,
            position: {
                x: 1.9281311,
                y: -9.195087,
            },
            network: [constant_1.PolusVent.O2, constant_1.PolusVent.Electrical],
        },
        [constant_1.PolusVent.Electrical]: {
            id: constant_1.PolusVent.Electrical,
            position: {
                x: 6.8989105,
                y: -14.047455,
            },
            network: [constant_1.PolusVent.Security, constant_1.PolusVent.O2],
        },
        [constant_1.PolusVent.O2]: {
            id: constant_1.PolusVent.O2,
            position: {
                x: 3.5089645,
                y: -16.216679,
            },
            network: [constant_1.PolusVent.Security, constant_1.PolusVent.Electrical],
        },
        [constant_1.PolusVent.Communications]: {
            id: constant_1.PolusVent.Communications,
            position: {
                x: 12.303043,
                y: -18.53483,
            },
            network: [constant_1.PolusVent.Office, constant_1.PolusVent.Storage],
        },
        [constant_1.PolusVent.Office]: {
            id: constant_1.PolusVent.Office,
            position: {
                x: 16.377811,
                y: -19.235523,
            },
            network: [constant_1.PolusVent.Communications, constant_1.PolusVent.Storage],
        },
        [constant_1.PolusVent.Admin]: {
            id: constant_1.PolusVent.Admin,
            position: {
                x: 20.088806,
                y: -25.153582,
            },
            network: [constant_1.PolusVent.LavaPool],
        },
        [constant_1.PolusVent.Laboratory]: {
            id: constant_1.PolusVent.Laboratory,
            position: {
                x: 32.96254,
                y: -9.163349,
            },
            network: [constant_1.PolusVent.LavaPool],
        },
        [constant_1.PolusVent.LavaPool]: {
            id: constant_1.PolusVent.LavaPool,
            position: {
                x: 30.906845,
                y: -11.497368,
            },
            network: [constant_1.PolusVent.Laboratory],
        },
        [constant_1.PolusVent.Storage]: {
            id: constant_1.PolusVent.Storage,
            position: {
                x: 21.999237,
                y: -11.826963,
            },
            network: [constant_1.PolusVent.Communications, constant_1.PolusVent.Office],
        },
        [constant_1.PolusVent.RightSeismic]: {
            id: constant_1.PolusVent.RightSeismic,
            position: {
                x: 24.019531,
                y: -8.026855,
            },
            network: [constant_1.PolusVent.LeftSeismic],
        },
        [constant_1.PolusVent.LeftSeismic]: {
            id: constant_1.PolusVent.LeftSeismic,
            position: {
                x: 9.639431,
                y: -7.356678,
            },
            network: [constant_1.PolusVent.RightSeismic],
        },
        [constant_1.PolusVent.OutsideAdmin]: {
            id: constant_1.PolusVent.OutsideAdmin,
            position: {
                x: 18.929123,
                y: -24.487068,
            },
            network: [constant_1.PolusVent.Admin],
        },
    },
    [constant_1.GameMap.AprilFoolsTheSkeld]: {},
    [constant_1.GameMap.Airship]: {
        [constant_1.AirshipVent.Vault]: {
            id: constant_1.AirshipVent.Vault,
            position: {
                x: -12.6322,
                y: 8.4735,
            },
            network: [constant_1.AirshipVent.Cockpit],
        },
        [constant_1.AirshipVent.Cockpit]: {
            id: constant_1.AirshipVent.Cockpit,
            position: {
                x: -22.099,
                y: -1.512,
            },
            network: [constant_1.AirshipVent.Vault, constant_1.AirshipVent.ViewingDeck],
        },
        [constant_1.AirshipVent.ViewingDeck]: {
            id: constant_1.AirshipVent.ViewingDeck,
            position: {
                x: -15.659,
                y: -11.6991,
            },
            network: [constant_1.AirshipVent.Cockpit],
        },
        [constant_1.AirshipVent.Engine]: {
            id: constant_1.AirshipVent.Engine,
            position: {
                x: 0.203,
                y: -2.5361,
            },
            network: [constant_1.AirshipVent.Kitchen, constant_1.AirshipVent.LowerMainHall],
        },
        [constant_1.AirshipVent.Kitchen]: {
            id: constant_1.AirshipVent.Kitchen,
            position: {
                x: -2.6019,
                y: -9.338,
            },
            network: [constant_1.AirshipVent.Engine, constant_1.AirshipVent.LowerMainHall],
        },
        [constant_1.AirshipVent.UpperMainHall]: {
            id: constant_1.AirshipVent.UpperMainHall,
            position: {
                x: 7.021,
                y: -3.730999,
            },
            network: [constant_1.AirshipVent.RightGapRoom, constant_1.AirshipVent.LeftGapRoom],
        },
        [constant_1.AirshipVent.LowerMainHall]: {
            id: constant_1.AirshipVent.LowerMainHall,
            position: {
                x: 9.814,
                y: 3.206,
            },
            network: [constant_1.AirshipVent.Engine, constant_1.AirshipVent.Kitchen],
        },
        [constant_1.AirshipVent.RightGapRoom]: {
            id: constant_1.AirshipVent.RightGapRoom,
            position: {
                x: 12.663,
                y: 5.922,
            },
            network: [constant_1.AirshipVent.UpperMainHall, constant_1.AirshipVent.LeftGapRoom],
        },
        [constant_1.AirshipVent.LeftGapRoom]: {
            id: constant_1.AirshipVent.LeftGapRoom,
            position: {
                x: 3.605,
                y: 6.923,
            },
            network: [constant_1.AirshipVent.UpperMainHall, constant_1.AirshipVent.RightGapRoom],
        },
        [constant_1.AirshipVent.Showers]: {
            id: constant_1.AirshipVent.Showers,
            position: {
                x: 23.9869,
                y: -1.386,
            },
            network: [constant_1.AirshipVent.Records, constant_1.AirshipVent.CargoBay],
        },
        [constant_1.AirshipVent.Records]: {
            id: constant_1.AirshipVent.Records,
            position: {
                x: 23.2799,
                y: 8.259998,
            },
            network: [constant_1.AirshipVent.Showers, constant_1.AirshipVent.CargoBay],
        },
        [constant_1.AirshipVent.CargoBay]: {
            id: constant_1.AirshipVent.CargoBay,
            position: {
                x: 30.4409,
                y: -3.577,
            },
            network: [constant_1.AirshipVent.Showers, constant_1.AirshipVent.Records],
        },
    },
};
//# sourceMappingURL=MapVentData.js.map

/***/ }),

/***/ 1533:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchmakingServers = void 0;
exports.MatchmakingServers = {
    NA: ["na.mm.among.us"],
    EU: ["eu.mm.among.us"],
    AS: ["as.mm.among.us"],
};
//# sourceMappingURL=MatchmakingServers.js.map

/***/ }),

/***/ 5964:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(2888), exports);
__exportStar(__webpack_require__(6287), exports);
__exportStar(__webpack_require__(1078), exports);
__exportStar(__webpack_require__(3643), exports);
__exportStar(__webpack_require__(8450), exports);
__exportStar(__webpack_require__(1089), exports);
__exportStar(__webpack_require__(1533), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3418:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(3455), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1743:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicEvent = void 0;
class BasicEvent {
}
exports.BasicEvent = BasicEvent;
//# sourceMappingURL=BasicEvent.js.map

/***/ }),

/***/ 8898:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CancelableEvent = void 0;
const BasicEvent_1 = __webpack_require__(1743);
class CancelableEvent extends BasicEvent_1.BasicEvent {
    constructor() {
        super();
        this.canceled = false;
    }
    cancel() {
        this.canceled = true;
    }
}
exports.CancelableEvent = CancelableEvent;
//# sourceMappingURL=CancelableEvent.js.map

/***/ }),

/***/ 6595:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventEmitter = void 0;
class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }
    async emit(event) {
        const listeners = this.getListeners(event.eventName);
        await Promise.all([...listeners].map(lis => lis(event)));
        return event;
    }
    async emitSerial(event) {
        const listeners = this.getListeners(event.eventName);
        for (const listener of listeners) {
            listener(event);
        }
        return event;
    }
    on(event, listener) {
        const listeners = this.getListeners(event);
        listeners.add(listener);
        return this.off.bind(this, event, listener);
    }
    once(event, listener) {
        const removeListener = this.on(event, async (ev) => {
            removeListener();
            await listener(ev);
        });
        return removeListener;
    }
    wait(event) {
        return new Promise((resolve) => {
            this.once(event, resolve);
        });
    }
    off(event, listener) {
        const listeners = this.getListeners(event);
        listeners.delete(listener);
    }
    getListeners(event) {
        const listeners = this.listeners.get(event);
        if (!listeners) {
            this.listeners.set(event, new Set());
            return this.getListeners(event);
        }
        return listeners;
    }
    removeListeners(event) {
        const listeners = this.getListeners(event);
        listeners.clear();
    }
    removeAllListeners() {
        for (const [eventName] of this.listeners) {
            this.removeListeners(eventName);
        }
    }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=EventEmitter.js.map

/***/ }),

/***/ 9092:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RevertableEvent = void 0;
const BasicEvent_1 = __webpack_require__(1743);
class RevertableEvent extends BasicEvent_1.BasicEvent {
    constructor() {
        super();
        this.reverted = false;
    }
    revert() {
        this.reverted = true;
    }
}
exports.RevertableEvent = RevertableEvent;
//# sourceMappingURL=RevertableEvent.js.map

/***/ }),

/***/ 3455:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(1743), exports);
__exportStar(__webpack_require__(8898), exports);
__exportStar(__webpack_require__(6595), exports);
__exportStar(__webpack_require__(9092), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1214:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(8908), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2173:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.authTokenHook = exports.getAuthToken = void 0;
const path_1 = __importDefault(__webpack_require__(5622));
const child_process_1 = __importDefault(__webpack_require__(3129));
const util_1 = __webpack_require__(5131);
function getAuthTokenImpl(exe_path, cert_path, ip, port) {
    return new Promise((resolve, reject) => {
        const tokenRegExp = /TOKEN:(\d+):TOKEN/;
        const args = [
            path_1.default.resolve(process.cwd(), cert_path),
            ip,
            port.toString(),
        ];
        const proc = child_process_1.default.spawn(exe_path, args);
        proc.stdout.on("data", (chunk) => {
            const out = chunk.toString("utf8");
            const matched = tokenRegExp.exec(out.toString("utf8"));
            if (matched) {
                const foundToken = matched[1];
                const authToken = parseInt(foundToken);
                proc.kill("SIGINT");
                resolve(authToken);
            }
        });
        proc.on("error", (err) => {
            proc.kill("SIGINT");
            reject(err);
        });
        util_1.sleep(5000).then(() => {
            proc.kill("SIGINT");
            reject(new Error("GetAuthToken took too long to get a token."));
        });
    });
}
/**
 * Get an authentication token from a specified server.
 * @param exe_path The path to the GetAuthToken executable.
 * @param cert_path The path to the certificate to use.
 * @param ip The IP of the server to get a token from.
 * @param port The port of the server to get a token from.
 * @param attempts The maximum number of attempts to get an auth token, before throwing an error.
 * @example
 * ```ts
 * const token = await getAuthToken(
 *   "path_to_get_auth_token.exe",
 *   "path_to_cert_path",
 *   "127.0.0.1",
 *   22025
 * )
 * ```
 */
async function getAuthToken(exe_path, cert_path, ip, port, attempts = 1, attempt = 1) {
    try {
        return await getAuthTokenImpl(exe_path, cert_path, ip, port);
    }
    catch (e) {
        if (attempt === attempts) {
            throw e;
        }
        else {
            return await getAuthToken(exe_path, cert_path, ip, port, attempts, attempt + 1);
        }
    }
}
exports.getAuthToken = getAuthToken;
/**
 * Hook a skeldjs client to automatically get an authentication token before connecting to a server.
 * @param client The client to hook.
 * @param options Options for get auth token.
 * @example
 * ```ts
 * const client = new SkeldjsClient("2021.4.2");
 *
 * authTokenHook(client, {
 *   exe_path: "path_to_get_auth_token.exe",
 *   cert_path: "path_to_cert_path"
 * });
 * ```
 */
function authTokenHook(client, options) {
    client.on("client.connect", async (ev) => {
        var _a;
        try {
            client.token = await getAuthToken(options.exe_path, options.cert_path, ev.ip, ev.port + 2 /* Auth port is normal port + 2 */, (_a = options.attempts) !== null && _a !== void 0 ? _a : 1);
        }
        catch (e) {
            client.token = 0;
        }
    });
}
exports.authTokenHook = authTokenHook;
//# sourceMappingURL=getauthtoken.js.map

/***/ }),

/***/ 8908:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(2173), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2602:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(8178), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9241:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PacketDecoder = exports.MessageDirection = void 0;
const util_1 = __webpack_require__(5131);
const option_1 = __webpack_require__(9467);
const root_1 = __webpack_require__(8514);
const game_1 = __webpack_require__(571);
const rpc_1 = __webpack_require__(2124);
var MessageDirection;
(function (MessageDirection) {
    MessageDirection[MessageDirection["Clientbound"] = 0] = "Clientbound";
    MessageDirection[MessageDirection["Serverbound"] = 1] = "Serverbound";
})(MessageDirection = exports.MessageDirection || (exports.MessageDirection = {}));
class PacketDecoder {
    constructor() {
        this.reset();
    }
    /**
     * Reset the packet decoder, removing all custom packets and removing listeners.
     */
    reset() {
        this.listeners = new Map();
        this.types = new Map();
        this.register(option_1.AcknowledgePacket, option_1.DisconnectPacket, option_1.HelloPacket, option_1.PingPacket, option_1.ReliablePacket, option_1.UnreliablePacket);
        this.register(root_1.AlterGameMessage, root_1.EndGameMessage, root_1.GameDataMessage, root_1.GameDataToMessage, root_1.GetGameListMessage, root_1.HostGameMessage, root_1.JoinedGameMessage, root_1.JoinGameMessage, root_1.KickPlayerMessage, root_1.RedirectMessage, root_1.RemoveGameMessage, root_1.RemovePlayerMessage, root_1.ReportPlayerMessage, root_1.StartGameMessage, root_1.WaitForHostMessage);
        this.register(game_1.ClientInfoMessage, game_1.DataMessage, game_1.DespawnMessage, game_1.ReadyMessage, game_1.RpcMessage, game_1.SceneChangeMessage, game_1.SpawnMessage);
        this.register(rpc_1.AddVoteMessage, rpc_1.CastVoteMessage, rpc_1.CheckColorMessage, rpc_1.CheckNameMessage, rpc_1.ClearVoteMessage, rpc_1.ClimbLadderMessage, rpc_1.CloseMessage, rpc_1.CloseDoorsOfTypeMessage, rpc_1.CompleteTaskMessage, rpc_1.EnterVentMessage, rpc_1.ExiledMessage, rpc_1.ExitVentMessage, rpc_1.MurderPlayerMessage, rpc_1.PlayAnimationMessage, rpc_1.RepairSystemMessage, rpc_1.ReportDeadBodyMessage, rpc_1.SendChatMessage, rpc_1.SendChatNoteMessage, rpc_1.SetColorMessage, rpc_1.SetHatMessage, rpc_1.SetInfectedMessage, rpc_1.SetNameMessage, rpc_1.SetPetMessage, rpc_1.SetScanner, rpc_1.SetSkinMessage, rpc_1.SetStartCounterMessage, rpc_1.SetTasksMessage, rpc_1.SnapToMessage, rpc_1.StartMeetingMessage, rpc_1.SyncSettingsMessage, rpc_1.UsePlatformMessage, rpc_1.VotingCompleteMessage);
    }
    getClasses(type) {
        const classes = this.types.get(type);
        if (classes) {
            return classes;
        }
        this.types.set(type, new Map());
        return this.getClasses(type);
    }
    /**
     * Register a message or several messages to the packet decoder.
     * @param messageClasses The packet or packets to register.
     */
    register(...messageClasses) {
        for (const messageClass of messageClasses) {
            const classes = this.getClasses(messageClass.type);
            classes.set(messageClass.tag, messageClass);
        }
    }
    /**
     * Emit a decoded message to all listeners concurrently, also emits the message's children recursively.
     * @param message The message to emit.
     * @param direction The direction that the message was sent.
     * @param sender Additional metadata for the message, e.g. the sender.
     */
    async emitDecoded(message, direction, sender) {
        if (message.children) {
            for (const child of message.children) {
                await this.emitDecoded(child, direction, sender);
            }
        }
        await this.emit(message, direction, sender);
    }
    /**
     * Emit a decoded message to all listeners serially, also emits the message's children recursively.
     * @param message The message to emit.
     * @param direction The direction that the message was sent.
     * @param sender Additional metadata for the message, e.g. the sender.
     */
    async emitDecodedSerial(message, direction, sender) {
        if (message.children) {
            for (const child of message.children) {
                await this.emitDecodedSerial(child, direction, sender);
            }
        }
        await this.emitSerial(message, direction, sender);
    }
    async emit(message, direction, sender) {
        const classes = this.types.get(message.type);
        if (classes) {
            const messageClass = classes.get(message.tag);
            if (messageClass) {
                const listeners = this.getListeners(messageClass);
                await Promise.all([...listeners].map(listener => listener(message, direction, sender)));
            }
        }
    }
    async emitSerial(message, direction, sender) {
        const classes = this.types.get(message.type);
        if (classes) {
            const messageClass = classes.get(message.tag);
            if (messageClass) {
                const listeners = this.getListeners(messageClass);
                for (const listener of listeners) {
                    await listener(message, direction, sender);
                }
            }
        }
    }
    /**
     * Get all listeners for a packet.
     * @param messageClass The packet to get listeners for.
     * @returns All listeners for the packet.
     */
    getListeners(messageClass) {
        const listeners = this.listeners.get(messageClass);
        if (listeners)
            return listeners;
        this.listeners.set(messageClass, new Set());
        return this.getListeners(messageClass);
    }
    on(messageClass, listener) {
        if (Array.isArray(messageClass)) {
            for (const single of messageClass) {
                const listeners = this.getListeners(single);
                listeners.add(listener);
            }
        }
        else {
            const listeners = this.getListeners(messageClass);
            listeners.add(listener);
        }
        return this.off.bind(this, messageClass, listener);
    }
    off(messageClass, listener) {
        if (Array.isArray(messageClass)) {
            for (const single of messageClass) {
                const listeners = this.getListeners(single);
                listeners.delete(listener);
            }
        }
        else {
            const listeners = this.getListeners(messageClass);
            listeners.delete(listener);
        }
    }
    once(messageClass, listener) {
        const removeListener = this.on(messageClass, (message, direction, sender) => {
            removeListener();
            listener(message, direction, sender);
        });
        return removeListener;
    }
    /**
     * Asynchronously wait for a message to be decoded.
     * @param messageClass The message to listen for.
     * @returns A promise containing the message, direciton and sender metadata for the message.
     */
    wait(messageClass) {
        return new Promise((resolve) => {
            this.once(messageClass, (message, direction, sender) => {
                resolve({ message, direction, sender });
            });
        });
    }
    /**
     * Asynchronously wait for a specific message to be decoded.
     * @param messageClass The message to listen for.
     * @param filter A filter for the message to wait for.
     * @returns A function to remove the listener.
     */
    waitf(messageClass, filter) {
        return new Promise((resolve) => {
            const removeListener = this.on(messageClass, (message, direction, sender) => {
                if (filter(message, direction, sender)) {
                    removeListener();
                    resolve({ message, direction, sender });
                }
            });
        });
    }
    _parse(reader, direction = MessageDirection.Clientbound) {
        if (Buffer.isBuffer(reader)) {
            return this._parse(util_1.HazelReader.from(reader), direction);
        }
        const optionMessages = this.types.get("option");
        if (!optionMessages)
            return null;
        const sendOption = reader.uint8();
        const optionMessageClass = optionMessages.get(sendOption);
        if (!optionMessageClass)
            return null;
        const message = optionMessageClass.Deserialize(reader, direction, this);
        return message;
    }
    /**
     * Write a buffer or reader to the decoder.
     * @param reader The buffer or reader to decode.
     * @param direction The direction that the packet was sent.
     * @param sender Additional metadata for the sender.
     */
    async write(reader, direction = MessageDirection.Clientbound, sender) {
        const message = this._parse(reader, direction);
        if (message) {
            await this.emitDecoded(message, direction, sender);
        }
        return message;
    }
    /**
     * Parse a buffer or reader in place, without emitting the resultant message.
     * @param reader The buffer or reader to parse.
     * @param direction The direction that the packet was sent.
     * @returns The parsed message.
     */
    parse(reader, direction = MessageDirection.Clientbound) {
        return this._parse(reader, direction);
    }
}
exports.PacketDecoder = PacketDecoder;
//# sourceMappingURL=PacketDecoder.js.map

/***/ }),

/***/ 8178:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(6966), exports);
__exportStar(__webpack_require__(4395), exports);
__exportStar(__webpack_require__(9241), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7797:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentSpawnData = void 0;
class ComponentSpawnData {
    constructor(netid, data) {
        this.netid = netid;
        this.data = data;
    }
    static Deserialize(reader) {
        const netid = reader.upacked();
        const [, data] = reader.message();
        return new ComponentSpawnData(netid, data.buffer);
    }
    Serialize(writer) {
        writer.upacked(this.netid);
        writer.begin(1);
        writer.bytes(this.data);
        writer.end();
    }
}
exports.ComponentSpawnData = ComponentSpawnData;
//# sourceMappingURL=ComponentSpawnData.js.map

/***/ }),

/***/ 4780:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameListing = void 0;
const util_1 = __webpack_require__(5131);
class GameListing {
    constructor(code, ip, port, name, num_players, age, map, num_impostors, max_players) {
        this.ip = ip;
        this.port = port;
        this.name = name;
        this.num_players = num_players;
        this.age = age;
        this.map = map;
        this.num_impostors = num_impostors;
        this.max_players = max_players;
        if (typeof code === "string") {
            this.code = util_1.Code2Int(code);
        }
        else {
            this.code = code;
        }
    }
    static Deserialize(reader) {
        const ip = reader.bytes(4).buffer.join(".");
        const port = reader.uint16();
        const code = reader.int32();
        const name = reader.string();
        const num_players = reader.uint8();
        const age = reader.upacked();
        const map = reader.uint8();
        const num_impostors = reader.uint8();
        const max_players = reader.uint8();
        return new GameListing(code, ip, port, name, num_players, age, map, num_impostors, max_players);
    }
    Serialize(writer) {
        const split = this.ip.split(".");
        for (const part of split) {
            writer.uint8(parseInt(part));
        }
        writer.uint16(this.port);
        writer.int32(this.code);
        writer.string(this.name);
        writer.uint8(this.num_players);
        writer.upacked(this.age);
        writer.uint8(this.map);
        writer.uint8(this.num_impostors);
        writer.uint8(this.max_players);
    }
}
exports.GameListing = GameListing;
//# sourceMappingURL=GameListing.js.map

/***/ }),

/***/ 4508:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameOptions = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
class GameOptions {
    constructor(options = {}) {
        this.patch(options);
    }
    static isValid(options) {
        if (options.maxPlayers < 4 || options.maxPlayers > 10) {
            return false;
        }
        if (!(options.keywords in constant_1.GameKeyword)) {
            return false;
        }
        if (!(options.map in constant_1.GameMap)) {
            return false;
        }
        if (options.numImpostors < 1 || options.numImpostors > 3) {
            return false;
        }
        if (options.numEmergencies > 9) {
            return false;
        }
        if (options.emergencyCooldown < 0 || options.emergencyCooldown > 60) {
            return false;
        }
        if (options.discussionTime < 0 || options.discussionTime > 120) {
            return false;
        }
        if (options.votingTime < 0 || options.votingTime > 300) {
            return false;
        }
        if (options.playerSpeed < 0.5 || options.playerSpeed > 3) {
            return false;
        }
        if (options.crewmateVision < 0.25 || options.crewmateVision > 5) {
            return false;
        }
        if (options.impostorVision < 0.25 || options.impostorVision > 5) {
            return false;
        }
        if (options.killCooldown < 10 || options.killCooldown > 60) {
            return false;
        }
        if (!(options.killDistance in constant_1.KillDistance)) {
            return false;
        }
        if (!(options.taskbarUpdates in constant_1.TaskBarUpdate)) {
            return false;
        }
        if (options.commonTasks < 0 || options.commonTasks > 2) {
            return false;
        }
        if (options.longTasks < 0 || options.longTasks > 3) {
            return false;
        }
        if (options.shortTasks < 0 || options.shortTasks > 5) {
            return false;
        }
        return true;
    }
    patch(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        this.version = (_a = options.version) !== null && _a !== void 0 ? _a : 4;
        this.maxPlayers = (_b = options.maxPlayers) !== null && _b !== void 0 ? _b : 10;
        this.keywords = (_c = options.keywords) !== null && _c !== void 0 ? _c : constant_1.GameKeyword.Other;
        this.map = (_d = options.map) !== null && _d !== void 0 ? _d : constant_1.GameMap.MiraHQ;
        this.playerSpeed = (_e = options.playerSpeed) !== null && _e !== void 0 ? _e : 1;
        this.crewmateVision = (_f = options.crewmateVision) !== null && _f !== void 0 ? _f : 1;
        this.impostorVision = (_g = options.impostorVision) !== null && _g !== void 0 ? _g : 1.5;
        this.killCooldown = (_h = options.killCooldown) !== null && _h !== void 0 ? _h : 45;
        this.commonTasks = (_j = options.commonTasks) !== null && _j !== void 0 ? _j : 1;
        this.longTasks = (_k = options.longTasks) !== null && _k !== void 0 ? _k : 1;
        this.shortTasks = (_l = options.shortTasks) !== null && _l !== void 0 ? _l : 2;
        this.numEmergencies = (_m = options.numEmergencies) !== null && _m !== void 0 ? _m : 1;
        this.numImpostors = (_o = options.numImpostors) !== null && _o !== void 0 ? _o : 1;
        this.killDistance = (_p = options.killDistance) !== null && _p !== void 0 ? _p : constant_1.KillDistance.Medium;
        this.discussionTime = (_q = options.discussionTime) !== null && _q !== void 0 ? _q : 15;
        this.votingTime = (_r = options.votingTime) !== null && _r !== void 0 ? _r : 120;
        this.isDefaults = (_s = options.isDefaults) !== null && _s !== void 0 ? _s : false;
        this.emergencyCooldown = (_t = options.emergencyCooldown) !== null && _t !== void 0 ? _t : 15;
        this.confirmEjects = (_u = options.confirmEjects) !== null && _u !== void 0 ? _u : true;
        this.visualTasks = (_v = options.visualTasks) !== null && _v !== void 0 ? _v : true;
        this.anonymousVotes = (_w = options.anonymousVotes) !== null && _w !== void 0 ? _w : false;
        this.taskbarUpdates = (_x = options.taskbarUpdates) !== null && _x !== void 0 ? _x : constant_1.TaskBarUpdate.Always;
    }
    static Deserialize(reader) {
        return new GameOptions().Deserialize(reader);
    }
    Deserialize(reader) {
        const length = reader.upacked();
        const oreader = reader.bytes(length);
        this.version = oreader.uint8();
        this.maxPlayers = oreader.uint8();
        this.keywords = oreader.uint32();
        this.map = oreader.uint8();
        this.playerSpeed = oreader.float();
        this.crewmateVision = oreader.float();
        this.impostorVision = oreader.float();
        this.killCooldown = oreader.float();
        this.commonTasks = oreader.uint8();
        this.longTasks = oreader.uint8();
        this.shortTasks = oreader.uint8();
        this.numEmergencies = oreader.uint32();
        this.numImpostors = oreader.uint8();
        this.killDistance = oreader.uint8();
        this.discussionTime = oreader.uint32();
        this.votingTime = oreader.uint32();
        this.isDefaults = oreader.bool();
        if (this.version >= 2) {
            this.emergencyCooldown = oreader.uint8();
            if (this.version >= 3) {
                this.confirmEjects = oreader.bool();
                this.visualTasks = oreader.bool();
                if (this.version >= 4) {
                    this.anonymousVotes = oreader.bool();
                    this.taskbarUpdates = oreader.uint8();
                }
            }
        }
        return this;
    }
    Serialize(writer) {
        const owriter = util_1.HazelWriter.alloc(42);
        owriter.uint8(this.version);
        owriter.uint8(this.maxPlayers);
        owriter.uint32(this.keywords);
        owriter.uint8(this.map);
        owriter.float(this.playerSpeed);
        owriter.float(this.crewmateVision);
        owriter.float(this.impostorVision);
        owriter.float(this.killCooldown);
        owriter.uint8(this.commonTasks);
        owriter.uint8(this.longTasks);
        owriter.uint8(this.shortTasks);
        owriter.uint32(this.numEmergencies);
        owriter.uint8(this.numImpostors);
        owriter.uint8(this.killDistance);
        owriter.uint32(this.discussionTime);
        owriter.uint32(this.votingTime);
        owriter.bool(this.isDefaults);
        if (this.version >= 2) {
            owriter.uint8(this.emergencyCooldown);
            if (this.version >= 3) {
                owriter.bool(this.confirmEjects);
                owriter.bool(this.visualTasks);
                if (this.version >= 4) {
                    owriter.bool(this.anonymousVotes);
                    owriter.uint8(this.taskbarUpdates);
                }
            }
        }
        writer.upacked(owriter.size);
        writer.bytes(owriter);
    }
}
exports.GameOptions = GameOptions;
//# sourceMappingURL=GameOptions.js.map

/***/ }),

/***/ 6966:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(7797), exports);
__exportStar(__webpack_require__(4780), exports);
__exportStar(__webpack_require__(4508), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3426:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseMessage = void 0;
class BaseMessage {
    constructor() {
        this._canceled = false;
    }
    get canceled() {
        return this._canceled;
    }
    static Deserialize(reader, direction, decoder) {
        void reader, direction, decoder;
        return new BaseMessage();
    }
    Serialize(writer, direction, decoder) {
        void writer, direction, decoder;
    }
    cancel() {
        this._canceled = true;
    }
}
exports.BaseMessage = BaseMessage;
//# sourceMappingURL=BaseMessage.js.map

/***/ }),

/***/ 8907:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseGameDataMessage = void 0;
const BaseMessage_1 = __webpack_require__(3426);
class BaseGameDataMessage extends BaseMessage_1.BaseMessage {
    constructor() {
        super();
        this.type = "gamedata";
    }
}
exports.BaseGameDataMessage = BaseGameDataMessage;
BaseGameDataMessage.type = "gamedata";
//# sourceMappingURL=BaseGameDataMessage.js.map

/***/ }),

/***/ 9103:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientInfoMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseGameDataMessage_1 = __webpack_require__(8907);
class ClientInfoMessage extends BaseGameDataMessage_1.BaseGameDataMessage {
    constructor(clientid, platform) {
        super();
        this.tag = constant_1.GameDataMessageTag.ClientInfo;
        this.clientid = clientid;
        this.platform = platform;
    }
    static Deserialize(reader) {
        const clientid = reader.packed();
        const platform = reader.upacked();
        return new ClientInfoMessage(clientid, platform);
    }
    Serialize(writer) {
        writer.packed(this.clientid);
        writer.upacked(this.platform);
    }
}
exports.ClientInfoMessage = ClientInfoMessage;
ClientInfoMessage.tag = constant_1.GameDataMessageTag.ClientInfo;
//# sourceMappingURL=ClientInfo.js.map

/***/ }),

/***/ 3620:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseGameDataMessage_1 = __webpack_require__(8907);
class DataMessage extends BaseGameDataMessage_1.BaseGameDataMessage {
    constructor(netid, data) {
        super();
        this.tag = constant_1.GameDataMessageTag.Data;
        this.netid = netid;
        this.data = data;
    }
    static Deserialize(reader) {
        const netid = reader.upacked();
        const data = reader.bytes(reader.left);
        return new DataMessage(netid, data.buffer);
    }
    Serialize(writer) {
        writer.upacked(this.netid);
        writer.bytes(this.data);
    }
}
exports.DataMessage = DataMessage;
DataMessage.tag = constant_1.GameDataMessageTag.Data;
//# sourceMappingURL=Data.js.map

/***/ }),

/***/ 9605:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DespawnMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseGameDataMessage_1 = __webpack_require__(8907);
class DespawnMessage extends BaseGameDataMessage_1.BaseGameDataMessage {
    constructor(netid) {
        super();
        this.tag = constant_1.GameDataMessageTag.Despawn;
        this.netid = netid;
    }
    static Deserialize(reader) {
        const netid = reader.upacked();
        return new DespawnMessage(netid);
    }
    Serialize(writer) {
        writer.upacked(this.netid);
    }
}
exports.DespawnMessage = DespawnMessage;
DespawnMessage.tag = constant_1.GameDataMessageTag.Despawn;
//# sourceMappingURL=Despawn.js.map

/***/ }),

/***/ 5906:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReadyMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseGameDataMessage_1 = __webpack_require__(8907);
class ReadyMessage extends BaseGameDataMessage_1.BaseGameDataMessage {
    constructor(clientid) {
        super();
        this.tag = constant_1.GameDataMessageTag.Ready;
        this.clientid = clientid;
    }
    static Deserialize(reader) {
        const clientid = reader.packed();
        return new ReadyMessage(clientid);
    }
    Serialize(writer) {
        writer.packed(this.clientid);
    }
}
exports.ReadyMessage = ReadyMessage;
ReadyMessage.tag = constant_1.GameDataMessageTag.Ready;
//# sourceMappingURL=Ready.js.map

/***/ }),

/***/ 3195:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RpcMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
const BaseGameDataMessage_1 = __webpack_require__(8907);
class RpcMessage extends BaseGameDataMessage_1.BaseGameDataMessage {
    constructor(netid, data) {
        super();
        this.tag = constant_1.GameDataMessageTag.RPC;
        this.netid = netid;
        this.data = data;
    }
    get children() {
        return [this.data];
    }
    static Deserialize(reader, direction, decoder) {
        const netid = reader.upacked();
        const callid = reader.uint8();
        const rpcMessages = decoder.types.get("rpc");
        if (!rpcMessages)
            return new RpcMessage(netid, new BaseRpcMessage_1.BaseRpcMessage());
        const mreader = reader.bytes(reader.left);
        const rpcMessageClass = rpcMessages.get(callid);
        if (!rpcMessageClass)
            return new RpcMessage(netid, new BaseRpcMessage_1.BaseRpcMessage());
        const rpc = rpcMessageClass.Deserialize(mreader, direction, decoder);
        return new RpcMessage(netid, rpc);
    }
    Serialize(writer, direction, decoder) {
        writer.upacked(this.netid);
        writer.uint8(this.data.tag);
        writer.write(this.data, direction, decoder);
    }
}
exports.RpcMessage = RpcMessage;
RpcMessage.tag = constant_1.GameDataMessageTag.RPC;
//# sourceMappingURL=Rpc.js.map

/***/ }),

/***/ 4465:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SceneChangeMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseGameDataMessage_1 = __webpack_require__(8907);
class SceneChangeMessage extends BaseGameDataMessage_1.BaseGameDataMessage {
    constructor(clientid, scene) {
        super();
        this.tag = constant_1.GameDataMessageTag.SceneChange;
        this.clientid = clientid;
        this.scene = scene;
    }
    static Deserialize(reader) {
        const clientid = reader.packed();
        const scene = reader.string();
        return new SceneChangeMessage(clientid, scene);
    }
    Serialize(writer) {
        writer.packed(this.clientid);
        writer.string(this.scene);
    }
}
exports.SceneChangeMessage = SceneChangeMessage;
SceneChangeMessage.tag = constant_1.GameDataMessageTag.SceneChange;
//# sourceMappingURL=SceneChange.js.map

/***/ }),

/***/ 1643:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpawnMessage = void 0;
const constant_1 = __webpack_require__(492);
const misc_1 = __webpack_require__(6966);
const BaseGameDataMessage_1 = __webpack_require__(8907);
class SpawnMessage extends BaseGameDataMessage_1.BaseGameDataMessage {
    constructor(spawnType, ownerid, flags, components) {
        super();
        this.tag = constant_1.GameDataMessageTag.Spawn;
        this.spawnType = spawnType;
        this.ownerid = ownerid;
        this.flags = flags;
        this.components = components;
    }
    static Deserialize(reader) {
        const spawnType = reader.upacked();
        const ownerid = reader.packed();
        const flags = reader.uint8();
        const num_components = reader.upacked();
        const components = reader.lread(num_components, misc_1.ComponentSpawnData);
        return new SpawnMessage(spawnType, ownerid, flags, components);
    }
    Serialize(writer) {
        writer.upacked(this.spawnType);
        writer.packed(this.ownerid);
        writer.uint8(this.flags);
        writer.lwrite(true, this.components);
    }
}
exports.SpawnMessage = SpawnMessage;
SpawnMessage.tag = constant_1.GameDataMessageTag.Spawn;
//# sourceMappingURL=Spawn.js.map

/***/ }),

/***/ 571:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(8907), exports);
__exportStar(__webpack_require__(9103), exports);
__exportStar(__webpack_require__(3620), exports);
__exportStar(__webpack_require__(9605), exports);
__exportStar(__webpack_require__(8907), exports);
__exportStar(__webpack_require__(5906), exports);
__exportStar(__webpack_require__(3195), exports);
__exportStar(__webpack_require__(4465), exports);
__exportStar(__webpack_require__(1643), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4395:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(571), exports);
__exportStar(__webpack_require__(9467), exports);
__exportStar(__webpack_require__(8514), exports);
__exportStar(__webpack_require__(2124), exports);
__exportStar(__webpack_require__(3426), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3510:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AcknowledgePacket = void 0;
const constant_1 = __webpack_require__(492);
const BaseRootPacket_1 = __webpack_require__(2071);
class AcknowledgePacket extends BaseRootPacket_1.BaseRootPacket {
    constructor(nonce, missingPackets) {
        super();
        this.tag = constant_1.SendOption.Acknowledge;
        this.nonce = nonce;
        this.missingPackets = missingPackets;
    }
    static Deserialize(reader) {
        const nonce = reader.uint16(true);
        const missing = reader.uint8();
        const arr = [];
        for (let i = 0; i < 8; i++) {
            if ((missing & (1 << i)) === 0) {
                arr.push(i);
            }
        }
        return new AcknowledgePacket(nonce, arr);
    }
    Serialize(writer) {
        writer.uint16(this.nonce, true);
        let bit = 0xff;
        for (let i = 0; i < this.missingPackets.length; i++) {
            bit &= ~(1 << this.missingPackets[i]);
        }
        writer.uint8(bit);
    }
}
exports.AcknowledgePacket = AcknowledgePacket;
AcknowledgePacket.tag = constant_1.SendOption.Acknowledge;
//# sourceMappingURL=Acknowledge.js.map

/***/ }),

/***/ 2071:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseRootPacket = void 0;
const BaseMessage_1 = __webpack_require__(3426);
class BaseRootPacket extends BaseMessage_1.BaseMessage {
    constructor() {
        super();
        this.type = "option";
    }
}
exports.BaseRootPacket = BaseRootPacket;
BaseRootPacket.type = "option";
//# sourceMappingURL=BaseRootPacket.js.map

/***/ }),

/***/ 1290:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DisconnectPacket = void 0;
const constant_1 = __webpack_require__(492);
const BaseRootPacket_1 = __webpack_require__(2071);
class DisconnectPacket extends BaseRootPacket_1.BaseRootPacket {
    constructor(reason, message, showReason) {
        super();
        this.tag = constant_1.SendOption.Disconnect;
        this.reason = reason;
        this.message = message;
        this.showReason = showReason;
    }
    static Deserialize(reader) {
        if (reader.left) {
            const showReason = reader.bool();
            if (reader.left) {
                const [, mreader] = reader.message();
                const reason = mreader.uint8();
                if (reason === constant_1.DisconnectReason.Custom && mreader.left) {
                    const message = mreader.string();
                    return new DisconnectPacket(reason, message, showReason);
                }
                return new DisconnectPacket(reason, "", showReason);
            }
            else {
                return new DisconnectPacket(constant_1.DisconnectReason.None, "", showReason);
            }
        }
        else {
            return new DisconnectPacket(constant_1.DisconnectReason.None, "", true);
        }
    }
    Serialize(writer) {
        var _a;
        if (typeof this.showReason === "boolean" ||
            typeof this.reason === "number") {
            writer.bool((_a = this.showReason) !== null && _a !== void 0 ? _a : true);
            if (typeof this.reason === "number") {
                writer.begin(0);
                writer.uint8(this.reason);
                if (this.reason === constant_1.DisconnectReason.Custom &&
                    typeof this.message === "string") {
                    writer.string(this.message);
                }
                writer.end();
            }
        }
    }
}
exports.DisconnectPacket = DisconnectPacket;
DisconnectPacket.tag = constant_1.SendOption.Disconnect;
//# sourceMappingURL=Disconnect.js.map

/***/ }),

/***/ 2828:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HelloPacket = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const BaseRootPacket_1 = __webpack_require__(2071);
class HelloPacket extends BaseRootPacket_1.BaseRootPacket {
    constructor(nonce, clientver, username, token) {
        super();
        this.tag = constant_1.SendOption.Hello;
        this.nonce = nonce;
        this.clientver = clientver;
        this.username = username;
        this.token = token;
    }
    static Deserialize(reader) {
        const nonce = reader.uint16(true);
        reader.jump(1); // Skip hazel version.
        const clientver = reader.read(util_1.VersionInfo);
        const username = reader.string();
        const token = reader.uint32();
        return new HelloPacket(nonce, clientver, username, token);
    }
    Serialize(writer) {
        writer.uint16(this.nonce, true);
        writer.uint8(0);
        writer.write(this.clientver);
        writer.string(this.username);
        writer.uint32(this.token);
    }
}
exports.HelloPacket = HelloPacket;
HelloPacket.tag = constant_1.SendOption.Hello;
//# sourceMappingURL=Hello.js.map

/***/ }),

/***/ 5259:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NormalPacket = void 0;
const BaseRootPacket_1 = __webpack_require__(2071);
class NormalPacket extends BaseRootPacket_1.BaseRootPacket {
    constructor(children) {
        super();
        this.children = children;
    }
    static Deserialize(reader, direction, decoder) {
        const rootMessages = decoder.types.get("root");
        if (!rootMessages)
            return new NormalPacket([]);
        const children = [];
        while (reader.left) {
            const [tag, mreader] = reader.message();
            const rootMessageClass = rootMessages.get(tag);
            if (!rootMessageClass)
                continue;
            const root = rootMessageClass.Deserialize(mreader, direction, decoder);
            children.push(root);
        }
        return new NormalPacket(children);
    }
    Serialize(writer, direction, decoder) {
        const rootMessages = decoder.types.get("root");
        if (!rootMessages)
            return;
        for (const message of this.children) {
            if (!rootMessages.has(message.tag))
                continue;
            writer.begin(message.tag);
            writer.write(message, direction, decoder);
            writer.end();
        }
    }
}
exports.NormalPacket = NormalPacket;
//# sourceMappingURL=Normal.js.map

/***/ }),

/***/ 3934:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PingPacket = void 0;
const constant_1 = __webpack_require__(492);
const BaseRootPacket_1 = __webpack_require__(2071);
class PingPacket extends BaseRootPacket_1.BaseRootPacket {
    constructor(nonce) {
        super();
        this.tag = constant_1.SendOption.Ping;
        this.nonce = nonce;
    }
    static Deserialize(reader) {
        const nonce = reader.uint16(true);
        return new PingPacket(nonce);
    }
    Serialize(writer) {
        writer.uint16(this.nonce, true);
    }
}
exports.PingPacket = PingPacket;
PingPacket.tag = constant_1.SendOption.Ping;
//# sourceMappingURL=Ping.js.map

/***/ }),

/***/ 8683:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReliablePacket = void 0;
const constant_1 = __webpack_require__(492);
const Normal_1 = __webpack_require__(5259);
class ReliablePacket extends Normal_1.NormalPacket {
    constructor(nonce, children) {
        super(children);
        this.tag = constant_1.SendOption.Reliable;
        this.nonce = nonce;
    }
    static Deserialize(reader, direction, decoder) {
        const nonce = reader.uint16(true);
        const normal = super.Deserialize(reader, direction, decoder);
        return new ReliablePacket(nonce, normal.children);
    }
    Serialize(writer, direction, decoder) {
        writer.uint16(this.nonce, true);
        super.Serialize(writer, direction, decoder);
    }
}
exports.ReliablePacket = ReliablePacket;
ReliablePacket.tag = constant_1.SendOption.Reliable;
//# sourceMappingURL=Reliable.js.map

/***/ }),

/***/ 2460:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnreliablePacket = void 0;
const constant_1 = __webpack_require__(492);
const Normal_1 = __webpack_require__(5259);
class UnreliablePacket extends Normal_1.NormalPacket {
    constructor(children) {
        super(children);
        this.tag = constant_1.SendOption.Unreliable;
    }
    static Deserialize(reader, direction, decoder) {
        const normal = super.Deserialize(reader, direction, decoder);
        return new UnreliablePacket(normal.children);
    }
}
exports.UnreliablePacket = UnreliablePacket;
UnreliablePacket.tag = constant_1.SendOption.Unreliable;
//# sourceMappingURL=Unreliable.js.map

/***/ }),

/***/ 9467:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(3510), exports);
__exportStar(__webpack_require__(1290), exports);
__exportStar(__webpack_require__(2828), exports);
__exportStar(__webpack_require__(5259), exports);
__exportStar(__webpack_require__(3934), exports);
__exportStar(__webpack_require__(8683), exports);
__exportStar(__webpack_require__(2071), exports);
__exportStar(__webpack_require__(2460), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1509:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlterGameMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const BaseRootMessage_1 = __webpack_require__(5072);
class AlterGameMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(code, alter_tag, value) {
        super();
        this.tag = constant_1.RootMessageTag.AlterGame;
        if (typeof code === "string") {
            this.code = util_1.Code2Int(code);
        }
        else {
            this.code = code;
        }
        this.alterTag = alter_tag;
        this.value = value;
    }
    static Deserialize(reader) {
        const code = reader.int32();
        const alter_tag = reader.uint8();
        const value = reader.uint8();
        return new AlterGameMessage(code, alter_tag, value);
    }
    Serialize(writer) {
        writer.int32(this.code);
        writer.uint8(this.alterTag);
        writer.uint8(this.value);
    }
}
exports.AlterGameMessage = AlterGameMessage;
AlterGameMessage.tag = constant_1.RootMessageTag.AlterGame;
//# sourceMappingURL=AlterGame.js.map

/***/ }),

/***/ 5072:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseRootMessage = void 0;
const BaseMessage_1 = __webpack_require__(3426);
class BaseRootMessage extends BaseMessage_1.BaseMessage {
    constructor() {
        super();
        this.type = "root";
    }
}
exports.BaseRootMessage = BaseRootMessage;
BaseRootMessage.type = "root";
//# sourceMappingURL=BaseRootMessage.js.map

/***/ }),

/***/ 1023:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EndGameMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const BaseRootMessage_1 = __webpack_require__(5072);
class EndGameMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(code, reason, show_ad) {
        super();
        this.tag = constant_1.RootMessageTag.EndGame;
        if (typeof code === "string") {
            this.code = util_1.Code2Int(code);
        }
        else {
            this.code = code;
        }
        this.reason = reason;
        this.show_ad = show_ad;
    }
    static Deserialize(reader) {
        const code = reader.int32();
        const reason = reader.uint8();
        const show_ad = reader.bool();
        return new EndGameMessage(code, reason, show_ad);
    }
    Serialize(writer) {
        writer.int32(this.code);
        writer.uint8(this.reason);
        writer.bool(this.show_ad);
    }
}
exports.EndGameMessage = EndGameMessage;
EndGameMessage.tag = constant_1.RootMessageTag.EndGame;
//# sourceMappingURL=EndGame.js.map

/***/ }),

/***/ 6877:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameDataMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const BaseRootMessage_1 = __webpack_require__(5072);
class GameDataMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(code, children) {
        super();
        this.tag = constant_1.RootMessageTag.GameData;
        if (typeof code === "string") {
            this.code = util_1.Code2Int(code);
        }
        else {
            this.code = code;
        }
        this.children = children;
    }
    static Deserialize(reader, direction, decoder) {
        const code = reader.int32();
        const rootMessages = decoder.types.get("gamedata");
        if (!rootMessages)
            return new GameDataMessage(code, []);
        const children = [];
        while (reader.left) {
            const [tag, mreader] = reader.message();
            const rootMessageClass = rootMessages.get(tag);
            if (!rootMessageClass)
                continue;
            const root = rootMessageClass.Deserialize(mreader, direction, decoder);
            children.push(root);
        }
        return new GameDataMessage(code, children);
    }
    Serialize(writer, direction, decoder) {
        writer.int32(this.code);
        const rootMessages = decoder.types.get("gamedata");
        if (!rootMessages)
            return;
        for (const message of this.children) {
            if (!rootMessages.has(message.tag))
                continue;
            writer.begin(message.tag);
            writer.write(message, direction, decoder);
            writer.end();
        }
    }
}
exports.GameDataMessage = GameDataMessage;
GameDataMessage.tag = constant_1.RootMessageTag.GameData;
//# sourceMappingURL=GameData.js.map

/***/ }),

/***/ 8319:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameDataToMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const BaseRootMessage_1 = __webpack_require__(5072);
class GameDataToMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(code, recipientid, children) {
        super();
        this.tag = constant_1.RootMessageTag.GameDataTo;
        if (typeof code === "string") {
            this.code = util_1.Code2Int(code);
        }
        else {
            this.code = code;
        }
        this.recipientid = recipientid;
        this._children = children;
    }
    static Deserialize(reader, direction, decoder) {
        const code = reader.int32();
        const recipientid = reader.packed();
        const rootMessages = decoder.types.get("gamedata");
        if (!rootMessages)
            return new GameDataToMessage(code, recipientid, []);
        const children = [];
        while (reader.left) {
            const [tag, mreader] = reader.message();
            const rootMessageClass = rootMessages.get(tag);
            if (!rootMessageClass)
                continue;
            const root = rootMessageClass.Deserialize(mreader, direction, decoder);
            children.push(root);
        }
        return new GameDataToMessage(code, recipientid, children);
    }
    Serialize(writer, direction, decoder) {
        writer.int32(this.code);
        writer.packed(this.recipientid);
        const rootMessages = decoder.types.get("gamedata");
        if (!rootMessages)
            return;
        for (const message of this._children) {
            if (!rootMessages.has(message.tag))
                continue;
            writer.begin(message.tag);
            writer.write(message, direction, decoder);
            writer.end();
        }
    }
}
exports.GameDataToMessage = GameDataToMessage;
GameDataToMessage.tag = constant_1.RootMessageTag.GameDataTo;
//# sourceMappingURL=GameDataTo.js.map

/***/ }),

/***/ 75:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetGameListMessage = void 0;
const constant_1 = __webpack_require__(492);
const misc_1 = __webpack_require__(6966);
const PacketDecoder_1 = __webpack_require__(9241);
const BaseRootMessage_1 = __webpack_require__(5072);
class GetGameListMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(arg0, arg1) {
        super();
        this.tag = constant_1.RootMessageTag.GetGameListV2;
        if (Array.isArray(arg0)) {
            this.gameList = arg0;
            this.gameCounts = arg1;
        }
        else {
            this.options = arg0;
            this.quickchat = arg1;
        }
    }
    static Deserialize(reader, direction) {
        if (direction === PacketDecoder_1.MessageDirection.Clientbound) {
            const gameCounts = {};
            const gameList = [];
            while (reader.left) {
                const [tag, mreader] = reader.message();
                switch (tag) {
                    case constant_1.GetGameListTag.GameCounts:
                        gameCounts[constant_1.GameMap.TheSkeld] = mreader.uint32();
                        gameCounts[constant_1.GameMap.MiraHQ] = mreader.uint32();
                        gameCounts[constant_1.GameMap.Polus] = mreader.uint32();
                        break;
                    case constant_1.GetGameListTag.GameList:
                        while (mreader.left) {
                            const [, lreader] = mreader.message();
                            const listing = lreader.read(misc_1.GameListing);
                            gameList.push(listing);
                        }
                        break;
                }
            }
            return new GetGameListMessage(gameList, gameCounts);
        }
        else {
            reader.upacked(); // Skip hard-coded value at 0x02
            const options = misc_1.GameOptions.Deserialize(reader);
            const quickchat = reader.uint8();
            return new GetGameListMessage(options, quickchat);
        }
    }
    Serialize(writer, direction) {
        if (direction === PacketDecoder_1.MessageDirection.Clientbound) {
            if (this.gameCounts) {
                writer.begin(constant_1.GetGameListTag.GameCounts);
                writer.uint32(this.gameCounts[constant_1.GameMap.TheSkeld] || 0);
                writer.uint32(this.gameCounts[constant_1.GameMap.MiraHQ] || 0);
                writer.uint32(this.gameCounts[constant_1.GameMap.Polus] || 0);
                writer.end();
            }
            writer.begin(constant_1.GetGameListTag.GameList);
            for (const listing of this.gameList) {
                writer.begin(0);
                writer.write(listing);
                writer.end();
            }
            writer.end();
        }
        else {
            writer.upacked(0x02);
            writer.write(this.options);
            writer.uint8(this.quickchat);
        }
    }
}
exports.GetGameListMessage = GetGameListMessage;
GetGameListMessage.tag = constant_1.RootMessageTag.GetGameListV2;
//# sourceMappingURL=GetGameList.js.map

/***/ }),

/***/ 4336:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HostGameMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const misc_1 = __webpack_require__(6966);
const PacketDecoder_1 = __webpack_require__(9241);
const BaseRootMessage_1 = __webpack_require__(5072);
class HostGameMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(options, quickchat) {
        super();
        this.tag = constant_1.RootMessageTag.HostGame;
        if (typeof options === "string") {
            this.code = util_1.Code2Int(options);
        }
        else if (typeof options === "number") {
            this.code = options;
        }
        else if (typeof quickchat === "number") {
            this.options = options;
            this.quickchat = quickchat;
        }
    }
    static Deserialize(reader, direction) {
        if (direction === PacketDecoder_1.MessageDirection.Clientbound) {
            const code = reader.int32();
            return new HostGameMessage(code);
        }
        else {
            const gameOptions = misc_1.GameOptions.Deserialize(reader);
            const quickChat = reader.uint8();
            return new HostGameMessage(gameOptions, quickChat);
        }
    }
    Serialize(writer, direction) {
        if (direction === PacketDecoder_1.MessageDirection.Clientbound) {
            writer.int32(this.code);
        }
        else {
            writer.write(this.options);
            writer.uint8(this.quickchat);
        }
    }
}
exports.HostGameMessage = HostGameMessage;
HostGameMessage.tag = constant_1.RootMessageTag.HostGame;
//# sourceMappingURL=HostGame.js.map

/***/ }),

/***/ 3716:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JoinGameMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const PacketDecoder_1 = __webpack_require__(9241);
const BaseRootMessage_1 = __webpack_require__(5072);
class JoinGameMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(code, clientid, hostid) {
        super();
        this.tag = constant_1.RootMessageTag.JoinGame;
        if (typeof code === "number") {
            if (constant_1.DisconnectReason[code]) {
                this.error = code;
                if (typeof clientid === "string") {
                    this.message = clientid;
                }
            }
            else {
                this.code = code;
            }
        }
        else {
            this.code = util_1.Code2Int(code);
        }
        if (typeof hostid === "number") {
            this.clientid = clientid;
            this.hostid = hostid;
        }
    }
    static Deserialize(reader, direction) {
        if (direction === PacketDecoder_1.MessageDirection.Clientbound) {
            const code = reader.int32();
            if (!constant_1.DisconnectReason[code]) {
                const clientid = reader.int32();
                const hostid = reader.int32();
                return new JoinGameMessage(code, clientid, hostid);
            }
            const message = code === constant_1.DisconnectReason.Custom && reader.left
                ? reader.string()
                : undefined;
            return new JoinGameMessage(code, message);
        }
        else {
            const code = reader.int32();
            return new JoinGameMessage(code);
        }
    }
    Serialize(writer, direction) {
        if (direction === PacketDecoder_1.MessageDirection.Clientbound) {
            if (this.code) {
                writer.int32(this.code);
                writer.int32(this.clientid);
                writer.int32(this.hostid);
            }
            else {
                writer.int32(this.error);
                if (this.error === constant_1.DisconnectReason.Custom &&
                    typeof this.message === "string") {
                    writer.string(this.message);
                }
            }
        }
        else {
            writer.int32(this.code);
        }
    }
}
exports.JoinGameMessage = JoinGameMessage;
JoinGameMessage.tag = constant_1.RootMessageTag.JoinGame;
//# sourceMappingURL=JoinGame.js.map

/***/ }),

/***/ 5796:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JoinedGameMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const BaseRootMessage_1 = __webpack_require__(5072);
class JoinedGameMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(code, clientid, hostid, others) {
        super();
        this.tag = constant_1.RootMessageTag.JoinedGame;
        if (typeof code === "string") {
            this.code = util_1.Code2Int(code);
        }
        else {
            this.code = code;
        }
        this.clientid = clientid;
        this.hostid = hostid;
        this.others = others;
    }
    static Deserialize(reader) {
        const code = reader.int32();
        const clientid = reader.int32();
        const hostid = reader.int32();
        const others = reader.list((r) => r.packed());
        return new JoinedGameMessage(code, clientid, hostid, others);
    }
    Serialize(writer) {
        writer.int32(this.code);
        writer.int32(this.clientid);
        writer.int32(this.hostid);
        writer.list(true, this.others, (other) => writer.packed(other));
    }
}
exports.JoinedGameMessage = JoinedGameMessage;
JoinedGameMessage.tag = constant_1.RootMessageTag.JoinedGame;
//# sourceMappingURL=JoinedGame.js.map

/***/ }),

/***/ 515:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KickPlayerMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const BaseRootMessage_1 = __webpack_require__(5072);
class KickPlayerMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(code, clientid, banned, reason) {
        super();
        this.tag = constant_1.RootMessageTag.KickPlayer;
        if (typeof code === "string") {
            this.code = util_1.Code2Int(code);
        }
        else {
            this.code = code;
        }
        this.clientid = clientid;
        this.banned = banned;
        this.reason = reason || constant_1.DisconnectReason.None;
    }
    static Deserialize(reader) {
        const code = reader.int32();
        const clientid = reader.packed();
        const banned = reader.bool();
        const reason = reader.left ? reader.uint8() : constant_1.DisconnectReason.None;
        return new KickPlayerMessage(code, clientid, banned, reason);
    }
    Serialize(writer) {
        writer.int32(this.code);
        writer.packed(this.clientid);
        writer.bool(this.banned);
        if (typeof this.reason === "number") {
            writer.uint8(this.reason);
        }
    }
}
exports.KickPlayerMessage = KickPlayerMessage;
KickPlayerMessage.tag = constant_1.RootMessageTag.KickPlayer;
//# sourceMappingURL=KickPlayer.js.map

/***/ }),

/***/ 563:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedirectMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRootMessage_1 = __webpack_require__(5072);
class RedirectMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(ip, port) {
        super();
        this.tag = constant_1.RootMessageTag.Redirect;
        this.ip = ip;
        this.port = port;
    }
    static Deserialize(reader) {
        const ip = reader.bytes(4).buffer.join(".");
        const port = reader.uint16();
        return new RedirectMessage(ip, port);
    }
    Serialize(writer) {
        const split = this.ip.split(".");
        for (const part of split) {
            writer.uint8(parseInt(part));
        }
        writer.uint16(this.port);
    }
}
exports.RedirectMessage = RedirectMessage;
RedirectMessage.tag = constant_1.RootMessageTag.Redirect;
//# sourceMappingURL=Redirect.js.map

/***/ }),

/***/ 191:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoveGameMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRootMessage_1 = __webpack_require__(5072);
class RemoveGameMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(reason) {
        super();
        this.tag = constant_1.RootMessageTag.RemoveGame;
        this.reason = reason || constant_1.DisconnectReason.None;
    }
    static Deserialize(reader) {
        const reason = reader.uint8();
        return new RemoveGameMessage(reason);
    }
    Serialize(writer) {
        writer.uint8(this.reason);
    }
}
exports.RemoveGameMessage = RemoveGameMessage;
RemoveGameMessage.tag = constant_1.RootMessageTag.RemoveGame;
//# sourceMappingURL=RemoveGame.js.map

/***/ }),

/***/ 2239:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemovePlayerMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const PacketDecoder_1 = __webpack_require__(9241);
const BaseRootMessage_1 = __webpack_require__(5072);
class RemovePlayerMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(code, clientid, reason, hostid) {
        super();
        this.tag = constant_1.RootMessageTag.RemovePlayer;
        if (typeof code === "string") {
            this.code = util_1.Code2Int(code);
        }
        else {
            this.code = code;
        }
        this.clientid = clientid;
        this.reason = reason;
        if (hostid)
            this.hostid = hostid;
    }
    static Deserialize(reader, direction) {
        if (direction === PacketDecoder_1.MessageDirection.Clientbound) {
            const code = reader.int32();
            const clientid = reader.int32();
            const hostid = reader.int32();
            const reason = reader.uint8();
            return new RemovePlayerMessage(code, clientid, reason, hostid);
        }
        else {
            const code = reader.int32();
            const clientid = reader.packed();
            const reason = reader.uint8();
            return new RemovePlayerMessage(code, clientid, reason);
        }
    }
    Serialize(writer, direction) {
        if (direction === PacketDecoder_1.MessageDirection.Clientbound) {
            writer.int32(this.code);
            writer.int32(this.clientid);
            writer.int32(this.hostid);
            writer.uint8(this.reason);
        }
        else {
            writer.int32(this.code);
            writer.packed(this.clientid);
            writer.uint8(this.reason);
        }
    }
}
exports.RemovePlayerMessage = RemovePlayerMessage;
RemovePlayerMessage.tag = constant_1.RootMessageTag.RemovePlayer;
//# sourceMappingURL=RemovePlayer.js.map

/***/ }),

/***/ 3215:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportPlayerMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const PacketDecoder_1 = __webpack_require__(9241);
const BaseRootMessage_1 = __webpack_require__(5072);
class ReportPlayerMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(code, clientid_reason, reason_outcome, name) {
        super();
        this.tag = constant_1.RootMessageTag.ReportPlayer;
        if (typeof name === "string") {
            this.clientid = code;
            this.reason = clientid_reason;
            this.outcome = reason_outcome;
            this.name = name;
        }
        else {
            if (typeof code === "string") {
                this.code = util_1.Code2Int(code);
            }
            else {
                this.code = code;
            }
            this.clientid = clientid_reason;
            this.reason = reason_outcome;
        }
    }
    static Deserialize(reader, direction) {
        if (direction === PacketDecoder_1.MessageDirection.Clientbound) {
            const clientid = reader.packed();
            const reason = reader.uint32();
            const outcome = reader.uint8();
            const name = reader.string();
            return new ReportPlayerMessage(clientid, reason, outcome, name);
        }
        else {
            const code = reader.int32();
            const clientid = reader.packed();
            const reason = reader.uint8();
            return new ReportPlayerMessage(code, clientid, reason);
        }
    }
    Serialize(writer, direction) {
        if (direction === PacketDecoder_1.MessageDirection.Clientbound) {
            writer.packed(this.clientid);
            writer.uint32(this.reason);
            writer.uint8(this.outcome);
            writer.string(this.name);
        }
        else {
            writer.int32(this.code);
            writer.packed(this.clientid);
            writer.uint8(this.reason);
        }
    }
}
exports.ReportPlayerMessage = ReportPlayerMessage;
ReportPlayerMessage.tag = constant_1.RootMessageTag.ReportPlayer;
//# sourceMappingURL=ReportPlayer.js.map

/***/ }),

/***/ 3339:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartGameMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const BaseRootMessage_1 = __webpack_require__(5072);
class StartGameMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(code) {
        super();
        this.tag = constant_1.RootMessageTag.StartGame;
        if (typeof code === "string") {
            this.code = util_1.Code2Int(code);
        }
        else {
            this.code = code;
        }
    }
    static Deserialize(reader) {
        const code = reader.int32();
        return new StartGameMessage(code);
    }
    Serialize(writer) {
        writer.int32(this.code);
    }
}
exports.StartGameMessage = StartGameMessage;
StartGameMessage.tag = constant_1.RootMessageTag.StartGame;
//# sourceMappingURL=StartGame.js.map

/***/ }),

/***/ 1220:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WaitForHostMessage = void 0;
const constant_1 = __webpack_require__(492);
const util_1 = __webpack_require__(5131);
const BaseRootMessage_1 = __webpack_require__(5072);
class WaitForHostMessage extends BaseRootMessage_1.BaseRootMessage {
    constructor(code, clientid) {
        super();
        this.tag = constant_1.RootMessageTag.WaitForHost;
        if (typeof code === "string") {
            this.code = util_1.Code2Int(code);
        }
        else {
            this.code = code;
        }
        this.clientid = clientid;
    }
    static Deserialize(reader) {
        const code = reader.int32();
        const clientid = reader.int32();
        return new WaitForHostMessage(code, clientid);
    }
    Serialize(writer) {
        writer.int32(this.code);
        writer.int32(this.clientid);
    }
}
exports.WaitForHostMessage = WaitForHostMessage;
WaitForHostMessage.tag = constant_1.RootMessageTag.WaitForHost;
//# sourceMappingURL=WaitForHost.js.map

/***/ }),

/***/ 8514:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(1509), exports);
__exportStar(__webpack_require__(1023), exports);
__exportStar(__webpack_require__(6877), exports);
__exportStar(__webpack_require__(8319), exports);
__exportStar(__webpack_require__(75), exports);
__exportStar(__webpack_require__(4336), exports);
__exportStar(__webpack_require__(5796), exports);
__exportStar(__webpack_require__(3716), exports);
__exportStar(__webpack_require__(515), exports);
__exportStar(__webpack_require__(563), exports);
__exportStar(__webpack_require__(191), exports);
__exportStar(__webpack_require__(2239), exports);
__exportStar(__webpack_require__(3215), exports);
__exportStar(__webpack_require__(5072), exports);
__exportStar(__webpack_require__(3339), exports);
__exportStar(__webpack_require__(1220), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4246:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddVoteMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class AddVoteMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(votingid, targetid) {
        super();
        this.tag = constant_1.RpcMessageTag.AddVote;
        this.votingid = votingid;
        this.targetid = targetid;
    }
    static Deserialize(reader) {
        const votingid = reader.uint32();
        const targetid = reader.uint32();
        return new AddVoteMessage(votingid, targetid);
    }
    Serialize(writer) {
        writer.uint32(this.votingid);
        writer.uint32(this.targetid);
    }
}
exports.AddVoteMessage = AddVoteMessage;
AddVoteMessage.tag = constant_1.RpcMessageTag.AddVote;
//# sourceMappingURL=AddVote.js.map

/***/ }),

/***/ 369:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseRpcMessage = void 0;
const BaseMessage_1 = __webpack_require__(3426);
class BaseRpcMessage extends BaseMessage_1.BaseMessage {
    constructor() {
        super(...arguments);
        this.type = "rpc";
    }
}
exports.BaseRpcMessage = BaseRpcMessage;
BaseRpcMessage.type = "rpc";
//# sourceMappingURL=BaseRpcMessage.js.map

/***/ }),

/***/ 6022:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CastVoteMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class CastVoteMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(votingid, suspectid) {
        super();
        this.tag = constant_1.RpcMessageTag.CastVote;
        this.votingid = votingid;
        this.suspectid = suspectid;
    }
    static Deserialize(reader) {
        const votingid = reader.uint8();
        const suspectid = reader.uint8();
        return new CastVoteMessage(votingid, suspectid);
    }
    Serialize(writer) {
        writer.uint8(this.votingid);
        writer.uint8(this.suspectid);
    }
}
exports.CastVoteMessage = CastVoteMessage;
CastVoteMessage.tag = constant_1.RpcMessageTag.CastVote;
//# sourceMappingURL=CastVote.js.map

/***/ }),

/***/ 4285:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckColorMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class CheckColorMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(color) {
        super();
        this.tag = constant_1.RpcMessageTag.CheckColor;
        this.color = color;
    }
    static Deserialize(reader) {
        const color = reader.uint8();
        return new CheckColorMessage(color);
    }
    Serialize(writer) {
        writer.uint8(this.color);
    }
}
exports.CheckColorMessage = CheckColorMessage;
CheckColorMessage.tag = constant_1.RpcMessageTag.CheckColor;
//# sourceMappingURL=CheckColor.js.map

/***/ }),

/***/ 8692:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckNameMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class CheckNameMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(name) {
        super();
        this.tag = constant_1.RpcMessageTag.CheckName;
        this.name = name;
    }
    static Deserialize(reader) {
        const name = reader.string();
        return new CheckNameMessage(name);
    }
    Serialize(writer) {
        writer.string(this.name);
    }
}
exports.CheckNameMessage = CheckNameMessage;
CheckNameMessage.tag = constant_1.RpcMessageTag.CheckName;
//# sourceMappingURL=CheckName.js.map

/***/ }),

/***/ 5390:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClearVoteMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class ClearVoteMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor() {
        super(...arguments);
        this.tag = constant_1.RpcMessageTag.ClearVote;
    }
}
exports.ClearVoteMessage = ClearVoteMessage;
ClearVoteMessage.tag = constant_1.RpcMessageTag.ClearVote;
//# sourceMappingURL=ClearVote.js.map

/***/ }),

/***/ 4922:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClimbLadderMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class ClimbLadderMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(ladderid, sequenceid) {
        super();
        this.tag = constant_1.RpcMessageTag.ClimbLadder;
        this.ladderid = ladderid;
        this.sequenceid = sequenceid;
    }
    static Deserialize(reader) {
        const ladderid = reader.uint8();
        const sequenceid = reader.uint8();
        return new ClimbLadderMessage(ladderid, sequenceid);
    }
    Serialize(writer) {
        writer.uint8(this.ladderid);
        writer.uint8(this.sequenceid);
    }
}
exports.ClimbLadderMessage = ClimbLadderMessage;
ClimbLadderMessage.tag = constant_1.RpcMessageTag.ClimbLadder;
//# sourceMappingURL=ClimbLadder.js.map

/***/ }),

/***/ 4524:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloseMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class CloseMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor() {
        super(...arguments);
        this.tag = constant_1.RpcMessageTag.Close;
    }
}
exports.CloseMessage = CloseMessage;
CloseMessage.tag = constant_1.RpcMessageTag.Close;
//# sourceMappingURL=Close.js.map

/***/ }),

/***/ 3235:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloseDoorsOfTypeMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class CloseDoorsOfTypeMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(systemid) {
        super();
        this.tag = constant_1.RpcMessageTag.CloseDoorsOfType;
        this.systemid = systemid;
    }
    static Deserialize(reader) {
        const systemid = reader.uint8();
        return new CloseDoorsOfTypeMessage(systemid);
    }
    Serialize(writer) {
        writer.uint8(this.systemid);
    }
}
exports.CloseDoorsOfTypeMessage = CloseDoorsOfTypeMessage;
CloseDoorsOfTypeMessage.tag = constant_1.RpcMessageTag.CloseDoorsOfType;
//# sourceMappingURL=CloseDoorsOfType.js.map

/***/ }),

/***/ 638:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompleteTaskMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class CompleteTaskMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(taskidx) {
        super();
        this.tag = constant_1.RpcMessageTag.CompleteTask;
        this.taskidx = taskidx;
    }
    static Deserialize(reader) {
        const taskidx = reader.upacked();
        return new CompleteTaskMessage(taskidx);
    }
    Serialize(writer) {
        writer.upacked(this.taskidx);
    }
}
exports.CompleteTaskMessage = CompleteTaskMessage;
CompleteTaskMessage.tag = constant_1.RpcMessageTag.CompleteTask;
//# sourceMappingURL=CompleteTask.js.map

/***/ }),

/***/ 2811:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnterVentMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class EnterVentMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(ventid) {
        super();
        this.tag = constant_1.RpcMessageTag.EnterVent;
        this.ventid = ventid;
    }
    static Deserialize(reader) {
        const ventid = reader.upacked();
        return new EnterVentMessage(ventid);
    }
    Serialize(writer) {
        writer.upacked(this.ventid);
    }
}
exports.EnterVentMessage = EnterVentMessage;
EnterVentMessage.tag = constant_1.RpcMessageTag.EnterVent;
//# sourceMappingURL=EnterVent.js.map

/***/ }),

/***/ 9389:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExiledMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class ExiledMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor() {
        super(...arguments);
        this.tag = constant_1.RpcMessageTag.Exiled;
    }
}
exports.ExiledMessage = ExiledMessage;
ExiledMessage.tag = constant_1.RpcMessageTag.Exiled;
//# sourceMappingURL=Exiled.js.map

/***/ }),

/***/ 6236:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExitVentMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class ExitVentMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(ventid) {
        super();
        this.tag = constant_1.RpcMessageTag.ExitVent;
        this.ventid = ventid;
    }
    static Deserialize(reader) {
        const ventid = reader.upacked();
        return new ExitVentMessage(ventid);
    }
    Serialize(writer) {
        writer.upacked(this.ventid);
    }
}
exports.ExitVentMessage = ExitVentMessage;
ExitVentMessage.tag = constant_1.RpcMessageTag.ExitVent;
//# sourceMappingURL=ExitVent.js.map

/***/ }),

/***/ 7093:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MurderPlayerMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class MurderPlayerMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(victimid) {
        super();
        this.tag = constant_1.RpcMessageTag.MurderPlayer;
        this.victimid = victimid;
    }
    static Deserialize(reader) {
        const victimid = reader.upacked();
        return new MurderPlayerMessage(victimid);
    }
    Serialize(writer) {
        writer.upacked(this.victimid);
    }
}
exports.MurderPlayerMessage = MurderPlayerMessage;
MurderPlayerMessage.tag = constant_1.RpcMessageTag.MurderPlayer;
//# sourceMappingURL=MurderPlayer.js.map

/***/ }),

/***/ 8326:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayAnimationMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class PlayAnimationMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(taskid) {
        super();
        this.tag = constant_1.RpcMessageTag.PlayAnimation;
        this.taskid = taskid;
    }
    static Deserialize(reader) {
        const taskid = reader.uint8();
        return new PlayAnimationMessage(taskid);
    }
    Serialize(writer) {
        writer.uint8(this.taskid);
    }
}
exports.PlayAnimationMessage = PlayAnimationMessage;
PlayAnimationMessage.tag = constant_1.RpcMessageTag.PlayAnimation;
//# sourceMappingURL=PlayAnimation.js.map

/***/ }),

/***/ 7486:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RepairSystemMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class RepairSystemMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(systemid, netid, amount) {
        super();
        this.tag = constant_1.RpcMessageTag.RepairSystem;
        this.systemid = systemid;
        this.netid = netid;
        this.amount = amount;
    }
    static Deserialize(reader) {
        const systemid = reader.uint8();
        const netid = reader.upacked();
        const amount = reader.uint8();
        return new RepairSystemMessage(systemid, netid, amount);
    }
    Serialize(writer) {
        writer.uint8(this.systemid);
        writer.upacked(this.netid);
        writer.uint8(this.amount);
    }
}
exports.RepairSystemMessage = RepairSystemMessage;
RepairSystemMessage.tag = constant_1.RpcMessageTag.RepairSystem;
//# sourceMappingURL=RepairSystem.js.map

/***/ }),

/***/ 8909:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportDeadBodyMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class ReportDeadBodyMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(bodyid) {
        super();
        this.tag = constant_1.RpcMessageTag.ReportDeadBody;
        this.bodyid = bodyid;
    }
    static Deserialize(reader) {
        const bodyid = reader.uint8();
        return new ReportDeadBodyMessage(bodyid);
    }
    Serialize(writer) {
        writer.uint8(this.bodyid);
    }
}
exports.ReportDeadBodyMessage = ReportDeadBodyMessage;
ReportDeadBodyMessage.tag = constant_1.RpcMessageTag.ReportDeadBody;
//# sourceMappingURL=ReportDeadBody.js.map

/***/ }),

/***/ 7045:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendChatMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SendChatMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(message) {
        super();
        this.tag = constant_1.RpcMessageTag.SendChat;
        this.message = message;
    }
    static Deserialize(reader) {
        const message = reader.string();
        return new SendChatMessage(message);
    }
    Serialize(writer) {
        writer.string(this.message);
    }
}
exports.SendChatMessage = SendChatMessage;
SendChatMessage.tag = constant_1.RpcMessageTag.SendChat;
//# sourceMappingURL=SendChat.js.map

/***/ }),

/***/ 2141:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendChatNoteMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SendChatNoteMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(playerid, notetype) {
        super();
        this.tag = constant_1.RpcMessageTag.SendChatNote;
        this.playerid = playerid;
        this.notetype = notetype;
    }
    static Deserialize(reader) {
        const playerid = reader.uint8();
        const notetype = reader.uint8();
        return new SendChatNoteMessage(playerid, notetype);
    }
    Serialize(writer) {
        writer.uint8(this.playerid);
        writer.uint8(this.notetype);
    }
}
exports.SendChatNoteMessage = SendChatNoteMessage;
SendChatNoteMessage.tag = constant_1.RpcMessageTag.SendChatNote;
//# sourceMappingURL=SendChatNote.js.map

/***/ }),

/***/ 9893:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetColorMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SetColorMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(color) {
        super();
        this.tag = constant_1.RpcMessageTag.SetColor;
        this.color = color;
    }
    static Deserialize(reader) {
        const color = reader.uint8();
        return new SetColorMessage(color);
    }
    Serialize(writer) {
        writer.uint8(this.color);
    }
}
exports.SetColorMessage = SetColorMessage;
SetColorMessage.tag = constant_1.RpcMessageTag.SetColor;
//# sourceMappingURL=SetColor.js.map

/***/ }),

/***/ 42:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetHatMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SetHatMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(hat) {
        super();
        this.tag = constant_1.RpcMessageTag.SetHat;
        this.hat = hat;
    }
    static Deserialize(reader) {
        const hat = reader.upacked();
        return new SetHatMessage(hat);
    }
    Serialize(writer) {
        writer.upacked(this.hat);
    }
}
exports.SetHatMessage = SetHatMessage;
SetHatMessage.tag = constant_1.RpcMessageTag.SetHat;
//# sourceMappingURL=SetHat.js.map

/***/ }),

/***/ 9035:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetInfectedMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SetInfectedMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(impostors) {
        super();
        this.tag = constant_1.RpcMessageTag.SetInfected;
        this.impostors = impostors;
    }
    static Deserialize(reader) {
        const impostors = reader.list((r) => r.uint8());
        return new SetInfectedMessage(impostors);
    }
    Serialize(writer) {
        writer.list(true, this.impostors, (i) => writer.uint8(i));
    }
}
exports.SetInfectedMessage = SetInfectedMessage;
SetInfectedMessage.tag = constant_1.RpcMessageTag.SetInfected;
//# sourceMappingURL=SetInfected.js.map

/***/ }),

/***/ 9662:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetNameMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SetNameMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(name) {
        super();
        this.tag = constant_1.RpcMessageTag.SetName;
        this.name = name;
    }
    static Deserialize(reader) {
        const name = reader.string();
        return new SetNameMessage(name);
    }
    Serialize(writer) {
        writer.string(this.name);
    }
}
exports.SetNameMessage = SetNameMessage;
SetNameMessage.tag = constant_1.RpcMessageTag.SetName;
//# sourceMappingURL=SetName.js.map

/***/ }),

/***/ 4662:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetPetMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SetPetMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(pet) {
        super();
        this.tag = constant_1.RpcMessageTag.SetPet;
        this.pet = pet;
    }
    static Deserialize(reader) {
        const pet = reader.upacked();
        return new SetPetMessage(pet);
    }
    Serialize(writer) {
        writer.upacked(this.pet);
    }
}
exports.SetPetMessage = SetPetMessage;
SetPetMessage.tag = constant_1.RpcMessageTag.SetPet;
//# sourceMappingURL=SetPet.js.map

/***/ }),

/***/ 754:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetScanner = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SetScanner extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(scanning, sequenceid) {
        super();
        this.tag = constant_1.RpcMessageTag.StartMeeting;
        this.scanning = scanning;
        this.sequenceid = sequenceid;
    }
    static Deserialize(reader) {
        const scanning = reader.bool();
        const sequenceid = reader.uint8();
        return new SetScanner(scanning, sequenceid);
    }
    Serialize(writer) {
        writer.bool(this.scanning);
        writer.uint8(this.sequenceid);
    }
}
exports.SetScanner = SetScanner;
SetScanner.tag = constant_1.RpcMessageTag.StartMeeting;
//# sourceMappingURL=SetScanner.js.map

/***/ }),

/***/ 4863:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetSkinMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SetSkinMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(skin) {
        super();
        this.tag = constant_1.RpcMessageTag.SetSkin;
        this.skin = skin;
    }
    static Deserialize(reader) {
        const skin = reader.upacked();
        return new SetSkinMessage(skin);
    }
    Serialize(writer) {
        writer.upacked(this.skin);
    }
}
exports.SetSkinMessage = SetSkinMessage;
SetSkinMessage.tag = constant_1.RpcMessageTag.SetSkin;
//# sourceMappingURL=SetSkin.js.map

/***/ }),

/***/ 4066:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetStartCounterMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SetStartCounterMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(sequenceid, counter) {
        super();
        this.tag = constant_1.RpcMessageTag.SetStartCounter;
        this.sequenceid = sequenceid;
        this.counter = counter;
    }
    static Deserialize(reader) {
        const sequenceid = reader.upacked();
        const counter = reader.int8();
        return new SetStartCounterMessage(sequenceid, counter);
    }
    Serialize(writer) {
        writer.upacked(this.sequenceid);
        writer.int8(this.counter);
    }
}
exports.SetStartCounterMessage = SetStartCounterMessage;
SetStartCounterMessage.tag = constant_1.RpcMessageTag.SetStartCounter;
//# sourceMappingURL=SetStartCounter.js.map

/***/ }),

/***/ 145:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetTasksMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SetTasksMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(playerid, taskids) {
        super();
        this.tag = constant_1.RpcMessageTag.SetTasks;
        this.playerid = playerid;
        this.taskids = taskids;
    }
    static Detaskidslize(reader) {
        const playerid = reader.uint8();
        const tasks = reader.list((r) => r.uint8());
        return new SetTasksMessage(playerid, tasks);
    }
    Serialize(writer) {
        writer.uint8(this.playerid);
        writer.list(true, this.taskids, (t) => writer.uint8(t));
    }
}
exports.SetTasksMessage = SetTasksMessage;
SetTasksMessage.tag = constant_1.RpcMessageTag.SetTasks;
//# sourceMappingURL=SetTasks.js.map

/***/ }),

/***/ 6740:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SnapToMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class SnapToMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(position, sequenceid) {
        super();
        this.tag = constant_1.RpcMessageTag.SnapTo;
        this.position = position;
        this.sequenceid = sequenceid;
    }
    static Deserialize(reader) {
        const position = reader.vector();
        const sequenceid = reader.uint16();
        return new SnapToMessage(position, sequenceid);
    }
    Serialize(writer) {
        writer.vector(this.position);
        writer.uint16(this.sequenceid);
    }
}
exports.SnapToMessage = SnapToMessage;
SnapToMessage.tag = constant_1.RpcMessageTag.SnapTo;
//# sourceMappingURL=SnapTo.js.map

/***/ }),

/***/ 499:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartMeetingMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class StartMeetingMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(bodyid) {
        super();
        this.tag = constant_1.RpcMessageTag.StartMeeting;
        this.bodyid = bodyid;
    }
    static Deserialize(reader) {
        const bodyid = reader.uint8();
        return new StartMeetingMessage(bodyid);
    }
    Serialize(writer) {
        writer.uint8(this.bodyid);
    }
}
exports.StartMeetingMessage = StartMeetingMessage;
StartMeetingMessage.tag = constant_1.RpcMessageTag.StartMeeting;
//# sourceMappingURL=StartMeeting.js.map

/***/ }),

/***/ 4660:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyncSettingsMessage = void 0;
const constant_1 = __webpack_require__(492);
const misc_1 = __webpack_require__(6966);
const BaseRpcMessage_1 = __webpack_require__(369);
class SyncSettingsMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(options) {
        super();
        this.tag = constant_1.RpcMessageTag.SyncSettings;
        this.options = options;
    }
    static Deserialize(reader) {
        const options = reader.read(misc_1.GameOptions);
        return new SyncSettingsMessage(options);
    }
    Serialize(writer) {
        writer.write(this.options);
    }
}
exports.SyncSettingsMessage = SyncSettingsMessage;
SyncSettingsMessage.tag = constant_1.RpcMessageTag.SyncSettings;
//# sourceMappingURL=SyncSettings.js.map

/***/ }),

/***/ 2693:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsePlatformMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class UsePlatformMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor() {
        super(...arguments);
        this.tag = constant_1.RpcMessageTag.UsePlatform;
    }
}
exports.UsePlatformMessage = UsePlatformMessage;
UsePlatformMessage.tag = constant_1.RpcMessageTag.UsePlatform;
//# sourceMappingURL=UsePlatform.js.map

/***/ }),

/***/ 7191:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VotingCompleteMessage = void 0;
const constant_1 = __webpack_require__(492);
const BaseRpcMessage_1 = __webpack_require__(369);
class VotingCompleteMessage extends BaseRpcMessage_1.BaseRpcMessage {
    constructor(states, exiledid, tie) {
        super();
        this.tag = constant_1.RpcMessageTag.VotingComplete;
        this.states = states;
        this.exiledid = exiledid;
        this.tie = tie;
    }
    static Deexiledidize(reader) {
        const states = reader.list((r) => r.uint8());
        const exiled = reader.uint8();
        const tie = reader.bool();
        return new VotingCompleteMessage(states, exiled, tie);
    }
    Serialize(writer) {
        writer.list(true, this.states, (s) => writer.uint8(s));
        writer.uint8(this.exiledid);
        writer.bool(this.tie);
    }
}
exports.VotingCompleteMessage = VotingCompleteMessage;
VotingCompleteMessage.tag = constant_1.RpcMessageTag.VotingComplete;
//# sourceMappingURL=VotingComplete.js.map

/***/ }),

/***/ 2124:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(4246), exports);
__exportStar(__webpack_require__(369), exports);
__exportStar(__webpack_require__(6022), exports);
__exportStar(__webpack_require__(4285), exports);
__exportStar(__webpack_require__(8692), exports);
__exportStar(__webpack_require__(5390), exports);
__exportStar(__webpack_require__(4922), exports);
__exportStar(__webpack_require__(4524), exports);
__exportStar(__webpack_require__(3235), exports);
__exportStar(__webpack_require__(638), exports);
__exportStar(__webpack_require__(2811), exports);
__exportStar(__webpack_require__(9389), exports);
__exportStar(__webpack_require__(6236), exports);
__exportStar(__webpack_require__(7093), exports);
__exportStar(__webpack_require__(8326), exports);
__exportStar(__webpack_require__(7486), exports);
__exportStar(__webpack_require__(8909), exports);
__exportStar(__webpack_require__(7045), exports);
__exportStar(__webpack_require__(2141), exports);
__exportStar(__webpack_require__(9893), exports);
__exportStar(__webpack_require__(42), exports);
__exportStar(__webpack_require__(9035), exports);
__exportStar(__webpack_require__(9662), exports);
__exportStar(__webpack_require__(4662), exports);
__exportStar(__webpack_require__(754), exports);
__exportStar(__webpack_require__(4863), exports);
__exportStar(__webpack_require__(4066), exports);
__exportStar(__webpack_require__(145), exports);
__exportStar(__webpack_require__(6740), exports);
__exportStar(__webpack_require__(499), exports);
__exportStar(__webpack_require__(4660), exports);
__exportStar(__webpack_require__(2693), exports);
__exportStar(__webpack_require__(7191), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2347:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(4037), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4037:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(3302), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3302:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkeldjsStateManager = void 0;
const core_1 = __webpack_require__(6096);
const protocol_1 = __webpack_require__(2602);
const util_1 = __webpack_require__(5131);
class SkeldjsStateManager extends core_1.Hostable {
    constructor(options = {}) {
        super(Object.assign({ doFixedUpdate: false }, options));
        this.clientid = 0;
        this.decoder.on(protocol_1.HostGameMessage, (message, direction) => {
            if (direction === protocol_1.MessageDirection.Clientbound) {
                this.setCode(message.code);
            }
        });
        this.decoder.on(protocol_1.JoinGameMessage, async (message, direction) => {
            if (direction === protocol_1.MessageDirection.Clientbound &&
                message.code === this.code) {
                await this.handleJoin(message.clientid);
                await this.setHost(message.hostid);
            }
        });
        this.decoder.on(protocol_1.StartGameMessage, async (message, direction) => {
            if (direction === protocol_1.MessageDirection.Clientbound &&
                message.code === this.code) {
                await this._handleStart();
            }
        });
        this.decoder.on(protocol_1.RemovePlayerMessage, async (message, direction) => {
            if (direction === protocol_1.MessageDirection.Clientbound &&
                message.code === this.code) {
                await this.handleLeave(message.clientid);
                await this.setHost(message.hostid);
            }
        });
        this.decoder.on(protocol_1.GameDataToMessage, async (message, direction, sender) => {
            if (direction === protocol_1.MessageDirection.Clientbound &&
                message.code === this.code) {
                for (const child of message._children) {
                    this.decoder.emitDecoded(child, direction, sender);
                }
            }
        });
        this.decoder.on(protocol_1.JoinedGameMessage, async (message, direction) => {
            if (direction === protocol_1.MessageDirection.Clientbound) {
                this.clientid = message.clientid;
                await this.setCode(message.code);
                await this.setHost(message.hostid);
                await this.handleJoin(message.clientid);
                for (let i = 0; i < message.others.length; i++) {
                    await this.handleJoin(message.others[i]);
                }
            }
        });
    }
    async handleInboundMessage(message) {
        const reader = util_1.HazelReader.from(message);
        this.decoder.write(reader, protocol_1.MessageDirection.Clientbound, null);
    }
    async handleOutboundMessage(message) {
        const reader = util_1.HazelReader.from(message);
        this.decoder.write(reader, protocol_1.MessageDirection.Serverbound, null);
    }
    _reset() {
        this.objects.clear();
        this.objects.set(-2, this);
        this.players.clear();
        this.netobjects.clear();
        this.stream = [];
        this.code = 0;
        this.hostid = 0;
        this.settings = new protocol_1.GameOptions();
        this.counter = -1;
        this.privacy = "private";
    }
}
exports.SkeldjsStateManager = SkeldjsStateManager;
//# sourceMappingURL=state.js.map

/***/ }),

/***/ 5131:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(428), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5291:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Int2Code = exports.Code2Int = exports.V2Int2Code = exports.V2Gen = exports.V2Code2Int = exports.V1Int2Code = exports.V1Gen = exports.V1Code2Int = void 0;
function V1Code2Int(code) {
    const a = code.charCodeAt(0) & 0xff;
    const b = code.charCodeAt(1) & 0xff;
    const c = code.charCodeAt(2) & 0xff;
    const d = code.charCodeAt(3) & 0xff;
    return (a << 24) | (b << 16) | (c << 8) | d;
}
exports.V1Code2Int = V1Code2Int;
function V1Gen() {
    const a = ~~(Math.random() * 26) + 65;
    const b = ~~(Math.random() * 26) + 65;
    const c = ~~(Math.random() * 26) + 65;
    const d = ~~(Math.random() * 26) + 65;
    return (a << 24) | (b << 16) | (c << 8) | d;
}
exports.V1Gen = V1Gen;
function V1Int2Code(bytes) {
    const a = String.fromCharCode((bytes >> 24) & 0xff);
    const b = String.fromCharCode((bytes >> 16) & 0xff);
    const c = String.fromCharCode((bytes >> 8) & 0xff);
    const d = String.fromCharCode(bytes & 0xff);
    return a + b + c + d;
}
exports.V1Int2Code = V1Int2Code;
const V2 = "QWXRTYLPESDFGHUJKZOCVBINMA";
const V2Map = [
    25,
    21,
    19,
    10,
    8,
    11,
    12,
    13,
    22,
    15,
    16,
    6,
    24,
    23,
    18,
    7,
    0,
    3,
    9,
    4,
    14,
    20,
    1,
    2,
    5,
    17,
];
function V2Parts2Int(a, b, c, d, e, f) {
    const one = (a + 26 * b) & 0x3ff;
    const two = c + 26 * (d + 26 * (e + 26 * f));
    return one | ((two << 10) & 0x3ffffc00) | 0x80000000;
}
function V2Code2Int(code) {
    return V2Parts2Int(V2Map[code.charCodeAt(0) - 65], V2Map[code.charCodeAt(1) - 65], V2Map[code.charCodeAt(2) - 65], V2Map[code.charCodeAt(3) - 65], V2Map[code.charCodeAt(4) - 65], V2Map[code.charCodeAt(5) - 65]);
}
exports.V2Code2Int = V2Code2Int;
function V2Gen() {
    return V2Parts2Int(~~(Math.random() * 26), ~~(Math.random() * 26), ~~(Math.random() * 26), ~~(Math.random() * 26), ~~(Math.random() * 26), ~~(Math.random() * 26));
}
exports.V2Gen = V2Gen;
function V2Int2Code(bytes) {
    const a = bytes & 0x3ff;
    const b = (bytes >> 10) & 0xfffff;
    return (V2[a % 26] +
        V2[~~(a / 26)] +
        V2[b % 26] +
        V2[~~((b / 26) % 26)] +
        V2[~~((b / (26 * 26)) % 26)] +
        V2[~~((b / (26 * 26 * 26)) % 26)]);
}
exports.V2Int2Code = V2Int2Code;
function Code2Int(code) {
    if (code.length === 6) {
        return V2Code2Int(code);
    }
    else if (code.length === 4) {
        return V1Code2Int(code);
    }
    else {
        return 0;
    }
}
exports.Code2Int = Code2Int;
function Int2Code(bytes) {
    if (bytes < 0) {
        return V2Int2Code(bytes);
    }
    else {
        return V1Int2Code(bytes);
    }
}
exports.Int2Code = Int2Code;
//# sourceMappingURL=Codes.js.map

/***/ }),

/***/ 7611:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HazelBuffer = void 0;
class HazelBuffer {
    constructor(_buffer) {
        this._buffer = _buffer;
        this._cursor = 0;
    }
    static checkInteger(val, bounds) {
        if (typeof val !== "number") {
            throw new TypeError("Expected an integer, instead got " + typeof val + ".");
        }
        if (!Number.isInteger(val)) {
            throw new TypeError("Expected an integer, instead got a fraction.");
        }
        if (bounds) {
            if (val < bounds.min || val > bounds.max) {
                throw new RangeError("Expected value to be within " +
                    bounds.min +
                    " and " +
                    bounds.max +
                    ", got " +
                    val +
                    ".");
            }
        }
    }
    /**
     * The buffer that the writer or reader is targeting.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(6);
     *
     * console.log(writer; // => <HazelBuffer [00] 00 00 00 00 00>
     * ```
     */
    get buffer() {
        return this._buffer;
    }
    /**
     * The size of the buffer that the writer or reader is targeting.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(6);
     *
     * console.log(writer.size); // => 6
     * ```
     */
    get size() {
        return this._buffer.byteLength;
    }
    /**
     * The current position of the writer or reader.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(2);
     * writer.uint16(4);
     *
     * console.log(writer.cursor); // => 2
     * ```
     */
    get cursor() {
        return this._cursor;
    }
    /**
     * The number of bytes left in the writer or reader.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(6);
     * writer.uint16(4);
     *
     * console.log(writer.left); // => 4
     * ```
     */
    get left() {
        return this.size - this._cursor;
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < this.buffer.byteLength; i++) {
            yield this.buffer[i];
        }
    }
    toString(encoding = "hex") {
        return this.buffer.toString(encoding);
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
        const width = 10;
        let min = this.cursor - Math.floor(width / 2);
        let max = this.cursor + Math.ceil(width / 2);
        if (max >= this.buffer.byteLength) {
            min = Math.max(0, this.buffer.byteLength - width);
            max = this.buffer.byteLength;
        }
        if (min < 0) {
            max = Math.min(this.buffer.byteLength - 1, max + (0 - min));
            min = 0;
        }
        const view = [...this.buffer]
            .slice(min, max)
            .map((_) => _.toString(16).padStart(2, "0"));
        const cur_view = this.cursor - min;
        if (min > 0) {
            view.unshift(".." + min + " byte" + (min === 1 ? "" : "s") + "..");
        }
        if (max < this.buffer.byteLength) {
            const num = this.buffer.byteLength - max;
            view.push(".." + num + " byte" + (num === 1 ? "" : "s") + "..");
        }
        if (cur_view < 0) {
            const num = 0 - cur_view;
            if (num > 0) {
                view.unshift(".." + num + " byte" + (num === 1 ? "" : "s") + "..");
            }
            view.unshift("[  ]");
        }
        else if (cur_view > view.length - 1) {
            const num = cur_view - view.length;
            if (num > 0) {
                view.push(".." + num + " byte" + (num === 1 ? "" : "s") + "..");
            }
            view.push("[  ]");
        }
        else {
            view[cur_view] = "[" + view[cur_view] + "]";
        }
        return "<HazelBuffer " + view.join(" ") + ">";
    }
    /**
     * Move the cursor to a position.
     * @param pos The position to move to.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(12);
     * writer.goto(5);
     *
     * console.log(writer.cursor); // => 5
     * ```
     */
    goto(pos) {
        HazelBuffer.checkInteger(pos);
        this._cursor = pos;
        return this;
    }
    /**
     * Skip a speciied number of bytes.
     * @param pos The number of bytes to skip to.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(12);
     * writer.skip(3);
     * writer.skip(2);
     * writer.skip(5);
     *
     * console.log(writer.cursor); // => 10
     * ```
     */
    jump(bytes) {
        HazelBuffer.checkInteger(bytes);
        this._cursor += bytes;
        return this;
    }
    /**
     * Check whether two hazel buffers contain the same information.
     * @param other The other hazel writer to check.
     * @returns Whether or not the hazel writers are the same.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(2);
     * writer.uint8(21);
     * writer.uint8(69);
     *
     * const writer2 = HazelWriter.alloc(2);
     * writer.uint8(21);
     * writer.uint8(69);
     *
     * console.log(writer.compare(writer2)); // => true
     *
     * writer2.uint8(90);
     *
     * console.log(writer.compare(writer2)); // => false
     * ```
     */
    compare(other) {
        if (this.buffer.byteLength !== other.buffer.byteLength) {
            return false;
        }
        for (let i = 0; i < this.buffer.byteLength; i++) {
            if (this.buffer[i] !== other.buffer[i]) {
                return false;
            }
        }
        return true;
    }
}
exports.HazelBuffer = HazelBuffer;
//# sourceMappingURL=HazelBuffer.js.map

/***/ }),

/***/ 2698:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HazelReader = void 0;
const bounds_1 = __webpack_require__(8158);
const HazelBuffer_1 = __webpack_require__(7611);
const Vector_1 = __webpack_require__(3866);
class HazelReader extends HazelBuffer_1.HazelBuffer {
    static from(bytes, encoding = "utf8") {
        if (typeof bytes === "string") {
            const buffer = Buffer.from(bytes, encoding);
            return new HazelReader(buffer);
        }
        if (Array.isArray(bytes)) {
            const buffer = Buffer.from(bytes);
            return new HazelReader(buffer);
        }
        return new HazelReader(bytes);
    }
    constructor(_buffer) {
        super(_buffer);
    }
    /**
     * Read an unsigned 8-bit integer value.
     * @returns The value that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from([5, 6, 7, 8]);
     *
     * console.log(reader.uint8()); // => 5
     * ```
     */
    uint8() {
        const val = this._buffer.readUInt8(this._cursor);
        this._cursor += bounds_1.SIZES.uint8;
        return val;
    }
    /**
     * Read a signed 8-bit integer value.
     * @returns The value that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from([130, 6, 7, 8]);
     *
     * console.log(reader.int8()); // => -125
     * ```
     */
    int8() {
        const val = this._buffer.readInt8(this._cursor);
        this._cursor += bounds_1.SIZES.int8;
        return val;
    }
    /**
     * Read a single boolean value.
     * @returns The boolean that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from("0001", "hex");
     *
     * console.log(reader.bool()) // => false
     * console.log(reader.bool()) // => true
     * ```
     */
    bool() {
        return this.uint8() === 1;
    }
    /**
     * Read a deserializable object from the reader.
     * @param deserializable The object class to read.
     * @returns The deserialized data.
     */
    read(deserializable, ...args) {
        return deserializable.Deserialize(this, ...args);
    }
    /**
     * Read a list of deserializable objects from the reader.
     * @param deserializable The object class to read.
     * @returns An array of deserialized objects.
     */
    lread(length, deserializable, ...args) {
        return this.list(length, (reader) => deserializable.Deserialize(reader, ...args));
    }
    /**
     * Read a single ascii character.
     * @returns The character that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from("41", "hex");
     *
     * console.log(reader.char()) // => A
     * ```
     */
    char() {
        return String.fromCharCode(this.uint8());
    }
    /**
     * Read a single unsigned byte.
     * @returns The byte that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from("41", "hex");
     *
     * console.log(reader.byte()) // => 65
     * ```
     */
    byte() {
        return this.uint8();
    }
    /**
     * Read a single signed byte.
     * @returns The byte that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from("41", "hex");
     *
     * console.log(reader.sbyte()) // => 65
     * ```
     */
    sbyte() {
        return this.int8();
    }
    /**
     * Read an unsigned 16-bit integer value.
     * @returns The value that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from([130, 6, 7, 8]);
     *
     * console.log(reader.uint16()); // => 1666
     * ```
     */
    uint16(be = false) {
        const val = be
            ? this._buffer.readUInt16BE(this._cursor)
            : this._buffer.readUInt16LE(this._cursor);
        this._cursor += bounds_1.SIZES.uint16;
        return val;
    }
    /**
     * Read a signed 16-bit integer value.
     * @returns The value that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from([130, 6, 7, 8]);
     *
     * console.log(reader.int16()); // => 1666
     * ```
     */
    int16(be = false) {
        const val = be
            ? this._buffer.readInt16BE(this._cursor)
            : this._buffer.readInt16LE(this._cursor);
        this._cursor += bounds_1.SIZES.int16;
        return val;
    }
    /**
     * Read an unsigned 32-bit integer value.
     * @returns The value that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from([130, 6, 7, 8]);
     *
     * console.log(reader.uint32()); // => 1666
     * ```
     */
    uint32(be = false) {
        const val = be
            ? this._buffer.readUInt32BE(this._cursor)
            : this._buffer.readUInt32LE(this._cursor);
        this._cursor += bounds_1.SIZES.uint32;
        return val;
    }
    /**
     * Read a signed 32-bit integer value.
     * @returns The value that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from([130, 6, 7, 8]);
     *
     * console.log(reader.int32()); // => 1666
     * ```
     */
    int32(be = false) {
        const val = be
            ? this._buffer.readInt32BE(this._cursor)
            : this._buffer.readInt32LE(this._cursor);
        this._cursor += bounds_1.SIZES.int32;
        return val;
    }
    /**
     * Read an IEEE 754 floating point number.
     * @returns The value that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from([130, 6, 7, 8]);
     *
     * console.log(reader.float()); // => 1666
     * ```
     */
    float(be = false) {
        const val = be
            ? this._buffer.readFloatBE(this._cursor)
            : this._buffer.readFloatLE(this._cursor);
        this._cursor += bounds_1.SIZES.float;
        return val;
    }
    /**
     * Read a signed variable-sized integer.
     * @returns The value that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from("ac9e04", "hex");
     *
     * console.log(reader.packed()); // => 69420
     * ```
     */
    packed() {
        let out = 0;
        for (let shift = 0;; shift++) {
            const byte = this.uint8();
            const read = (byte >> 7) & 1;
            const val = read ? byte ^ 0x80 : byte;
            if (val) {
                out |= val << (shift * 7);
            }
            else if (read) {
                out <<= shift * 7;
            }
            if (!read) {
                break;
            }
        }
        return out;
    }
    /**
     * Read an unsigned variable-sized integer.
     * @returns The value that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from("ac9e04", "hex");
     *
     * console.log(reader.upacked()); // => 69420
     * ```
     */
    upacked() {
        return this.packed() >>> 0;
    }
    /**
     * Read a list of chars.
     * @returns The string that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from("48656c6c6f2c20776f726c6421", "hex");
     *
     * console.log(reader.string()); // => Hello, world!
     * ```
     */
    string() {
        const length = this.upacked();
        const str = this.buffer
            .slice(this._cursor, this._cursor + length)
            .toString("utf8");
        this._cursor += length;
        return str;
    }
    /**
     * Read a hazel message.
     * @returns The message that was read.
     * @example
     * ```typescript
     * const reader = HazelReader.from("0005010a0a0a0a0a");
     *
     * const [ tag, mreader ] = reader.message();
     *
     * console.log(tag, mreader.size); // => 1 5
     * ```
     */
    message() {
        const length = this.uint16();
        const tag = this.uint8();
        const message = this.bytes(length);
        return [tag, message];
    }
    /**
     * Read a specified number of bytes.
     * @param bytes The number of bytes to read.
     * @example
     * ```typescript
     * const reader = HazelReader.from("030201);
     *
     * const message = reader.bytes(2);
     *
     * console.log(message.buffer); // => <Buffer 03 02>
     * ```
     */
    bytes(bytes) {
        const buffer = this.buffer.slice(this._cursor, this._cursor + bytes);
        this._cursor += bytes;
        return HazelReader.from(buffer);
    }
    list(length, fn) {
        if (typeof length === "number") {
            if (!fn) {
                throw new TypeError("Expected a function for list reader, instead got " +
                    typeof fn +
                    ".");
            }
            const items = [];
            for (let i = 0; i < length; i++) {
                items.push(fn(this, i));
            }
            return items;
        }
        return this.list(this.upacked(), length);
    }
    /**
     * Read a vector position.
     * @returns The vector that was read.
     */
    vector() {
        const x = this.uint16();
        const y = this.uint16();
        return new Vector_1.Vector2(Vector_1.Vector2.lerp(x / 65535), Vector_1.Vector2.lerp(y / 65535));
    }
}
exports.HazelReader = HazelReader;
//# sourceMappingURL=HazelReader.js.map

/***/ }),

/***/ 8599:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HazelWriter = void 0;
const bounds_1 = __webpack_require__(8158);
const HazelBuffer_1 = __webpack_require__(7611);
const Vector_1 = __webpack_require__(3866);
class HazelWriter extends HazelBuffer_1.HazelBuffer {
    constructor(_buffer) {
        super(_buffer);
        this.messageStack = [];
    }
    /**
     * Allocate a message writer with a buffer of the specified number of bytes.
     * @param bytes The number of bytes to allocate.
     * @returns The message writer writing to the allocated bytes.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(6);
     *
     * console.log(writer.size); // => 6
     * ```
     */
    static alloc(bytes) {
        HazelBuffer_1.HazelBuffer.checkInteger(bytes, bounds_1.BOUNDS.uint32);
        const buffer = Buffer.alloc(bytes);
        return new HazelWriter(buffer);
    }
    /**
     * Clone the message writer to a new writer with a separate buffer.
     * @returns The new message writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(2);
     * writer.uint8(32);
     * writer.uint8(12);
     *
     * const cloned = writer.clone();
     * cloned.uint8(90);
     *
     * console.log(writer); // => <HazelBuffer 20 0c [  ]>
     * console.log(cloned); // => <HazelBuffer 20 0c 5a [  ]>
     * ```
     */
    clone() {
        const writer = HazelWriter.alloc(this.size);
        this.buffer.copy(writer.buffer);
        writer.goto(this._cursor);
        return writer;
    }
    /**
     * Reallocate the the number of bytes in the writer.
     * @param size The size to reallocate to.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(4);
     * writer.realloc(8);
     *
     * console.log(writer.size); // => 8
     * ```
     */
    realloc(size) {
        HazelBuffer_1.HazelBuffer.checkInteger(size);
        if (size === this.size) {
            return this;
        }
        const new_buffer = Buffer.alloc(size);
        this._buffer.copy(new_buffer);
        this._buffer = new_buffer;
        return this;
    }
    /**
     * Expand the writer by the number of bytes required to write a value. Won't reallocate if there are enough bytes remaining.
     * @param required The number of bytes required to write a value.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(6);
     * writer.expand(2); // The cursor is at 0, since there is 2 bytes remaining, the size remains at 6.
     *
     * console.log(writer.size); // => 6
     *
     * writer.expand(8); // There is not 8 bytes remaining so the writer buffer is reallocated to 8.
     * console.log(writer.size); // => 8
     * ```
     */
    expand(required) {
        HazelBuffer_1.HazelBuffer.checkInteger(required);
        if (required < 0) {
            throw new RangeError("Cannot expand by a negative amount.");
        }
        if (this._cursor + required >= this.size) {
            this.realloc(this._cursor + required);
        }
        return this;
    }
    /**
     * Write an unsigned 8-bit integer value.
     * @param val The value to write. (Between 0 and 255 inclusive.)
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(1);
     *
     * writer.uint8(54);
     * ```
     */
    uint8(val) {
        HazelBuffer_1.HazelBuffer.checkInteger(val, bounds_1.BOUNDS.uint8);
        this.expand(bounds_1.SIZES.uint8);
        this.buffer.writeUInt8(val, this._cursor);
        this._cursor += bounds_1.SIZES.uint8;
        return this;
    }
    /**
     * Write a signed 8-bit integer value.
     * @param val The value to write. (Between -127 and 127 inclusive.)
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(4);
     *
     * writer.int8(-120);
     * writer.int8(68);
     * ```
     */
    int8(val) {
        HazelBuffer_1.HazelBuffer.checkInteger(val, bounds_1.BOUNDS.int8);
        this.expand(bounds_1.SIZES.uint8);
        this.buffer.writeInt8(val, this._cursor);
        this._cursor += bounds_1.SIZES.uint8;
        return this;
    }
    /**
     * Write a single unsigned byte.
     * @param val The value to write. (Between 0 and 255 inclusive.)
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(1);
     *
     * writer.byte(69);
     * ```
     */
    byte(val) {
        return this.uint8(val);
    }
    /**
     * Write a single signed byte.
     * @param val The value to write. (Between -127 and 127 inclusive.)
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(1);
     *
     * writer.byte(-32);
     * ```
     */
    sbyte(val) {
        return this.int8(val);
    }
    /**
     * Write a single utf8 char.
     * @param val The value to write.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(4);
     *
     * writer.char("A");
     * writer.char("6");
     * ```
     */
    char(val) {
        if (val.length !== 1) {
            throw new Error("Expected a single character, got '" + val + "'.");
        }
        this.uint8(val.charCodeAt(0));
    }
    /**
     * Write a true or false value.
     * @param val The value to write.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(4);
     *
     * writer.bool(true);
     * writer.bool(false);
     * ```
     */
    bool(val) {
        this.uint8(val ? 1 : 0);
        return this;
    }
    /**
     * Write a serializable object to the writer.
     * @param serializable The object to write.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(0);
     *
     * writer.write(player.control);
     * ```
     */
    write(serializable, ...args) {
        if (serializable.PreSerialize) {
            serializable.PreSerialize();
        }
        serializable.Serialize(this, ...args);
    }
    /**
     * Write a list of serializable objects to the writer.
     * @param serializable The objects to write.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(0);
     *
     * writer.write(players.map(player => player.control));
     * ```
     */
    lwrite(length, serializable, ...args) {
        if (length) {
            this.upacked(serializable.length);
        }
        for (const object of serializable) {
            this.write(object, ...args);
        }
    }
    /**
     * Write an unsigned 16-bit integer value.
     * @param val The value to write. (Between 0 and 65535 inclusive.)
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(4);
     *
     * writer.uint16(5342);
     * writer.uint16(256);
     * ```
     */
    uint16(val, be = false) {
        HazelBuffer_1.HazelBuffer.checkInteger(val, bounds_1.BOUNDS.uint16);
        this.expand(bounds_1.SIZES.uint16);
        if (be) {
            this.buffer.writeUInt16BE(val, this._cursor);
        }
        else {
            this.buffer.writeUInt16LE(val, this._cursor);
        }
        this._cursor += bounds_1.SIZES.uint16;
        return this;
    }
    /**
     * Write a signed 16-bit integer value.
     * @param val The value to write. (Between -32767 and 32767 inclusive.)
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(4);
     *
     * writer.int16(-3452);
     * writer.int16(1933);
     * ```
     */
    int16(val, be = false) {
        HazelBuffer_1.HazelBuffer.checkInteger(val, bounds_1.BOUNDS.int16);
        this.expand(bounds_1.SIZES.int16);
        if (be) {
            this.buffer.writeInt16BE(val, this._cursor);
        }
        else {
            this.buffer.writeInt16LE(val, this._cursor);
        }
        this._cursor += bounds_1.SIZES.int16;
        return this;
    }
    /**
     * Write an unsigned 32-bit integer value.
     * @param val The value to write. (Between 0 and 4294967295 inclusive.)
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(8);
     *
     * writer.uint32(6764774);
     * writer.uint32(12314352);
     * ```
     */
    uint32(val, be = false) {
        HazelBuffer_1.HazelBuffer.checkInteger(val, bounds_1.BOUNDS.uint32);
        this.expand(bounds_1.SIZES.uint32);
        if (be) {
            this.buffer.writeUInt32BE(val, this._cursor);
        }
        else {
            this.buffer.writeUInt32LE(val, this._cursor);
        }
        this._cursor += bounds_1.SIZES.uint32;
        return this;
    }
    /**
     * Write a signed 32-bit integer value.
     * @param val The value to write. (Between -2147483647 and 2147483647 inclusive.)
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(8);
     *
     * writer.uint32(-432423);
     * writer.uint32(1212112);
     * ```
     */
    int32(val, be = false) {
        HazelBuffer_1.HazelBuffer.checkInteger(val, bounds_1.BOUNDS.int32);
        this.expand(bounds_1.SIZES.int32);
        if (be) {
            this.buffer.writeInt32BE(val, this._cursor);
        }
        else {
            this.buffer.writeInt32LE(val, this._cursor);
        }
        this._cursor += bounds_1.SIZES.int32;
        return this;
    }
    /**
     * Write an IEEE 754 floating point number.
     * @param val The value to write.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(8);
     *
     * writer.float(54.32);
     * writer.float(21.69420);
     * ```
     */
    float(val, be = false) {
        if (typeof val !== "number") {
            throw new TypeError("Expected a number, got " + typeof val + ".");
        }
        this.expand(bounds_1.SIZES.float);
        if (be) {
            this.buffer.writeFloatBE(val, this._cursor);
        }
        else {
            this.buffer.writeFloatLE(val, this._cursor);
        }
        this._cursor += bounds_1.SIZES.float;
        return this;
    }
    /**
     * Write a signed variable-sized integer.
     * @param val The value to write.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(0);
     *
     * writer.packed(-420);
     * writer.packed(153);
     * ```
     */
    packed(val) {
        HazelBuffer_1.HazelBuffer.checkInteger(val, bounds_1.BOUNDS.int32);
        return this.upacked(val >>> 0);
    }
    /**
     * Write an unsigned variable-size integer.
     * @param val The value to write.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(0);
     *
     * writer.packed(54325);
     * writer.packed(11293);
     * ```
     */
    upacked(val) {
        HazelBuffer_1.HazelBuffer.checkInteger(val, bounds_1.BOUNDS.uint32);
        do {
            let byte = val & 0xff;
            if (val >= 0x80) {
                byte |= 0x80;
            }
            this.uint8(byte);
            val >>>= 7;
        } while (val > 0);
    }
    /**
     * Write a packed int length-prefixed string.
     * @param val The string to write.
     * @returns The writer.
     * @example
     * ```typescript
     * const writer = HazelWriter.alloc(9);
     *
     * writer.string("poopy");
     * writer.string("poop");
     * ``
     */
    string(val) {
        this.upacked(val.length);
        this.bytes(val);
    }
    /**
     * Write non-length-prefixed bytes.
     * @param bytes The bytes to write to the buffer.
     * @returns The writer.
     * ```typescript
     * const writer = HazelWriter.alloc(5);
     * writer.bytes("Hello");
     * ```
     */
    bytes(bytes) {
        if (Buffer.isBuffer(bytes)) {
            this.expand(bytes.byteLength);
            bytes.copy(this.buffer, this._cursor);
            this._cursor += bytes.byteLength;
            return this;
        }
        if (Array.isArray(bytes) || typeof bytes === "string") {
            const buffer = Buffer.from(bytes);
            return this.bytes(buffer);
        }
        return this.bytes(bytes.buffer);
    }
    /**
     * Begin writing a new length & tag message.
     * @param tag The tag of the message.
     * @returns The writer.
     * ```typescript
     * const writer = HazelWriter.alloc(4);
     * writer.begin(5);
     * writer.uint8(0x45);
     * writer.end();
     * ```
     */
    begin(tag) {
        this.messageStack.push(this._cursor);
        this.jump(2);
        this.uint8(tag);
        return this;
    }
    /**
     * End writing an opened message.
     * @returns The writer.
     * ```typescript
     * const writer = HazelWriter.alloc(4);
     * writer.begin(5);
     * writer.uint8(0x45);
     * writer.end();
     * ```
     */
    end() {
        const pos = this.messageStack.pop();
        if (typeof pos !== "number") {
            throw new Error("Attempted to end a message that never started.");
        }
        const length = this._cursor - pos;
        if (length > bounds_1.BOUNDS.uint16.max) {
            throw new Error("Message length of " + length + " was too long.");
        }
        const cursor = this._cursor;
        this.goto(pos);
        this.uint16(length - 3);
        this.goto(cursor);
        return this;
    }
    /**
     * Write an object list from the buffer.
     * @param length The length of the list.
     * @param fn The function accepting a single reader to use for reading data.
     * @returns The writer.
     * @example
     * ```typescript
     * const nums = [5, 6, 7, 8];
     * const reader = HazelReader.alloc(0);
     *
     * const items = reader.list(nums, (item, writer) => writer.uint8(item));
     *
     * console.log(items); // => [5, 6, 7, 8];
     * ```
     */
    list(length, arr, fn) {
        if (length) {
            this.upacked(arr.length);
        }
        for (let i = 0; i < arr.length; i++) {
            const obj = arr[i];
            if (fn)
                fn(obj, i, this);
        }
        return this;
    }
    /**
     * Write a vector position into 2 16 bit integers.
     * @param position The position to write.
     * @returns The writer.
     */
    vector(position) {
        const x = Vector_1.Vector2.unlerp(position.x) * 65535;
        const y = Vector_1.Vector2.unlerp(position.y) * 65535;
        this.uint16(~~x);
        this.uint16(~~y);
    }
}
exports.HazelWriter = HazelWriter;
//# sourceMappingURL=HazelWriter.js.map

/***/ }),

/***/ 905:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TextBuilder = void 0;
const hex = (h) => h.toString(16).padStart(2, "0");
class TextBuilder {
    constructor() {
        this._str = "";
    }
    toString() {
        return this._str;
    }
    /**
     * Write plain text.
     */
    text(str) {
        this._str += str;
        return this;
    }
    append(text) {
        this._str += text.toString();
        return this;
    }
    /**
     * Create a text tag (color, link)
     */
    tag(content) {
        this._str += "[" + content + "]";
        return this;
    }
    color(r, g, b, a) {
        if (typeof r === "string") {
            if (!/^[a-fA-F0-9]+$/.test(r)) {
                return this.color(r.replace(/[^a-fA-F0-9]/g, "0"));
            }
            const hexclr = r.padStart(8, "0");
            this.tag(hexclr);
        }
        else if (typeof r === "number") {
            const hexclr = hex(r) + hex(g || 0) + hex(b || 0) + hex(a || 0);
            this.tag(hexclr);
        }
        return this;
    }
    /**
     * Reset the builder to a blank string.
     */
    reset() {
        this._str = "";
        return this;
    }
    /**
     * Clear all styles (color, link).
     */
    clear() {
        this.tag("");
        return this;
    }
    /**
     * Write a clickable link.
     * @param url A URL to link to, must begin with http.
     */
    link(url) {
        if (url.startsWith("http")) {
            this._str += "[" + url + "]";
        }
        else {
            throw new Error("TextBuilder: Invalid URL (must start with http).");
        }
        return this;
    }
    /**
     * Write a clickable link.
     * @param url A URL to link to, must begin with http.
     */
    url(url) {
        return this.link(url);
    }
}
exports.TextBuilder = TextBuilder;
//# sourceMappingURL=TextBuilder.js.map

/***/ }),

/***/ 3866:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vector2 = void 0;
/**
 * Represents a 2D vector in Among Us, i.e. a position or velocity.
 */
class Vector2 {
    constructor(x, y) {
        if (typeof x === "undefined") {
            this.x = 0;
            this.y = 0;
        }
        else if (typeof x === "number") {
            this.x = x;
            this.y = typeof y === "number" ? y : x;
        }
        else if (Array.isArray(x)) {
            this.x = x[0];
            this.y = x[1];
        }
        else {
            this.x = x.x;
            this.y = x.y;
        }
    }
    /**
     * Add two vectors together
     * @param a The first vector.
     * @param b The second vector.
     * @returns A new vector with the two vectors added together.
     * @example
     * ```ts
     * const a = new Vector2(5, 8);
     * const b = new Vector2(3, 7);
     *
     * const c = Vector2.add(a, b);
     * console.log(c); // => (8, 15)
     * ```
     */
    static add(a, b) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }
    /**
     * Subtract one vector from another.
     * @param a The first vector.
     * @param b The second vector.
     * @returns A new vector with the second vector subtracted from the first.
     * @example
     * ```ts
     * const a = new Vector2(9, 9);
     * const b = new Vector2(3, 3);
     *
     * const c = Vector2.sub(a, b);
     * console.log(c); // => (6, 6)
     * ```
     */
    static sub(a, b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }
    static mul(a, b) {
        if (typeof b === "number") {
            return new Vector2(a.x * b, a.y * b);
        }
        return new Vector2(a.x * b.x, a.y * b.y);
    }
    static div(a, b) {
        if (typeof b === "number") {
            return new Vector2(a.x / b, a.y / b);
        }
        return new Vector2(a.x / b.x, a.y / b.y);
    }
    /**
     * Calculate the distance between one vector and another.
     * @param a The first vector.
     * @param b The second vector.
     * @returns The distance between the two vectors.
     * @example
     * ```ts
     * const a = new Vector(3, 3);
     * const b = new Vector(6, 7);
     *
     * const dist = Vector2.dist(a, b);
     * console.log(dist); // => 5
     * ```
     */
    static dist(a, b) {
        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }
    /**
     * Clamp a value between a minimum and a maximum.
     * @param val The value to clamp.
     * @param min The minimum value.
     * @param max The maximum value.
     * @returns The clamped value.
     * @example
     * ```ts
     * console.log(Vector2.clamp(50, 0, 100)); // => 50
     * console.log(Vector2.clamp(125, 0, 100)); // => 100
     * console.log(Vector2.clamp(-50, 0, 100)); // => 0
     * ```
     */
    static clamp(val, min, max) {
        if (val > max) {
            return max;
        }
        if (val < min) {
            return min;
        }
        return val;
    }
    /**
     * Map a value between 0 and 1 to between a minimum and maximum value.
     * @param val The value to lerp.
     * @param min The minimum value to lerp from.
     * @param max The maximum value to lerp to.
     * @returns The lerped value.
     * @example
     * ```ts
     * console.log(Vector2.lerp(0.9)); // => 40
     * console.log(Vector2.lerp(0.9, -30, 30)); // => 24
     * ```
     */
    static lerp(val, min = -50, max = 50) {
        if (!isFinite(min))
            return max;
        if (!isFinite(max))
            return min;
        const clamped = Vector2.clamp(val, 0, 1);
        return min + (max - min) * clamped;
    }
    /**
     * Map a value between a minimum and maximum value to between 0 and 1.
     * @param val The value to unlerp.
     * @param min The minimum value to unlerp from.
     * @param max The maximum value to unlerp to.
     * @returns The unlerped value.
     * @example
     * ```ts
     * console.log(Vector2.unlerp(0)); // => 0.5
     * console.log(Vector2.unlerp(0, -15, 25)); // => 0.375
     * ```
     */
    static unlerp(val, min = -50, max = 50) {
        return (val - min) / (max - min);
    }
    /**
     * A null vector.
     * @example
     * ```ts
     * console.log(Vector2.null); // => (0, 0)
     * ```
     */
    static get null() {
        return new Vector2(0, 0);
    }
    static Deserialize(reader) {
        return reader.vector();
    }
    Serialize(writer) {
        writer.vector(this);
    }
    /**
     * Convert the vector into a string.
     * @returns The vector as a string.
     * @example
     * ```ts
     * const vector = new Vector2(5, 6);
     *
     * console.log(vector.toString()); // => (5, 6)
     * ```
     */
    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
        return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ")";
    }
}
exports.Vector2 = Vector2;
//# sourceMappingURL=Vector.js.map

/***/ }),

/***/ 2714:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VersionInfo = void 0;
class VersionInfo {
    constructor(year, month, day, revision = 0) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.revision = revision;
    }
    static from(version) {
        if (typeof version === "number") {
            const year = Math.floor(version / 25000);
            version %= 25000;
            const month = Math.floor(version / 1800);
            version %= 1800;
            const day = Math.floor(version / 50);
            const revision = version % 50;
            return new VersionInfo(year, month, day, revision);
        }
        else {
            const parts = version.split(".");
            const year = parts[0] || "0";
            const month = parts[1] || "0";
            const day = parts[2] || "0";
            const revision = parts[3] || "0";
            return new VersionInfo(parseInt(year), parseInt(month), parseInt(day), parseInt(revision));
        }
    }
    static Deserialize(reader) {
        const num = reader.uint32();
        return VersionInfo.from(num);
    }
    Serialize(writer) {
        writer.int32(this.encode());
    }
    /**
     * Convert the version into a human-readable string format.
     * @returns The version as a string.
     * @example
     * ```ts
     * const version = new VersionInfo(2021, 4, 2);
     *
     * console.log(version.toString()); // => 2021.4.2.0
     * ```
     */
    toString() {
        return (this.year + "." + this.month + "." + this.day + "." + this.revision);
    }
    /**
     * Encode the version as an integer.
     * @returns The version as an integer.
     * @example
     * ```ts
     * const version = new VersionInfo(2021, 4, 2);
     *
     * console.log(version.encode()); // => 50532300
     * ```
     */
    encode() {
        return (this.year * 25000 +
            this.month * 1800 +
            this.day * 50 +
            this.revision);
    }
}
exports.VersionInfo = VersionInfo;
//# sourceMappingURL=Version.js.map

/***/ }),

/***/ 8158:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BOUNDS = exports.SIZES = void 0;
exports.SIZES = {
    uint8: 1,
    int8: 1,
    uint16: 2,
    int16: 2,
    uint32: 4,
    int32: 4,
    float: 4,
};
exports.BOUNDS = {
    uint8: {
        min: 0,
        max: 255,
    },
    int8: {
        min: -127,
        max: 127,
    },
    uint16: {
        min: 0,
        max: 65535,
    },
    int16: {
        min: -32767,
        max: 32767,
    },
    uint32: {
        min: 0,
        max: 4294967295,
    },
    int32: {
        min: -2147483647,
        max: 2147483647,
    },
};
//# sourceMappingURL=bounds.js.map

/***/ }),

/***/ 428:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(5291), exports);
__exportStar(__webpack_require__(7611), exports);
__exportStar(__webpack_require__(2698), exports);
__exportStar(__webpack_require__(8599), exports);
__exportStar(__webpack_require__(4106), exports);
__exportStar(__webpack_require__(9450), exports);
__exportStar(__webpack_require__(905), exports);
__exportStar(__webpack_require__(3866), exports);
__exportStar(__webpack_require__(2714), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4106:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ritoa = void 0;
function ritoa(remote) {
    if (remote.remote) {
        return ritoa(remote.remote);
    }
    return `${remote.address}:${remote.port}`;
}
exports.ritoa = ritoa;
//# sourceMappingURL=ritoa.js.map

/***/ }),

/***/ 9450:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sleep = void 0;
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
exports.sleep = sleep;
//# sourceMappingURL=sleep.js.map

/***/ }),

/***/ 7173:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 7418:
/***/ ((module) => {

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ 4448:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/** @license React v17.0.2
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
var aa=__webpack_require__(7294),m=__webpack_require__(7418),r=__webpack_require__(3840);function y(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}if(!aa)throw Error(y(227));var ba=new Set,ca={};function da(a,b){ea(a,b);ea(a+"Capture",b)}
function ea(a,b){ca[a]=b;for(a=0;a<b.length;a++)ba.add(b[a])}
var fa=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ha=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ia=Object.prototype.hasOwnProperty,
ja={},ka={};function la(a){if(ia.call(ka,a))return!0;if(ia.call(ja,a))return!1;if(ha.test(a))return ka[a]=!0;ja[a]=!0;return!1}function ma(a,b,c,d){if(null!==c&&0===c.type)return!1;switch(typeof b){case "function":case "symbol":return!0;case "boolean":if(d)return!1;if(null!==c)return!c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return"data-"!==a&&"aria-"!==a;default:return!1}}
function na(a,b,c,d){if(null===b||"undefined"===typeof b||ma(a,b,c,d))return!0;if(d)return!1;if(null!==c)switch(c.type){case 3:return!b;case 4:return!1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return!1}function B(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g}var D={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){D[a]=new B(a,0,!1,a,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];D[b]=new B(b,1,!1,a[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){D[a]=new B(a,2,!1,a.toLowerCase(),null,!1,!1)});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){D[a]=new B(a,2,!1,a,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){D[a]=new B(a,3,!1,a.toLowerCase(),null,!1,!1)});
["checked","multiple","muted","selected"].forEach(function(a){D[a]=new B(a,3,!0,a,null,!1,!1)});["capture","download"].forEach(function(a){D[a]=new B(a,4,!1,a,null,!1,!1)});["cols","rows","size","span"].forEach(function(a){D[a]=new B(a,6,!1,a,null,!1,!1)});["rowSpan","start"].forEach(function(a){D[a]=new B(a,5,!1,a.toLowerCase(),null,!1,!1)});var oa=/[\-:]([a-z])/g;function pa(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(oa,
pa);D[b]=new B(b,1,!1,a,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(oa,pa);D[b]=new B(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(oa,pa);D[b]=new B(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(a){D[a]=new B(a,1,!1,a.toLowerCase(),null,!1,!1)});
D.xlinkHref=new B("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){D[a]=new B(a,1,!1,a.toLowerCase(),null,!0,!0)});
function qa(a,b,c,d){var e=D.hasOwnProperty(b)?D[b]:null;var f=null!==e?0===e.type:d?!1:!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1]?!1:!0;f||(na(b,c,e,d)&&(c=null),d||null===e?la(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c))))}
var ra=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,sa=60103,ta=60106,ua=60107,wa=60108,xa=60114,ya=60109,za=60110,Aa=60112,Ba=60113,Ca=60120,Da=60115,Ea=60116,Fa=60121,Ga=60128,Ha=60129,Ia=60130,Ja=60131;
if("function"===typeof Symbol&&Symbol.for){var E=Symbol.for;sa=E("react.element");ta=E("react.portal");ua=E("react.fragment");wa=E("react.strict_mode");xa=E("react.profiler");ya=E("react.provider");za=E("react.context");Aa=E("react.forward_ref");Ba=E("react.suspense");Ca=E("react.suspense_list");Da=E("react.memo");Ea=E("react.lazy");Fa=E("react.block");E("react.scope");Ga=E("react.opaque.id");Ha=E("react.debug_trace_mode");Ia=E("react.offscreen");Ja=E("react.legacy_hidden")}
var Ka="function"===typeof Symbol&&Symbol.iterator;function La(a){if(null===a||"object"!==typeof a)return null;a=Ka&&a[Ka]||a["@@iterator"];return"function"===typeof a?a:null}var Ma;function Na(a){if(void 0===Ma)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);Ma=b&&b[1]||""}return"\n"+Ma+a}var Oa=!1;
function Pa(a,b){if(!a||Oa)return"";Oa=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[])}catch(k){var d=k}Reflect.construct(a,[],b)}else{try{b.call()}catch(k){d=k}a.call(b.prototype)}else{try{throw Error();}catch(k){d=k}a()}}catch(k){if(k&&d&&"string"===typeof k.stack){for(var e=k.stack.split("\n"),
f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h])return"\n"+e[g].replace(" at new "," at ");while(1<=g&&0<=h)}break}}}finally{Oa=!1,Error.prepareStackTrace=c}return(a=a?a.displayName||a.name:"")?Na(a):""}
function Qa(a){switch(a.tag){case 5:return Na(a.type);case 16:return Na("Lazy");case 13:return Na("Suspense");case 19:return Na("SuspenseList");case 0:case 2:case 15:return a=Pa(a.type,!1),a;case 11:return a=Pa(a.type.render,!1),a;case 22:return a=Pa(a.type._render,!1),a;case 1:return a=Pa(a.type,!0),a;default:return""}}
function Ra(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ua:return"Fragment";case ta:return"Portal";case xa:return"Profiler";case wa:return"StrictMode";case Ba:return"Suspense";case Ca:return"SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case za:return(a.displayName||"Context")+".Consumer";case ya:return(a._context.displayName||"Context")+".Provider";case Aa:var b=a.render;b=b.displayName||b.name||"";
return a.displayName||(""!==b?"ForwardRef("+b+")":"ForwardRef");case Da:return Ra(a.type);case Fa:return Ra(a._render);case Ea:b=a._payload;a=a._init;try{return Ra(a(b))}catch(c){}}return null}function Sa(a){switch(typeof a){case "boolean":case "number":case "object":case "string":case "undefined":return a;default:return""}}function Ta(a){var b=a.type;return(a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Ua(a){var b=Ta(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a)}});Object.defineProperty(a,b,{enumerable:c.enumerable});return{getValue:function(){return d},setValue:function(a){d=""+a},stopTracking:function(){a._valueTracker=
null;delete a[b]}}}}function Va(a){a._valueTracker||(a._valueTracker=Ua(a))}function Wa(a){if(!a)return!1;var b=a._valueTracker;if(!b)return!0;var c=b.getValue();var d="";a&&(d=Ta(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Xa(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
function Ya(a,b){var c=b.checked;return m({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value}}function $a(a,b){b=b.checked;null!=b&&qa(a,"checked",b,!1)}
function ab(a,b){$a(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?bb(a,b.type,c):b.hasOwnProperty("defaultValue")&&bb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked)}
function cb(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c)}
function bb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c)}function db(a){var b="";aa.Children.forEach(a,function(a){null!=a&&(b+=a)});return b}function eb(a,b){a=m({children:void 0},b);if(b=db(b.children))a.children=b;return a}
function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0)}else{c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e])}null!==b&&(b.selected=!0)}}
function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(y(91));return m({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(y(92));if(Array.isArray(c)){if(!(1>=c.length))throw Error(y(93));c=c[0]}b=c}null==b&&(b="");c=b}a._wrapperState={initialValue:Sa(c)}}
function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d)}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b)}var kb={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};
function lb(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function mb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?lb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var nb,ob=function(a){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)})}:a}(function(a,b){if(a.namespaceURI!==kb.svg||"innerHTML"in a)a.innerHTML=b;else{nb=nb||document.createElement("div");nb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=nb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild)}});
function pb(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b}
var qb={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,
floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},rb=["Webkit","ms","Moz","O"];Object.keys(qb).forEach(function(a){rb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);qb[b]=qb[a]})});function sb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||qb.hasOwnProperty(a)&&qb[a]?(""+b).trim():b+"px"}
function tb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=sb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e}}var ub=m({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function vb(a,b){if(b){if(ub[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(y(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(y(60));if(!("object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML))throw Error(y(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(y(62));}}
function wb(a,b){if(-1===a.indexOf("-"))return"string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return!1;default:return!0}}function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(y(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b))}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a])}}function Gb(a,b){return a(b)}function Hb(a,b,c,d,e){return a(b,c,d,e)}function Ib(){}var Jb=Gb,Kb=!1,Lb=!1;function Mb(){if(null!==zb||null!==Ab)Ib(),Fb()}
function Nb(a,b,c){if(Lb)return a(b,c);Lb=!0;try{return Jb(a,b,c)}finally{Lb=!1,Mb()}}
function Ob(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1}if(a)return null;if(c&&"function"!==
typeof c)throw Error(y(231,b,typeof c));return c}var Pb=!1;if(fa)try{var Qb={};Object.defineProperty(Qb,"passive",{get:function(){Pb=!0}});window.addEventListener("test",Qb,Qb);window.removeEventListener("test",Qb,Qb)}catch(a){Pb=!1}function Rb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l)}catch(n){this.onError(n)}}var Sb=!1,Tb=null,Ub=!1,Vb=null,Wb={onError:function(a){Sb=!0;Tb=a}};function Xb(a,b,c,d,e,f,g,h,k){Sb=!1;Tb=null;Rb.apply(Wb,arguments)}
function Yb(a,b,c,d,e,f,g,h,k){Xb.apply(this,arguments);if(Sb){if(Sb){var l=Tb;Sb=!1;Tb=null}else throw Error(y(198));Ub||(Ub=!0,Vb=l)}}function Zb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else{a=b;do b=a,0!==(b.flags&1026)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function $b(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function ac(a){if(Zb(a)!==a)throw Error(y(188));}
function bc(a){var b=a.alternate;if(!b){b=Zb(a);if(null===b)throw Error(y(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return ac(e),a;if(f===d)return ac(e),b;f=f.sibling}throw Error(y(188));}if(c.return!==d.return)c=e,d=f;else{for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===
c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}if(!g)throw Error(y(189));}}if(c.alternate!==d)throw Error(y(190));}if(3!==c.tag)throw Error(y(188));return c.stateNode.current===c?a:b}function cc(a){a=bc(a);if(!a)return null;for(var b=a;;){if(5===b.tag||6===b.tag)return b;if(b.child)b.child.return=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}}return null}
function dc(a,b){for(var c=a.alternate;null!==b;){if(b===a||b===c)return!0;b=b.return}return!1}var ec,fc,gc,hc,ic=!1,jc=[],kc=null,lc=null,mc=null,nc=new Map,oc=new Map,pc=[],qc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function rc(a,b,c,d,e){return{blockedOn:a,domEventName:b,eventSystemFlags:c|16,nativeEvent:e,targetContainers:[d]}}function sc(a,b){switch(a){case "focusin":case "focusout":kc=null;break;case "dragenter":case "dragleave":lc=null;break;case "mouseover":case "mouseout":mc=null;break;case "pointerover":case "pointerout":nc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":oc.delete(b.pointerId)}}
function tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a=rc(b,c,d,e,f),null!==b&&(b=Cb(b),null!==b&&fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
function uc(a,b,c,d,e){switch(b){case "focusin":return kc=tc(kc,a,b,c,d,e),!0;case "dragenter":return lc=tc(lc,a,b,c,d,e),!0;case "mouseover":return mc=tc(mc,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;nc.set(f,tc(nc.get(f)||null,a,b,c,d,e));return!0;case "gotpointercapture":return f=e.pointerId,oc.set(f,tc(oc.get(f)||null,a,b,c,d,e)),!0}return!1}
function vc(a){var b=wc(a.target);if(null!==b){var c=Zb(b);if(null!==c)if(b=c.tag,13===b){if(b=$b(c),null!==b){a.blockedOn=b;hc(a.lanePriority,function(){r.unstable_runWithPriority(a.priority,function(){gc(c)})});return}}else if(3===b&&c.stateNode.hydrate){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null}
function xc(a){if(null!==a.blockedOn)return!1;for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c)return b=Cb(c),null!==b&&fc(b),a.blockedOn=c,!1;b.shift()}return!0}function zc(a,b,c){xc(a)&&c.delete(b)}
function Ac(){for(ic=!1;0<jc.length;){var a=jc[0];if(null!==a.blockedOn){a=Cb(a.blockedOn);null!==a&&ec(a);break}for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c){a.blockedOn=c;break}b.shift()}null===a.blockedOn&&jc.shift()}null!==kc&&xc(kc)&&(kc=null);null!==lc&&xc(lc)&&(lc=null);null!==mc&&xc(mc)&&(mc=null);nc.forEach(zc);oc.forEach(zc)}
function Bc(a,b){a.blockedOn===b&&(a.blockedOn=null,ic||(ic=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,Ac)))}
function Cc(a){function b(b){return Bc(b,a)}if(0<jc.length){Bc(jc[0],a);for(var c=1;c<jc.length;c++){var d=jc[c];d.blockedOn===a&&(d.blockedOn=null)}}null!==kc&&Bc(kc,a);null!==lc&&Bc(lc,a);null!==mc&&Bc(mc,a);nc.forEach(b);oc.forEach(b);for(c=0;c<pc.length;c++)d=pc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<pc.length&&(c=pc[0],null===c.blockedOn);)vc(c),null===c.blockedOn&&pc.shift()}
function Dc(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var Ec={animationend:Dc("Animation","AnimationEnd"),animationiteration:Dc("Animation","AnimationIteration"),animationstart:Dc("Animation","AnimationStart"),transitionend:Dc("Transition","TransitionEnd")},Fc={},Gc={};
fa&&(Gc=document.createElement("div").style,"AnimationEvent"in window||(delete Ec.animationend.animation,delete Ec.animationiteration.animation,delete Ec.animationstart.animation),"TransitionEvent"in window||delete Ec.transitionend.transition);function Hc(a){if(Fc[a])return Fc[a];if(!Ec[a])return a;var b=Ec[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Gc)return Fc[a]=b[c];return a}
var Ic=Hc("animationend"),Jc=Hc("animationiteration"),Kc=Hc("animationstart"),Lc=Hc("transitionend"),Mc=new Map,Nc=new Map,Oc=["abort","abort",Ic,"animationEnd",Jc,"animationIteration",Kc,"animationStart","canplay","canPlay","canplaythrough","canPlayThrough","durationchange","durationChange","emptied","emptied","encrypted","encrypted","ended","ended","error","error","gotpointercapture","gotPointerCapture","load","load","loadeddata","loadedData","loadedmetadata","loadedMetadata","loadstart","loadStart",
"lostpointercapture","lostPointerCapture","playing","playing","progress","progress","seeking","seeking","stalled","stalled","suspend","suspend","timeupdate","timeUpdate",Lc,"transitionEnd","waiting","waiting"];function Pc(a,b){for(var c=0;c<a.length;c+=2){var d=a[c],e=a[c+1];e="on"+(e[0].toUpperCase()+e.slice(1));Nc.set(d,b);Mc.set(d,e);da(e,[d])}}var Qc=r.unstable_now;Qc();var F=8;
function Rc(a){if(0!==(1&a))return F=15,1;if(0!==(2&a))return F=14,2;if(0!==(4&a))return F=13,4;var b=24&a;if(0!==b)return F=12,b;if(0!==(a&32))return F=11,32;b=192&a;if(0!==b)return F=10,b;if(0!==(a&256))return F=9,256;b=3584&a;if(0!==b)return F=8,b;if(0!==(a&4096))return F=7,4096;b=4186112&a;if(0!==b)return F=6,b;b=62914560&a;if(0!==b)return F=5,b;if(a&67108864)return F=4,67108864;if(0!==(a&134217728))return F=3,134217728;b=805306368&a;if(0!==b)return F=2,b;if(0!==(1073741824&a))return F=1,1073741824;
F=8;return a}function Sc(a){switch(a){case 99:return 15;case 98:return 10;case 97:case 96:return 8;case 95:return 2;default:return 0}}function Tc(a){switch(a){case 15:case 14:return 99;case 13:case 12:case 11:case 10:return 98;case 9:case 8:case 7:case 6:case 4:case 5:return 97;case 3:case 2:case 1:return 95;case 0:return 90;default:throw Error(y(358,a));}}
function Uc(a,b){var c=a.pendingLanes;if(0===c)return F=0;var d=0,e=0,f=a.expiredLanes,g=a.suspendedLanes,h=a.pingedLanes;if(0!==f)d=f,e=F=15;else if(f=c&134217727,0!==f){var k=f&~g;0!==k?(d=Rc(k),e=F):(h&=f,0!==h&&(d=Rc(h),e=F))}else f=c&~g,0!==f?(d=Rc(f),e=F):0!==h&&(d=Rc(h),e=F);if(0===d)return 0;d=31-Vc(d);d=c&((0>d?0:1<<d)<<1)-1;if(0!==b&&b!==d&&0===(b&g)){Rc(b);if(e<=F)return b;F=e}b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-Vc(b),e=1<<c,d|=a[c],b&=~e;return d}
function Wc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function Xc(a,b){switch(a){case 15:return 1;case 14:return 2;case 12:return a=Yc(24&~b),0===a?Xc(10,b):a;case 10:return a=Yc(192&~b),0===a?Xc(8,b):a;case 8:return a=Yc(3584&~b),0===a&&(a=Yc(4186112&~b),0===a&&(a=512)),a;case 2:return b=Yc(805306368&~b),0===b&&(b=268435456),b}throw Error(y(358,a));}function Yc(a){return a&-a}function Zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
function $c(a,b,c){a.pendingLanes|=b;var d=b-1;a.suspendedLanes&=d;a.pingedLanes&=d;a=a.eventTimes;b=31-Vc(b);a[b]=c}var Vc=Math.clz32?Math.clz32:ad,bd=Math.log,cd=Math.LN2;function ad(a){return 0===a?32:31-(bd(a)/cd|0)|0}var dd=r.unstable_UserBlockingPriority,ed=r.unstable_runWithPriority,fd=!0;function gd(a,b,c,d){Kb||Ib();var e=hd,f=Kb;Kb=!0;try{Hb(e,a,b,c,d)}finally{(Kb=f)||Mb()}}function id(a,b,c,d){ed(dd,hd.bind(null,a,b,c,d))}
function hd(a,b,c,d){if(fd){var e;if((e=0===(b&4))&&0<jc.length&&-1<qc.indexOf(a))a=rc(null,a,b,c,d),jc.push(a);else{var f=yc(a,b,c,d);if(null===f)e&&sc(a,d);else{if(e){if(-1<qc.indexOf(a)){a=rc(f,a,b,c,d);jc.push(a);return}if(uc(f,a,b,c,d))return;sc(a,d)}jd(a,b,d,null,c)}}}}
function yc(a,b,c,d){var e=xb(d);e=wc(e);if(null!==e){var f=Zb(e);if(null===f)e=null;else{var g=f.tag;if(13===g){e=$b(f);if(null!==e)return e;e=null}else if(3===g){if(f.stateNode.hydrate)return 3===f.tag?f.stateNode.containerInfo:null;e=null}else f!==e&&(e=null)}}jd(a,b,d,e,c);return null}var kd=null,ld=null,md=null;
function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return!0}function qd(){return!1}
function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}m(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
(a.returnValue=!1),this.isDefaultPrevented=pd)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd)},persist:function(){},isPersistent:pd});return b}
var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=m({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=m({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return"movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=m({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=m({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=m({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=m({},sd,{clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=m({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:!1}function zd(){return Pd}
var Qd=m({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return"keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return"keypress"===a.type?od(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===
a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=m({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=m({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=m({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=m({},Ad,{deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae=fa&&"CompositionEvent"in window,be=null;fa&&"documentMode"in document&&(be=document.documentMode);var ce=fa&&"TextEvent"in window&&!be,de=fa&&(!ae||be&&8<be&&11>=be),ee=String.fromCharCode(32),fe=!1;
function ge(a,b){switch(a){case "keyup":return-1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return!0;default:return!1}}function he(a){a=a.detail;return"object"===typeof a&&"data"in a?a.data:null}var ie=!1;function je(a,b){switch(a){case "compositionend":return he(b);case "keypress":if(32!==b.which)return null;fe=!0;return ee;case "textInput":return a=b.data,a===ee&&fe?null:a;default:return null}}
function ke(a,b){if(ie)return"compositionend"===a||!ae&&ge(a,b)?(a=nd(),md=ld=kd=null,ie=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de&&"ko"!==b.locale?null:b.data;default:return null}}
var le={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return"input"===b?!!le[a.type]:"textarea"===b?!0:!1}function ne(a,b,c,d){Eb(d);b=oe(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}))}var pe=null,qe=null;function re(a){se(a,0)}function te(a){var b=ue(a);if(Wa(b))return a}
function ve(a,b){if("change"===a)return b}var we=!1;if(fa){var xe;if(fa){var ye="oninput"in document;if(!ye){var ze=document.createElement("div");ze.setAttribute("oninput","return;");ye="function"===typeof ze.oninput}xe=ye}else xe=!1;we=xe&&(!document.documentMode||9<document.documentMode)}function Ae(){pe&&(pe.detachEvent("onpropertychange",Be),qe=pe=null)}function Be(a){if("value"===a.propertyName&&te(qe)){var b=[];ne(b,qe,a,xb(a));a=re;if(Kb)a(b);else{Kb=!0;try{Gb(a,b)}finally{Kb=!1,Mb()}}}}
function Ce(a,b,c){"focusin"===a?(Ae(),pe=b,qe=c,pe.attachEvent("onpropertychange",Be)):"focusout"===a&&Ae()}function De(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te(qe)}function Ee(a,b){if("click"===a)return te(b)}function Fe(a,b){if("input"===a||"change"===a)return te(b)}function Ge(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He="function"===typeof Object.is?Object.is:Ge,Ie=Object.prototype.hasOwnProperty;
function Je(a,b){if(He(a,b))return!0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return!1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return!1;for(d=0;d<c.length;d++)if(!Ie.call(b,c[d])||!He(a[c[d]],b[c[d]]))return!1;return!0}function Ke(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Le(a,b){var c=Ke(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return{node:c,offset:b-a};a=d}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode}c=void 0}c=Ke(c)}}function Me(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Me(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
function Ne(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href}catch(d){c=!1}if(c)a=b.contentWindow;else break;b=Xa(a.document)}return b}function Oe(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
var Pe=fa&&"documentMode"in document&&11>=document.documentMode,Qe=null,Re=null,Se=null,Te=!1;
function Ue(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te||null==Qe||Qe!==Xa(d)||(d=Qe,"selectionStart"in d&&Oe(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se&&Je(Se,d)||(Se=d,d=oe(Re,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe)))}
Pc("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "),
0);Pc("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "),1);Pc(Oc,2);for(var Ve="change selectionchange textInput compositionstart compositionend compositionupdate".split(" "),We=0;We<Ve.length;We++)Nc.set(Ve[We],0);ea("onMouseEnter",["mouseout","mouseover"]);
ea("onMouseLeave",["mouseout","mouseover"]);ea("onPointerEnter",["pointerout","pointerover"]);ea("onPointerLeave",["pointerout","pointerover"]);da("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));da("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));da("onBeforeInput",["compositionend","keypress","textInput","paste"]);da("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));
da("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));da("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Xe="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Ye=new Set("cancel close invalid load scroll toggle".split(" ").concat(Xe));
function Ze(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Yb(d,b,void 0,a);a.currentTarget=null}
function se(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k}}}if(Ub)throw a=Vb,Ub=!1,Vb=null,a;}
function G(a,b){var c=$e(b),d=a+"__bubble";c.has(d)||(af(b,a,2,!1),c.add(d))}var bf="_reactListening"+Math.random().toString(36).slice(2);function cf(a){a[bf]||(a[bf]=!0,ba.forEach(function(b){Ye.has(b)||df(b,!1,a,null);df(b,!0,a,null)}))}
function df(a,b,c,d){var e=4<arguments.length&&void 0!==arguments[4]?arguments[4]:0,f=c;"selectionchange"===a&&9!==c.nodeType&&(f=c.ownerDocument);if(null!==d&&!b&&Ye.has(a)){if("scroll"!==a)return;e|=2;f=d}var g=$e(f),h=a+"__"+(b?"capture":"bubble");g.has(h)||(b&&(e|=4),af(f,a,e,b),g.add(h))}
function af(a,b,c,d){var e=Nc.get(b);switch(void 0===e?2:e){case 0:e=gd;break;case 1:e=id;break;default:e=hd}c=e.bind(null,b,c,a);e=void 0;!Pb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1)}
function jd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return}for(;null!==h;){g=wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode}}d=d.return}Nb(function(){var d=f,e=xb(c),g=[];
a:{var h=Mc.get(a);if(void 0!==h){var k=td,x=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":x="focus";k=Fd;break;case "focusout":x="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case Ic:case Jc:case Kc:k=Hd;break;case Lc:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td}var w=0!==(b&4),z=!w&&"scroll"===a,u=w?null!==h?h+"Capture":null:h;w=[];for(var t=d,q;null!==
t;){q=t;var v=q.stateNode;5===q.tag&&null!==v&&(q=v,null!==u&&(v=Ob(t,u),null!=v&&w.push(ef(t,v,q))));if(z)break;t=t.return}0<w.length&&(h=new k(h,x,null,c,e),g.push({event:h,listeners:w}))}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&0===(b&16)&&(x=c.relatedTarget||c.fromElement)&&(wc(x)||x[ff]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(x=c.relatedTarget||c.toElement,k=d,x=x?wc(x):null,null!==
x&&(z=Zb(x),x!==z||5!==x.tag&&6!==x.tag))x=null}else k=null,x=d;if(k!==x){w=Bd;v="onMouseLeave";u="onMouseEnter";t="mouse";if("pointerout"===a||"pointerover"===a)w=Td,v="onPointerLeave",u="onPointerEnter",t="pointer";z=null==k?h:ue(k);q=null==x?h:ue(x);h=new w(v,t+"leave",k,c,e);h.target=z;h.relatedTarget=q;v=null;wc(e)===d&&(w=new w(u,t+"enter",x,c,e),w.target=q,w.relatedTarget=z,v=w);z=v;if(k&&x)b:{w=k;u=x;t=0;for(q=w;q;q=gf(q))t++;q=0;for(v=u;v;v=gf(v))q++;for(;0<t-q;)w=gf(w),t--;for(;0<q-t;)u=
gf(u),q--;for(;t--;){if(w===u||null!==u&&w===u.alternate)break b;w=gf(w);u=gf(u)}w=null}else w=null;null!==k&&hf(g,h,k,w,!1);null!==x&&null!==z&&hf(g,z,x,w,!0)}}}a:{h=d?ue(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var J=ve;else if(me(h))if(we)J=Fe;else{J=De;var K=Ce}else(k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(J=Ee);if(J&&(J=J(a,d))){ne(g,J,c,e);break a}K&&K(a,h,d);"focusout"===a&&(K=h._wrapperState)&&
K.controlled&&"number"===h.type&&bb(h,"number",h.value)}K=d?ue(d):window;switch(a){case "focusin":if(me(K)||"true"===K.contentEditable)Qe=K,Re=d,Se=null;break;case "focusout":Se=Re=Qe=null;break;case "mousedown":Te=!0;break;case "contextmenu":case "mouseup":case "dragend":Te=!1;Ue(g,c,e);break;case "selectionchange":if(Pe)break;case "keydown":case "keyup":Ue(g,c,e)}var Q;if(ae)b:{switch(a){case "compositionstart":var L="onCompositionStart";break b;case "compositionend":L="onCompositionEnd";break b;
case "compositionupdate":L="onCompositionUpdate";break b}L=void 0}else ie?ge(a,c)&&(L="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(L="onCompositionStart");L&&(de&&"ko"!==c.locale&&(ie||"onCompositionStart"!==L?"onCompositionEnd"===L&&ie&&(Q=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie=!0)),K=oe(d,L),0<K.length&&(L=new Ld(L,a,null,c,e),g.push({event:L,listeners:K}),Q?L.data=Q:(Q=he(c),null!==Q&&(L.data=Q))));if(Q=ce?je(a,c):ke(a,c))d=oe(d,"onBeforeInput"),0<d.length&&(e=new Ld("onBeforeInput",
"beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=Q)}se(g,b)})}function ef(a,b,c){return{instance:a,listener:b,currentTarget:c}}function oe(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Ob(a,c),null!=f&&d.unshift(ef(a,f,e)),f=Ob(a,b),null!=f&&d.push(ef(a,f,e)));a=a.return}return d}function gf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function hf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Ob(c,f),null!=k&&g.unshift(ef(c,k,h))):e||(k=Ob(c,f),null!=k&&g.push(ef(c,k,h))));c=c.return}0!==g.length&&a.push({event:b,listeners:g})}function jf(){}var kf=null,lf=null;function mf(a,b){switch(a){case "button":case "input":case "select":case "textarea":return!!b.autoFocus}return!1}
function nf(a,b){return"textarea"===a||"option"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}var of="function"===typeof setTimeout?setTimeout:void 0,pf="function"===typeof clearTimeout?clearTimeout:void 0;function qf(a){1===a.nodeType?a.textContent="":9===a.nodeType&&(a=a.body,null!=a&&(a.textContent=""))}
function rf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break}return a}function sf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--}else"/$"===c&&b++}a=a.previousSibling}return null}var tf=0;function uf(a){return{$$typeof:Ga,toString:a,valueOf:a}}var vf=Math.random().toString(36).slice(2),wf="__reactFiber$"+vf,xf="__reactProps$"+vf,ff="__reactContainer$"+vf,yf="__reactEvents$"+vf;
function wc(a){var b=a[wf];if(b)return b;for(var c=a.parentNode;c;){if(b=c[ff]||c[wf]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=sf(a);null!==a;){if(c=a[wf])return c;a=sf(a)}return b}a=c;c=a.parentNode}return null}function Cb(a){a=a[wf]||a[ff];return!a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(y(33));}function Db(a){return a[xf]||null}
function $e(a){var b=a[yf];void 0===b&&(b=a[yf]=new Set);return b}var zf=[],Af=-1;function Bf(a){return{current:a}}function H(a){0>Af||(a.current=zf[Af],zf[Af]=null,Af--)}function I(a,b){Af++;zf[Af]=a.current;a.current=b}var Cf={},M=Bf(Cf),N=Bf(!1),Df=Cf;
function Ef(a,b){var c=a.type.contextTypes;if(!c)return Cf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}function Ff(a){a=a.childContextTypes;return null!==a&&void 0!==a}function Gf(){H(N);H(M)}function Hf(a,b,c){if(M.current!==Cf)throw Error(y(168));I(M,b);I(N,c)}
function If(a,b,c){var d=a.stateNode;a=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in a))throw Error(y(108,Ra(b)||"Unknown",e));return m({},c,d)}function Jf(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Cf;Df=M.current;I(M,a);I(N,N.current);return!0}function Kf(a,b,c){var d=a.stateNode;if(!d)throw Error(y(169));c?(a=If(a,b,Df),d.__reactInternalMemoizedMergedChildContext=a,H(N),H(M),I(M,a)):H(N);I(N,c)}
var Lf=null,Mf=null,Nf=r.unstable_runWithPriority,Of=r.unstable_scheduleCallback,Pf=r.unstable_cancelCallback,Qf=r.unstable_shouldYield,Rf=r.unstable_requestPaint,Sf=r.unstable_now,Tf=r.unstable_getCurrentPriorityLevel,Uf=r.unstable_ImmediatePriority,Vf=r.unstable_UserBlockingPriority,Wf=r.unstable_NormalPriority,Xf=r.unstable_LowPriority,Yf=r.unstable_IdlePriority,Zf={},$f=void 0!==Rf?Rf:function(){},ag=null,bg=null,cg=!1,dg=Sf(),O=1E4>dg?Sf:function(){return Sf()-dg};
function eg(){switch(Tf()){case Uf:return 99;case Vf:return 98;case Wf:return 97;case Xf:return 96;case Yf:return 95;default:throw Error(y(332));}}function fg(a){switch(a){case 99:return Uf;case 98:return Vf;case 97:return Wf;case 96:return Xf;case 95:return Yf;default:throw Error(y(332));}}function gg(a,b){a=fg(a);return Nf(a,b)}function hg(a,b,c){a=fg(a);return Of(a,b,c)}function ig(){if(null!==bg){var a=bg;bg=null;Pf(a)}jg()}
function jg(){if(!cg&&null!==ag){cg=!0;var a=0;try{var b=ag;gg(99,function(){for(;a<b.length;a++){var c=b[a];do c=c(!0);while(null!==c)}});ag=null}catch(c){throw null!==ag&&(ag=ag.slice(a+1)),Of(Uf,ig),c;}finally{cg=!1}}}var kg=ra.ReactCurrentBatchConfig;function lg(a,b){if(a&&a.defaultProps){b=m({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}var mg=Bf(null),ng=null,og=null,pg=null;function qg(){pg=og=ng=null}
function rg(a){var b=mg.current;H(mg);a.type._context._currentValue=b}function sg(a,b){for(;null!==a;){var c=a.alternate;if((a.childLanes&b)===b)if(null===c||(c.childLanes&b)===b)break;else c.childLanes|=b;else a.childLanes|=b,null!==c&&(c.childLanes|=b);a=a.return}}function tg(a,b){ng=a;pg=og=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(ug=!0),a.firstContext=null)}
function vg(a,b){if(pg!==a&&!1!==b&&0!==b){if("number"!==typeof b||1073741823===b)pg=a,b=1073741823;b={context:a,observedBits:b,next:null};if(null===og){if(null===ng)throw Error(y(308));og=b;ng.dependencies={lanes:0,firstContext:b,responders:null}}else og=og.next=b}return a._currentValue}var wg=!1;function xg(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null},effects:null}}
function yg(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects})}function zg(a,b){return{eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}function Ag(a,b){a=a.updateQueue;if(null!==a){a=a.shared;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b}}
function Bg(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next}while(null!==c);null===f?e=f=b:f=f.next=b}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b}
function Cg(a,b,c,d){var e=a.updateQueue;wg=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var n=a.alternate;if(null!==n){n=n.updateQueue;var A=n.lastBaseUpdate;A!==g&&(null===A?n.firstBaseUpdate=l:A.next=l,n.lastBaseUpdate=k)}}if(null!==f){A=e.baseState;g=0;n=l=k=null;do{h=f.lane;var p=f.eventTime;if((d&h)===h){null!==n&&(n=n.next={eventTime:p,lane:0,tag:f.tag,payload:f.payload,callback:f.callback,
next:null});a:{var C=a,x=f;h=b;p=c;switch(x.tag){case 1:C=x.payload;if("function"===typeof C){A=C.call(p,A,h);break a}A=C;break a;case 3:C.flags=C.flags&-4097|64;case 0:C=x.payload;h="function"===typeof C?C.call(p,A,h):C;if(null===h||void 0===h)break a;A=m({},A,h);break a;case 2:wg=!0}}null!==f.callback&&(a.flags|=32,h=e.effects,null===h?e.effects=[f]:h.push(f))}else p={eventTime:p,lane:h,tag:f.tag,payload:f.payload,callback:f.callback,next:null},null===n?(l=n=p,k=A):n=n.next=p,g|=h;f=f.next;if(null===
f)if(h=e.shared.pending,null===h)break;else f=h.next,h.next=null,e.lastBaseUpdate=h,e.shared.pending=null}while(1);null===n&&(k=A);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=n;Dg|=g;a.lanes=g;a.memoizedState=A}}function Eg(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(y(191,e));e.call(d)}}}var Fg=(new aa.Component).refs;
function Gg(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:m({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c)}
var Kg={isMounted:function(a){return(a=a._reactInternals)?Zb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d)},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d)},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=Hg(),d=Ig(a),e=zg(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=
b);Ag(a,e);Jg(a,d,c)}};function Lg(a,b,c,d,e,f,g){a=a.stateNode;return"function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Je(c,d)||!Je(e,f):!0}
function Mg(a,b,c){var d=!1,e=Cf;var f=b.contextType;"object"===typeof f&&null!==f?f=vg(f):(e=Ff(b)?Df:M.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Ef(a,e):Cf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Kg;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function Ng(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Kg.enqueueReplaceState(b,b.state,null)}
function Og(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=Fg;xg(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=vg(f):(f=Ff(b)?Df:M.current,e.context=Ef(a,f));Cg(a,c,e,d);e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Gg(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||
(b=e.state,"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Kg.enqueueReplaceState(e,e.state,null),Cg(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4)}var Pg=Array.isArray;
function Qg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(y(309));var d=c.stateNode}if(!d)throw Error(y(147,a));var e=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===e)return b.ref;b=function(a){var b=d.refs;b===Fg&&(b=d.refs={});null===a?delete b[e]:b[e]=a};b._stringRef=e;return b}if("string"!==typeof a)throw Error(y(284));if(!c._owner)throw Error(y(290,a));}return a}
function Rg(a,b){if("textarea"!==a.type)throw Error(y(31,"[object Object]"===Object.prototype.toString.call(b)?"object with keys {"+Object.keys(b).join(", ")+"}":b));}
function Sg(a){function b(b,c){if(a){var d=b.lastEffect;null!==d?(d.nextEffect=c,b.lastEffect=c):b.firstEffect=b.lastEffect=c;c.nextEffect=null;c.flags=8}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Tg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags=2,
c):d;b.flags=2;return c}function g(b){a&&null===b.alternate&&(b.flags=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Ug(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){if(null!==b&&b.elementType===c.type)return d=e(b,c.props),d.ref=Qg(a,b,c),d.return=a,d;d=Vg(c.type,c.key,c.props,null,a.mode,d);d.ref=Qg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=
Wg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function n(a,b,c,d,f){if(null===b||7!==b.tag)return b=Xg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function A(a,b,c){if("string"===typeof b||"number"===typeof b)return b=Ug(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case sa:return c=Vg(b.type,b.key,b.props,null,a.mode,c),c.ref=Qg(a,null,b),c.return=a,c;case ta:return b=Wg(b,a.mode,c),b.return=a,b}if(Pg(b)||La(b))return b=Xg(b,
a.mode,c,null),b.return=a,b;Rg(a,b)}return null}function p(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case sa:return c.key===e?c.type===ua?n(a,b,c.props.children,d,e):k(a,b,c,d):null;case ta:return c.key===e?l(a,b,c,d):null}if(Pg(c)||La(c))return null!==e?null:n(a,b,c,d,null);Rg(a,c)}return null}function C(a,b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=a.get(c)||
null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case sa:return a=a.get(null===d.key?c:d.key)||null,d.type===ua?n(b,a,d.props.children,e,d.key):k(b,a,d,e);case ta:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e)}if(Pg(d)||La(d))return a=a.get(c)||null,n(b,a,d,e,null);Rg(b,d)}return null}function x(e,g,h,k){for(var l=null,t=null,u=g,z=g=0,q=null;null!==u&&z<h.length;z++){u.index>z?(q=u,u=null):q=u.sibling;var n=p(e,u,h[z],k);if(null===n){null===u&&(u=q);break}a&&u&&null===
n.alternate&&b(e,u);g=f(n,g,z);null===t?l=n:t.sibling=n;t=n;u=q}if(z===h.length)return c(e,u),l;if(null===u){for(;z<h.length;z++)u=A(e,h[z],k),null!==u&&(g=f(u,g,z),null===t?l=u:t.sibling=u,t=u);return l}for(u=d(e,u);z<h.length;z++)q=C(u,e,z,h[z],k),null!==q&&(a&&null!==q.alternate&&u.delete(null===q.key?z:q.key),g=f(q,g,z),null===t?l=q:t.sibling=q,t=q);a&&u.forEach(function(a){return b(e,a)});return l}function w(e,g,h,k){var l=La(h);if("function"!==typeof l)throw Error(y(150));h=l.call(h);if(null==
h)throw Error(y(151));for(var t=l=null,u=g,z=g=0,q=null,n=h.next();null!==u&&!n.done;z++,n=h.next()){u.index>z?(q=u,u=null):q=u.sibling;var w=p(e,u,n.value,k);if(null===w){null===u&&(u=q);break}a&&u&&null===w.alternate&&b(e,u);g=f(w,g,z);null===t?l=w:t.sibling=w;t=w;u=q}if(n.done)return c(e,u),l;if(null===u){for(;!n.done;z++,n=h.next())n=A(e,n.value,k),null!==n&&(g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);return l}for(u=d(e,u);!n.done;z++,n=h.next())n=C(u,e,z,n.value,k),null!==n&&(a&&null!==n.alternate&&
u.delete(null===n.key?z:n.key),g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);a&&u.forEach(function(a){return b(e,a)});return l}return function(a,d,f,h){var k="object"===typeof f&&null!==f&&f.type===ua&&null===f.key;k&&(f=f.props.children);var l="object"===typeof f&&null!==f;if(l)switch(f.$$typeof){case sa:a:{l=f.key;for(k=d;null!==k;){if(k.key===l){switch(k.tag){case 7:if(f.type===ua){c(a,k.sibling);d=e(k,f.props.children);d.return=a;a=d;break a}break;default:if(k.elementType===f.type){c(a,k.sibling);
d=e(k,f.props);d.ref=Qg(a,k,f);d.return=a;a=d;break a}}c(a,k);break}else b(a,k);k=k.sibling}f.type===ua?(d=Xg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Vg(f.type,f.key,f.props,null,a.mode,h),h.ref=Qg(a,d,f),h.return=a,a=h)}return g(a);case ta:a:{for(k=f.key;null!==d;){if(d.key===k)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else{c(a,d);break}else b(a,d);d=d.sibling}d=
Wg(f,a.mode,h);d.return=a;a=d}return g(a)}if("string"===typeof f||"number"===typeof f)return f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):(c(a,d),d=Ug(f,a.mode,h),d.return=a,a=d),g(a);if(Pg(f))return x(a,d,f,h);if(La(f))return w(a,d,f,h);l&&Rg(a,f);if("undefined"===typeof f&&!k)switch(a.tag){case 1:case 22:case 0:case 11:case 15:throw Error(y(152,Ra(a.type)||"Component"));}return c(a,d)}}var Yg=Sg(!0),Zg=Sg(!1),$g={},ah=Bf($g),bh=Bf($g),ch=Bf($g);
function dh(a){if(a===$g)throw Error(y(174));return a}function eh(a,b){I(ch,b);I(bh,a);I(ah,$g);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:mb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=mb(b,a)}H(ah);I(ah,b)}function fh(){H(ah);H(bh);H(ch)}function gh(a){dh(ch.current);var b=dh(ah.current);var c=mb(b,a.type);b!==c&&(I(bh,a),I(ah,c))}function hh(a){bh.current===a&&(H(ah),H(bh))}var P=Bf(0);
function ih(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&64))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}return null}var jh=null,kh=null,lh=!1;
function mh(a,b){var c=nh(5,null,null,0);c.elementType="DELETED";c.type="DELETED";c.stateNode=b;c.return=a;c.flags=8;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c}function oh(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,!0):!1;case 13:return!1;default:return!1}}
function ph(a){if(lh){var b=kh;if(b){var c=b;if(!oh(a,b)){b=rf(c.nextSibling);if(!b||!oh(a,b)){a.flags=a.flags&-1025|2;lh=!1;jh=a;return}mh(jh,c)}jh=a;kh=rf(b.firstChild)}else a.flags=a.flags&-1025|2,lh=!1,jh=a}}function qh(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;jh=a}
function rh(a){if(a!==jh)return!1;if(!lh)return qh(a),lh=!0,!1;var b=a.type;if(5!==a.tag||"head"!==b&&"body"!==b&&!nf(b,a.memoizedProps))for(b=kh;b;)mh(a,b),b=rf(b.nextSibling);qh(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(y(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){kh=rf(a.nextSibling);break a}b--}else"$"!==c&&"$!"!==c&&"$?"!==c||b++}a=a.nextSibling}kh=null}}else kh=jh?rf(a.stateNode.nextSibling):null;return!0}
function sh(){kh=jh=null;lh=!1}var th=[];function uh(){for(var a=0;a<th.length;a++)th[a]._workInProgressVersionPrimary=null;th.length=0}var vh=ra.ReactCurrentDispatcher,wh=ra.ReactCurrentBatchConfig,xh=0,R=null,S=null,T=null,yh=!1,zh=!1;function Ah(){throw Error(y(321));}function Bh(a,b){if(null===b)return!1;for(var c=0;c<b.length&&c<a.length;c++)if(!He(a[c],b[c]))return!1;return!0}
function Ch(a,b,c,d,e,f){xh=f;R=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;vh.current=null===a||null===a.memoizedState?Dh:Eh;a=c(d,e);if(zh){f=0;do{zh=!1;if(!(25>f))throw Error(y(301));f+=1;T=S=null;b.updateQueue=null;vh.current=Fh;a=c(d,e)}while(zh)}vh.current=Gh;b=null!==S&&null!==S.next;xh=0;T=S=R=null;yh=!1;if(b)throw Error(y(300));return a}function Hh(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===T?R.memoizedState=T=a:T=T.next=a;return T}
function Ih(){if(null===S){var a=R.alternate;a=null!==a?a.memoizedState:null}else a=S.next;var b=null===T?R.memoizedState:T.next;if(null!==b)T=b,S=a;else{if(null===a)throw Error(y(310));S=a;a={memoizedState:S.memoizedState,baseState:S.baseState,baseQueue:S.baseQueue,queue:S.queue,next:null};null===T?R.memoizedState=T=a:T=T.next=a}return T}function Jh(a,b){return"function"===typeof b?b(a):b}
function Kh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y(311));c.lastRenderedReducer=a;var d=S,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g}d.baseQueue=e=f;c.pending=null}if(null!==e){e=e.next;d=d.baseState;var h=g=f=null,k=e;do{var l=k.lane;if((xh&l)===l)null!==h&&(h=h.next={lane:0,action:k.action,eagerReducer:k.eagerReducer,eagerState:k.eagerState,next:null}),d=k.eagerReducer===a?k.eagerState:a(d,k.action);else{var n={lane:l,action:k.action,eagerReducer:k.eagerReducer,
eagerState:k.eagerState,next:null};null===h?(g=h=n,f=d):h=h.next=n;R.lanes|=l;Dg|=l}k=k.next}while(null!==k&&k!==e);null===h?f=d:h.next=g;He(d,b.memoizedState)||(ug=!0);b.memoizedState=d;b.baseState=f;b.baseQueue=h;c.lastRenderedState=d}return[b.memoizedState,c.dispatch]}
function Lh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He(f,b.memoizedState)||(ug=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f}return[f,d]}
function Mh(a,b,c){var d=b._getVersion;d=d(b._source);var e=b._workInProgressVersionPrimary;if(null!==e)a=e===d;else if(a=a.mutableReadLanes,a=(xh&a)===a)b._workInProgressVersionPrimary=d,th.push(b);if(a)return c(b._source);th.push(b);throw Error(y(350));}
function Nh(a,b,c,d){var e=U;if(null===e)throw Error(y(349));var f=b._getVersion,g=f(b._source),h=vh.current,k=h.useState(function(){return Mh(e,b,c)}),l=k[1],n=k[0];k=T;var A=a.memoizedState,p=A.refs,C=p.getSnapshot,x=A.source;A=A.subscribe;var w=R;a.memoizedState={refs:p,source:b,subscribe:d};h.useEffect(function(){p.getSnapshot=c;p.setSnapshot=l;var a=f(b._source);if(!He(g,a)){a=c(b._source);He(n,a)||(l(a),a=Ig(w),e.mutableReadLanes|=a&e.pendingLanes);a=e.mutableReadLanes;e.entangledLanes|=a;for(var d=
e.entanglements,h=a;0<h;){var k=31-Vc(h),v=1<<k;d[k]|=a;h&=~v}}},[c,b,d]);h.useEffect(function(){return d(b._source,function(){var a=p.getSnapshot,c=p.setSnapshot;try{c(a(b._source));var d=Ig(w);e.mutableReadLanes|=d&e.pendingLanes}catch(q){c(function(){throw q;})}})},[b,d]);He(C,c)&&He(x,b)&&He(A,d)||(a={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:n},a.dispatch=l=Oh.bind(null,R,a),k.queue=a,k.baseQueue=null,n=Mh(e,b,c),k.memoizedState=k.baseState=n);return n}
function Ph(a,b,c){var d=Ih();return Nh(d,a,b,c)}function Qh(a){var b=Hh();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a=b.queue={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:a};a=a.dispatch=Oh.bind(null,R,a);return[b.memoizedState,a]}
function Rh(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=R.updateQueue;null===b?(b={lastEffect:null},R.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function Sh(a){var b=Hh();a={current:a};return b.memoizedState=a}function Th(){return Ih().memoizedState}function Uh(a,b,c,d){var e=Hh();R.flags|=a;e.memoizedState=Rh(1|b,c,void 0,void 0===d?null:d)}
function Vh(a,b,c,d){var e=Ih();d=void 0===d?null:d;var f=void 0;if(null!==S){var g=S.memoizedState;f=g.destroy;if(null!==d&&Bh(d,g.deps)){Rh(b,c,f,d);return}}R.flags|=a;e.memoizedState=Rh(1|b,c,f,d)}function Wh(a,b){return Uh(516,4,a,b)}function Xh(a,b){return Vh(516,4,a,b)}function Yh(a,b){return Vh(4,2,a,b)}function Zh(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null)};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null}}
function $h(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Vh(4,2,Zh.bind(null,b,a),c)}function ai(){}function bi(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}function ci(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}
function di(a,b){var c=eg();gg(98>c?98:c,function(){a(!0)});gg(97<c?97:c,function(){var c=wh.transition;wh.transition=1;try{a(!1),b()}finally{wh.transition=c}})}
function Oh(a,b,c){var d=Hg(),e=Ig(a),f={lane:e,action:c,eagerReducer:null,eagerState:null,next:null},g=b.pending;null===g?f.next=f:(f.next=g.next,g.next=f);b.pending=f;g=a.alternate;if(a===R||null!==g&&g===R)zh=yh=!0;else{if(0===a.lanes&&(null===g||0===g.lanes)&&(g=b.lastRenderedReducer,null!==g))try{var h=b.lastRenderedState,k=g(h,c);f.eagerReducer=g;f.eagerState=k;if(He(k,h))return}catch(l){}finally{}Jg(a,e,d)}}
var Gh={readContext:vg,useCallback:Ah,useContext:Ah,useEffect:Ah,useImperativeHandle:Ah,useLayoutEffect:Ah,useMemo:Ah,useReducer:Ah,useRef:Ah,useState:Ah,useDebugValue:Ah,useDeferredValue:Ah,useTransition:Ah,useMutableSource:Ah,useOpaqueIdentifier:Ah,unstable_isNewReconciler:!1},Dh={readContext:vg,useCallback:function(a,b){Hh().memoizedState=[a,void 0===b?null:b];return a},useContext:vg,useEffect:Wh,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Uh(4,2,Zh.bind(null,
b,a),c)},useLayoutEffect:function(a,b){return Uh(4,2,a,b)},useMemo:function(a,b){var c=Hh();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Hh();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a=d.queue={pending:null,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};a=a.dispatch=Oh.bind(null,R,a);return[d.memoizedState,a]},useRef:Sh,useState:Qh,useDebugValue:ai,useDeferredValue:function(a){var b=Qh(a),c=b[0],d=b[1];Wh(function(){var b=wh.transition;
wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Qh(!1),b=a[0];a=di.bind(null,a[1]);Sh(a);return[a,b]},useMutableSource:function(a,b,c){var d=Hh();d.memoizedState={refs:{getSnapshot:b,setSnapshot:null},source:a,subscribe:c};return Nh(d,a,b,c)},useOpaqueIdentifier:function(){if(lh){var a=!1,b=uf(function(){a||(a=!0,c("r:"+(tf++).toString(36)));throw Error(y(355));}),c=Qh(b)[1];0===(R.mode&2)&&(R.flags|=516,Rh(5,function(){c("r:"+(tf++).toString(36))},
void 0,null));return b}b="r:"+(tf++).toString(36);Qh(b);return b},unstable_isNewReconciler:!1},Eh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Kh,useRef:Th,useState:function(){return Kh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Kh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Kh(Jh)[0];return[Th().current,
a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Kh(Jh)[0]},unstable_isNewReconciler:!1},Fh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Lh,useRef:Th,useState:function(){return Lh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Lh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Lh(Jh)[0];return[Th().current,
a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Lh(Jh)[0]},unstable_isNewReconciler:!1},ei=ra.ReactCurrentOwner,ug=!1;function fi(a,b,c,d){b.child=null===a?Zg(b,null,c,d):Yg(b,a.child,c,d)}function gi(a,b,c,d,e){c=c.render;var f=b.ref;tg(b,e);d=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,d,e);return b.child}
function ii(a,b,c,d,e,f){if(null===a){var g=c.type;if("function"===typeof g&&!ji(g)&&void 0===g.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=g,ki(a,b,g,d,e,f);a=Vg(c.type,null,d,b,b.mode,f);a.ref=b.ref;a.return=b;return b.child=a}g=a.child;if(0===(e&f)&&(e=g.memoizedProps,c=c.compare,c=null!==c?c:Je,c(e,d)&&a.ref===b.ref))return hi(a,b,f);b.flags|=1;a=Tg(g,d);a.ref=b.ref;a.return=b;return b.child=a}
function ki(a,b,c,d,e,f){if(null!==a&&Je(a.memoizedProps,d)&&a.ref===b.ref)if(ug=!1,0!==(f&e))0!==(a.flags&16384)&&(ug=!0);else return b.lanes=a.lanes,hi(a,b,f);return li(a,b,c,d,f)}
function mi(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode||"unstable-defer-without-hiding"===d.mode)if(0===(b.mode&4))b.memoizedState={baseLanes:0},ni(b,c);else if(0!==(c&1073741824))b.memoizedState={baseLanes:0},ni(b,null!==f?f.baseLanes:c);else return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a},ni(b,a),null;else null!==f?(d=f.baseLanes|c,b.memoizedState=null):d=c,ni(b,d);fi(a,b,e,c);return b.child}
function oi(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=128}function li(a,b,c,d,e){var f=Ff(c)?Df:M.current;f=Ef(b,f);tg(b,e);c=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,c,e);return b.child}
function pi(a,b,c,d,e){if(Ff(c)){var f=!0;Jf(b)}else f=!1;tg(b,e);if(null===b.stateNode)null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),Mg(b,c,d),Og(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=vg(l):(l=Ff(c)?Df:M.current,l=Ef(b,l));var n=c.getDerivedStateFromProps,A="function"===typeof n||"function"===typeof g.getSnapshotBeforeUpdate;A||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&
"function"!==typeof g.componentWillReceiveProps||(h!==d||k!==l)&&Ng(b,g,d,l);wg=!1;var p=b.memoizedState;g.state=p;Cg(b,d,g,e);k=b.memoizedState;h!==d||p!==k||N.current||wg?("function"===typeof n&&(Gg(b,c,n,d),k=b.memoizedState),(h=wg||Lg(b,c,h,d,p,k,l))?(A||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===
typeof g.componentDidMount&&(b.flags|=4)):("function"===typeof g.componentDidMount&&(b.flags|=4),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4),d=!1)}else{g=b.stateNode;yg(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:lg(b.type,h);g.props=l;A=b.pendingProps;p=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=vg(k):(k=Ff(c)?Df:M.current,k=Ef(b,k));var C=c.getDerivedStateFromProps;(n="function"===typeof C||
"function"===typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==A||p!==k)&&Ng(b,g,d,k);wg=!1;p=b.memoizedState;g.state=p;Cg(b,d,g,e);var x=b.memoizedState;h!==A||p!==x||N.current||wg?("function"===typeof C&&(Gg(b,c,C,d),x=b.memoizedState),(l=wg||Lg(b,c,l,d,p,x,k))?(n||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,
x,k),"function"===typeof g.UNSAFE_componentWillUpdate&&g.UNSAFE_componentWillUpdate(d,x,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=256)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),b.memoizedProps=d,b.memoizedState=x),g.props=d,g.state=x,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||
h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),d=!1)}return qi(a,b,c,d,f,e)}
function qi(a,b,c,d,e,f){oi(a,b);var g=0!==(b.flags&64);if(!d&&!g)return e&&Kf(b,c,!1),hi(a,b,f);d=b.stateNode;ei.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Yg(b,a.child,null,f),b.child=Yg(b,null,h,f)):fi(a,b,h,f);b.memoizedState=d.state;e&&Kf(b,c,!0);return b.child}function ri(a){var b=a.stateNode;b.pendingContext?Hf(a,b.pendingContext,b.pendingContext!==b.context):b.context&&Hf(a,b.context,!1);eh(a,b.containerInfo)}
var si={dehydrated:null,retryLane:0};
function ti(a,b,c){var d=b.pendingProps,e=P.current,f=!1,g;(g=0!==(b.flags&64))||(g=null!==a&&null===a.memoizedState?!1:0!==(e&2));g?(f=!0,b.flags&=-65):null!==a&&null===a.memoizedState||void 0===d.fallback||!0===d.unstable_avoidThisFallback||(e|=1);I(P,e&1);if(null===a){void 0!==d.fallback&&ph(b);a=d.children;e=d.fallback;if(f)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},b.memoizedState=si,a;if("number"===typeof d.unstable_expectedLoadTime)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},
b.memoizedState=si,b.lanes=33554432,a;c=vi({mode:"visible",children:a},b.mode,c,null);c.return=b;return b.child=c}if(null!==a.memoizedState){if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:{baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:
{baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}function ui(a,b,c,d){var e=a.mode,f=a.child;b={mode:"hidden",children:b};0===(e&2)&&null!==f?(f.childLanes=0,f.pendingProps=b):f=vi(b,e,0,null);c=Xg(c,e,d,null);f.return=a;c.return=a;f.sibling=c;a.child=f;return c}
function xi(a,b,c,d){var e=a.child;a=e.sibling;c=Tg(e,{mode:"visible",children:c});0===(b.mode&2)&&(c.lanes=d);c.return=b;c.sibling=null;null!==a&&(a.nextEffect=null,a.flags=8,b.firstEffect=b.lastEffect=a);return b.child=c}
function wi(a,b,c,d,e){var f=b.mode,g=a.child;a=g.sibling;var h={mode:"hidden",children:c};0===(f&2)&&b.child!==g?(c=b.child,c.childLanes=0,c.pendingProps=h,g=c.lastEffect,null!==g?(b.firstEffect=c.firstEffect,b.lastEffect=g,g.nextEffect=null):b.firstEffect=b.lastEffect=null):c=Tg(g,h);null!==a?d=Tg(a,d):(d=Xg(d,f,e,null),d.flags|=2);d.return=b;c.return=b;c.sibling=d;b.child=c;return d}function yi(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);sg(a.return,b)}
function zi(a,b,c,d,e,f){var g=a.memoizedState;null===g?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e,lastEffect:f}:(g.isBackwards=b,g.rendering=null,g.renderingStartTime=0,g.last=d,g.tail=c,g.tailMode=e,g.lastEffect=f)}
function Ai(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;fi(a,b,d.children,c);d=P.current;if(0!==(d&2))d=d&1|2,b.flags|=64;else{if(null!==a&&0!==(a.flags&64))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&yi(a,c);else if(19===a.tag)yi(a,c);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return}a.sibling.return=a.return;a=a.sibling}d&=1}I(P,d);if(0===(b.mode&2))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===ih(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);zi(b,!1,e,c,f,b.lastEffect);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===ih(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a}zi(b,!0,c,null,f,b.lastEffect);break;case "together":zi(b,!1,null,null,void 0,b.lastEffect);break;default:b.memoizedState=null}return b.child}
function hi(a,b,c){null!==a&&(b.dependencies=a.dependencies);Dg|=b.lanes;if(0!==(c&b.childLanes)){if(null!==a&&b.child!==a.child)throw Error(y(153));if(null!==b.child){a=b.child;c=Tg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Tg(a,a.pendingProps),c.return=b;c.sibling=null}return b.child}return null}var Bi,Ci,Di,Ei;
Bi=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return}c.sibling.return=c.return;c=c.sibling}};Ci=function(){};
Di=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;dh(ah.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "option":e=eb(a,e);d=eb(a,d);f=[];break;case "select":e=m({},e,{value:void 0});d=m({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=jf)}vb(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===
l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&(c||(c={}),c[g]="")}else"dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ca.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||
(c={}),c[g]=k[g])}else c||(f||(f=[]),f.push(l,c)),c=k;else"dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ca.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&G("scroll",a),f||h===k||(f=[])):"object"===typeof k&&null!==k&&k.$$typeof===Ga?k.toString():(f=f||[]).push(l,k))}c&&(f=f||[]).push("style",
c);var l=f;if(b.updateQueue=l)b.flags|=4}};Ei=function(a,b,c,d){c!==d&&(b.flags|=4)};function Fi(a,b){if(!lh)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null}}
function Gi(a,b,c){var d=b.pendingProps;switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return null;case 1:return Ff(b.type)&&Gf(),null;case 3:fh();H(N);H(M);uh();d=b.stateNode;d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)rh(b)?b.flags|=4:d.hydrate||(b.flags|=256);Ci(b);return null;case 5:hh(b);var e=dh(ch.current);c=b.type;if(null!==a&&null!=b.stateNode)Di(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=128);else{if(!d){if(null===
b.stateNode)throw Error(y(166));return null}a=dh(ah.current);if(rh(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[wf]=b;d[xf]=f;switch(c){case "dialog":G("cancel",d);G("close",d);break;case "iframe":case "object":case "embed":G("load",d);break;case "video":case "audio":for(a=0;a<Xe.length;a++)G(Xe[a],d);break;case "source":G("error",d);break;case "img":case "image":case "link":G("error",d);G("load",d);break;case "details":G("toggle",d);break;case "input":Za(d,f);G("invalid",d);break;case "select":d._wrapperState=
{wasMultiple:!!f.multiple};G("invalid",d);break;case "textarea":hb(d,f),G("invalid",d)}vb(c,f);a=null;for(var g in f)f.hasOwnProperty(g)&&(e=f[g],"children"===g?"string"===typeof e?d.textContent!==e&&(a=["children",e]):"number"===typeof e&&d.textContent!==""+e&&(a=["children",""+e]):ca.hasOwnProperty(g)&&null!=e&&"onScroll"===g&&G("scroll",d));switch(c){case "input":Va(d);cb(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=
jf)}d=a;b.updateQueue=d;null!==d&&(b.flags|=4)}else{g=9===e.nodeType?e:e.ownerDocument;a===kb.html&&(a=lb(c));a===kb.html?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[wf]=b;a[xf]=d;Bi(a,b,!1,!1);b.stateNode=a;g=wb(c,d);switch(c){case "dialog":G("cancel",a);G("close",a);
e=d;break;case "iframe":case "object":case "embed":G("load",a);e=d;break;case "video":case "audio":for(e=0;e<Xe.length;e++)G(Xe[e],a);e=d;break;case "source":G("error",a);e=d;break;case "img":case "image":case "link":G("error",a);G("load",a);e=d;break;case "details":G("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);G("invalid",a);break;case "option":e=eb(a,d);break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=m({},d,{value:void 0});G("invalid",a);break;case "textarea":hb(a,d);e=
gb(a,d);G("invalid",a);break;default:e=d}vb(c,e);var h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?tb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&ob(a,k)):"children"===f?"string"===typeof k?("textarea"!==c||""!==k)&&pb(a,k):"number"===typeof k&&pb(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ca.hasOwnProperty(f)?null!=k&&"onScroll"===f&&G("scroll",a):null!=k&&qa(a,f,k,g))}switch(c){case "input":Va(a);cb(a,d,!1);
break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,!0);break;default:"function"===typeof e.onClick&&(a.onclick=jf)}mf(c,d)&&(b.flags|=4)}null!==b.ref&&(b.flags|=128)}return null;case 6:if(a&&null!=b.stateNode)Ei(a,b,a.memoizedProps,d);else{if("string"!==typeof d&&null===b.stateNode)throw Error(y(166));
c=dh(ch.current);dh(ah.current);rh(b)?(d=b.stateNode,c=b.memoizedProps,d[wf]=b,d.nodeValue!==c&&(b.flags|=4)):(d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[wf]=b,b.stateNode=d)}return null;case 13:H(P);d=b.memoizedState;if(0!==(b.flags&64))return b.lanes=c,b;d=null!==d;c=!1;null===a?void 0!==b.memoizedProps.fallback&&rh(b):c=null!==a.memoizedState;if(d&&!c&&0!==(b.mode&2))if(null===a&&!0!==b.memoizedProps.unstable_avoidThisFallback||0!==(P.current&1))0===V&&(V=3);else{if(0===V||3===V)V=
4;null===U||0===(Dg&134217727)&&0===(Hi&134217727)||Ii(U,W)}if(d||c)b.flags|=4;return null;case 4:return fh(),Ci(b),null===a&&cf(b.stateNode.containerInfo),null;case 10:return rg(b),null;case 17:return Ff(b.type)&&Gf(),null;case 19:H(P);d=b.memoizedState;if(null===d)return null;f=0!==(b.flags&64);g=d.rendering;if(null===g)if(f)Fi(d,!1);else{if(0!==V||null!==a&&0!==(a.flags&64))for(a=b.child;null!==a;){g=ih(a);if(null!==g){b.flags|=64;Fi(d,!1);f=g.updateQueue;null!==f&&(b.updateQueue=f,b.flags|=4);
null===d.lastEffect&&(b.firstEffect=null);b.lastEffect=d.lastEffect;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=2,f.nextEffect=null,f.firstEffect=null,f.lastEffect=null,g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,
f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;I(P,P.current&1|2);return b.child}a=a.sibling}null!==d.tail&&O()>Ji&&(b.flags|=64,f=!0,Fi(d,!1),b.lanes=33554432)}else{if(!f)if(a=ih(g),null!==a){if(b.flags|=64,f=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Fi(d,!0),null===d.tail&&"hidden"===d.tailMode&&!g.alternate&&!lh)return b=b.lastEffect=d.lastEffect,null!==b&&(b.nextEffect=null),null}else 2*O()-d.renderingStartTime>Ji&&1073741824!==c&&(b.flags|=
64,f=!0,Fi(d,!1),b.lanes=33554432);d.isBackwards?(g.sibling=b.child,b.child=g):(c=d.last,null!==c?c.sibling=g:b.child=g,d.last=g)}return null!==d.tail?(c=d.tail,d.rendering=c,d.tail=c.sibling,d.lastEffect=b.lastEffect,d.renderingStartTime=O(),c.sibling=null,b=P.current,I(P,f?b&1|2:b&1),c):null;case 23:case 24:return Ki(),null!==a&&null!==a.memoizedState!==(null!==b.memoizedState)&&"unstable-defer-without-hiding"!==d.mode&&(b.flags|=4),null}throw Error(y(156,b.tag));}
function Li(a){switch(a.tag){case 1:Ff(a.type)&&Gf();var b=a.flags;return b&4096?(a.flags=b&-4097|64,a):null;case 3:fh();H(N);H(M);uh();b=a.flags;if(0!==(b&64))throw Error(y(285));a.flags=b&-4097|64;return a;case 5:return hh(a),null;case 13:return H(P),b=a.flags,b&4096?(a.flags=b&-4097|64,a):null;case 19:return H(P),null;case 4:return fh(),null;case 10:return rg(a),null;case 23:case 24:return Ki(),null;default:return null}}
function Mi(a,b){try{var c="",d=b;do c+=Qa(d),d=d.return;while(d);var e=c}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack}return{value:a,source:b,stack:e}}function Ni(a,b){try{console.error(b.value)}catch(c){setTimeout(function(){throw c;})}}var Oi="function"===typeof WeakMap?WeakMap:Map;function Pi(a,b,c){c=zg(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Qi||(Qi=!0,Ri=d);Ni(a,b)};return c}
function Si(a,b,c){c=zg(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){Ni(a,b);return d(e)}}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){"function"!==typeof d&&(null===Ti?Ti=new Set([this]):Ti.add(this),Ni(a,b));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""})});return c}var Ui="function"===typeof WeakSet?WeakSet:Set;
function Vi(a){var b=a.ref;if(null!==b)if("function"===typeof b)try{b(null)}catch(c){Wi(a,c)}else b.current=null}function Xi(a,b){switch(b.tag){case 0:case 11:case 15:case 22:return;case 1:if(b.flags&256&&null!==a){var c=a.memoizedProps,d=a.memoizedState;a=b.stateNode;b=a.getSnapshotBeforeUpdate(b.elementType===b.type?c:lg(b.type,c),d);a.__reactInternalSnapshotBeforeUpdate=b}return;case 3:b.flags&256&&qf(b.stateNode.containerInfo);return;case 5:case 6:case 4:case 17:return}throw Error(y(163));}
function Yi(a,b,c){switch(c.tag){case 0:case 11:case 15:case 22:b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{if(3===(a.tag&3)){var d=a.create;a.destroy=d()}a=a.next}while(a!==b)}b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{var e=a;d=e.next;e=e.tag;0!==(e&4)&&0!==(e&1)&&(Zi(c,a),$i(c,a));a=d}while(a!==b)}return;case 1:a=c.stateNode;c.flags&4&&(null===b?a.componentDidMount():(d=c.elementType===c.type?b.memoizedProps:lg(c.type,b.memoizedProps),a.componentDidUpdate(d,
b.memoizedState,a.__reactInternalSnapshotBeforeUpdate)));b=c.updateQueue;null!==b&&Eg(c,b,a);return;case 3:b=c.updateQueue;if(null!==b){a=null;if(null!==c.child)switch(c.child.tag){case 5:a=c.child.stateNode;break;case 1:a=c.child.stateNode}Eg(c,b,a)}return;case 5:a=c.stateNode;null===b&&c.flags&4&&mf(c.type,c.memoizedProps)&&a.focus();return;case 6:return;case 4:return;case 12:return;case 13:null===c.memoizedState&&(c=c.alternate,null!==c&&(c=c.memoizedState,null!==c&&(c=c.dehydrated,null!==c&&Cc(c))));
return;case 19:case 17:case 20:case 21:case 23:case 24:return}throw Error(y(163));}
function aj(a,b){for(var c=a;;){if(5===c.tag){var d=c.stateNode;if(b)d=d.style,"function"===typeof d.setProperty?d.setProperty("display","none","important"):d.display="none";else{d=c.stateNode;var e=c.memoizedProps.style;e=void 0!==e&&null!==e&&e.hasOwnProperty("display")?e.display:null;d.style.display=sb("display",e)}}else if(6===c.tag)c.stateNode.nodeValue=b?"":c.memoizedProps;else if((23!==c.tag&&24!==c.tag||null===c.memoizedState||c===a)&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===
a)break;for(;null===c.sibling;){if(null===c.return||c.return===a)return;c=c.return}c.sibling.return=c.return;c=c.sibling}}
function bj(a,b){if(Mf&&"function"===typeof Mf.onCommitFiberUnmount)try{Mf.onCommitFiberUnmount(Lf,b)}catch(f){}switch(b.tag){case 0:case 11:case 14:case 15:case 22:a=b.updateQueue;if(null!==a&&(a=a.lastEffect,null!==a)){var c=a=a.next;do{var d=c,e=d.destroy;d=d.tag;if(void 0!==e)if(0!==(d&4))Zi(b,c);else{d=b;try{e()}catch(f){Wi(d,f)}}c=c.next}while(c!==a)}break;case 1:Vi(b);a=b.stateNode;if("function"===typeof a.componentWillUnmount)try{a.props=b.memoizedProps,a.state=b.memoizedState,a.componentWillUnmount()}catch(f){Wi(b,
f)}break;case 5:Vi(b);break;case 4:cj(a,b)}}function dj(a){a.alternate=null;a.child=null;a.dependencies=null;a.firstEffect=null;a.lastEffect=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.return=null;a.updateQueue=null}function ej(a){return 5===a.tag||3===a.tag||4===a.tag}
function fj(a){a:{for(var b=a.return;null!==b;){if(ej(b))break a;b=b.return}throw Error(y(160));}var c=b;b=c.stateNode;switch(c.tag){case 5:var d=!1;break;case 3:b=b.containerInfo;d=!0;break;case 4:b=b.containerInfo;d=!0;break;default:throw Error(y(161));}c.flags&16&&(pb(b,""),c.flags&=-17);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c.return||ej(c.return)){c=null;break a}c=c.return}c.sibling.return=c.return;for(c=c.sibling;5!==c.tag&&6!==c.tag&&18!==c.tag;){if(c.flags&2)continue b;if(null===
c.child||4===c.tag)continue b;else c.child.return=c,c=c.child}if(!(c.flags&2)){c=c.stateNode;break a}}d?gj(a,c,b):hj(a,c,b)}
function gj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=jf));else if(4!==d&&(a=a.child,null!==a))for(gj(a,b,c),a=a.sibling;null!==a;)gj(a,b,c),a=a.sibling}
function hj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(hj(a,b,c),a=a.sibling;null!==a;)hj(a,b,c),a=a.sibling}
function cj(a,b){for(var c=b,d=!1,e,f;;){if(!d){d=c.return;a:for(;;){if(null===d)throw Error(y(160));e=d.stateNode;switch(d.tag){case 5:f=!1;break a;case 3:e=e.containerInfo;f=!0;break a;case 4:e=e.containerInfo;f=!0;break a}d=d.return}d=!0}if(5===c.tag||6===c.tag){a:for(var g=a,h=c,k=h;;)if(bj(g,k),null!==k.child&&4!==k.tag)k.child.return=k,k=k.child;else{if(k===h)break a;for(;null===k.sibling;){if(null===k.return||k.return===h)break a;k=k.return}k.sibling.return=k.return;k=k.sibling}f?(g=e,h=c.stateNode,
8===g.nodeType?g.parentNode.removeChild(h):g.removeChild(h)):e.removeChild(c.stateNode)}else if(4===c.tag){if(null!==c.child){e=c.stateNode.containerInfo;f=!0;c.child.return=c;c=c.child;continue}}else if(bj(a,c),null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;4===c.tag&&(d=!1)}c.sibling.return=c.return;c=c.sibling}}
function ij(a,b){switch(b.tag){case 0:case 11:case 14:case 15:case 22:var c=b.updateQueue;c=null!==c?c.lastEffect:null;if(null!==c){var d=c=c.next;do 3===(d.tag&3)&&(a=d.destroy,d.destroy=void 0,void 0!==a&&a()),d=d.next;while(d!==c)}return;case 1:return;case 5:c=b.stateNode;if(null!=c){d=b.memoizedProps;var e=null!==a?a.memoizedProps:d;a=b.type;var f=b.updateQueue;b.updateQueue=null;if(null!==f){c[xf]=d;"input"===a&&"radio"===d.type&&null!=d.name&&$a(c,d);wb(a,e);b=wb(a,d);for(e=0;e<f.length;e+=
2){var g=f[e],h=f[e+1];"style"===g?tb(c,h):"dangerouslySetInnerHTML"===g?ob(c,h):"children"===g?pb(c,h):qa(c,g,h,b)}switch(a){case "input":ab(c,d);break;case "textarea":ib(c,d);break;case "select":a=c._wrapperState.wasMultiple,c._wrapperState.wasMultiple=!!d.multiple,f=d.value,null!=f?fb(c,!!d.multiple,f,!1):a!==!!d.multiple&&(null!=d.defaultValue?fb(c,!!d.multiple,d.defaultValue,!0):fb(c,!!d.multiple,d.multiple?[]:"",!1))}}}return;case 6:if(null===b.stateNode)throw Error(y(162));b.stateNode.nodeValue=
b.memoizedProps;return;case 3:c=b.stateNode;c.hydrate&&(c.hydrate=!1,Cc(c.containerInfo));return;case 12:return;case 13:null!==b.memoizedState&&(jj=O(),aj(b.child,!0));kj(b);return;case 19:kj(b);return;case 17:return;case 23:case 24:aj(b,null!==b.memoizedState);return}throw Error(y(163));}function kj(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Ui);b.forEach(function(b){var d=lj.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d))})}}
function mj(a,b){return null!==a&&(a=a.memoizedState,null===a||null!==a.dehydrated)?(b=b.memoizedState,null!==b&&null===b.dehydrated):!1}var nj=Math.ceil,oj=ra.ReactCurrentDispatcher,pj=ra.ReactCurrentOwner,X=0,U=null,Y=null,W=0,qj=0,rj=Bf(0),V=0,sj=null,tj=0,Dg=0,Hi=0,uj=0,vj=null,jj=0,Ji=Infinity;function wj(){Ji=O()+500}var Z=null,Qi=!1,Ri=null,Ti=null,xj=!1,yj=null,zj=90,Aj=[],Bj=[],Cj=null,Dj=0,Ej=null,Fj=-1,Gj=0,Hj=0,Ij=null,Jj=!1;function Hg(){return 0!==(X&48)?O():-1!==Fj?Fj:Fj=O()}
function Ig(a){a=a.mode;if(0===(a&2))return 1;if(0===(a&4))return 99===eg()?1:2;0===Gj&&(Gj=tj);if(0!==kg.transition){0!==Hj&&(Hj=null!==vj?vj.pendingLanes:0);a=Gj;var b=4186112&~Hj;b&=-b;0===b&&(a=4186112&~a,b=a&-a,0===b&&(b=8192));return b}a=eg();0!==(X&4)&&98===a?a=Xc(12,Gj):(a=Sc(a),a=Xc(a,Gj));return a}
function Jg(a,b,c){if(50<Dj)throw Dj=0,Ej=null,Error(y(185));a=Kj(a,b);if(null===a)return null;$c(a,b,c);a===U&&(Hi|=b,4===V&&Ii(a,W));var d=eg();1===b?0!==(X&8)&&0===(X&48)?Lj(a):(Mj(a,c),0===X&&(wj(),ig())):(0===(X&4)||98!==d&&99!==d||(null===Cj?Cj=new Set([a]):Cj.add(a)),Mj(a,c));vj=a}function Kj(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}
function Mj(a,b){for(var c=a.callbackNode,d=a.suspendedLanes,e=a.pingedLanes,f=a.expirationTimes,g=a.pendingLanes;0<g;){var h=31-Vc(g),k=1<<h,l=f[h];if(-1===l){if(0===(k&d)||0!==(k&e)){l=b;Rc(k);var n=F;f[h]=10<=n?l+250:6<=n?l+5E3:-1}}else l<=b&&(a.expiredLanes|=k);g&=~k}d=Uc(a,a===U?W:0);b=F;if(0===d)null!==c&&(c!==Zf&&Pf(c),a.callbackNode=null,a.callbackPriority=0);else{if(null!==c){if(a.callbackPriority===b)return;c!==Zf&&Pf(c)}15===b?(c=Lj.bind(null,a),null===ag?(ag=[c],bg=Of(Uf,jg)):ag.push(c),
c=Zf):14===b?c=hg(99,Lj.bind(null,a)):(c=Tc(b),c=hg(c,Nj.bind(null,a)));a.callbackPriority=b;a.callbackNode=c}}
function Nj(a){Fj=-1;Hj=Gj=0;if(0!==(X&48))throw Error(y(327));var b=a.callbackNode;if(Oj()&&a.callbackNode!==b)return null;var c=Uc(a,a===U?W:0);if(0===c)return null;var d=c;var e=X;X|=16;var f=Pj();if(U!==a||W!==d)wj(),Qj(a,d);do try{Rj();break}catch(h){Sj(a,h)}while(1);qg();oj.current=f;X=e;null!==Y?d=0:(U=null,W=0,d=V);if(0!==(tj&Hi))Qj(a,0);else if(0!==d){2===d&&(X|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),c=Wc(a),0!==c&&(d=Tj(a,c)));if(1===d)throw b=sj,Qj(a,0),Ii(a,c),Mj(a,O()),b;a.finishedWork=
a.current.alternate;a.finishedLanes=c;switch(d){case 0:case 1:throw Error(y(345));case 2:Uj(a);break;case 3:Ii(a,c);if((c&62914560)===c&&(d=jj+500-O(),10<d)){if(0!==Uc(a,0))break;e=a.suspendedLanes;if((e&c)!==c){Hg();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=of(Uj.bind(null,a),d);break}Uj(a);break;case 4:Ii(a,c);if((c&4186112)===c)break;d=a.eventTimes;for(e=-1;0<c;){var g=31-Vc(c);f=1<<g;g=d[g];g>e&&(e=g);c&=~f}c=e;c=O()-c;c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3E3>c?3E3:4320>
c?4320:1960*nj(c/1960))-c;if(10<c){a.timeoutHandle=of(Uj.bind(null,a),c);break}Uj(a);break;case 5:Uj(a);break;default:throw Error(y(329));}}Mj(a,O());return a.callbackNode===b?Nj.bind(null,a):null}function Ii(a,b){b&=~uj;b&=~Hi;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-Vc(b),d=1<<c;a[c]=-1;b&=~d}}
function Lj(a){if(0!==(X&48))throw Error(y(327));Oj();if(a===U&&0!==(a.expiredLanes&W)){var b=W;var c=Tj(a,b);0!==(tj&Hi)&&(b=Uc(a,b),c=Tj(a,b))}else b=Uc(a,0),c=Tj(a,b);0!==a.tag&&2===c&&(X|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),b=Wc(a),0!==b&&(c=Tj(a,b)));if(1===c)throw c=sj,Qj(a,0),Ii(a,b),Mj(a,O()),c;a.finishedWork=a.current.alternate;a.finishedLanes=b;Uj(a);Mj(a,O());return null}
function Vj(){if(null!==Cj){var a=Cj;Cj=null;a.forEach(function(a){a.expiredLanes|=24&a.pendingLanes;Mj(a,O())})}ig()}function Wj(a,b){var c=X;X|=1;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}}function Xj(a,b){var c=X;X&=-2;X|=8;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}}function ni(a,b){I(rj,qj);qj|=b;tj|=b}function Ki(){qj=rj.current;H(rj)}
function Qj(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,pf(c));if(null!==Y)for(c=Y.return;null!==c;){var d=c;switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&Gf();break;case 3:fh();H(N);H(M);uh();break;case 5:hh(d);break;case 4:fh();break;case 13:H(P);break;case 19:H(P);break;case 10:rg(d);break;case 23:case 24:Ki()}c=c.return}U=a;Y=Tg(a.current,null);W=qj=tj=b;V=0;sj=null;uj=Hi=Dg=0}
function Sj(a,b){do{var c=Y;try{qg();vh.current=Gh;if(yh){for(var d=R.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next}yh=!1}xh=0;T=S=R=null;zh=!1;pj.current=null;if(null===c||null===c.return){V=1;sj=b;Y=null;break}a:{var f=a,g=c.return,h=c,k=b;b=W;h.flags|=2048;h.firstEffect=h.lastEffect=null;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k;if(0===(h.mode&2)){var n=h.alternate;n?(h.updateQueue=n.updateQueue,h.memoizedState=n.memoizedState,h.lanes=n.lanes):
(h.updateQueue=null,h.memoizedState=null)}var A=0!==(P.current&1),p=g;do{var C;if(C=13===p.tag){var x=p.memoizedState;if(null!==x)C=null!==x.dehydrated?!0:!1;else{var w=p.memoizedProps;C=void 0===w.fallback?!1:!0!==w.unstable_avoidThisFallback?!0:A?!1:!0}}if(C){var z=p.updateQueue;if(null===z){var u=new Set;u.add(l);p.updateQueue=u}else z.add(l);if(0===(p.mode&2)){p.flags|=64;h.flags|=16384;h.flags&=-2981;if(1===h.tag)if(null===h.alternate)h.tag=17;else{var t=zg(-1,1);t.tag=2;Ag(h,t)}h.lanes|=1;break a}k=
void 0;h=b;var q=f.pingCache;null===q?(q=f.pingCache=new Oi,k=new Set,q.set(l,k)):(k=q.get(l),void 0===k&&(k=new Set,q.set(l,k)));if(!k.has(h)){k.add(h);var v=Yj.bind(null,f,l,h);l.then(v,v)}p.flags|=4096;p.lanes=b;break a}p=p.return}while(null!==p);k=Error((Ra(h.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.")}5!==V&&(V=2);k=Mi(k,h);p=
g;do{switch(p.tag){case 3:f=k;p.flags|=4096;b&=-b;p.lanes|=b;var J=Pi(p,f,b);Bg(p,J);break a;case 1:f=k;var K=p.type,Q=p.stateNode;if(0===(p.flags&64)&&("function"===typeof K.getDerivedStateFromError||null!==Q&&"function"===typeof Q.componentDidCatch&&(null===Ti||!Ti.has(Q)))){p.flags|=4096;b&=-b;p.lanes|=b;var L=Si(p,f,b);Bg(p,L);break a}}p=p.return}while(null!==p)}Zj(c)}catch(va){b=va;Y===c&&null!==c&&(Y=c=c.return);continue}break}while(1)}
function Pj(){var a=oj.current;oj.current=Gh;return null===a?Gh:a}function Tj(a,b){var c=X;X|=16;var d=Pj();U===a&&W===b||Qj(a,b);do try{ak();break}catch(e){Sj(a,e)}while(1);qg();X=c;oj.current=d;if(null!==Y)throw Error(y(261));U=null;W=0;return V}function ak(){for(;null!==Y;)bk(Y)}function Rj(){for(;null!==Y&&!Qf();)bk(Y)}function bk(a){var b=ck(a.alternate,a,qj);a.memoizedProps=a.pendingProps;null===b?Zj(a):Y=b;pj.current=null}
function Zj(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&2048)){c=Gi(c,b,qj);if(null!==c){Y=c;return}c=b;if(24!==c.tag&&23!==c.tag||null===c.memoizedState||0!==(qj&1073741824)||0===(c.mode&4)){for(var d=0,e=c.child;null!==e;)d|=e.lanes|e.childLanes,e=e.sibling;c.childLanes=d}null!==a&&0===(a.flags&2048)&&(null===a.firstEffect&&(a.firstEffect=b.firstEffect),null!==b.lastEffect&&(null!==a.lastEffect&&(a.lastEffect.nextEffect=b.firstEffect),a.lastEffect=b.lastEffect),1<b.flags&&(null!==
a.lastEffect?a.lastEffect.nextEffect=b:a.firstEffect=b,a.lastEffect=b))}else{c=Li(b);if(null!==c){c.flags&=2047;Y=c;return}null!==a&&(a.firstEffect=a.lastEffect=null,a.flags|=2048)}b=b.sibling;if(null!==b){Y=b;return}Y=b=a}while(null!==b);0===V&&(V=5)}function Uj(a){var b=eg();gg(99,dk.bind(null,a,b));return null}
function dk(a,b){do Oj();while(null!==yj);if(0!==(X&48))throw Error(y(327));var c=a.finishedWork;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(y(177));a.callbackNode=null;var d=c.lanes|c.childLanes,e=d,f=a.pendingLanes&~e;a.pendingLanes=e;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=e;a.mutableReadLanes&=e;a.entangledLanes&=e;e=a.entanglements;for(var g=a.eventTimes,h=a.expirationTimes;0<f;){var k=31-Vc(f),l=1<<k;e[k]=0;g[k]=-1;h[k]=-1;f&=~l}null!==
Cj&&0===(d&24)&&Cj.has(a)&&Cj.delete(a);a===U&&(Y=U=null,W=0);1<c.flags?null!==c.lastEffect?(c.lastEffect.nextEffect=c,d=c.firstEffect):d=c:d=c.firstEffect;if(null!==d){e=X;X|=32;pj.current=null;kf=fd;g=Ne();if(Oe(g)){if("selectionStart"in g)h={start:g.selectionStart,end:g.selectionEnd};else a:if(h=(h=g.ownerDocument)&&h.defaultView||window,(l=h.getSelection&&h.getSelection())&&0!==l.rangeCount){h=l.anchorNode;f=l.anchorOffset;k=l.focusNode;l=l.focusOffset;try{h.nodeType,k.nodeType}catch(va){h=null;
break a}var n=0,A=-1,p=-1,C=0,x=0,w=g,z=null;b:for(;;){for(var u;;){w!==h||0!==f&&3!==w.nodeType||(A=n+f);w!==k||0!==l&&3!==w.nodeType||(p=n+l);3===w.nodeType&&(n+=w.nodeValue.length);if(null===(u=w.firstChild))break;z=w;w=u}for(;;){if(w===g)break b;z===h&&++C===f&&(A=n);z===k&&++x===l&&(p=n);if(null!==(u=w.nextSibling))break;w=z;z=w.parentNode}w=u}h=-1===A||-1===p?null:{start:A,end:p}}else h=null;h=h||{start:0,end:0}}else h=null;lf={focusedElem:g,selectionRange:h};fd=!1;Ij=null;Jj=!1;Z=d;do try{ek()}catch(va){if(null===
Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);Ij=null;Z=d;do try{for(g=a;null!==Z;){var t=Z.flags;t&16&&pb(Z.stateNode,"");if(t&128){var q=Z.alternate;if(null!==q){var v=q.ref;null!==v&&("function"===typeof v?v(null):v.current=null)}}switch(t&1038){case 2:fj(Z);Z.flags&=-3;break;case 6:fj(Z);Z.flags&=-3;ij(Z.alternate,Z);break;case 1024:Z.flags&=-1025;break;case 1028:Z.flags&=-1025;ij(Z.alternate,Z);break;case 4:ij(Z.alternate,Z);break;case 8:h=Z;cj(g,h);var J=h.alternate;dj(h);null!==
J&&dj(J)}Z=Z.nextEffect}}catch(va){if(null===Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);v=lf;q=Ne();t=v.focusedElem;g=v.selectionRange;if(q!==t&&t&&t.ownerDocument&&Me(t.ownerDocument.documentElement,t)){null!==g&&Oe(t)&&(q=g.start,v=g.end,void 0===v&&(v=q),"selectionStart"in t?(t.selectionStart=q,t.selectionEnd=Math.min(v,t.value.length)):(v=(q=t.ownerDocument||document)&&q.defaultView||window,v.getSelection&&(v=v.getSelection(),h=t.textContent.length,J=Math.min(g.start,h),g=void 0===
g.end?J:Math.min(g.end,h),!v.extend&&J>g&&(h=g,g=J,J=h),h=Le(t,J),f=Le(t,g),h&&f&&(1!==v.rangeCount||v.anchorNode!==h.node||v.anchorOffset!==h.offset||v.focusNode!==f.node||v.focusOffset!==f.offset)&&(q=q.createRange(),q.setStart(h.node,h.offset),v.removeAllRanges(),J>g?(v.addRange(q),v.extend(f.node,f.offset)):(q.setEnd(f.node,f.offset),v.addRange(q))))));q=[];for(v=t;v=v.parentNode;)1===v.nodeType&&q.push({element:v,left:v.scrollLeft,top:v.scrollTop});"function"===typeof t.focus&&t.focus();for(t=
0;t<q.length;t++)v=q[t],v.element.scrollLeft=v.left,v.element.scrollTop=v.top}fd=!!kf;lf=kf=null;a.current=c;Z=d;do try{for(t=a;null!==Z;){var K=Z.flags;K&36&&Yi(t,Z.alternate,Z);if(K&128){q=void 0;var Q=Z.ref;if(null!==Q){var L=Z.stateNode;switch(Z.tag){case 5:q=L;break;default:q=L}"function"===typeof Q?Q(q):Q.current=q}}Z=Z.nextEffect}}catch(va){if(null===Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);Z=null;$f();X=e}else a.current=c;if(xj)xj=!1,yj=a,zj=b;else for(Z=d;null!==Z;)b=
Z.nextEffect,Z.nextEffect=null,Z.flags&8&&(K=Z,K.sibling=null,K.stateNode=null),Z=b;d=a.pendingLanes;0===d&&(Ti=null);1===d?a===Ej?Dj++:(Dj=0,Ej=a):Dj=0;c=c.stateNode;if(Mf&&"function"===typeof Mf.onCommitFiberRoot)try{Mf.onCommitFiberRoot(Lf,c,void 0,64===(c.current.flags&64))}catch(va){}Mj(a,O());if(Qi)throw Qi=!1,a=Ri,Ri=null,a;if(0!==(X&8))return null;ig();return null}
function ek(){for(;null!==Z;){var a=Z.alternate;Jj||null===Ij||(0!==(Z.flags&8)?dc(Z,Ij)&&(Jj=!0):13===Z.tag&&mj(a,Z)&&dc(Z,Ij)&&(Jj=!0));var b=Z.flags;0!==(b&256)&&Xi(a,Z);0===(b&512)||xj||(xj=!0,hg(97,function(){Oj();return null}));Z=Z.nextEffect}}function Oj(){if(90!==zj){var a=97<zj?97:zj;zj=90;return gg(a,fk)}return!1}function $i(a,b){Aj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}))}function Zi(a,b){Bj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}))}
function fk(){if(null===yj)return!1;var a=yj;yj=null;if(0!==(X&48))throw Error(y(331));var b=X;X|=32;var c=Bj;Bj=[];for(var d=0;d<c.length;d+=2){var e=c[d],f=c[d+1],g=e.destroy;e.destroy=void 0;if("function"===typeof g)try{g()}catch(k){if(null===f)throw Error(y(330));Wi(f,k)}}c=Aj;Aj=[];for(d=0;d<c.length;d+=2){e=c[d];f=c[d+1];try{var h=e.create;e.destroy=h()}catch(k){if(null===f)throw Error(y(330));Wi(f,k)}}for(h=a.current.firstEffect;null!==h;)a=h.nextEffect,h.nextEffect=null,h.flags&8&&(h.sibling=
null,h.stateNode=null),h=a;X=b;ig();return!0}function gk(a,b,c){b=Mi(c,b);b=Pi(a,b,1);Ag(a,b);b=Hg();a=Kj(a,1);null!==a&&($c(a,1,b),Mj(a,b))}
function Wi(a,b){if(3===a.tag)gk(a,a,b);else for(var c=a.return;null!==c;){if(3===c.tag){gk(c,a,b);break}else if(1===c.tag){var d=c.stateNode;if("function"===typeof c.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d))){a=Mi(b,a);var e=Si(c,a,1);Ag(c,e);e=Hg();c=Kj(c,1);if(null!==c)$c(c,1,e),Mj(c,e);else if("function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d)))try{d.componentDidCatch(b,a)}catch(f){}break}}c=c.return}}
function Yj(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=Hg();a.pingedLanes|=a.suspendedLanes&c;U===a&&(W&c)===c&&(4===V||3===V&&(W&62914560)===W&&500>O()-jj?Qj(a,0):uj|=c);Mj(a,b)}function lj(a,b){var c=a.stateNode;null!==c&&c.delete(b);b=0;0===b&&(b=a.mode,0===(b&2)?b=1:0===(b&4)?b=99===eg()?1:2:(0===Gj&&(Gj=tj),b=Yc(62914560&~Gj),0===b&&(b=4194304)));c=Hg();a=Kj(a,b);null!==a&&($c(a,b,c),Mj(a,c))}var ck;
ck=function(a,b,c){var d=b.lanes;if(null!==a)if(a.memoizedProps!==b.pendingProps||N.current)ug=!0;else if(0!==(c&d))ug=0!==(a.flags&16384)?!0:!1;else{ug=!1;switch(b.tag){case 3:ri(b);sh();break;case 5:gh(b);break;case 1:Ff(b.type)&&Jf(b);break;case 4:eh(b,b.stateNode.containerInfo);break;case 10:d=b.memoizedProps.value;var e=b.type._context;I(mg,e._currentValue);e._currentValue=d;break;case 13:if(null!==b.memoizedState){if(0!==(c&b.child.childLanes))return ti(a,b,c);I(P,P.current&1);b=hi(a,b,c);return null!==
b?b.sibling:null}I(P,P.current&1);break;case 19:d=0!==(c&b.childLanes);if(0!==(a.flags&64)){if(d)return Ai(a,b,c);b.flags|=64}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);I(P,P.current);if(d)break;else return null;case 23:case 24:return b.lanes=0,mi(a,b,c)}return hi(a,b,c)}else ug=!1;b.lanes=0;switch(b.tag){case 2:d=b.type;null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);a=b.pendingProps;e=Ef(b,M.current);tg(b,c);e=Ch(null,b,d,a,e,c);b.flags|=1;if("object"===
typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof){b.tag=1;b.memoizedState=null;b.updateQueue=null;if(Ff(d)){var f=!0;Jf(b)}else f=!1;b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null;xg(b);var g=d.getDerivedStateFromProps;"function"===typeof g&&Gg(b,d,g,a);e.updater=Kg;b.stateNode=e;e._reactInternals=b;Og(b,d,a,c);b=qi(null,b,d,!0,f,c)}else b.tag=0,fi(null,b,e,c),b=b.child;return b;case 16:e=b.elementType;a:{null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);
a=b.pendingProps;f=e._init;e=f(e._payload);b.type=e;f=b.tag=hk(e);a=lg(e,a);switch(f){case 0:b=li(null,b,e,a,c);break a;case 1:b=pi(null,b,e,a,c);break a;case 11:b=gi(null,b,e,a,c);break a;case 14:b=ii(null,b,e,lg(e.type,a),d,c);break a}throw Error(y(306,e,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),li(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),pi(a,b,d,e,c);case 3:ri(b);d=b.updateQueue;if(null===a||null===d)throw Error(y(282));
d=b.pendingProps;e=b.memoizedState;e=null!==e?e.element:null;yg(a,b);Cg(b,d,null,c);d=b.memoizedState.element;if(d===e)sh(),b=hi(a,b,c);else{e=b.stateNode;if(f=e.hydrate)kh=rf(b.stateNode.containerInfo.firstChild),jh=b,f=lh=!0;if(f){a=e.mutableSourceEagerHydrationData;if(null!=a)for(e=0;e<a.length;e+=2)f=a[e],f._workInProgressVersionPrimary=a[e+1],th.push(f);c=Zg(b,null,d,c);for(b.child=c;c;)c.flags=c.flags&-3|1024,c=c.sibling}else fi(a,b,d,c),sh();b=b.child}return b;case 5:return gh(b),null===a&&
ph(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,nf(d,e)?g=null:null!==f&&nf(d,f)&&(b.flags|=16),oi(a,b),fi(a,b,g,c),b.child;case 6:return null===a&&ph(b),null;case 13:return ti(a,b,c);case 4:return eh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Yg(b,null,d,c):fi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),gi(a,b,d,e,c);case 7:return fi(a,b,b.pendingProps,c),b.child;case 8:return fi(a,b,b.pendingProps.children,
c),b.child;case 12:return fi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;g=b.memoizedProps;f=e.value;var h=b.type._context;I(mg,h._currentValue);h._currentValue=f;if(null!==g)if(h=g.value,f=He(h,f)?0:("function"===typeof d._calculateChangedBits?d._calculateChangedBits(h,f):1073741823)|0,0===f){if(g.children===e.children&&!N.current){b=hi(a,b,c);break a}}else for(h=b.child,null!==h&&(h.return=b);null!==h;){var k=h.dependencies;if(null!==k){g=h.child;for(var l=
k.firstContext;null!==l;){if(l.context===d&&0!==(l.observedBits&f)){1===h.tag&&(l=zg(-1,c&-c),l.tag=2,Ag(h,l));h.lanes|=c;l=h.alternate;null!==l&&(l.lanes|=c);sg(h.return,c);k.lanes|=c;break}l=l.next}}else g=10===h.tag?h.type===b.type?null:h.child:h.child;if(null!==g)g.return=h;else for(g=h;null!==g;){if(g===b){g=null;break}h=g.sibling;if(null!==h){h.return=g.return;g=h;break}g=g.return}h=g}fi(a,b,e.children,c);b=b.child}return b;case 9:return e=b.type,f=b.pendingProps,d=f.children,tg(b,c),e=vg(e,
f.unstable_observedBits),d=d(e),b.flags|=1,fi(a,b,d,c),b.child;case 14:return e=b.type,f=lg(e,b.pendingProps),f=lg(e.type,f),ii(a,b,e,f,d,c);case 15:return ki(a,b,b.type,b.pendingProps,d,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),b.tag=1,Ff(d)?(a=!0,Jf(b)):a=!1,tg(b,c),Mg(b,d,e),Og(b,d,e,c),qi(null,b,d,!0,a,c);case 19:return Ai(a,b,c);case 23:return mi(a,b,c);case 24:return mi(a,b,c)}throw Error(y(156,b.tag));
};function ik(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.flags=0;this.lastEffect=this.firstEffect=this.nextEffect=null;this.childLanes=this.lanes=0;this.alternate=null}function nh(a,b,c,d){return new ik(a,b,c,d)}function ji(a){a=a.prototype;return!(!a||!a.isReactComponent)}
function hk(a){if("function"===typeof a)return ji(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Aa)return 11;if(a===Da)return 14}return 2}
function Tg(a,b){var c=a.alternate;null===c?(c=nh(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.nextEffect=null,c.firstEffect=null,c.lastEffect=null);c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function Vg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)ji(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ua:return Xg(c.children,e,f,b);case Ha:g=8;e|=16;break;case wa:g=8;e|=1;break;case xa:return a=nh(12,c,b,e|8),a.elementType=xa,a.type=xa,a.lanes=f,a;case Ba:return a=nh(13,c,b,e),a.type=Ba,a.elementType=Ba,a.lanes=f,a;case Ca:return a=nh(19,c,b,e),a.elementType=Ca,a.lanes=f,a;case Ia:return vi(c,e,f,b);case Ja:return a=nh(24,c,b,e),a.elementType=Ja,a.lanes=f,a;default:if("object"===
typeof a&&null!==a)switch(a.$$typeof){case ya:g=10;break a;case za:g=9;break a;case Aa:g=11;break a;case Da:g=14;break a;case Ea:g=16;d=null;break a;case Fa:g=22;break a}throw Error(y(130,null==a?a:typeof a,""));}b=nh(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Xg(a,b,c,d){a=nh(7,a,d,b);a.lanes=c;return a}function vi(a,b,c,d){a=nh(23,a,d,b);a.elementType=Ia;a.lanes=c;return a}function Ug(a,b,c){a=nh(6,a,null,b);a.lanes=c;return a}
function Wg(a,b,c){b=nh(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function jk(a,b,c){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.pendingContext=this.context=null;this.hydrate=c;this.callbackNode=null;this.callbackPriority=0;this.eventTimes=Zc(0);this.expirationTimes=Zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=Zc(0);this.mutableSourceEagerHydrationData=null}
function kk(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:ta,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function lk(a,b,c,d){var e=b.current,f=Hg(),g=Ig(e);a:if(c){c=c._reactInternals;b:{if(Zb(c)!==c||1!==c.tag)throw Error(y(170));var h=c;do{switch(h.tag){case 3:h=h.stateNode.context;break b;case 1:if(Ff(h.type)){h=h.stateNode.__reactInternalMemoizedMergedChildContext;break b}}h=h.return}while(null!==h);throw Error(y(171));}if(1===c.tag){var k=c.type;if(Ff(k)){c=If(c,k,h);break a}}c=h}else c=Cf;null===b.context?b.context=c:b.pendingContext=c;b=zg(f,g);b.payload={element:a};d=void 0===d?null:d;null!==
d&&(b.callback=d);Ag(e,b);Jg(e,g,f);return g}function mk(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function nk(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b}}function ok(a,b){nk(a,b);(a=a.alternate)&&nk(a,b)}function pk(){return null}
function qk(a,b,c){var d=null!=c&&null!=c.hydrationOptions&&c.hydrationOptions.mutableSources||null;c=new jk(a,b,null!=c&&!0===c.hydrate);b=nh(3,null,null,2===b?7:1===b?3:0);c.current=b;b.stateNode=c;xg(b);a[ff]=c.current;cf(8===a.nodeType?a.parentNode:a);if(d)for(a=0;a<d.length;a++){b=d[a];var e=b._getVersion;e=e(b._source);null==c.mutableSourceEagerHydrationData?c.mutableSourceEagerHydrationData=[b,e]:c.mutableSourceEagerHydrationData.push(b,e)}this._internalRoot=c}
qk.prototype.render=function(a){lk(a,this._internalRoot,null,null)};qk.prototype.unmount=function(){var a=this._internalRoot,b=a.containerInfo;lk(null,a,null,function(){b[ff]=null})};function rk(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}
function sk(a,b){b||(b=a?9===a.nodeType?a.documentElement:a.firstChild:null,b=!(!b||1!==b.nodeType||!b.hasAttribute("data-reactroot")));if(!b)for(var c;c=a.lastChild;)a.removeChild(c);return new qk(a,0,b?{hydrate:!0}:void 0)}
function tk(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f._internalRoot;if("function"===typeof e){var h=e;e=function(){var a=mk(g);h.call(a)}}lk(b,g,a,e)}else{f=c._reactRootContainer=sk(c,d);g=f._internalRoot;if("function"===typeof e){var k=e;e=function(){var a=mk(g);k.call(a)}}Xj(function(){lk(b,g,a,e)})}return mk(g)}ec=function(a){if(13===a.tag){var b=Hg();Jg(a,4,b);ok(a,4)}};fc=function(a){if(13===a.tag){var b=Hg();Jg(a,67108864,b);ok(a,67108864)}};
gc=function(a){if(13===a.tag){var b=Hg(),c=Ig(a);Jg(a,c,b);ok(a,c)}};hc=function(a,b){return b()};
yb=function(a,b,c){switch(b){case "input":ab(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(y(90));Wa(d);ab(d,e)}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1)}};Gb=Wj;
Hb=function(a,b,c,d,e){var f=X;X|=4;try{return gg(98,a.bind(null,b,c,d,e))}finally{X=f,0===X&&(wj(),ig())}};Ib=function(){0===(X&49)&&(Vj(),Oj())};Jb=function(a,b){var c=X;X|=2;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}};function uk(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!rk(b))throw Error(y(200));return kk(a,b,null,c)}var vk={Events:[Cb,ue,Db,Eb,Fb,Oj,{current:!1}]},wk={findFiberByHostInstance:wc,bundleType:0,version:"17.0.2",rendererPackageName:"react-dom"};
var xk={bundleType:wk.bundleType,version:wk.version,rendererPackageName:wk.rendererPackageName,rendererConfig:wk.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ra.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=cc(a);return null===a?null:a.stateNode},findFiberByHostInstance:wk.findFiberByHostInstance||
pk,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var yk=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!yk.isDisabled&&yk.supportsFiber)try{Lf=yk.inject(xk),Mf=yk}catch(a){}}exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=vk;exports.createPortal=uk;
exports.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(y(188));throw Error(y(268,Object.keys(a)));}a=cc(b);a=null===a?null:a.stateNode;return a};exports.flushSync=function(a,b){var c=X;if(0!==(c&48))return a(b);X|=1;try{if(a)return gg(99,a.bind(null,b))}finally{X=c,ig()}};exports.hydrate=function(a,b,c){if(!rk(b))throw Error(y(200));return tk(null,a,b,!0,c)};
exports.render=function(a,b,c){if(!rk(b))throw Error(y(200));return tk(null,a,b,!1,c)};exports.unmountComponentAtNode=function(a){if(!rk(a))throw Error(y(40));return a._reactRootContainer?(Xj(function(){tk(null,null,a,!1,function(){a._reactRootContainer=null;a[ff]=null})}),!0):!1};exports.unstable_batchedUpdates=Wj;exports.unstable_createPortal=function(a,b){return uk(a,b,2<arguments.length&&void 0!==arguments[2]?arguments[2]:null)};
exports.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!rk(c))throw Error(y(200));if(null==a||void 0===a._reactInternals)throw Error(y(38));return tk(a,b,c,!1,d)};exports.version="17.0.2";


/***/ }),

/***/ 3935:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (false) {}
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (true) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = __webpack_require__(4448);
} else {}


/***/ }),

/***/ 2408:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/** @license React v17.0.2
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l=__webpack_require__(7418),n=60103,p=60106;exports.Fragment=60107;exports.StrictMode=60108;exports.Profiler=60114;var q=60109,r=60110,t=60112;exports.Suspense=60113;var u=60115,v=60116;
if("function"===typeof Symbol&&Symbol.for){var w=Symbol.for;n=w("react.element");p=w("react.portal");exports.Fragment=w("react.fragment");exports.StrictMode=w("react.strict_mode");exports.Profiler=w("react.profiler");q=w("react.provider");r=w("react.context");t=w("react.forward_ref");exports.Suspense=w("react.suspense");u=w("react.memo");v=w("react.lazy")}var x="function"===typeof Symbol&&Symbol.iterator;
function y(a){if(null===a||"object"!==typeof a)return null;a=x&&a[x]||a["@@iterator"];return"function"===typeof a?a:null}function z(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},B={};function C(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}C.prototype.isReactComponent={};C.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error(z(85));this.updater.enqueueSetState(this,a,b,"setState")};C.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};
function D(){}D.prototype=C.prototype;function E(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}var F=E.prototype=new D;F.constructor=E;l(F,C.prototype);F.isPureReactComponent=!0;var G={current:null},H=Object.prototype.hasOwnProperty,I={key:!0,ref:!0,__self:!0,__source:!0};
function J(a,b,c){var e,d={},k=null,h=null;if(null!=b)for(e in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)H.call(b,e)&&!I.hasOwnProperty(e)&&(d[e]=b[e]);var g=arguments.length-2;if(1===g)d.children=c;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];d.children=f}if(a&&a.defaultProps)for(e in g=a.defaultProps,g)void 0===d[e]&&(d[e]=g[e]);return{$$typeof:n,type:a,key:k,ref:h,props:d,_owner:G.current}}
function K(a,b){return{$$typeof:n,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function L(a){return"object"===typeof a&&null!==a&&a.$$typeof===n}function escape(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a){return b[a]})}var M=/\/+/g;function N(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function O(a,b,c,e,d){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case n:case p:h=!0}}if(h)return h=a,d=d(h),a=""===e?"."+N(h,0):e,Array.isArray(d)?(c="",null!=a&&(c=a.replace(M,"$&/")+"/"),O(d,b,c,"",function(a){return a})):null!=d&&(L(d)&&(d=K(d,c+(!d.key||h&&h.key===d.key?"":(""+d.key).replace(M,"$&/")+"/")+a)),b.push(d)),1;h=0;e=""===e?".":e+":";if(Array.isArray(a))for(var g=
0;g<a.length;g++){k=a[g];var f=e+N(k,g);h+=O(k,b,c,f,d)}else if(f=y(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=e+N(k,g++),h+=O(k,b,c,f,d);else if("object"===k)throw b=""+a,Error(z(31,"[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b));return h}function P(a,b,c){if(null==a)return a;var e=[],d=0;O(a,e,"","",function(a){return b.call(c,a,d++)});return e}
function Q(a){if(-1===a._status){var b=a._result;b=b();a._status=0;a._result=b;b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b)},function(b){0===a._status&&(a._status=2,a._result=b)})}if(1===a._status)return a._result;throw a._result;}var R={current:null};function S(){var a=R.current;if(null===a)throw Error(z(321));return a}var T={ReactCurrentDispatcher:R,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:G,IsSomeRendererActing:{current:!1},assign:l};
exports.Children={map:P,forEach:function(a,b,c){P(a,function(){b.apply(this,arguments)},c)},count:function(a){var b=0;P(a,function(){b++});return b},toArray:function(a){return P(a,function(a){return a})||[]},only:function(a){if(!L(a))throw Error(z(143));return a}};exports.Component=C;exports.PureComponent=E;exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=T;
exports.cloneElement=function(a,b,c){if(null===a||void 0===a)throw Error(z(267,a));var e=l({},a.props),d=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=G.current);void 0!==b.key&&(d=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)H.call(b,f)&&!I.hasOwnProperty(f)&&(e[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)e.children=c;else if(1<f){g=Array(f);for(var m=0;m<f;m++)g[m]=arguments[m+2];e.children=g}return{$$typeof:n,type:a.type,
key:d,ref:k,props:e,_owner:h}};exports.createContext=function(a,b){void 0===b&&(b=null);a={$$typeof:r,_calculateChangedBits:b,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:q,_context:a};return a.Consumer=a};exports.createElement=J;exports.createFactory=function(a){var b=J.bind(null,a);b.type=a;return b};exports.createRef=function(){return{current:null}};exports.forwardRef=function(a){return{$$typeof:t,render:a}};exports.isValidElement=L;
exports.lazy=function(a){return{$$typeof:v,_payload:{_status:-1,_result:a},_init:Q}};exports.memo=function(a,b){return{$$typeof:u,type:a,compare:void 0===b?null:b}};exports.useCallback=function(a,b){return S().useCallback(a,b)};exports.useContext=function(a,b){return S().useContext(a,b)};exports.useDebugValue=function(){};exports.useEffect=function(a,b){return S().useEffect(a,b)};exports.useImperativeHandle=function(a,b,c){return S().useImperativeHandle(a,b,c)};
exports.useLayoutEffect=function(a,b){return S().useLayoutEffect(a,b)};exports.useMemo=function(a,b){return S().useMemo(a,b)};exports.useReducer=function(a,b,c){return S().useReducer(a,b,c)};exports.useRef=function(a){return S().useRef(a)};exports.useState=function(a){return S().useState(a)};exports.version="17.0.2";


/***/ }),

/***/ 7294:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (true) {
  module.exports = __webpack_require__(2408);
} else {}


/***/ }),

/***/ 53:
/***/ ((__unused_webpack_module, exports) => {

/** @license React v0.20.2
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f,g,h,k;if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()}}else{var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q}}
if("undefined"===typeof window||"function"!==typeof MessageChannel){var t=null,u=null,w=function(){if(null!==t)try{var a=exports.unstable_now();t(!0,a);t=null}catch(b){throw setTimeout(w,0),b;}};f=function(a){null!==t?setTimeout(f,0,a):(t=a,setTimeout(w,0))};g=function(a,b){u=setTimeout(a,b)};h=function(){clearTimeout(u)};exports.unstable_shouldYield=function(){return!1};k=exports.unstable_forceFrameRate=function(){}}else{var x=window.setTimeout,y=window.clearTimeout;if("undefined"!==typeof console){var z=
window.cancelAnimationFrame;"function"!==typeof window.requestAnimationFrame&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");"function"!==typeof z&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills")}var A=!1,B=null,C=-1,D=5,E=0;exports.unstable_shouldYield=function(){return exports.unstable_now()>=
E};k=function(){};exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<a?Math.floor(1E3/a):5};var F=new MessageChannel,G=F.port2;F.port1.onmessage=function(){if(null!==B){var a=exports.unstable_now();E=a+D;try{B(!0,a)?G.postMessage(null):(A=!1,B=null)}catch(b){throw G.postMessage(null),b;}}else A=!1};f=function(a){B=a;A||(A=!0,G.postMessage(null))};g=function(a,b){C=
x(function(){a(exports.unstable_now())},b)};h=function(){y(C);C=-1}}function H(a,b){var c=a.length;a.push(b);a:for(;;){var d=c-1>>>1,e=a[d];if(void 0!==e&&0<I(e,b))a[d]=b,a[c]=e,c=d;else break a}}function J(a){a=a[0];return void 0===a?null:a}
function K(a){var b=a[0];if(void 0!==b){var c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length;d<e;){var m=2*(d+1)-1,n=a[m],v=m+1,r=a[v];if(void 0!==n&&0>I(n,c))void 0!==r&&0>I(r,n)?(a[d]=r,a[v]=c,d=v):(a[d]=n,a[m]=c,d=m);else if(void 0!==r&&0>I(r,c))a[d]=r,a[v]=c,d=v;else break a}}return b}return null}function I(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}var L=[],M=[],N=1,O=null,P=3,Q=!1,R=!1,S=!1;
function T(a){for(var b=J(M);null!==b;){if(null===b.callback)K(M);else if(b.startTime<=a)K(M),b.sortIndex=b.expirationTime,H(L,b);else break;b=J(M)}}function U(a){S=!1;T(a);if(!R)if(null!==J(L))R=!0,f(V);else{var b=J(M);null!==b&&g(U,b.startTime-a)}}
function V(a,b){R=!1;S&&(S=!1,h());Q=!0;var c=P;try{T(b);for(O=J(L);null!==O&&(!(O.expirationTime>b)||a&&!exports.unstable_shouldYield());){var d=O.callback;if("function"===typeof d){O.callback=null;P=O.priorityLevel;var e=d(O.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?O.callback=e:O===J(L)&&K(L);T(b)}else K(L);O=J(L)}if(null!==O)var m=!0;else{var n=J(M);null!==n&&g(U,n.startTime-b);m=!1}return m}finally{O=null,P=c,Q=!1}}var W=k;exports.unstable_IdlePriority=5;
exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null};exports.unstable_continueExecution=function(){R||Q||(R=!0,f(V))};exports.unstable_getCurrentPriorityLevel=function(){return P};exports.unstable_getFirstCallbackNode=function(){return J(L)};
exports.unstable_next=function(a){switch(P){case 1:case 2:case 3:var b=3;break;default:b=P}var c=P;P=b;try{return a()}finally{P=c}};exports.unstable_pauseExecution=function(){};exports.unstable_requestPaint=W;exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=P;P=a;try{return b()}finally{P=c}};
exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3}e=c+e;a={id:N++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,H(M,a),null===J(L)&&a===J(M)&&(S?h():S=!0,g(U,c-d))):(a.sortIndex=e,H(L,a),R||Q||(R=!0,f(V)));return a};
exports.unstable_wrapCallback=function(a){var b=P;return function(){var c=P;P=b;try{return a.apply(this,arguments)}finally{P=c}}};


/***/ }),

/***/ 3840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (true) {
  module.exports = __webpack_require__(53);
} else {}


/***/ }),

/***/ 3129:
/***/ ((module) => {

module.exports = require("child_process");;

/***/ }),

/***/ 6200:
/***/ ((module) => {

module.exports = require("dgram");;

/***/ }),

/***/ 881:
/***/ ((module) => {

module.exports = require("dns");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

module.exports = require("fs");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

module.exports = require("path");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: external "url"
const external_url_namespaceObject = require("url");;
;// CONCATENATED MODULE: ./src/managers/audioManager.jsx
class AudioManager {
  constructor(game) {
    this.game = game;
    this.currentSounds = [];
  }

  addSound(name, path, type, shouldRepeat) {
    const audio = new Audio(`assets/sounds${path.startsWith('/') ? path : '/' + path}`);
    audio.controls = false;
    audio.addEventListener('canplaythrough', () => {
      audio.volume = type == 'ui' ? this.game.config.sound.ui : type == 'game' ? this.game.config.sound.game : type == 'music' ? this.game.config.sound.music : 1;
      audio.loop = shouldRepeat instanceof Boolean ? shouldRepeat : false;
      audio.play();
      this.currentSounds.push({
        name,
        object: audio
      });
    });

    audio.onended = () => {
      this.currentSounds.splice(this.currentSounds.findIndex(sound => sound.name == name), 1);
    };
  }

  removeSound(name) {
    const index = this.currentSounds.findIndex(sound => sound.name == name);

    if (index >= 0) {
      this.currentSounds[index].object.pause();
      this.currentSounds.splice(index, 1);
    }
  }

}
;// CONCATENATED MODULE: ./src/scenes/Scene.jsx
/* eslint-disable no-unused-vars */

/* eslint-disable no-empty-function */
class Scene {
  constructor(game) {
    this.game = game;
  }

  render(root) {}

}
;// CONCATENATED MODULE: ./src/scenes/onlineScene/OnlineScene.jsx


const React = __webpack_require__(7294);

const ReactDOM = __webpack_require__(3935);

class OnlineScene extends Scene {
  constructor(game) {
    super(game);
    this.game = game;
    this.game.audioManager.removeSound('test');
  }

  render(root) {
    ReactDOM.render( /*#__PURE__*/React.createElement("div", {
      id: "onlineScene",
      className: "scene"
    }, /*#__PURE__*/React.createElement("p", null, "online scene")), root);
  }

}
;// CONCATENATED MODULE: ./src/scenes/menuScene/MenuScene.jsx



const MenuScene_React = __webpack_require__(7294);

const MenuScene_ReactDOM = __webpack_require__(3935);

class MenuScene extends Scene {
  constructor(game) {
    super(game);
    this.game = game;
  }

  init() {
    this.game.audioManager.addSound('main_menu', 'menu_music.mp3', 'music', true);
    this.buttons = {};
    this.buttons.online = /*#__PURE__*/MenuScene_React.createElement("button", {
      className: "button is-primary menuScene",
      id: "onlineButton",
      onClick: () => {
        this.game.audioManager.addSound('click', 'general_sounds/UI_Select.wav', 'ui', false);
        this.game.setScene(OnlineScene);
      },
      onMouseEnter: () => this.game.audioManager.addSound('hover', 'general_sounds/UI_Hover.wav', 'ui', false)
    }, "Online");
  }

  render(root) {
    MenuScene_ReactDOM.render( /*#__PURE__*/MenuScene_React.createElement("div", {
      id: "menuScene",
      className: "scene"
    }, Object.values(this.buttons)), root);
  }

}
;// CONCATENATED MODULE: ./src/Game.jsx




const {
  SkeldjsClient
} = __webpack_require__(7981);

const {
  authTokenHook
} = __webpack_require__(1214);

const fs = __webpack_require__(5747);

const path = __webpack_require__(5622);

class Game {
  constructor(root) {
    this.root = root;
  }

  init(fps, clientVersion, appDataDirPath) {
    // Create config object
    this.config = {
      sound: {
        ui: 0.3,
        game: 1,
        music: 0.7
      },
      graphics: {
        fps
      }
    };
    this.client = new SkeldjsClient(clientVersion);
    this.appDataPath = appDataDirPath;
    console.log(path.join(process.resourcesPath, 'binaries/GetAuthToken.exe'));
    authTokenHook(this.client, {
      exe_path: path.join(process.resourcesPath, 'binaries/GetAuthToken.exe'),
      cert_path: ''
    }); // Set audio manager

    this.audioManager = new AudioManager(this);
    this._currentScene = new MenuScene(this);

    this._currentScene.init();

    this._currentPopup = null;
    this.renderer = setInterval(() => {
      this._currentScene.render(this.root);
    }, 1000 / fps);
  }

  setScene(Scene, shouldInit) {
    this._currentScene = new Scene(this);
    if (shouldInit) this._currentScene.init();
  }

}
;// CONCATENATED MODULE: ./src/main.jsx
// Imports
const main_path = __webpack_require__(5622);



const main_fs = __webpack_require__(5747); // Set the scene manager


const game = new Game(document.getElementsByTagName('body')[0]); // Import custom bulma

__webpack_require__(7173); // Funtion to get application data folder


const getAppDataPath = () => {
  switch (process.platform) {
    case 'darwin':
      return main_path.join(process.env.HOME, 'Library', 'Application Support', 'amogusclient');

    case 'win32':
      return main_path.join(process.env.APPDATA, 'amogusclient');

    case 'linux':
      return main_path.join(process.env.HOME, '.amogusclient');

    default:
      console.log('Unsupported platform!');
      process.exit(1);
  }
};

const appDataDirPath = getAppDataPath();

if (!main_fs.existsSync(appDataDirPath)) {
  main_fs.mkdirSync(appDataDirPath);
} // Create servers.js if needed


if (!main_fs.existsSync(main_path.join(appDataDirPath, 'servers.json'))) {
  const data = {
    currentlySelected: 0,
    servers: [{
      name: 'North America',
      host: 'na.mm.among.us',
      port: '22023'
    }, {
      name: 'Europe',
      host: 'eu.mm.among.us',
      port: '22023'
    }, {
      name: 'Asia',
      host: 'as.mm.among.us',
      port: '22023'
    }]
  };
  main_fs.writeFileSync(main_path.join(appDataDirPath, 'servers.json'), JSON.stringify(data), () => {
    process.exit(1);
  });
  console.log(main_fs.readFileSync(main_path.join(appDataDirPath, 'servers.json')).toString());
}

game.init(30, '2021.4.2', appDataDirPath);
})();

/******/ })()
;