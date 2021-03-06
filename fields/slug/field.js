
Formation.Fields.Slug = function Field( params ){
  params = typeof params === "object" ? params : {};
  params.widget = params.widget || 'SlugInput';
  params.fromDOM = function( value ){
    if (! value && ! this.required ) return undefined;
    return Formation.camelToSlug( value );
  };
  params.min = params.min || 1;
  params.max = params.max || err( 'Please add a maximum length for this field greater than 0.' )

  Formation.Field.call( this, params );

  Object.defineProperty( this, "pattern", {
    value: function(){
      return this._optional( Formation.Validators.Slug( this.min, this.max ) );
    }
  });

  Object.defineProperty( this, "instance", {
    value: Formation.FieldInstance({ field: this }),
  });
};

Formation.Fields.Slug.prototype = Object.create( Formation.Field.prototype );
