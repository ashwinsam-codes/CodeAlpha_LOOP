const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/loop';

// Real photograph portraits (high quality Unsplash photo portraits, strictly realistic humans)
const sampleUsersData = [
  {
    username: 'sarah_j',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Photographer & coffee enthusiast based in Seattle ☕ Capturing everyday calm.'
  },
  {
    username: 'marcus_c',
    name: 'Marcus Chen',
    email: 'marcus@example.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Architectural designer. Minimal spaces, natural light, and clean structures 📐'
  },
  {
    username: 'elena_r',
    name: 'Elena Rostova',
    email: 'elena@example.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Book lover, artisan baker, and weekend trail walker 🥖🌿 Living slowly.'
  },
  {
    username: 'david_m',
    name: 'David Miller',
    email: 'david@example.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Landscape & nature photographer. Chasing light across the Pacific Northwest 🌲'
  },
  {
    username: 'maya_p',
    name: 'Maya Patel',
    email: 'maya@example.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Software engineer building modern web tools. Plant mom & matcha drinker 🍵'
  },
  {
    username: 'alex_r',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    bio: 'Urban runner & street explorer. Sharing authentic moments from city life 🏃‍♂️'
  }
];

// Realistic photos of places, food, everyday life, and natural scenes
const samplePostsData = [
  {
    userIndex: 0, // Sarah
    content: 'Quiet morning at the local cafe before the rush. Fresh brew, natural sunlight, and a quiet moment to plan the week ahead. ☕✨',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    comments: [
      { userIndex: 1, text: 'Love the warm lighting in this shot!' },
      { userIndex: 2, text: 'The best way to start any morning.' }
    ]
  },
  {
    userIndex: 1, // Marcus
    content: 'Exploring concrete geometry and shadow interplay in the new downtown cultural center. Good architecture doesn’t shout; it breathes.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    comments: [
      { userIndex: 0, text: 'Incredible angles, Marcus!' },
      { userIndex: 4, text: 'Clean and timeless aesthetic.' }
    ]
  },
  {
    userIndex: 2, // Elena
    content: 'Fresh sourdough boule straight out of the Dutch oven this morning! Nothing beats that crispy blistered crust and aroma filling the kitchen. 🥖🍞',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    comments: [
      { userIndex: 5, text: 'That crust looks absolutely perfect!' },
      { userIndex: 3, text: 'Send a loaf over here please haha!' }
    ]
  },
  {
    userIndex: 3, // David
    content: 'Sunrise over the cascade mountain ridge. Stood in the freezing mist for two hours waiting for the golden hour break — completely worth every second.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    comments: [
      { userIndex: 1, text: 'Breathtaking depth of field David.' },
      { userIndex: 0, text: 'Nature at its finest. Beautiful capture!' }
    ]
  },
  {
    userIndex: 4, // Maya
    content: 'Resetting my home workspace for a productive week. Natural oak wood, gentle green leaves, and zero cable clutter. Ready to build! 💻🌿',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    comments: [
      { userIndex: 1, text: 'The dream desk setup right there.' }
    ]
  },
  {
    userIndex: 5, // Alex
    content: 'Sunset 10k run along the coastal promenade. The cool evening breeze and the pastel sky were the ultimate recharge after a busy day.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    comments: [
      { userIndex: 3, text: 'Coast runs hit completely different. Great pace!' }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB at', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected.');

    // Clear existing collections
    console.log('[Seed] Clearing existing Users and Posts...');
    await User.deleteMany({});
    await Post.deleteMany({});

    // Hash common password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    console.log('[Seed] Creating sample users...');
    const createdUsers = [];
    for (const u of sampleUsersData) {
      const user = new User({
        ...u,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
    }
    console.log(`[Seed] Created ${createdUsers.length} realistic user accounts.`);

    // Setup mutual following
    createdUsers[0].following.push(createdUsers[1]._id, createdUsers[2]._id, createdUsers[3]._id);
    createdUsers[0].followers.push(createdUsers[1]._id, createdUsers[4]._id);

    createdUsers[1].following.push(createdUsers[0]._id, createdUsers[2]._id);
    createdUsers[1].followers.push(createdUsers[0]._id, createdUsers[3]._id);

    createdUsers[2].following.push(createdUsers[0]._id, createdUsers[3]._id);
    createdUsers[2].followers.push(createdUsers[0]._id, createdUsers[1]._id, createdUsers[5]._id);

    createdUsers[3].following.push(createdUsers[0]._id, createdUsers[1]._id);
    createdUsers[3].followers.push(createdUsers[0]._id, createdUsers[2]._id);

    createdUsers[4].following.push(createdUsers[0]._id, createdUsers[1]._id);
    createdUsers[4].followers.push(createdUsers[5]._id);

    createdUsers[5].following.push(createdUsers[2]._id, createdUsers[4]._id);
    createdUsers[5].followers.push(createdUsers[4]._id);

    for (const u of createdUsers) {
      await u.save();
    }

    console.log('[Seed] Creating sample posts and comments...');
    for (const postData of samplePostsData) {
      const author = createdUsers[postData.userIndex];

      const postComments = postData.comments.map((c) => ({
        user: createdUsers[c.userIndex]._id,
        text: c.text,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 36000000))
      }));

      // Random likes
      const likes = createdUsers
        .filter((_, idx) => idx !== postData.userIndex && Math.random() > 0.3)
        .map((u) => u._id);

      const post = new Post({
        user: author._id,
        content: postData.content,
        image: postData.image,
        likes,
        comments: postComments,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 2))
      });

      await post.save();
    }

    console.log('[Seed] Seed completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Sample test accounts created (Password for all: password123):');
    createdUsers.forEach((u) => {
      console.log(` - @${u.username} (${u.email}) - ${u.name}`);
    });
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
}

seedDatabase();
