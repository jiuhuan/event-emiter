
// event-emiter
// jiuhuan<by11880@126.com>

"use strict";

module.exports = function EventEmiter() {
  this.__EventsList = {};
};

EventEmiter.log = function log() {
  try {
    console.log.apply(console, arguments);
  } catch (e) {}
};

EventEmiter.indexOf = function indexOf(array, value) {
  for (var i = 0; i < array.length; i++) {
    if(array[i]['callback'] === value){
      return i;
    }
  }
  return -1;
};

EventEmiter.prototype.on = function (name, data, callback, type) {

  var events = this.__EventsList[ name ];

  if( !events ){
    events = this.__EventsList[ name ] = []
  }

  if( EventEmiter.indexOf(events, callback) === -1 ){

    var handler = {
      name: name,
      type: type || 0,
      callback: callback
    };

    events.push(handler);

    return this
  }

  return this
};

EventEmiter.prototype.one = function(name, data, callback) {
  this.on(name, data, callback, 1);
};

EventEmiter.prototype.emit = function (name, data) {
  var events = this.__EventsList[ name ],
      handler;
  if(events && events.length){
    events = events.slice();
    // var self = this;
    while (handler = events.shift()) {
      try {
        var result = handler.callback.apply(this, [ data ]);
        if(1 === handler.type){
          this.remove(name, handler.callback);
        }
        if(false === result){
          break;
        }
      } catch (e) {
        throw e
      }
    }
  }else{
    EventEmiter.log('error: '+ name +' is not registered')
  }
  return this
};

EventEmiter.prototype.remove = function (name, callback) {
  var events = this.__EventsList[ name ];

  if(!events){
    return null
  }

  if(!callback){
    try {
      delete this.__EventsList[ name ]
    } catch (e) {
      this.__EventsList[ name ] = null
    }
    return null
  }

  if(events.length){
    var index = EventEmiter.indexOf(events, callback);
    events.splice(index, 1);
  }

  return this
};
