# Ottoman.js (Node.js ODM for Couchbase)

Ottoman is a ODM built for Couchbase and Node.js.  
Here in this NPM Package has $in, $lt, $gt, $contains with multi-dimentional array capability enhancement. 

All other are exactly same as below original source

Source - http://github.com/couchbaselabs/node-ottoman



## Getting Started

### Installing

Ottoman is not yet published to npm, to install the development version
directly from GitHub, run:
```
npm install ottoman-in
```


### Introduction
``` Schema
const dataSchema = db.model('Data', {
  dataFor: {
    type: 'string',
    enum: [ 'type1', 'type2', 'type3' ]
  },
  applications: 'Mixed', 
});

```
```javascript
// $in Capability
let params = {
    dataFor:
    {
      '$in': [req.params.type, 'type3']
    },
    applications: {
      [appId]: true
    }
  };
  Data.find(params, (error, result) => {
    if (error) {
      return res.status(401).send({'success': false, 'message': error});
    }
    return res.status(200).send(result);
  });
//$contains with multi-dimentional array
/*"parentArray": [
       {
         "childArray": [
           {
             _id: 123
           },
           {
             _id: 456
           }
         ]
       }
     ]*/

const query = {
   parentArray :{'$contains':{childArray:{'$contains':{'_id':123}}}}
 };

 Data.find(query, {load: ['ref_doc']}, (error, result) => {
   if (error) {
     return res.status(401).send({'success': false, 'message': error});
   }
   return res.status(200).send(result);
 });


```
