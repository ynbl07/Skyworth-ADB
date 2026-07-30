const crypto = require('crypto');

function calculateNumber(md5Str) {
    if (!md5Str || md5Str.length < 32) {
        return 0;
    }

    const beforeStr = md5Str.substring(0, 16);
    const afterStr = md5Str.substring(16, 32);

    let beforeNum = 0;
    for (let i = 0; i < beforeStr.length; i++) {
        const val = beforeStr[i].charCodeAt(0) - 48;
        beforeNum += parseInt(val, 10);
    }

    let afterNum = 0;
    for (let i = 0; i < afterStr.length; i++) {
        const val = afterStr[i].charCodeAt(0) - 48;
        afterNum += parseInt(val, 10);
    }

    return beforeNum * afterNum;
}

function calculatePassword(mac, random) {
    const normalizedMac = String(mac || '').trim();
    const normalizedRandom = String(random || '').trim();

    const source = `JSCMCC_SKYWORTH${normalizedMac}${normalizedRandom}tianhuaxin@skyworth.com`;
    const md5Hash = crypto.createHash('md5').update(source).digest('hex');

    return calculateNumber(md5Hash);
}

module.exports = function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const body = typeof request.body === 'string'
        ? JSON.parse(request.body || '{}')
        : request.body || {};

    const mac = body.mac;
    const random = body.random;

    if (!mac || !random) {
        return response.status(400).json({ error: '缺少 MAC 地址或随机码' });
    }

    const result = calculatePassword(mac, random);

    return response.status(200).json({ result });
};
