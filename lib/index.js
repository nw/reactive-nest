
var old = {};

module.exports = function(reactive){

  old.get = reactive.adapter.get;
  old.set = reactive.adapter.set;
  old.reactive = reactive;
  
  reactive.get(function(obj, prop){
    if(!isNested(prop)) return old.get(obj, prop);
    
    var path = prop.split('.');
    while(path.length && obj){
      obj = old.get(obj, path.shift())
    }
    
    return obj;
  })
  
  reactive.set(function(obj, prop, val){
    if(!isNested(prop)) return old.set(obj, prop, val);
    
    var path = prop.split('.');
    var prop = path.pop();
    
    while(path.length && obj){
      obj = old.get(obj, path.shift())
    }
    
    old.set(obj, prop, val);
  })

}

module.exports.revert = function(){
  if(!old.reactive) return;
  old.reactive.get(old.get);
  old.reactive.set(old.set);
}


function isNested(prop){
  return ~prop.indexOf('.')
}
