import Redis from 'ioredis';

// Create a Redis client with the correct configuration

const redisClient = new Redis({
  host: 'redis-12468.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
  port: 12468, 
  username: 'default', 
  password: 'YEnEN5OwMrFue9NSXvcPLXoopmOgekYq', 
  connectTimeout: 10000, 
});

// Event listeners for connection and error handling
redisClient.on('connect', () => {
  console.log('ioredis: Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.error('ioredis: Redis connection error:', err.message);
});


export default redisClient;
