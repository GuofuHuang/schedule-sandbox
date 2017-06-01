import { Products } from '../../../both/collections/products.collection';
import { Counts } from 'meteor/tmeasday:publish-counts';

Meteor.publish('one_products', function(id: any, options: any) {

  Counts.publish(this, 'one_products', Products.find(id).cursor, {noReady: false});
  return Products.collection.find(id, options);

})