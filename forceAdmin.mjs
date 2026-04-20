import mongoose from 'mongoose';

async function update() {
   await mongoose.connect('mongodb://localhost:27017/aurelia');
   const res = await mongoose.connection.db.collection('users').updateOne(
      {email: 'admin@aurelia.com'},
      {$set: {role: 'admin'}}
   );
   console.log("Updated db successfully", res);
   process.exit(0);
}
update();
