'use strict';

var bunyan = require('bunyan'),
	winston = require('winston'),
	restify = require('restify'),
	Bunyan2Winston = require('./winston'),
	redis = require('./redis'),
	PrettyStream = require('bunyan-prettystream'),
	defaultConfig = require('../config/logger');

module.exports.logger = function (options) {
	if (!options) {
		options = {};
	}

	var redisClient = redis(options.redis || defaultConfig.redis),
		item,
		prettyStdOut;

	for (var stream in options.streams) {
		item = options.streams[stream] || defaultConfig.streams[stream];
		if (item.type === 'redis') {
			item.type = 'raw';
			item.stream = redisClient;
		} else if (item.type === 'winston') {
			var log = new winston.Logger({
				transports: [
					new winston.transports.Console({
						colorize: true,
						json: false
					})
				]
			});

			item.type = 'raw';
			item.stream = new Bunyan2Winston(log, bunyan);
		}

		// Prettyprint if show in console
		if (item.stream === process.stdout && item.prettify) {
			prettyStdOut = new PrettyStream({
				mode: 'short'
			});
			prettyStdOut.pipe(process.stdout);
			item.stream = prettyStdOut;
		}
	}

	return bunyan.createLogger({
		name: options.name || defaultConfig.name,
		src: options.src || defaultConfig.src,
		streams: options.streams || defaultConfig.streams,
		serializers: restify.bunyan.serializers
	});
};


module.exports.audit = function (options) {
	if (options.audit.enable || defaultConfig.enable) {
		return restify.auditLogger({
			log: this.logger(options)
		});
	}

	return false;
};
