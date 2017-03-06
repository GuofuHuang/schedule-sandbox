import {MongoObservable} from "meteor-rxjs";
import { Product } from  '../models/products.model';

export const Products = new MongoObservable.Collection<Product>('products');