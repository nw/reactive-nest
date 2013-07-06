var model = require('model')
  , reactive = require('reactive')
  , domify = require('domify')
  , assert = require('component-assert')
  , model_nest = require('model-nest')
  , nest = require('reactive-nest');
  
nest(reactive);

var Other = model('Other')
    .attr('twitter', {type: 'string'});
    
Other.prototype.twitlink = function(){
  return 'http://twitter.com/'+ this.attrs.twitter;
}

var User = model('User')
  .use(model_nest)
  .attr('name', { type: 'string' })
  .attr('age', { type: 'number' })
  .attr('contact', model('Contact')
      .use(model_nest)
      .attr('phone', {type: 'string'})
      .attr('email', {type: 'string'})
      .attr('other', Other));
  
describe('nesting models', function(){
  it('should allow setting base props', function(){
    var el = domify('<p><em data-text="name"></em></p>');
    var user = new User({ name: 'Joe' });

     reactive(el, user);
    
    var em = el.children[0];
    
    assert('Joe' == em.textContent);
  })
  
  
  it('should allow setting nested objects', function(){
    var el = domify('<p><em data-text="contact.phone"></em></p>');
    var user = new User({
      name: 'Joe',
      age: 13,
      contact: {
        phone: '555-555-5555', 
        email: 'joe@live.com',
        other: { twitter: 'joemoments'}
      }});
      
     reactive(el, user);
    
    var em = el.children[0];
    
    assert('555-555-5555' == em.textContent)
    
    user.contact.phone('805-362-5214');
    
    assert('805-362-5214' == em.textContent)
  })
  
  it('should allow nested of nested', function(){
    var el = domify('<p><em data-text="contact.other.twitter"></em></p>');
    var user = new User({
      name: 'Joe',
      age: 13,
      contact: {
        phone: '555-555-5555', 
        email: 'joe@live.com',
        other: { twitter: 'joemoments'}
      }});
      
     reactive(el, user);
    
    var em = el.children[0];
    
    assert('joemoments' == em.textContent)
    
    user.contact.other.twitter("joemomma")
    
    assert('joemomma' == em.textContent)
    
  })
  
  it('should allow custom view functions', function(){
    var el = domify('<p><em data-text="contact.other.twitlink"></em></p>');
    var user = new User({
      name: 'Joe',
      age: 13,
      contact: {
        phone: '555-555-5555', 
        email: 'joe@live.com',
        other: { twitter: 'joemoments'}
      }});
      
     reactive(el, user);
    
    var em = el.children[0];
    
    assert('http://twitter.com/joemoments' == em.textContent)
    
  })
  
  
})