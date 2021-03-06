'use strict';

const express = require('express');
const router = express.Router();

const checkContentType = req => {
    const ct = req.header('Content-Type');
    if (!ct || !ct.match('application/x-www-form-urlencoded')) {
        return false;
    }
    return true;
};

const checkBody = (req, names) => {
    const body = req.body;
    if (!body) return false;
    return Object.keys(body).every(key => {
        return names.includes(key);
    });
};

const handleQuery = (req, res) => {
    const names = ['mapdb', 'encoding', 'page', 'count', 'condition'];
    const checkQuery = req => {
        const query = req.query;
        return query.op && query.op === 'query';
    };
    const check = req => {
        return checkQuery(req) && checkContentType(req) && checkBody(req, names);
    };
    if (!check(req)) {
        // res.status(422);
        res.send({ success: false });
        return;
    }
    const body = req.body;
    const count = body.count || 20;
    const features = [];
    for (let i = 0; i < count; i++) {
        features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [100 + Math.random() * 10, 50 + Math.random() * 10]
            },
            properties: {
                idx: i
            }
        });
    }
    const response = {
        success: true,
        count: 1,
        data: [{
            type: 'FeatureCollection',
            layer: req.params.layer,
            features: features
        }]
    };
    res.send(response);
    res.end();
};

const handleIdentify = (req, res) => {
    const names = ['mapdb', 'encoding', 'page', 'count', 'spatialFilter'];
    const checkQuery = req => {
        const query = req.query;
        return query.op && query.op === 'query';
    };
    const check = req => {
        return checkQuery(req) && checkContentType(req) && checkBody(req, names);
    };
    if (!check(req)) {
        // res.status(422);
        res.send({ success: false });
        return;
    }
    const body = req.body;
    const count = body.count;
    const features = [];
    for (let i = 0; i < count; i++) {
        features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [100 + Math.random() * 10, 50 + Math.random() * 10]
            },
            properties: {
                idx: i
            }
        });
    }
    const response = {
        success: true,
        count: 1,
        data: [{
            type: 'FeatureCollection',
            layer: req.params.layer,
            features: features
        }]
    };
    res.send(response);
    res.end();
};

router.post('/sdb/databases/:db/layers/:layer/data', function (req, res) {
    const layerId = req.params.layer;
    const op = req.query.op;
    if (op === 'query') {
        if (layerId === 'test-query') {
            handleQuery(req, res);
        } else {
            handleIdentify(req, res);
        }
    } else if (op === 'count') {
        const response = {
            success: true,
            data: 5
        };
        res.send(response);
        res.end();
    }
});

router.post('/geometry/relation', function (req, res) {
    const names = ['source', 'targets', 'relation'];
    const check = req => {
        return checkContentType(req) && checkBody(req, names);
    };
    let success;
    if (!check(req)) {
        success = false;
        // res.status(422);
        res.send({ success });
        return;
    }
    success = true;
    const body = req.body;
    const targets = JSON.parse(body.targets);
    const count = targets.length;
    const data = targets.map((value, index) => {
        return (index < count - 1) ? 1 : 0;
    });
    res.send({ success, count, data });
});

router.post('/geometry/analysis/buffer', (req, res) => {
    const names = ['targets', 'distance'];
    const check = req => {
        return checkContentType(req) && checkBody(req, names);
    };
    let success;
    if (!check(req)) {
        success = false;
        // res.status(422);
        res.send({ success });
        return;
    }
    success = true;
    const body = req.body;
    const targets = JSON.parse(body.targets);
    const count = targets.length;
    const data = targets;
    res.send({ success, count, data });
});

module.exports = router;
