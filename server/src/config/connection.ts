import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

console.log('Attempting to connect to MongoDB...');
console.log('Current directory:', process.cwd());
console.log('MONGODB_URI value:', process.env.MONGODB_URI);
console.log('Connection URI exists:', !!process.env.MONGODB_URI);
console.log('Using URI:', uri);

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB.');
    console.log('Connected to:', process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

export default mongoose.connection;