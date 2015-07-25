var Listener = function() {
    this.callbacks = {
        'trigger': []
    };

    //TODO: this is just a proof of concept. Implement the actual listener here!
    setInterval(function() {
        this.onTrigger();
    }.bind(this), 1000);
}

Listener.prototype.on = function(topic, callback) {
    if (!this.callbacks[topic]) {
        throw new Error('invalid event topic');
    }
    this.callbacks[topic].push(callback);
}

Listener.prototype.onTrigger = function() {
    this.callbacks.trigger.forEach(function(callback) {
        callback();
    });
};

module.exports = Listener;
