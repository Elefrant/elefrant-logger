'use strict';

var component = require('../component'),
	restify = require('restify'),
	should = require('should');

var server = restify.createServer();

describe('logger', function () {

	it('exports an object', function () {
		should.exist(component);
	});

	it('check afterServer', function () {
		should(component.afterServer({}, server, restify)).be.ok;
	});

	it('check paramServer object', function () {
		should(component.paramServer({})).be.an.Object;
	});

	it('check register a function', function () {
		should(component.register({})).be.a.Function;
	});
});
