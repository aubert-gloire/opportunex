import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import YouthProfile from '../models/YouthProfile.js';
import EmployerProfile from '../models/EmployerProfile.js';
import Job from '../models/Job.js';
import SkillTest from '../models/SkillTest.js';
import Course from '../models/Course.js';

dotenv.config();

// Sample data
const adminUser = {
  firstName: 'Admin',
  lastName: 'OpportuneX',
  email: process.env.ADMIN_EMAIL || 'admin@opportunex.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  role: 'admin',
  isVerified: true,
  isActive: true,
};

const sampleYouth = {
  firstName: 'Jean',
  lastName: 'Uwimana',
  email: 'jean.uwimana@example.com',
  password: 'password123',
  role: 'youth',
  isVerified: true,
};

const sampleEmployer = {
  firstName: 'Alice',
  lastName: 'Mukamana',
  email: 'alice@techcompany.rw',
  password: 'password123',
  role: 'employer',
  isVerified: true,
};

const skillTests = [
  {
    title: 'JavaScript Fundamentals',
    category: 'Technical',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and control flow',
    difficulty: 'beginner',
    duration: 30,
    passingScore: 70,
    questions: [
      {
        question: 'Which keyword is used to declare a variable in JavaScript?',
        options: ['var', 'let', 'const', 'All of the above'],
        correctAnswer: 3,
        points: 1,
      },
      {
        question: 'What is the correct way to write a JavaScript array?',
        options: ['var colors = "red", "green", "blue"', 'var colors = (1:"red", 2:"green", 3:"blue")', 'var colors = ["red", "green", "blue"]', 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")'],
        correctAnswer: 2,
        points: 1,
      },
      {
        question: 'How do you create a function in JavaScript?',
        options: ['function myFunction()', 'function:myFunction()', 'function = myFunction()', 'def myFunction()'],
        correctAnswer: 0,
        points: 1,
      },
      {
        question: 'What is the output of: typeof null',
        options: ['null', 'undefined', 'object', 'number'],
        correctAnswer: 2,
        points: 1,
      },
      {
        question: 'Which method is used to add an element at the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 0,
        points: 1,
      },
    ],
    isActive: true,
  },
  {
    title: 'Communication Skills Assessment',
    category: 'Soft Skills',
    description: 'Evaluate your professional communication and interpersonal skills',
    difficulty: 'beginner',
    duration: 20,
    passingScore: 70,
    questions: [
      {
        question: 'What is the most important aspect of effective communication?',
        options: ['Speaking loudly', 'Active listening', 'Using big words', 'Talking fast'],
        correctAnswer: 1,
        points: 1,
      },
      {
        question: 'In professional emails, what should you always include?',
        options: ['Emojis', 'Slang', 'Clear subject line', 'Multiple colors'],
        correctAnswer: 2,
        points: 1,
      },
      {
        question: 'When giving a presentation, you should:',
        options: ['Read directly from slides', 'Make eye contact with audience', 'Face away from audience', 'Speak in monotone'],
        correctAnswer: 1,
        points: 1,
      },
    ],
    isActive: true,
  },
  {
    title: 'Project Management Basics',
    category: 'Business',
    description: 'Test your understanding of project management principles and methodologies',
    difficulty: 'intermediate',
    duration: 25,
    passingScore: 75,
    questions: [
      {
        question: 'What does "Agile" methodology emphasize?',
        options: ['Rigid planning', 'Iterative development', 'No documentation', 'Waterfall approach'],
        correctAnswer: 1,
        points: 1,
      },
      {
        question: 'What is a "sprint" in Scrum?',
        options: ['A running race', 'A time-boxed iteration', 'A project deadline', 'A team meeting'],
        correctAnswer: 1,
        points: 1,
      },
      {
        question: 'Which tool is commonly used for project tracking?',
        options: ['Microsoft Paint', 'Trello', 'Calculator', 'Notepad'],
        correctAnswer: 1,
        points: 1,
      },
    ],
    isActive: true,
  },
];

const sampleCourses = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch. Build real-world projects using HTML, CSS, JavaScript, React, Node.js and MongoDB. Perfect for beginners wanting to start a career in tech.',
    instructor: {
      name: 'Dr. Emmanuel Nsanzimana',
      title: 'Senior Software Engineer',
      avatar: '',
      bio: 'Former Google engineer with 10+ years of experience teaching web development',
    },
    category: 'Technical',
    sector: 'Technology',
    level: 'beginner',
    thumbnail: '',
    price: 0,
    currency: 'RWF',
    lessons: [
      {
        title: 'Introduction to Web Development',
        description: 'Learn what web development is, the technologies used, and what you will learn in this course. Understand the difference between frontend and backend development.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 15,
        content: 'Web development is the process of creating websites and web applications. In this lesson, we cover the fundamentals and roadmap for becoming a web developer.',
        resources: [
          {
            title: 'Web Development Roadmap',
            url: 'https://roadmap.sh/frontend',
            type: 'link',
          },
        ],
        order: 0,
      },
      {
        title: 'HTML Basics',
        description: 'Master HTML tags, elements, and semantic markup. Learn how to structure web pages properly.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 30,
        content: 'HTML (HyperText Markup Language) is the backbone of every website. Learn about headings, paragraphs, links, images, and more.',
        resources: [],
        order: 1,
      },
      {
        title: 'CSS Fundamentals',
        description: 'Style your web pages with CSS. Learn selectors, properties, the box model, and responsive design.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 45,
        content: 'CSS (Cascading Style Sheets) makes your websites beautiful. Master layout, colors, typography, and modern CSS features.',
        resources: [],
        order: 2,
      },
      {
        title: 'JavaScript Introduction',
        description: 'Get started with JavaScript programming. Variables, data types, functions, and control flow.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 50,
        content: 'JavaScript brings interactivity to websites. Learn the fundamentals of programming with JavaScript.',
        resources: [],
        order: 3,
      },
      {
        title: 'Building Your First Project',
        description: 'Apply what you have learned by building a complete website from scratch.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 60,
        content: 'Put your skills to practice by building a portfolio website. Learn best practices and deployment.',
        resources: [],
        order: 4,
      },
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'Web Development'],
    prerequisites: ['Basic computer skills', 'Passion for learning'],
    learningOutcomes: [
      'Build responsive websites from scratch',
      'Understand HTML, CSS, and JavaScript fundamentals',
      'Create interactive web applications',
      'Deploy your projects to the web',
      'Start your career as a web developer',
    ],
    isPublished: true,
    certificate: {
      enabled: true,
      passingPercentage: 80,
    },
  },
  {
    title: 'Digital Marketing Essentials',
    description: 'Master digital marketing strategies including SEO, social media marketing, content marketing, and analytics. Learn how to grow businesses online.',
    instructor: {
      name: 'Grace Uwase',
      title: 'Digital Marketing Strategist',
      avatar: '',
      bio: 'Helped 50+ Rwandan businesses grow their online presence',
    },
    category: 'Marketing',
    sector: 'Business',
    level: 'beginner',
    thumbnail: '',
    price: 0,
    currency: 'RWF',
    lessons: [
      {
        title: 'Introduction to Digital Marketing',
        description: 'Overview of digital marketing channels, strategies, and how businesses grow online.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 20,
        content: 'Digital marketing encompasses all marketing efforts that use the internet. Learn about SEO, social media, email marketing, and more.',
        resources: [],
        order: 0,
      },
      {
        title: 'Social Media Marketing',
        description: 'Learn how to use Facebook, Instagram, Twitter, and LinkedIn to grow your brand.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 35,
        content: 'Social media is a powerful tool for reaching customers. Learn content creation, engagement strategies, and advertising.',
        resources: [],
        order: 1,
      },
      {
        title: 'SEO Fundamentals',
        description: 'Search Engine Optimization techniques to rank higher on Google and drive organic traffic.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 40,
        content: 'SEO helps your website appear in search results. Learn keyword research, on-page optimization, and link building.',
        resources: [],
        order: 2,
      },
      {
        title: 'Content Marketing Strategy',
        description: 'Create compelling content that attracts and converts customers.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 30,
        content: 'Content is king in digital marketing. Learn how to create blogs, videos, and other content that drives results.',
        resources: [],
        order: 3,
      },
    ],
    skills: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing'],
    prerequisites: ['Basic internet usage', 'Interest in marketing'],
    learningOutcomes: [
      'Create effective digital marketing campaigns',
      'Use social media to grow your brand',
      'Optimize websites for search engines',
      'Develop content marketing strategies',
      'Measure and analyze marketing performance',
    ],
    isPublished: true,
    certificate: {
      enabled: true,
      passingPercentage: 75,
    },
  },
  {
    title: 'Professional Communication Skills',
    description: 'Master workplace communication including emails, presentations, meetings, and interpersonal skills. Essential for career success.',
    instructor: {
      name: 'Patrick Habimana',
      title: 'Corporate Communication Coach',
      avatar: '',
      bio: 'Trained over 1000 professionals in effective communication',
    },
    category: 'Soft Skills',
    sector: 'Business',
    level: 'beginner',
    thumbnail: '',
    price: 0,
    currency: 'RWF',
    lessons: [
      {
        title: 'Effective Email Communication',
        description: 'Write professional emails that get results. Learn proper structure, tone, and etiquette.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 25,
        content: 'Email is a primary communication tool in business. Learn how to write clear, professional emails.',
        resources: [],
        order: 0,
      },
      {
        title: 'Presentation Skills',
        description: 'Deliver compelling presentations with confidence. Master storytelling and visual design.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 35,
        content: 'Great presentations can change minds and win opportunities. Learn structure, delivery, and slide design.',
        resources: [],
        order: 1,
      },
      {
        title: 'Active Listening',
        description: 'Improve your listening skills to better understand colleagues and clients.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 20,
        content: 'Listening is as important as speaking. Learn techniques for active listening and empathetic communication.',
        resources: [],
        order: 2,
      },
      {
        title: 'Conflict Resolution',
        description: 'Handle workplace conflicts professionally and maintain positive relationships.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 30,
        content: 'Conflicts are inevitable in the workplace. Learn how to address them constructively.',
        resources: [],
        order: 3,
      },
    ],
    skills: ['Communication', 'Presentation', 'Active Listening', 'Conflict Resolution'],
    prerequisites: ['None'],
    learningOutcomes: [
      'Write professional business emails',
      'Deliver confident presentations',
      'Practice active listening',
      'Resolve workplace conflicts',
      'Build stronger professional relationships',
    ],
    isPublished: true,
    certificate: {
      enabled: true,
      passingPercentage: 70,
    },
  },
  {
    title: 'Data Analysis with Excel',
    description: 'Learn data analysis using Microsoft Excel. Master formulas, pivot tables, charts, and data visualization for business insights.',
    instructor: {
      name: 'Sarah Mukankusi',
      title: 'Data Analyst & Excel Expert',
      avatar: '',
      bio: 'Certified Microsoft Excel Expert with 8 years of corporate experience',
    },
    category: 'Business',
    sector: 'Finance',
    level: 'intermediate',
    thumbnail: '',
    price: 0,
    currency: 'RWF',
    lessons: [
      {
        title: 'Excel Basics and Interface',
        description: 'Get comfortable with Excel interface, worksheets, and basic operations.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 20,
        content: 'Excel is the most widely used tool for data analysis. Learn the basics of the interface and navigation.',
        resources: [],
        order: 0,
      },
      {
        title: 'Formulas and Functions',
        description: 'Master essential Excel formulas including SUM, AVERAGE, VLOOKUP, IF, and more.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 45,
        content: 'Formulas are the power of Excel. Learn the most important functions for data analysis.',
        resources: [],
        order: 1,
      },
      {
        title: 'Pivot Tables',
        description: 'Create powerful pivot tables to summarize and analyze large datasets.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 40,
        content: 'Pivot tables are essential for data analysis. Learn how to create and customize them for insights.',
        resources: [],
        order: 2,
      },
      {
        title: 'Data Visualization',
        description: 'Create impactful charts and graphs to communicate your findings.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 35,
        content: 'Visualizations make data easier to understand. Learn to create professional charts and dashboards.',
        resources: [],
        order: 3,
      },
    ],
    skills: ['Excel', 'Data Analysis', 'Pivot Tables', 'Data Visualization'],
    prerequisites: ['Basic computer skills', 'Microsoft Excel installed'],
    learningOutcomes: [
      'Use Excel formulas and functions effectively',
      'Create and customize pivot tables',
      'Build data visualizations and dashboards',
      'Analyze business data for insights',
      'Present data-driven recommendations',
    ],
    isPublished: true,
    certificate: {
      enabled: true,
      passingPercentage: 75,
    },
  },
];

const seed = async () => {
  try {
    console.log('🌱 Starting database seed...');

    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await YouthProfile.deleteMany({});
    await EmployerProfile.deleteMany({});
    await Job.deleteMany({});
    await SkillTest.deleteMany({});
    await Course.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create(adminUser);
    console.log(`✅ Admin created: ${admin.email}`);

    // Create sample youth user
    console.log('👤 Creating sample youth user...');
    const youth = await User.create(sampleYouth);
    await YouthProfile.create({
      user: youth._id,
      university: 'University of Rwanda',
      major: 'Computer Science',
      graduationYear: 2024,
      bio: 'Passionate software developer with experience in web development',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Communication'],
      location: 'Kigali',
      preferredSectors: ['Technology', 'Business'],
      availableForWork: true,
    });
    console.log(`✅ Youth user created: ${youth.email}`);

    // Create sample employer user
    console.log('👤 Creating sample employer user...');
    const employer = await User.create(sampleEmployer);
    await EmployerProfile.create({
      user: employer._id,
      companyName: 'TechRwanda Ltd',
      industry: 'Technology',
      companySize: '11-50',
      description: 'Leading technology company in Rwanda focused on innovative solutions',
      location: 'Kigali',
      website: 'https://techrwanda.com',
      isVerifiedEmployer: true,
    });
    console.log(`✅ Employer created: ${employer.email}`);

    // Create sample jobs
    console.log('💼 Creating sample jobs...');
    await Job.create([
      {
        employer: employer._id,
        title: 'Junior Software Developer',
        description: 'We are seeking a talented junior developer to join our growing team. You will work on exciting projects using modern technologies and have opportunities to learn from experienced developers.',
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          '1+ years of programming experience',
          'Strong problem-solving skills',
        ],
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        type: 'full-time',
        sector: 'Technology',
        location: 'Kigali',
        isRemote: false,
        salaryRange: {
          min: 500000,
          max: 800000,
          currency: 'RWF',
        },
        status: 'open',
      },
      {
        employer: employer._id,
        title: 'Frontend Developer Internship',
        description: 'Great opportunity for students to gain real-world experience in frontend development. You will work on various client projects and learn industry best practices.',
        requirements: [
          'Currently pursuing or recently completed degree in IT',
          'Basic knowledge of HTML, CSS, JavaScript',
          'Eagerness to learn',
        ],
        requiredSkills: ['HTML', 'CSS', 'JavaScript'],
        type: 'internship',
        sector: 'Technology',
        location: 'Kigali',
        isRemote: true,
        salaryRange: {
          min: 200000,
          max: 300000,
          currency: 'RWF',
        },
        status: 'open',
      },
      {
        employer: employer._id,
        title: 'Business Analyst',
        description: 'We need a detail-oriented business analyst to help us optimize our business processes and drive data-informed decisions.',
        requirements: [
          'Bachelor\'s degree in Business, Finance, or related field',
          'Strong analytical skills',
          'Excellent communication skills',
        ],
        requiredSkills: ['Data Analysis', 'Excel', 'Communication', 'Problem Solving'],
        type: 'full-time',
        sector: 'Business',
        location: 'Kigali',
        isRemote: false,
        salaryRange: {
          min: 600000,
          max: 900000,
          currency: 'RWF',
        },
        status: 'open',
      },
    ]);
    console.log('✅ Sample jobs created');

    // Create skill tests
    console.log('📝 Creating skill tests...');
    for (const test of skillTests) {
      await SkillTest.create(test);
    }
    console.log('✅ Skill tests created');

    // Create sample courses
    console.log('📚 Creating sample courses...');
    for (const course of sampleCourses) {
      await Course.create(course);
    }
    console.log('✅ Sample courses created');

    console.log('\n✨ Database seeded successfully!\n');
    console.log('📧 Login credentials:');
    console.log('   Admin: admin@opportunex.com / Admin@123456');
    console.log('   Youth: jean.uwimana@example.com / password123');
    console.log('   Employer: alice@techcompany.rw / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
