'use strict';

var RedisClient = require('redis'),
	_ = require('lodash');

module.exports = function (config) {

	var redis = null;

	// Add Logger functionallity to redis
	RedisClient.RedisClient.prototype.write = function (value) {
		var prefix = value.name || 'logfrant',
			now = new Date(),
			hash = Math.round(new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()).getTime() / 1000),
			key = Math.round(new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()).getTime());

		redis.hset(prefix + ':' + hash, key, JSON.stringify(value));
	};

	// Redis connection
	var options = _.extend({
			auth_pass: config.password
		},
		config
	);
	redis = RedisClient.createClient(config.port, config.host, options);

	if (config.database) {
		redis.select(config.database);
		redis.on('connect', function () {
			redis.send_anyways = true;
			redis.select(config.database);
			redis.send_anyways = false;
		});
	}

	redis.on('error', function (err) {
		console.log('Redis error: %s', err);
	});

	return (redis);
};
