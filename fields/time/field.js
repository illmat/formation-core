Formation.Time = function Time( time ){
  var self = this;

  if ( typeof( time ) === 'undefined' || time === null ){
    var d = new Date();
    self.hour = d.getHours();
    self.minute = d.getMinutes();
    self.second = d.getSeconds();

  } else if ( time.__name__ === "Time" ){
    self.hour = time.hour;
    self.minute = time.minute;
    self.second = time.second;

  } else if ( typeof( time ) === 'string' ){
    var periodReg   = /am|pm/ig;
    var period      = time.match( periodReg );
    if ( period ){
      time    = time.replace( periodReg, '' ).trim();
      period  = _.contains( period, "PM" ) || _.contains( period, "pm" ) ? 12 : 0;
    }
    var timeStrings = time.split( ':' );

    timeNumbers = [];
    for( i=0; i <= timeStrings.length; i++ ){
      if (! timeStrings[ i ]){
        timeNumbers.push( 0 );
      } else {
        timeNumbers.push( Number( timeStrings[i] ) );
      }
    }
    self.hour   = timeNumbers[0] + period;
    self.minute = timeNumbers[1] || 0;
    self.second = timeNumbers[2] || 0;

  } else if ( _.isObject( time ) ){
    if (! _.contains( _.keys( time ), 'hour' ) ){
      throw new Error( 'Please construct a time object with {hour [,minute,second]} argument(s).' );
    }
    self.hour   = Number( time.hour );
    self.minute = Number( time.minute ) || 0;
    self.second = Number( time.second ) || 0;

  } else if ( typeof( time ) === 'number' ){
    self.hour   = time;
    self.minute = 0;
    self.second = 0;
  } else {
    throw new Error( 'Please enter an object (hour[, minute, second]), string ("hour:minute:second"), or number (hour).' );
  }

  if ( self.hour < 0 || self.hour > 23 ||
    self.minute < 0 || self.minute > 59 ||
    self.second < 0 || self.second > 59 ){
    throw new Error( 'Please enter a valid time value' );
  }

};

Object.defineProperties( Formation.Time.prototype, {
  __name__: { value: "Time" },
  toString: { value: function(){
    var hour = ( "00" + this.hour ).slice( -2 );
    var minute = ( "00" + this.minute ).slice( -2 );
    var second = ( "00" + this.second ).slice( -2 );
    return [ hour, minute, second ].join( ':' );
  }},

  getHour: { value: function(){
    var hour = ( "00" + this.hour ).slice( -2 );
    return hour;
  }},

  getMinute: { value: function(){
    var minute = ( "00" + this.minute ).slice( -2 );
    return minute;
  }},

  getSecond: { value: function(){
    var second = ( "00" + this.second ).slice( -2 );
    return second;
  }},

  to12HourString: { value: function(){
    var whichM = " AM";
    if ( this.hour >= 12 ) whichM = " PM";
    var hour = ( this.hour % 12 || 12 ).toString();
    var minute = ( "00" + this.minute ).slice( -2 );
    var timeString = [ hour, minute ].join( ':' );
    timeString = timeString + whichM;
    return timeString;
  }},

  valueOf: { value: function(){
    var second = 1000;
    var minute = 60000;
    var hour = 3600000;
    return this.hour*hour + this.minute*minute + this.second*second;
  }}
});




Formation.Fields.Time = function Field( params ){
  params = typeof params === "object" ? params : {};
  params.widget = params.widget || "TimeTextInput";

  params.min = new Formation.Time( params.min || 8 );
  params.max = new Formation.Time( params.max || "23:59" );

  params.toDOM = function(){
    var value = new Formation.Time( this.value );
    return value;
  };
  params.fromDOM = function( value ){
    if (! value && ! this.required ) return undefined;
    var value = new Formation.Time( value );
    return value;
  };

  Formation.Field.call( this, params );

  Object.defineProperties( this, {
    choices: { value: function(){
      var self = this;
      var hours = _.reduce( _.range( this.min.hour, this.max.hour + 1 ), function( memo, value ){
        memo.push( ( "00" + value ).slice( -2 ) );
        return memo;
      }, [] );
      var minutes = _.reduce( _.range( 0, 60 ), function( memo, value ){
        memo.push( ( "00" + value ).slice( -2 ) );
        return memo;
      }, [] );
      var seconds = _.reduce( _.range( 0, 60 ), function( memo, value ){
        memo.push( ( "00" + value ).slice( -2 ) );
        return memo;
      }, [] );

      return { hours: hours, minutes: minutes, seconds: seconds };
    }},

    pattern: { value: function(){
      return this._optional( Formation.Validators.Time( this.min, this.max ) );
    }},
  });

  Object.defineProperty( this, "instance", {
    value: Formation.FieldInstance({ field: this })
  });
};


Formation.Fields.Time.prototype = Object.create( Formation.Field.prototype );
