'use strict';

function Bunyan2Winston(wlog, bunyan) {
	this.wlog = wlog;
	this.bunyan = bunyan;
}
Bunyan2Winston.prototype.write = function write(rec) {
	var wlevel;

	if (rec.level <= this.bunyan.INFO) {
		wlevel = 'info';
	} else if (rec.level <= this.bunyan.WARN) {
		wlevel = 'warn';
	} else {
		wlevel = 'error';
	}
	// Note: We are *modifying* the log record here. This could be a problem
	// if our Bunyan logger had other streams. This one doesn't.
	var msg = rec.msg;
	delete rec.msg;
	// Remove internal bunyan fields that won't mean anything outside of
	// a bunyan context.
	delete rec.v;
	delete rec.level;

	// TODO: more?
	// Note: Winston doesn't handle *objects* in the 'metadata' field well
	// (e.g. the Bunyan record 'time' field is a Date instance, 'req' and
	// 'res' are typically objects). With 'json: true' on a Winston transport
	// it is a bit better, but still messes up 'date'. What exactly to do
	// here is perhaps user-preference.
	rec.time = String(rec.time);
	//Object.keys(rec).forEach(function (key) {
	// if (typeof(rec[key]) === "object") {
	// rec[key] = JSON.stringify(rec[key])
	// }
	//});

	this.wlog.log('[' + wlevel + ']', msg, rec);
};

module.exports = Bunyan2Winston;
