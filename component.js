'use strict';

var configDefault = require('./config/logger'),
	logger = require('./lib/logger'),
	format = require('util').format,
	name = 'logger';

module.exports = {
	enable: true,

	name: name,

	afterServer: function (elefrant, server, restify) {
		var config = configDefault;
		if (elefrant && elefrant.getConfigComp) {
			config = elefrant.getConfigComp(name, configDefault);
		}

		if (config.requestLogger) {
			server.use(restify.requestLogger());
		}

		var audit = logger.audit(config);
		if (audit) {
			server.on('after', audit);
		}

		return true;
	},

	paramServer: function (elefrant) {
		var config = configDefault;
		if (elefrant && elefrant.getConfigComp) {
			config = elefrant.getConfigComp(name, configDefault);
		}

		return {
			log: logger.logger(config)
		};
	},

	register: function (elefrant) {
		var config = configDefault,
			log = logger.logger(config);
		if (elefrant && elefrant.getConfigComp) {
			config = elefrant.getConfigComp(name, configDefault);
		}

		var func = function (level, message) {
			level = level || 'info';
			if (level === 'help') {
				level = 'info';
			}

			log[level](format.apply(this, Array.prototype.slice.call(arguments, 1)));
		};

		return func;
	}
};



//
//
//
// 'use strict';
//
// var config = require('./config/logger'),
// 	logger = require('./lib/logger'),
// 	format = require('util').format,
// 	_ = require('lodash');
//
// module.exports = {
// 	enable: true,
//
// 	name: 'logger',
//
// 	afterServer: function (elefrant, server, restify) {
// 		config = elefrant.getConfigComp('logger', config);
//
// 		if (config.requestLogger) {
// 			server.use(restify.requestLogger());
// 		}
//
// 		var audit = logger.audit(config);
// 		if (audit) {
// 			server.on('after', audit);
// 		}
// 	},
//
// 	paramServer: function (elefrant) {
//
// 		return {
// 			log: logger.logger(elefrant.config.logger)
// 		};
// 	},
//
// 	register: function (config) {
// 		// var log = logger.logger(config.logger);
// 		//
// 		// var func = function (level, message) {
// 		// 	level = level || 'info';
// 		// 	if (level === 'help') {
// 		// 		level = 'info';
// 		// 	}
// 		//
// 		// 	log[level](format.apply(this, Array.prototype.slice.call(arguments, 1)));
// 		// };
//
// 		return true;
// 	}
// };
