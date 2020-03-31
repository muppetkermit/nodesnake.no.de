



exports = module.exports = YMEvent;

function YMEvent(){
    this._listeners = {};
}

YMEvent.prototype = {
	
    constructor: YMEvent,

    addEventListener: function(type, listener){
        if (typeof this._listeners[type] == "undefined"){
            this._listeners[type] = [];
        }
        this._listeners[type].push(listener);
    },

    dispatchEvent: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){
            throw new Error("Event object missing 'type' property.");
        }

        if (this._listeners[event.type] instanceof Array){
            var listeners = this._listeners[event.type]
            	, len=listeners.length;
            for (var i=0; i < len; i++){
                listeners[i].call(this, event);
            }
        }
    },

    removeEventListener: function(type, listener){
        if (this._listeners[type] instanceof Array){
            var listeners = this._listeners[type],
            	len=listeners.length;
            for (var i=0; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};