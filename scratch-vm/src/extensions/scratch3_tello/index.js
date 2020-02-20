const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,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';

const message = {
    takeoff: {
        'ja': '離陸する',
        'ja-Hira': 'りりくする',
        'en': 'takeoff',
        'zh-cn': '自动起飞'
    },
    land: {
        'ja': '着陸する',
        'ja-Hira': 'ちゃくりくする',
        'en': 'land',
        'zh-cn': '自动降落'
    },
    up: {
        'ja': '上に [X]cm 上がる',
        'ja-Hira': 'うえに [X] センチあがる',
        'en': 'up [X] cm',
        'zh-cn': '向上飞 [X] cm'
    },
    down: {
        'ja': '下に [X]cm 下がる',
        'ja-Hira': 'したに [X] センチさがる',
        'en': 'down [X] cm',
        'zh-cn': '向下飞 [X] cm'
    },
    left: {
        'ja': '左に [X]cm 動く',
        'ja-Hira': 'ひだりに [X] センチうごく',
        'en': 'move left [X] cm',
        'zh-cn': '向左飞 [X] cm'
    },
    right: {
        'ja': '右に [X]cm 動く',
        'ja-Hira': 'みぎに [X] センチうごく',
        'en': 'move right [X] cm',
        'zh-cn': '向右飞 [X] cm'
    },
    forward: {
        'ja': '前に [X]cm 進む',
        'ja-Hira': 'まえに [X] センチすすむ',
        'en': 'move forward [X] cm',
        'zh-cn': '向前飞 [X] cm'
    },
    back: {
        'ja': '後ろに [X]cm 下がる',
        'ja-Hira': 'うしろに [X] センチさがる',
        'en': 'move back [X] cm',
        'zh-cn': '向后飞 [X] cm'
    },
    cw: {
        'ja': '[X] 度右に回る',
        'ja-Hira': '[X] どみぎにまわる',
        'en': 'rotate [X] degrees right',
        'zh-cn': '顺时针旋转 [X] 度'
    },
    ccw: {
        'ja': '[X] 度左に回る',
        'ja-Hira': '[X] どひだりにまわる',
        'en': 'rotate [X] degrees left',
        'zh-cn': '逆时针旋转 [X] 度'
    },
    flip: {
        'ja': '[TAKEPUT] 方向に転げ回る',
        'ja-Hira': '[TAKEPUT] 方向に転げ回る',
        'en': 'flip [TAKEPUT]',
        'zh-cn': '朝 [TAKEPUT] 方向翻滚'
    },
    stop: {
        'ja': 'ホバリング',
        'ja-Hira': 'ホバリング',
        'en': 'stop',
        'zh-cn': '悬停'
    },
    speed: {
        'ja': '速度を [X] cm/s に設定します',
        'ja-Hira': '速度を [X] cm/s に設定します',
        'en': 'set speed to [X] cm/s',
        'zh-cn': '将速度设为 [X] cm/s'
    },
    pitch: {
        'ja': 'ピッチ',
        'ja-Hira': 'ピッチ',
        'en': 'pitch',
        'zh-cn': '俯仰'
    },
    roll: {
        'ja': 'ロール',
        'ja-Hira': 'ロール',
        'en': 'roll',
        'zh-cn': '横滚'
    },
    yaw: {
        'ja': 'ヨー',
        'ja-Hira': 'ヨー',
        'en': 'yaw',
        'zh-cn': '偏航'
    },
    vgx: {
        'ja': 'x方向の速度',
        'ja-Hira': 'xほうこうのはやさ',
        'en': 'speed x',
        'zh-cn': 'X 轴速度'
    },
    vgy: {
        'ja': 'y方向の速度',
        'ja-Hira': 'yほうこうのはやさ',
        'en': 'speed y',
        'zh-cn': 'Y 轴速度'
    },
    vgz: {
        'ja': 'z方向の速度',
        'ja-Hira': 'zほうこうのはやさ',
        'en': 'speed z',
        'zh-cn': 'Z 轴速度'
    },
    tof: {
        'ja': '地面からの高度',
        'ja-Hira': 'じめんからのたかさ',
        'en': 'height from ground',
        'zh-cn': '相对地面高度'
    },
    height: {
        'ja': '離陸した場所からの高度',
        'ja-Hira': 'りりくしたばしょからのたかさ',
        'en': 'height from takeoff point',
        'zh-cn': '相对起飞点高度'
    },
    bat: {
        'ja': 'バッテリー残量',
        'ja-Hira': 'バッテリーざんりょう',
        'en': 'battery remaining',
        'zh-cn': '当前电量百分比'
    },
    baro: {
        'ja': '気圧計による高さ',
        'ja-Hira': 'きあつけいによるたかさ',
        'en': 'height by barometer',
        'zh-cn': '气压计测量高度'
    },
    time: {
        'ja': '飛行時間',
        'ja-Hira': 'ひこうじかん',
        'en': 'flying time',
        'zh-cn': '电机运转时间'
    },
    agx: {
        'ja': 'x方向の加速度',
        'ja-Hira': 'xほうこうのかそくど',
        'en': 'acceleration x',
        'zh-cn': 'X 轴加速度'
    },
    agy: {
        'ja': 'y方向の加速度',
        'ja-Hira': 'yほうこうのかそくど',
        'en': 'acceleration y',
        'zh-cn': 'Y 轴加速度'
    },
    agz: {
        'ja': 'z方向の加速度',
        'ja-Hira': 'zほうこうのかそくど',
        'en': 'acceleration z',
        'zh-cn': 'Z 轴加速度'
    }

};

/**
 * Class for the Tello
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3Tello {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Tello';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'tello';
    }
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        if (formatMessage.setup().locale === 'ja' || formatMessage.setup().locale === 'ja-Hira' || formatMessage.setup().locale === 'zh-cn') {
            this.locale = formatMessage.setup().locale;
        } else {
            this.locale = 'en';
        }

        return {
            id: Scratch3Tello.EXTENSION_ID,
            name: Scratch3Tello.EXTENSION_NAME,
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            showStatusButton: true,

            blocks: [
                {
                    opcode: 'takeoff',
                    text: message.takeoff[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'land',
                    text: message.land[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'up',
                    text: message.up[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    }
                },
                {
                    opcode: 'down',
                    text: message.down[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    }
                },
                {
                    opcode: 'left',
                    text: message.left[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    }
                },
                {
                    opcode: 'right',
                    text: message.right[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    }
                },
                {
                    opcode: 'forward',
                    text: message.forward[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    }
                },
                {
                    opcode: 'back',
                    text: message.back[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    }
                },
                {
                    opcode: 'cw',
                    text: message.cw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'ccw',
                    text: message.ccw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'flip',
                    text: message.flip[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TAKEPUT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Forward',
                            menu: 'takeput'
                        }
                    }
                },
                {
                    opcode: 'stop',
                    text: message.stop[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'speed',
                    text: message.speed[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'pitch',
                    text: message.pitch[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'roll',
                    text: message.roll[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'yaw',
                    text: message.yaw[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgx',
                    text: message.vgx[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgy',
                    text: message.vgy[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgz',
                    text: message.vgz[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'tof',
                    text: message.tof[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'height',
                    text: message.height[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'bat',
                    text: message.bat[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'baro',
                    text: message.baro[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'time',
                    text: message.time[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agx',
                    text: message.agx[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agy',
                    text: message.agy[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agz',
                    text: message.agz[this.locale],
                    blockType: BlockType.REPORTER
                }
            ],
            menus: {
                takeput: ['Forward', 'Back', 'Left','Right']
            }
        };
    }

    takeoff () {
        telloProcessor.send('takeoff');
    }

    land () {
        telloProcessor.send('land');
    }

    up (args) {
        telloProcessor.send(`up ${Cast.toString(args.X)}`);
    }

    down (args) {
        telloProcessor.send(`down ${Cast.toString(args.X)}`);
    }

    left (args) {
        telloProcessor.send(`left ${Cast.toString(args.X)}`);
    }

    right (args) {
        telloProcessor.send(`right ${Cast.toString(args.X)}`);
    }

    forward (args) {
        telloProcessor.send(`forward ${Cast.toString(args.X)}`);
    }

    back (args) {
        telloProcessor.send(`back ${Cast.toString(args.X)}`);
    }

    cw (args) {
        telloProcessor.send(`cw ${Cast.toString(args.X)}`);
    }

    ccw (args) {
        telloProcessor.send(`ccw ${Cast.toString(args.X)}`);
    }

    flip (args) {
	let param = 'f';
        if (args.TAKEPUT === 'Forward') {
            param = 'f';
        }
        else if (args.TAKEPUT === 'Back') {
            param = 'b';
        }
        else if (args.TAKEPUT === 'Left') {
            param = 'l';
        }
        else {
            param = 'r';
        }
        telloProcessor.send(`flip ${param}`);
    }

    stop () {
        telloProcessor.send('stop');
    }

    speed (args) {
        telloProcessor.send(`speed ${Cast.toString(args.X)}`);
    }

    pitch () {
        return telloProcessor.state('pitch');
    }

    roll () {
        return telloProcessor.state('roll');
    }

    yaw () {
        return telloProcessor.state('yaw');
    }

    vgx () {
        return telloProcessor.state('vgx');
    }

    vgy () {
        return telloProcessor.state('vgy');
    }

    vgz () {
        return telloProcessor.state('vgz');
    }

    tof () {
        return telloProcessor.state('tof');
    }

    height () {
        return telloProcessor.state('h');
    }

    bat () {
        return telloProcessor.state('bat');
    }

    baro () {
        return telloProcessor.state('baro');
    }

    time () {
        return telloProcessor.state('time');
    }

    agx () {
        return telloProcessor.state('agx');
    }

    agy () {
        return telloProcessor.state('agy');
    }

    agz () {
        return telloProcessor.state('agz');
    }
}
module.exports = Scratch3Tello;
