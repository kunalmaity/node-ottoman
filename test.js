var ottoman = require('./lib/ottoman');
var util = require('util');
var couchbase = require('couchbase');
var ottopath = require('./lib/ottopath');

var SOMETHING = 1;
if (SOMETHING) {
  var cluster = new couchbase.Cluster('couchbase://127.0.0.1');
  var bucket = cluster.openBucket('default');
  ottoman.bucket = bucket;
} else {
  ottoman.store = new ottoman.MockStoreAdapter();
}
ottoman.store.debug = true;

var NoteMdl = ottoman.model('Note', {
  msg: 'string'
});

var UserMdl = ottoman.model('User', {
  name: 'string',
  notes: [{ ref: 'Note' }]
}, {
  queries: {
    myProjects: {
      type: 'n1ql',
      of: 'Project',
      by: 'owner'
    }
  }
});

var ProjectMdl = ottoman.model('Project', {
  name: 'string',
  owner: {ref: 'User'}
}, {
  index: {
    findByOwner: {
      type: 'n1ql',
      by: 'owner'
    }
  }
});

var GroupMdl = ottoman.model('Group', {
  name: 'string',
  users: [{ ref: 'User' }]
}, {
  index: {
    findByName: {
      type: 'n1ql',
      by: 'name',
      consistency: ottoman.Consistency.GLOBAL
    },
    findByUser: {
      type: 'n1ql',
      by: 'users[*]',
      consistency: ottoman.Consistency.GLOBAL
    }
  }
});

ottoman.ensureIndices(function(err) {
  if (err) throw err;

  function doOtherStuff() {
    var myUser = UserMdl.ref('50f56eed-95d7-4075-97d8-56453a798c79');

    GroupMdl.find({users: {$contains: myUser}}, function (err, results) {
      if (err) throw err;

      console.log(results);
      process.exit(0);
    });
  }

  function getOrCreate(model, data, callback) {
    model.getById(data._id, function(err, foundObj) {
      if (!err) {
        callback(err, foundObj);
        return;
      }
      model.create(data, function(err, createdObj) {
        callback(err, createdObj);
      });
    });
  }

  /*
  var myUser = UserMdl.ref('d175902d-1ac3-403e-83af-e5020a9eb919');

  ProjectMdl.findByOwner(myUser, function(err, results) {
    if (err) throw err;

    console.log(results);
    process.exit(0);
  });
  //*/

  //*
  getOrCreate(NoteMdl, {_id:'19d3fc00-629d-42f6-99e1-a31e9a94fa82', msg: 'Test 1'}, function(err, note1) {
    //if (err) throw err;

    getOrCreate(NoteMdl, {_id:'555d2a07-92e7-436c-9dca-69147f9b19a4', msg: 'Test 2'}, function(err, note2) {
      //if (err) throw err;

      getOrCreate(NoteMdl, {_id:'ced819c3-f20b-4647-a86f-fcbb75ef3515', msg: 'Test 3'}, function(err, note3) {
        //if (err) throw err;

        getOrCreate(NoteMdl, {_id:'96be1668-083b-432b-8840-1a8a873a7160', msg: 'Test 4'}, function(err, note4) {
          //if (err) throw err;

          getOrCreate(UserMdl, {_id:'39f977f5-962c-4cd2-9c9e-21b0ea334052', name: 'Brett', notes:[note1, note2, note3]}, function(err, user1) {
            //if (err) throw err;

            getOrCreate(UserMdl, {_id:'50f56eed-95d7-4075-97d8-56453a798c79', name: 'Todd', notes: [note4]}, function(err, user2) {
              //if (err) throw err;

              getOrCreate(ProjectMdl, {_id:'5c2c899b-10e8-481b-86da-c5d50eac1fd2', name: 'Couchnode', owner: user1}, function(err, project1) {
                //if (err) throw err;

                getOrCreate(ProjectMdl, {_id:'a75c6f20-e362-4358-935c-5741d8944c25', name: 'Ottoman', owner: user1}, function(err, project2) {
                  //if (err) throw err;

                  getOrCreate(ProjectMdl, {_id:'77827508-50f8-44bb-85c1-50ca8a1db2e3', name: 'BikeShop', owner: user2}, function(err, project3) {
                    //if (err) throw err;

                    getOrCreate(GroupMdl, {_id:'4f152aca-bdfc-4d6f-ba5e-a3078ea90e89', name: 'Cool Cats', users: [user1, user2]}, function(err, group1) {
                      //if (err) throw err;

                      doOtherStuff();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  //*/
});
return;





var UserMdl = ottoman.model('User', {
  name: 'string'
});

var user = new UserMdl({
  name: 'Brett Lawson'
});

console.log(user);
console.log(user.id());

var userx = UserMdl.ref(user.id());
console.log(userx);
console.log(userx.id());

return;

function PhoneValidator(val) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if(!val.match(phoneno)) {
    throw new Error('Phone number is invalid.');
  }
}

var UsersMdl = ottoman.model('Users', {
  phone: {
    type: 'string',
    validator: PhoneValidator
  }
});

var user = new UsersMdl();
user.phone = '506-871-8108';
user.save(function(err) {
  console.log('ERR', err);
});


return;



console.log(UsersMdl.schema.fields);

var users = new UsersMdl();
users.mylist.push(new UserMdl({name:'Brett'}));
users.mylist.push(new UserMdl({name:'Joe'}));
users.mylist.push(new UserMdl({name:'John'}));
console.log(users.toJSON());

var usersCoo = ottoman.toCoo(users);
var usersX = ottoman.fromCoo(usersCoo);

console.log(usersX);

/*
UserMdl.create({name:'Brett'}, function(err, ux) {
  console.log(err, ux);

  UserMdl.create({name: 'Joe'}, function(err, uy) {
    console.log(err, uy);



    process.exit(0);
  });
});
*/

return;


var TestMdl = ottoman.model('Test', {
  name: 'string',
  company: {
    type: 'string',
    default: 'unset'
  },
  when: 'Mixed',
  idx: 'integer',
  user: {
    name: 'string',
    _id: {
      type: 'string',
      auto: 'uuid',
      readonly: true
    },
    creator: {
      name: 'string',
      _id: 'string'
    }
  }
}, {
  id: 'user._id'
});

var x = new TestMdl();
x.user.name = 'Brett19';
var xJson = x.toJSON();

console.log(x);
console.log(xJson);

var y = ottoman.fromCoo(xJson);
console.log(y);


return;

var attemptSchema = ottoman.model('LoginAttempt', {
  ip: { type: 'string', default: '' },
  user: { type: 'string', default: '' },
  time: { type: 'Date', default: Date.now }
});

ottoman.models.LoginAttempt.create({
  ip: 'lol',
  user: 'Brett19'
}, function(err) {
  console.log(err);
  bucket.dump();
});

return;

exports = module.exports = function(app, mongoose) {
  var attemptSchema = new mongoose.Schema({
    ip: { type: String, default: '' },
    user: { type: String, default: '' },
    time: { type: Date, default: Date.now, expires: app.config.loginAttempts.logExpiration }
  });
  attemptSchema.index({ ip: 1 });
  attemptSchema.index({ user: 1 });
  attemptSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('LoginAttempt', attemptSchema);
};

return;

var TestMdl = ottoman.model('Test', {
  name: 'string',
  company: {
    type: 'string',
    default: 'unset'
  },
  when: 'Mixed',
  idx: 'integer',
  user: {
    name: 'string',
    _id: {
      type: 'string',
      auto: 'uuid',
      readonly: true
    },
    creator: {
      name: 'string',
      _id: 'string'
    }
  }
}, {
  id: 'user._id',
  index: {
    findByCompany: {
      type: 'view',
      by: 'company'
    },
    getByIdx: {
      type: 'refdoc',
      by: 'idx'
    }
  },
  queries: {
    topPosts: {
      of: 'Post',
      by: 'creator'
    }
  }
});

var PostMdl = ottoman.model('Post', {
  creator: { type: TestMdl, ref: true },
  company: 'string'
});

//console.log(util.inspect(TestMdl, {depth:100}));
var x = new TestMdl();
x.idx = 14;
x.when = new Date();
x.company = 'Couchbase';
console.log(util.inspect(x, {depth:100}));
console.log(util.inspect(x.toJSON(), {depth:100}));

var y = new TestMdl();
y.idx = 20;
y.company = 'VMware';

var z = new PostMdl();
z.creator = y;
z.company = 'Couchbase';

z.save(function(err) {
  console.log('SAVED z', err);

  y.save(function(err) {
    console.log('SAVED y', err);

    x.save(function (err) {
      console.log('SAVED1', err);
      bucket.dump();

      TestMdl.getByIdx(14, function (err, resObjs) {
        console.log('GET', err, res);

        var res = resObjs[0];
        res.idx = 12;
        res.save(function (err) {
          console.log('SAVED2', err);
          bucket.dump();

          console.log(res.toJSON());
          ottoman.ensureIndices(function () {
            console.log('Ensured Indexes');
            bucket.dump();


            TestMdl.findByCompany('Couchbase', function(err, res) {
              console.log('FOUND', err, res);
              console.log(z.toJSON());

              y.topPosts(function(err, res) {
                console.log('TOP POSTS', err, res);
              });
            });

          });
        });
      });

      /*
       var xRef = TestMdl.ref(x.id());
       console.log(xRef);

       xRef.load(function(err) {
       console.log('LOADED', err);
       console.log(xRef);

       TestMdl.getById(x.id(), function(err, xFound) {
       console.log('LOADED', err);
       console.log(xFound);
       });
       });
       */
    });
  });
});

return;
/*
try {
  x._id = 'TEST-FAIL';
} catch (e) {
  console.log('EXCEPT: ', e);
}
console.log(x._id);
*/

console.log(JSON.stringify(x));
console.log(x.id());

console.log('x:', x.loaded(), x);
var xCoo = ottoman.toCoo(x);
console.log('y:', xCoo);
var xObj = ottoman.fromCoo(xCoo);
console.log('z:', xObj.loaded(), xObj);



/*
console.log('Registered Models:');
for (var i in ottoman.models) {
  console.log('  - ' + i);
}
*/
