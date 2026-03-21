import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import YouthProfile from '../models/YouthProfile.js';
import EmployerProfile from '../models/EmployerProfile.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import SkillTest from '../models/SkillTest.js';
import SkillResult from '../models/SkillResult.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import MentorshipSession from '../models/MentorshipSession.js';
import Payment from '../models/Payment.js';

dotenv.config();

// ─── Helpers ────────────────────────────────────────────────────────────────
const daysAgo  = (n) => new Date(Date.now() - n * 86_400_000);
const daysAhead = (n) => new Date(Date.now() + n * 86_400_000);

// ─── Users ───────────────────────────────────────────────────────────────────
const ADMIN = {
  firstName: 'Admin', lastName: 'OpportuneX',
  email: process.env.ADMIN_EMAIL || 'admin@opportunex.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  role: 'admin', isVerified: true, isActive: true,
};

const YOUTH_USERS = [
  { firstName: 'Jean',     lastName: 'Uwimana',     email: 'jean.uwimana@example.com',     password: 'password123', role: 'youth', isVerified: true },
  { firstName: 'Amina',    lastName: 'Habimana',    email: 'amina.habimana@example.com',    password: 'password123', role: 'youth', isVerified: true },
  { firstName: 'Eric',     lastName: 'Nkurunziza',  email: 'eric.nkurunziza@example.com',   password: 'password123', role: 'youth', isVerified: true },
  { firstName: 'Diane',    lastName: 'Mukamana',    email: 'diane.mukamana@example.com',    password: 'password123', role: 'youth', isVerified: true },
  { firstName: 'Patrick',  lastName: 'Nzeyimana',   email: 'patrick.nzeyimana@example.com', password: 'password123', role: 'youth', isVerified: true },
  { firstName: 'Clarisse', lastName: 'Uwase',       email: 'clarisse.uwase@example.com',    password: 'password123', role: 'youth', isVerified: true },
  { firstName: 'Kevin',    lastName: 'Mugisha',     email: 'kevin.mugisha@example.com',     password: 'password123', role: 'youth', isVerified: true },
];

const EMPLOYER_USERS = [
  { firstName: 'Alice',   lastName: 'Mukamana',  email: 'alice@techrwanda.rw',    password: 'password123', role: 'employer', isVerified: true },
  { firstName: 'Robert',  lastName: 'Kayitare',  email: 'robert@bankrwanda.rw',   password: 'password123', role: 'employer', isVerified: true },
  { firstName: 'Sophie',  lastName: 'Ingabire',  email: 'sophie@healthplus.rw',   password: 'password123', role: 'employer', isVerified: true },
  { firstName: 'David',   lastName: 'Hakizimana',email: 'david@buildright.rw',    password: 'password123', role: 'employer', isVerified: true },
];

// ─── Skill Tests ──────────────────────────────────────────────────────────────
const SKILL_TESTS = [
  {
    title: 'JavaScript Fundamentals',
    category: 'Technical', difficulty: 'beginner',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and control flow.',
    duration: 30, passingScore: 70, isActive: true,
    questions: [
      { question: 'Which keyword is used to declare a variable in JavaScript?', options: ['var','let','const','All of the above'], correctAnswer: 3, points: 1 },
      { question: 'What is the correct way to write a JavaScript array?', options: ['var colors = "red","green"','var colors = (1:"red")', 'var colors = ["red","green","blue"]','var colors = 1=("red")'], correctAnswer: 2, points: 1 },
      { question: 'How do you create a function in JavaScript?', options: ['function myFunction()','function:myFunction()','function = myFunction()','def myFunction()'], correctAnswer: 0, points: 1 },
      { question: 'What is the output of: typeof null?', options: ['null','undefined','object','number'], correctAnswer: 2, points: 1 },
      { question: 'Which method adds an element at the end of an array?', options: ['push()','pop()','shift()','unshift()'], correctAnswer: 0, points: 1 },
    ],
  },
  {
    title: 'Communication Skills Assessment',
    category: 'Soft Skills', difficulty: 'beginner',
    description: 'Evaluate your professional communication and interpersonal skills.',
    duration: 20, passingScore: 70, isActive: true,
    questions: [
      { question: 'What is the most important aspect of effective communication?', options: ['Speaking loudly','Active listening','Using big words','Talking fast'], correctAnswer: 1, points: 1 },
      { question: 'In professional emails, what should you always include?', options: ['Emojis','Slang','Clear subject line','Multiple colors'], correctAnswer: 2, points: 1 },
      { question: 'When giving a presentation, you should:', options: ['Read directly from slides','Make eye contact with audience','Face away from audience','Speak in monotone'], correctAnswer: 1, points: 1 },
    ],
  },
  {
    title: 'Project Management Basics',
    category: 'Business', difficulty: 'intermediate',
    description: 'Test your understanding of project management principles and methodologies.',
    duration: 25, passingScore: 75, isActive: true,
    questions: [
      { question: 'What does "Agile" methodology emphasize?', options: ['Rigid planning','Iterative development','No documentation','Waterfall approach'], correctAnswer: 1, points: 1 },
      { question: 'What is a "sprint" in Scrum?', options: ['A running race','A time-boxed iteration','A project deadline','A team meeting'], correctAnswer: 1, points: 1 },
      { question: 'Which tool is commonly used for project tracking?', options: ['Microsoft Paint','Trello','Calculator','Notepad'], correctAnswer: 1, points: 1 },
    ],
  },
  {
    title: 'Python Programming Basics',
    category: 'Technical', difficulty: 'beginner',
    description: 'Assess foundational Python programming knowledge for data and software roles.',
    duration: 30, passingScore: 70, isActive: true,
    questions: [
      { question: 'Which of the following is the correct syntax to print in Python?', options: ['print("Hello")','echo("Hello")','console.log("Hello")','printf("Hello")'], correctAnswer: 0, points: 1 },
      { question: 'How do you create a list in Python?', options: ['list = {}','list = []','list = ()','list = <>'], correctAnswer: 1, points: 1 },
      { question: 'What keyword is used to define a function in Python?', options: ['function','def','func','lambda'], correctAnswer: 1, points: 1 },
      { question: 'What does len() return?', options: ['Sum of elements','Number of elements','Type of variable','Last element'], correctAnswer: 1, points: 1 },
      { question: 'Which operator is used for integer division in Python?', options: ['/','//','%','**'], correctAnswer: 1, points: 1 },
    ],
  },
  {
    title: 'Financial Literacy & Analysis',
    category: 'Business', difficulty: 'intermediate',
    description: 'Test your understanding of financial concepts, analysis, and business finance fundamentals.',
    duration: 35, passingScore: 70, isActive: true,
    questions: [
      { question: 'What does ROI stand for?', options: ['Return on Investment','Rate of Interest','Revenue over Income','Risk of Insolvency'], correctAnswer: 0, points: 1 },
      { question: 'A company\'s balance sheet shows:', options: ['Revenue over time','Assets, liabilities, and equity','Cash flow only','Profit and loss'], correctAnswer: 1, points: 1 },
      { question: 'What is working capital?', options: ['Total equity','Current assets minus current liabilities','Net profit','Long-term debt'], correctAnswer: 1, points: 1 },
      { question: 'Gross profit is calculated as:', options: ['Revenue – all expenses','Revenue – cost of goods sold','Net income + taxes','Operating income – depreciation'], correctAnswer: 1, points: 1 },
      { question: 'What is a P&L statement used for?', options: ['Track inventory','Show profitability over a period','List company assets','Manage payroll'], correctAnswer: 1, points: 1 },
    ],
  },
];

// ─── Courses ──────────────────────────────────────────────────────────────────
const COURSES = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch. Build real-world projects using HTML, CSS, JavaScript, React, Node.js and MongoDB.',
    instructor: { name: 'Dr. Emmanuel Nsanzimana', title: 'Senior Software Engineer', bio: 'Former Google engineer with 10+ years teaching web development.' },
    category: 'Technical', sector: 'Technology', level: 'beginner',
    price: 0, currency: 'RWF', isPublished: true,
    skills: ['HTML','CSS','JavaScript','React','Node.js'],
    prerequisites: ['Basic computer skills'],
    learningOutcomes: ['Build responsive websites','Understand HTML/CSS/JS','Create interactive web apps','Deploy to the web'],
    certificate: { enabled: true, passingPercentage: 80 },
    lessons: [
      { title: 'Introduction to Web Development', description: 'Overview of frontend vs backend development.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 15, content: 'Web development fundamentals.', resources: [], order: 0 },
      { title: 'HTML Basics', description: 'Tags, elements, and semantic markup.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 30, content: 'HTML backbone of websites.', resources: [], order: 1 },
      { title: 'CSS Fundamentals', description: 'Selectors, box model, responsive design.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 45, content: 'CSS makes sites beautiful.', resources: [], order: 2 },
      { title: 'JavaScript Introduction', description: 'Variables, functions, control flow.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 50, content: 'JS brings interactivity.', resources: [], order: 3 },
      { title: 'Building Your First Project', description: 'Build a complete website from scratch.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 60, content: 'Portfolio project build.', resources: [], order: 4 },
    ],
  },
  {
    title: 'Digital Marketing Essentials',
    description: 'Master digital marketing strategies including SEO, social media marketing, content marketing, and analytics.',
    instructor: { name: 'Grace Uwase', title: 'Digital Marketing Strategist', bio: 'Helped 50+ Rwandan businesses grow their online presence.' },
    category: 'Marketing', sector: 'Business', level: 'beginner',
    price: 0, currency: 'RWF', isPublished: true,
    skills: ['Digital Marketing','SEO','Social Media','Content Marketing'],
    prerequisites: ['Basic internet usage'],
    learningOutcomes: ['Create digital marketing campaigns','Use social media for brand growth','Optimize for search engines','Develop content strategies'],
    certificate: { enabled: true, passingPercentage: 75 },
    lessons: [
      { title: 'Introduction to Digital Marketing', description: 'Channels and strategies overview.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 20, content: 'Digital marketing landscape.', resources: [], order: 0 },
      { title: 'Social Media Marketing', description: 'Facebook, Instagram, LinkedIn for brand growth.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 35, content: 'Social media strategy.', resources: [], order: 1 },
      { title: 'SEO Fundamentals', description: 'Rank higher on Google and drive traffic.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 40, content: 'Keyword research and on-page SEO.', resources: [], order: 2 },
      { title: 'Content Marketing Strategy', description: 'Create content that attracts and converts.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 30, content: 'Blogs, videos, and engagement.', resources: [], order: 3 },
    ],
  },
  {
    title: 'Professional Communication Skills',
    description: 'Master workplace communication including emails, presentations, meetings, and interpersonal skills.',
    instructor: { name: 'Patrick Habimana', title: 'Corporate Communication Coach', bio: 'Trained over 1,000 professionals in effective communication.' },
    category: 'Soft Skills', sector: 'Business', level: 'beginner',
    price: 0, currency: 'RWF', isPublished: true,
    skills: ['Communication','Presentation','Active Listening','Conflict Resolution'],
    prerequisites: ['None'],
    learningOutcomes: ['Write professional emails','Deliver confident presentations','Practice active listening','Resolve workplace conflicts'],
    certificate: { enabled: true, passingPercentage: 70 },
    lessons: [
      { title: 'Effective Email Communication', description: 'Professional email structure and tone.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 25, content: 'Email best practices.', resources: [], order: 0 },
      { title: 'Presentation Skills', description: 'Deliver compelling presentations with confidence.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 35, content: 'Storytelling and slide design.', resources: [], order: 1 },
      { title: 'Active Listening', description: 'Improve listening skills for better collaboration.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 20, content: 'Techniques for empathetic communication.', resources: [], order: 2 },
      { title: 'Conflict Resolution', description: 'Handle workplace conflicts professionally.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 30, content: 'Constructive conflict management.', resources: [], order: 3 },
    ],
  },
  {
    title: 'Data Analysis with Excel',
    description: 'Learn data analysis using Microsoft Excel. Master formulas, pivot tables, charts, and data visualization for business insights.',
    instructor: { name: 'Sarah Mukankusi', title: 'Data Analyst & Excel Expert', bio: 'Certified Microsoft Excel Expert with 8 years of corporate experience.' },
    category: 'Business', sector: 'Finance', level: 'intermediate',
    price: 0, currency: 'RWF', isPublished: true,
    skills: ['Excel','Data Analysis','Pivot Tables','Data Visualization'],
    prerequisites: ['Basic computer skills','Microsoft Excel installed'],
    learningOutcomes: ['Use Excel formulas effectively','Create pivot tables','Build data dashboards','Analyze business data','Present data-driven recommendations'],
    certificate: { enabled: true, passingPercentage: 75 },
    lessons: [
      { title: 'Excel Basics and Interface', description: 'Get comfortable with Excel worksheets.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 20, content: 'Excel navigation basics.', resources: [], order: 0 },
      { title: 'Formulas and Functions', description: 'SUM, AVERAGE, VLOOKUP, IF, and more.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 45, content: 'Essential Excel formulas.', resources: [], order: 1 },
      { title: 'Pivot Tables', description: 'Summarize and analyze large datasets.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 40, content: 'Pivot table creation and customization.', resources: [], order: 2 },
      { title: 'Data Visualization', description: 'Create impactful charts and graphs.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 35, content: 'Professional charts and dashboards.', resources: [], order: 3 },
    ],
  },
  {
    title: 'Financial Planning & Investment Basics',
    description: 'Understand personal and corporate finance, budgeting, investment principles, and the Rwandan financial landscape.',
    instructor: { name: 'James Nkusi', title: 'Senior Financial Advisor', bio: 'CFA charterholder with 12 years at major Rwandan financial institutions.' },
    category: 'Finance', sector: 'Finance', level: 'intermediate',
    price: 0, currency: 'RWF', isPublished: true,
    skills: ['Finance','Budgeting','Investment','Financial Planning'],
    prerequisites: ['Basic maths','Interest in finance'],
    learningOutcomes: ['Create personal budgets','Understand investment vehicles','Manage risk','Navigate Rwandan capital markets','Build a financial plan'],
    certificate: { enabled: true, passingPercentage: 75 },
    lessons: [
      { title: 'Introduction to Personal Finance', description: 'Budgeting, saving, and managing money.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 25, content: 'Personal finance fundamentals.', resources: [], order: 0 },
      { title: 'Investment Principles', description: 'Stocks, bonds, mutual funds, and risk.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 40, content: 'How investments work.', resources: [], order: 1 },
      { title: 'Rwanda Capital Market Overview', description: 'RSE, BNR regulations, and local instruments.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 30, content: 'Local financial ecosystem.', resources: [], order: 2 },
      { title: 'Building Your Financial Plan', description: 'Set goals and create a personalised plan.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 45, content: 'Goal-based financial planning.', resources: [], order: 3 },
    ],
  },
];

// ─── Main seed function ───────────────────────────────────────────────────────
const seed = async () => {
  try {
    console.log('🌱 Starting comprehensive database seed...\n');
    await connectDB();

    // ── Clear all collections ──────────────────────────────────────────────
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      YouthProfile.deleteMany({}),
      EmployerProfile.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      SkillTest.deleteMany({}),
      SkillResult.deleteMany({}),
      Course.deleteMany({}),
      CourseEnrollment.deleteMany({}),
      MentorshipSession.deleteMany({}),
      Payment.deleteMany({}),
    ]);
    console.log('✅ Collections cleared\n');

    // ── Admin ──────────────────────────────────────────────────────────────
    console.log('👤 Creating admin user...');
    const admin = await User.create(ADMIN);
    console.log(`   Admin: ${admin.email}`);

    // ── Youth Users (create one-by-one so bcrypt pre-save hook fires) ──────
    console.log('\n👥 Creating youth users...');
    const youthUsers = [];
    for (const u of YOUTH_USERS) { youthUsers.push(await User.create(u)); }
    const [jean, amina, eric, diane, patrick, clarisse, kevin] = youthUsers;
    youthUsers.forEach(u => console.log(`   Youth: ${u.email}`));

    // ── Employer Users ─────────────────────────────────────────────────────
    console.log('\n🏢 Creating employer users...');
    const employerUsers = [];
    for (const u of EMPLOYER_USERS) { employerUsers.push(await User.create(u)); }
    const [alice, robert, sophie, david] = employerUsers;
    employerUsers.forEach(u => console.log(`   Employer: ${u.email}`));

    // ── Youth Profiles ─────────────────────────────────────────────────────
    console.log('\n📋 Creating youth profiles...');
    await YouthProfile.create([
      {
        user: jean._id,
        university: 'University of Rwanda', major: 'Computer Science', graduationYear: 2024,
        bio: 'Passionate full-stack developer with a love for building products that solve real problems. Active open-source contributor and hackathon winner.',
        skills: ['JavaScript','React','Node.js','MongoDB','Git','Problem Solving'],
        experience: [{ title: 'Software Intern', company: 'Irembo Ltd', startDate: daysAgo(400), endDate: daysAgo(160), description: 'Developed REST APIs and contributed to the citizen services portal.' }],
        education: [{ institution: 'University of Rwanda', degree: 'BSc', field: 'Computer Science', startDate: daysAgo(1460), endDate: daysAgo(160) }],
        location: 'Kigali',
        preferredSectors: ['Technology','Business'],
        availableForWork: true,
        mentorshipInterests: ['Software Engineering','Career Development','Entrepreneurship'],
        portfolio: [{ title: 'E-Commerce Platform', description: 'Full-stack React/Node e-commerce platform with payment integration.', url: 'https://github.com' }],
      },
      {
        user: amina._id,
        university: 'ALU', major: 'Business & Finance', graduationYear: 2024,
        bio: 'Finance graduate with a strong analytical mindset. Experienced in financial modelling, investment analysis, and corporate strategy. Fluent in Kinyarwanda, French, and English.',
        skills: ['Financial Analysis','Excel','Data Analysis','Communication','Accounting'],
        experience: [{ title: 'Finance Intern', company: 'BPR Bank Rwanda', startDate: daysAgo(300), endDate: daysAgo(90), description: 'Assisted in credit analysis and monthly reporting for SME portfolio.' }],
        education: [{ institution: 'ALU', degree: 'BSc', field: 'Business Administration', startDate: daysAgo(1460), endDate: daysAgo(90) }],
        location: 'Kigali',
        preferredSectors: ['Finance','Business'],
        availableForWork: true,
        mentorshipInterests: ['Finance','Investment Banking','Corporate Strategy'],
      },
      {
        user: eric._id,
        university: 'University of Rwanda', major: 'Civil Engineering', graduationYear: 2023,
        bio: 'Civil engineer with practical experience in infrastructure projects. Skilled in AutoCAD, project supervision, and quality assurance.',
        skills: ['AutoCAD','Project Management','Structural Design','Communication','Problem Solving'],
        experience: [
          { title: 'Site Engineer', company: 'Rwanda Housing Authority', startDate: daysAgo(500), endDate: daysAgo(200), description: 'Supervised residential construction and ensured compliance with building codes.' },
          { title: 'Engineering Intern', company: 'REMA (Rwanda Environment Management Authority)', startDate: daysAgo(700), endDate: daysAgo(500), description: 'Contributed to environmental impact assessments for road projects.' },
        ],
        education: [{ institution: 'University of Rwanda', degree: 'BEng', field: 'Civil Engineering', startDate: daysAgo(1800), endDate: daysAgo(200) }],
        location: 'Kigali',
        preferredSectors: ['Engineering','Business'],
        availableForWork: true,
      },
      {
        user: diane._id,
        university: 'AUCA', major: 'Business Administration', graduationYear: 2024,
        bio: 'Business graduate with a passion for marketing and brand management. Experienced in creating digital campaigns and community engagement strategies.',
        skills: ['Marketing','Digital Marketing','Social Media','Excel','Customer Relations'],
        experience: [{ title: 'Marketing Assistant', company: 'Inyange Industries', startDate: daysAgo(350), endDate: daysAgo(50), description: 'Managed social media accounts and coordinated product launch campaigns.' }],
        education: [{ institution: 'AUCA', degree: 'BBA', field: 'Business Administration', startDate: daysAgo(1500), endDate: daysAgo(50) }],
        location: 'Kigali',
        preferredSectors: ['Business','Technology'],
        availableForWork: true,
        mentorshipInterests: ['Marketing','Brand Management','Entrepreneurship'],
      },
      {
        user: patrick._id,
        university: 'ALU', major: 'Data Science & AI', graduationYear: 2025,
        bio: 'Data science student with strong skills in Python, machine learning, and statistical analysis. Currently researching NLP applications for Kinyarwanda language processing.',
        skills: ['Python','Machine Learning','Data Analysis','SQL','Tableau','Statistical Modelling'],
        experience: [{ title: 'Data Analyst Intern', company: 'RwandAir', startDate: daysAgo(200), endDate: daysAgo(30), description: 'Built dashboards to track passenger trends and operational KPIs using Python and Tableau.' }],
        education: [{ institution: 'ALU', degree: 'BSc', field: 'Data Science & AI', startDate: daysAgo(1200), endDate: daysAhead(180) }],
        location: 'Kigali',
        preferredSectors: ['Technology','Finance'],
        availableForWork: true,
      },
      {
        user: clarisse._id,
        university: 'University of Rwanda', major: 'Public Health', graduationYear: 2024,
        bio: 'Public health graduate passionate about community health programmes and health systems strengthening. Experienced in data collection and health promotion campaigns.',
        skills: ['Public Health','Data Collection','Communication','Research','MS Office'],
        experience: [{ title: 'Health Officer Intern', company: 'Rwanda Biomedical Centre', startDate: daysAgo(400), endDate: daysAgo(100), description: 'Supported malaria prevention campaigns and community health worker training.' }],
        education: [{ institution: 'University of Rwanda', degree: 'BSc', field: 'Public Health', startDate: daysAgo(1500), endDate: daysAgo(100) }],
        location: 'Kigali',
        preferredSectors: ['Healthcare','Education'],
        availableForWork: true,
      },
      {
        user: kevin._id,
        university: 'AUCA', major: 'Marketing & Communications', graduationYear: 2024,
        bio: 'Creative marketing professional with expertise in content creation, brand storytelling, and digital advertising. Fluent in three languages.',
        skills: ['Marketing','Content Creation','Copywriting','Social Media','Adobe Creative Suite','Communication'],
        experience: [{ title: 'Content Creator', company: 'Kigali Today Media', startDate: daysAgo(280), endDate: daysAgo(20), description: 'Produced digital content, articles, and video scripts for a 50k+ audience.' }],
        education: [{ institution: 'AUCA', degree: 'BA', field: 'Marketing & Communications', startDate: daysAgo(1400), endDate: daysAgo(20) }],
        location: 'Kigali',
        preferredSectors: ['Business','Technology'],
        availableForWork: true,
        mentorshipInterests: ['Creative Marketing','Brand Strategy','Media'],
      },
    ]);
    console.log('✅ Youth profiles created');

    // ── Employer Profiles ──────────────────────────────────────────────────
    console.log('\n🏭 Creating employer profiles...');
    const now = new Date();
    const subEnd = daysAhead(365);
    await EmployerProfile.create([
      {
        user: alice._id,
        companyName: 'TechRwanda Ltd',
        industry: 'Technology', companySize: '51-200',
        description: 'Rwanda\'s leading software development company. We build digital products for government, NGOs, and private sector clients across East Africa. Our team of 80+ engineers drives digital transformation.',
        website: 'https://techrwanda.com',
        location: 'Kigali Innovation City, Kigali',
        contactEmail: 'hr@techrwanda.rw',
        contactPhone: '+250 788 001 001',
        tinNumber: 'TRW-001234',
        isVerifiedEmployer: true,
        subscription: { plan: 'premium', startDate: daysAgo(60), endDate: subEnd, isActive: true },
        totalJobsPosted: 8, activeJobsCount: 4,
      },
      {
        user: robert._id,
        companyName: 'BankRwanda Finance',
        industry: 'Finance', companySize: '200+',
        description: 'One of Rwanda\'s largest commercial banks with 45+ branches nationwide. We offer personal banking, SME financing, and investment products. Committed to financial inclusion across the country.',
        website: 'https://bankrwanda.rw',
        location: 'KN 5 Ave, Kigali',
        contactEmail: 'careers@bankrwanda.rw',
        contactPhone: '+250 788 002 002',
        tinNumber: 'BRW-005678',
        isVerifiedEmployer: true,
        subscription: { plan: 'premium', startDate: daysAgo(90), endDate: subEnd, isActive: true },
        totalJobsPosted: 6, activeJobsCount: 3,
      },
      {
        user: sophie._id,
        companyName: 'HealthCare Plus Rwanda',
        industry: 'Healthcare', companySize: '51-200',
        description: 'A modern private healthcare network with 6 clinics across Rwanda. We provide accessible, quality healthcare services combining technology with compassionate patient care.',
        website: 'https://healthcareplus.rw',
        location: 'Kimironko, Kigali',
        contactEmail: 'hr@healthcareplus.rw',
        contactPhone: '+250 788 003 003',
        tinNumber: 'HCP-009012',
        isVerifiedEmployer: true,
        subscription: { plan: 'basic', startDate: daysAgo(30), endDate: daysAhead(335), isActive: true },
        totalJobsPosted: 4, activeJobsCount: 2,
      },
      {
        user: david._id,
        companyName: 'BuildRight Engineering',
        industry: 'Engineering', companySize: '51-200',
        description: 'A premier construction and engineering firm specialising in infrastructure, housing, and commercial developments. Over 120 completed projects across Rwanda with a track record of excellence.',
        website: 'https://buildright.rw',
        location: 'Nyarugenge, Kigali',
        contactEmail: 'jobs@buildright.rw',
        contactPhone: '+250 788 004 004',
        tinNumber: 'BRE-003456',
        isVerifiedEmployer: true,
        subscription: { plan: 'basic', startDate: daysAgo(45), endDate: daysAhead(320), isActive: true },
        totalJobsPosted: 5, activeJobsCount: 3,
      },
    ]);
    console.log('✅ Employer profiles created');

    // ── Jobs ───────────────────────────────────────────────────────────────
    console.log('\n💼 Creating job postings...');
    const jobs = await Job.create([
      // TechRwanda (alice)
      {
        employer: alice._id, title: 'Junior Software Developer',
        description: 'Join our growing engineering team to build digital public services. You\'ll work with senior engineers on REST APIs, web apps, and mobile solutions for millions of Rwandan citizens.',
        requirements: ['BSc in Computer Science or related field','1+ years programming experience','Strong problem-solving skills','Excellent communication'],
        requiredSkills: ['JavaScript','React','Node.js','MongoDB'],
        type: 'full-time', sector: 'Technology', location: 'Kigali', isRemote: false,
        salaryRange: { min: 500000, max: 800000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(30),
      },
      {
        employer: alice._id, title: 'Frontend Developer Internship',
        description: 'A 6-month paid internship for talented students to gain hands-on experience building modern web interfaces. Work directly on live client projects.',
        requirements: ['Currently enrolled or recently graduated in IT/CS','Basic HTML, CSS, JavaScript knowledge','Eagerness to learn'],
        requiredSkills: ['HTML','CSS','JavaScript','React'],
        type: 'internship', sector: 'Technology', location: 'Kigali', isRemote: true,
        salaryRange: { min: 200000, max: 350000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(21),
      },
      {
        employer: alice._id, title: 'Data Engineer',
        description: 'Design and maintain data pipelines, ETL processes, and analytics infrastructure to power TechRwanda\'s data-driven products.',
        requirements: ['BSc in CS, Data Science, or Statistics','2+ years experience with data tools','Strong SQL and Python skills'],
        requiredSkills: ['Python','SQL','Data Analysis','Machine Learning'],
        type: 'full-time', sector: 'Technology', location: 'Kigali', isRemote: false,
        salaryRange: { min: 700000, max: 1100000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(45),
      },
      {
        employer: alice._id, title: 'UX/UI Designer',
        description: 'Craft beautiful, intuitive interfaces for our suite of civic tech products. Lead user research, wireframing, and design sprints.',
        requirements: ['Portfolio demonstrating strong UI design','Proficiency in Figma','Understanding of user research methods'],
        requiredSkills: ['Figma','UI Design','User Research','Adobe Creative Suite'],
        type: 'full-time', sector: 'Technology', location: 'Kigali', isRemote: true,
        salaryRange: { min: 450000, max: 750000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(14),
      },
      // BankRwanda (robert)
      {
        employer: robert._id, title: 'Financial Analyst',
        description: 'Analyse financial data, build models, and generate insights to support lending decisions and portfolio management for our SME banking division.',
        requirements: ['BSc in Finance, Economics, or Accounting','Strong Excel and financial modelling skills','Attention to detail'],
        requiredSkills: ['Financial Analysis','Excel','Data Analysis','Accounting'],
        type: 'full-time', sector: 'Finance', location: 'Kigali', isRemote: false,
        salaryRange: { min: 600000, max: 950000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(25),
      },
      {
        employer: robert._id, title: 'Credit Officer Trainee',
        description: 'Join our 12-month graduate trainee programme in credit analysis. Rotate through SME, retail, and corporate credit teams with structured mentorship.',
        requirements: ['Recent graduate in Finance, Business, or Economics','Strong analytical mindset','Commitment to 12-month programme'],
        requiredSkills: ['Financial Analysis','Communication','Excel','Problem Solving'],
        type: 'full-time', sector: 'Finance', location: 'Kigali', isRemote: false,
        salaryRange: { min: 400000, max: 550000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(18),
      },
      {
        employer: robert._id, title: 'Digital Banking Product Manager',
        description: 'Lead the roadmap for BankRwanda\'s mobile banking app serving 300,000+ customers. Work cross-functionally with engineering, design, and compliance.',
        requirements: ['3+ years in product management or fintech','Experience with mobile products','Strong stakeholder communication'],
        requiredSkills: ['Product Management','Digital Marketing','Communication','Data Analysis'],
        type: 'full-time', sector: 'Finance', location: 'Kigali', isRemote: false,
        salaryRange: { min: 900000, max: 1400000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(40),
      },
      // HealthCare Plus (sophie)
      {
        employer: sophie._id, title: 'Community Health Officer',
        description: 'Lead community outreach programmes, coordinate with local health centres, and drive health promotion initiatives across Kigali and surrounding districts.',
        requirements: ['BSc in Public Health or Nursing','Experience in community health work','Strong communication and fieldwork skills'],
        requiredSkills: ['Public Health','Data Collection','Communication','Research'],
        type: 'full-time', sector: 'Healthcare', location: 'Kigali', isRemote: false,
        salaryRange: { min: 380000, max: 580000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(20),
      },
      {
        employer: sophie._id, title: 'Healthcare Data Analyst',
        description: 'Analyse patient data, clinic performance metrics, and health outcomes to inform clinical decisions and improve service quality across our network.',
        requirements: ['BSc in Public Health, Statistics, or related field','Proficiency in Excel and data tools','Familiarity with healthcare datasets'],
        requiredSkills: ['Data Analysis','Excel','Public Health','Statistical Modelling'],
        type: 'full-time', sector: 'Healthcare', location: 'Kigali', isRemote: false,
        salaryRange: { min: 500000, max: 750000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(28),
      },
      {
        employer: sophie._id, title: 'Health Communications Intern',
        description: 'Support our communications team in creating health awareness content for social media, community flyers, and patient education materials.',
        requirements: ['Studying or recently graduated in Communications, Public Health, or Marketing','Creative writing skills','Interest in public health'],
        requiredSkills: ['Communication','Content Creation','Social Media','Marketing'],
        type: 'internship', sector: 'Healthcare', location: 'Kigali', isRemote: false,
        salaryRange: { min: 150000, max: 250000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(12),
      },
      // BuildRight Engineering (david)
      {
        employer: david._id, title: 'Junior Civil Engineer',
        description: 'Work alongside senior engineers on commercial and residential construction projects. Responsibilities include site supervision, quality control, and technical reporting.',
        requirements: ['BEng in Civil Engineering','Knowledge of AutoCAD and site supervision','Strong attention to detail'],
        requiredSkills: ['AutoCAD','Project Management','Structural Design','Communication'],
        type: 'full-time', sector: 'Engineering', location: 'Kigali', isRemote: false,
        salaryRange: { min: 550000, max: 800000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(30),
      },
      {
        employer: david._id, title: 'Quantity Surveyor',
        description: 'Manage costs and budgets for construction projects. Prepare bills of quantities, tender documents, and cost reports for BuildRight\'s portfolio.',
        requirements: ['BSc in Quantity Surveying or Civil Engineering','Strong numerical and analytical skills','Knowledge of construction costs'],
        requiredSkills: ['Project Management','Excel','Financial Analysis','Communication'],
        type: 'full-time', sector: 'Engineering', location: 'Kigali', isRemote: false,
        salaryRange: { min: 600000, max: 900000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(22),
      },
      {
        employer: david._id, title: 'Construction Site Supervisor (Internship)',
        description: 'Six-month internship for civil engineering students to gain practical site supervision experience on active construction projects.',
        requirements: ['Final year or recently graduated Civil Engineering student','Basic understanding of construction methods','Willingness to work on-site'],
        requiredSkills: ['AutoCAD','Project Management','Communication','Problem Solving'],
        type: 'internship', sector: 'Engineering', location: 'Kigali', isRemote: false,
        salaryRange: { min: 180000, max: 280000, currency: 'RWF' }, status: 'open',
        deadline: daysAhead(15),
      },
      // Closed/filled jobs for analytics
      {
        employer: alice._id, title: 'Backend Developer (Node.js)',
        description: 'Scale TechRwanda\'s microservices architecture handling 500k+ daily API requests.',
        requirements: ['3+ years Node.js experience','Microservices architecture knowledge'],
        requiredSkills: ['Node.js','MongoDB','JavaScript','Docker'],
        type: 'full-time', sector: 'Technology', location: 'Kigali', isRemote: true,
        salaryRange: { min: 800000, max: 1200000, currency: 'RWF' }, status: 'closed',
      },
      {
        employer: robert._id, title: 'Risk Analyst',
        description: 'Assess and mitigate credit, market, and operational risks for the bank.',
        requirements: ['BSc Finance or Actuarial Science','Knowledge of risk frameworks'],
        requiredSkills: ['Financial Analysis','Excel','Communication','Data Analysis'],
        type: 'full-time', sector: 'Finance', location: 'Kigali', isRemote: false,
        salaryRange: { min: 650000, max: 1000000, currency: 'RWF' }, status: 'filled',
      },
      {
        employer: david._id, title: 'Project Manager',
        description: 'Lead end-to-end delivery of large-scale construction projects.',
        requirements: ['5+ years project management experience','PMP certification preferred'],
        requiredSkills: ['Project Management','Communication','Financial Analysis','Problem Solving'],
        type: 'full-time', sector: 'Engineering', location: 'Kigali', isRemote: false,
        salaryRange: { min: 1000000, max: 1600000, currency: 'RWF' }, status: 'filled',
      },
    ]);
    console.log(`✅ ${jobs.length} jobs created`);

    // ── Skill Tests ────────────────────────────────────────────────────────
    console.log('\n📝 Creating skill tests...');
    const tests = await SkillTest.create(SKILL_TESTS);
    const [jsTest, commTest, pmTest, pyTest, finTest] = tests;
    console.log(`✅ ${tests.length} skill tests created`);

    // ── Skill Results & Youth verifiedSkills ──────────────────────────────
    console.log('\n🏅 Creating skill results...');
    // Jean – passed JS test (5/5 = 100%)
    await SkillResult.create({
      user: jean._id, test: jsTest._id,
      score: 5, totalPoints: 5, percentage: 100, passed: true, badge: 'advanced',
      timeTaken: 820,
      answers: [
        { questionIndex: 0, selectedAnswer: 3, isCorrect: true },
        { questionIndex: 1, selectedAnswer: 2, isCorrect: true },
        { questionIndex: 2, selectedAnswer: 0, isCorrect: true },
        { questionIndex: 3, selectedAnswer: 2, isCorrect: true },
        { questionIndex: 4, selectedAnswer: 0, isCorrect: true },
      ],
      completedAt: daysAgo(30),
    });
    await YouthProfile.findOneAndUpdate({ user: jean._id }, {
      $push: { verifiedSkills: { skill: 'JavaScript', score: 100, badge: 'advanced', verifiedAt: daysAgo(30) } },
    });

    // Jean – passed Python test (4/5 = 80%)
    await SkillResult.create({
      user: jean._id, test: pyTest._id,
      score: 4, totalPoints: 5, percentage: 80, passed: true, badge: 'intermediate',
      timeTaken: 1020,
      answers: [
        { questionIndex: 0, selectedAnswer: 0, isCorrect: true },
        { questionIndex: 1, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 2, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 3, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 4, selectedAnswer: 0, isCorrect: false },
      ],
      completedAt: daysAgo(15),
    });
    await YouthProfile.findOneAndUpdate({ user: jean._id }, {
      $push: { verifiedSkills: { skill: 'Python', score: 80, badge: 'intermediate', verifiedAt: daysAgo(15) } },
    });

    // Amina – passed Communication test (3/3 = 100%)
    await SkillResult.create({
      user: amina._id, test: commTest._id,
      score: 3, totalPoints: 3, percentage: 100, passed: true, badge: 'advanced',
      timeTaken: 540,
      answers: [
        { questionIndex: 0, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 1, selectedAnswer: 2, isCorrect: true },
        { questionIndex: 2, selectedAnswer: 1, isCorrect: true },
      ],
      completedAt: daysAgo(45),
    });
    await YouthProfile.findOneAndUpdate({ user: amina._id }, {
      $push: { verifiedSkills: { skill: 'Communication', score: 100, badge: 'advanced', verifiedAt: daysAgo(45) } },
    });

    // Amina – passed Financial Literacy (4/5 = 80%)
    await SkillResult.create({
      user: amina._id, test: finTest._id,
      score: 4, totalPoints: 5, percentage: 80, passed: true, badge: 'intermediate',
      timeTaken: 1200,
      answers: [
        { questionIndex: 0, selectedAnswer: 0, isCorrect: true },
        { questionIndex: 1, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 2, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 3, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 4, selectedAnswer: 0, isCorrect: false },
      ],
      completedAt: daysAgo(20),
    });
    await YouthProfile.findOneAndUpdate({ user: amina._id }, {
      $push: { verifiedSkills: { skill: 'Financial Analysis', score: 80, badge: 'intermediate', verifiedAt: daysAgo(20) } },
    });

    // Patrick – passed Python test (5/5 = 100%)
    await SkillResult.create({
      user: patrick._id, test: pyTest._id,
      score: 5, totalPoints: 5, percentage: 100, passed: true, badge: 'advanced',
      timeTaken: 680,
      answers: [
        { questionIndex: 0, selectedAnswer: 0, isCorrect: true },
        { questionIndex: 1, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 2, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 3, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 4, selectedAnswer: 1, isCorrect: true },
      ],
      completedAt: daysAgo(60),
    });
    await YouthProfile.findOneAndUpdate({ user: patrick._id }, {
      $push: { verifiedSkills: { skill: 'Python', score: 100, badge: 'advanced', verifiedAt: daysAgo(60) } },
    });

    // Eric – passed PM test (3/3 = 100%)
    await SkillResult.create({
      user: eric._id, test: pmTest._id,
      score: 3, totalPoints: 3, percentage: 100, passed: true, badge: 'intermediate',
      timeTaken: 920,
      answers: [
        { questionIndex: 0, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 1, selectedAnswer: 1, isCorrect: true },
        { questionIndex: 2, selectedAnswer: 1, isCorrect: true },
      ],
      completedAt: daysAgo(10),
    });
    await YouthProfile.findOneAndUpdate({ user: eric._id }, {
      $push: { verifiedSkills: { skill: 'Project Management', score: 100, badge: 'intermediate', verifiedAt: daysAgo(10) } },
    });

    console.log('✅ Skill results and verified badges created');

    // ── Courses ────────────────────────────────────────────────────────────
    console.log('\n📚 Creating courses...');
    const courses = await Course.create(COURSES);
    const [webCourse, mktCourse, commCourse, excelCourse, finCourse] = courses;
    console.log(`✅ ${courses.length} courses created`);

    // ── Course Enrollments ─────────────────────────────────────────────────
    console.log('\n🎓 Creating course enrollments...');

    const makeEnrollment = (user, course, completedCount, status, completedAtDate) => {
      const lessonIds = course.lessons.map(l => l._id);
      const completedLessons = lessonIds.slice(0, completedCount).map(id => ({ lessonId: id, completedAt: daysAgo(Math.floor(Math.random() * 30) + 1) }));
      const progress = Math.round((completedCount / course.lessons.length) * 100);
      return {
        user, course: course._id,
        status, progress, completedLessons,
        currentLesson: completedCount,
        enrolledAt: daysAgo(40),
        completedAt: status === 'completed' ? completedAtDate : undefined,
        certificateIssued: status === 'completed',
        certificateUrl: status === 'completed' ? `https://cert.opportunex.rw/${user}_${course._id}` : '',
        lastAccessedAt: daysAgo(Math.floor(Math.random() * 5)),
      };
    };

    await CourseEnrollment.create([
      // Jean: web dev (completed), Python course
      makeEnrollment(jean._id, webCourse,  5, 'completed', daysAgo(10)),
      makeEnrollment(jean._id, commCourse, 2, 'in-progress', null),

      // Amina: finance course (completed), digital marketing (in progress)
      makeEnrollment(amina._id, finCourse,  4, 'completed', daysAgo(5)),
      makeEnrollment(amina._id, mktCourse,  2, 'in-progress', null),

      // Eric: project management via comm course (in progress), excel (enrolled)
      makeEnrollment(eric._id, commCourse,  1, 'in-progress', null),
      makeEnrollment(eric._id, excelCourse, 0, 'enrolled', null),

      // Diane: digital marketing (completed), comm skills (in progress)
      makeEnrollment(diane._id, mktCourse,  4, 'completed', daysAgo(8)),
      makeEnrollment(diane._id, commCourse, 3, 'in-progress', null),

      // Patrick: web dev (in progress), excel (enrolled)
      makeEnrollment(patrick._id, webCourse,  3, 'in-progress', null),
      makeEnrollment(patrick._id, finCourse,   1, 'in-progress', null),

      // Clarisse: comm skills (in progress)
      makeEnrollment(clarisse._id, commCourse, 2, 'in-progress', null),

      // Kevin: digital marketing (completed), comm skills (completed)
      makeEnrollment(kevin._id, mktCourse,  4, 'completed', daysAgo(14)),
      makeEnrollment(kevin._id, commCourse, 4, 'completed', daysAgo(7)),
    ]);
    console.log('✅ Course enrollments created');

    // ── Applications ────────────────────────────────────────────────────────
    console.log('\n📄 Creating job applications...');
    const [
      jrDev, frontendIntern, dataEng, uiDesigner,
      finAnalyst, creditTrainee, digitalPM,
      communityHealth, healthDataAnalyst, healthCommIntern,
      juniorCivil, qtySurveyor, siteIntern,
    ] = jobs;

    await Application.create([
      // Jean → TechRwanda roles
      {
        job: jrDev._id, applicant: jean._id,
        coverLetter: 'I am a recent Computer Science graduate from the University of Rwanda with hands-on experience at Irembo Ltd. I built REST APIs serving thousands of daily users and am passionate about civic tech. TechRwanda\'s mission aligns perfectly with my career goals.',
        status: 'shortlisted', createdAt: daysAgo(18),
        employerNotes: 'Strong portfolio, solid GitHub activity. Move to interview.',
      },
      {
        job: dataEng._id, applicant: jean._id,
        coverLetter: 'Having recently passed the Python Skills Verification with an advanced badge on OpportuneX, I am confident in my data engineering capabilities. I am eager to build data pipelines that power TechRwanda\'s products.',
        status: 'reviewed', createdAt: daysAgo(10),
      },
      // Jean → BuildRight
      {
        job: siteIntern._id, applicant: jean._id,
        coverLetter: 'While my primary background is in software, I have strong analytical and problem-solving skills that translate well to construction project management. I am eager to gain cross-sector experience.',
        status: 'pending', createdAt: daysAgo(3),
      },
      // Amina → Finance roles
      {
        job: finAnalyst._id, applicant: amina._id,
        coverLetter: 'As an ALU Finance graduate with a verified Financial Analysis badge on OpportuneX, I bring rigorous analytical skills and real banking experience from my internship at BPR Bank. I am passionate about supporting Rwanda\'s SME ecosystem through smart credit decisions.',
        status: 'interviewed',
        interviewDate: daysAhead(5),
        interviewDetails: { location: 'BankRwanda HQ, KN 5 Ave', meetingLink: 'https://meet.google.com/abc-defg-hij', notes: 'Panel interview with the Credit Team Head.' },
        createdAt: daysAgo(22),
        employerNotes: 'Outstanding test results. Cultural fit looks excellent. Schedule final round.',
      },
      {
        job: creditTrainee._id, applicant: amina._id,
        coverLetter: 'Your 12-month graduate programme is exactly the structured career start I am looking for. My internship at BPR gave me a solid foundation in credit analysis and I am ready to deepen that expertise at BankRwanda.',
        status: 'accepted', createdAt: daysAgo(35),
        employerNotes: 'Exceptional candidate. First choice for the Q1 cohort.',
      },
      // Amina → HealthCare data
      {
        job: healthDataAnalyst._id, applicant: amina._id,
        coverLetter: 'My financial analysis background combined with my passion for impact-driven work makes me an ideal fit for this healthcare data analyst role. I am excited about using data to improve patient outcomes.',
        status: 'pending', createdAt: daysAgo(5),
      },
      // Eric → Engineering roles
      {
        job: juniorCivil._id, applicant: eric._id,
        coverLetter: 'With a BEng in Civil Engineering and two years of site supervision experience at Rwanda Housing Authority, I am well-prepared to contribute to BuildRight\'s projects. I hold a Project Management badge on OpportuneX demonstrating my readiness.',
        status: 'shortlisted', createdAt: daysAgo(14),
        employerNotes: 'Solid experience at RHA. Strong reference letters. Invite for site walk.',
      },
      {
        job: qtySurveyor._id, applicant: eric._id,
        coverLetter: 'My engineering background and experience preparing cost reports at REMA make me a strong candidate for the Quantity Surveyor role. I am detail-oriented and have a deep understanding of construction cost drivers.',
        status: 'reviewed', createdAt: daysAgo(8),
      },
      {
        job: siteIntern._id, applicant: eric._id,
        coverLetter: 'I am seeking additional site experience to complement my RHA tenure. BuildRight\'s reputation for complex projects makes this internship a unique learning opportunity.',
        status: 'accepted', createdAt: daysAgo(25),
        employerNotes: 'Overqualified for intern but fits the project gap. Welcome aboard.',
      },
      // Diane → Marketing/Business roles
      {
        job: digitalPM._id, applicant: diane._id,
        coverLetter: 'Having managed social campaigns for Inyange Industries\' product launches and completed the Digital Marketing Essentials course on OpportuneX, I am excited to bring a marketer\'s perspective to BankRwanda\'s mobile product team.',
        status: 'reviewed', createdAt: daysAgo(12),
      },
      {
        job: healthCommIntern._id, applicant: diane._id,
        coverLetter: 'My BBA with a marketing focus and hands-on campaign experience at Inyange makes me a strong fit for the Health Communications Intern role. I believe in using storytelling to change health behaviours.',
        status: 'shortlisted', createdAt: daysAgo(7),
        employerNotes: 'Creative samples submitted. Strong communicator.',
      },
      {
        job: uiDesigner._id, applicant: diane._id,
        coverLetter: 'I have always operated at the intersection of marketing and design. My campaigns at Inyange involved creative direction and visual brand management — experiences that translate directly to UI/UX thinking.',
        status: 'pending', createdAt: daysAgo(4),
      },
      // Patrick → Tech/Data roles
      {
        job: dataEng._id, applicant: patrick._id,
        coverLetter: 'As an ALU Data Science student with an advanced Python badge on OpportuneX and dashboard experience at RwandAir, I am confident I can build scalable data pipelines for TechRwanda\'s growing product suite.',
        status: 'interviewed',
        interviewDate: daysAhead(3),
        interviewDetails: { location: 'TechRwanda Office, Kigali Innovation City', meetingLink: 'https://meet.google.com/xyz-uvwx-yz', notes: 'Technical interview with the Data Platform team.' },
        createdAt: daysAgo(16),
        employerNotes: 'Top-tier Python assessment. Best candidate seen so far. Fast-track.',
      },
      {
        job: jrDev._id, applicant: patrick._id,
        coverLetter: 'While my specialisation is in data science, my strong programming foundation and RESTful API skills make me equally capable of contributing as a full-stack developer.',
        status: 'reviewed', createdAt: daysAgo(9),
      },
      {
        job: healthDataAnalyst._id, applicant: patrick._id,
        coverLetter: 'Healthcare data is one of the most impactful applications of data science. My experience at RwandAir building KPI dashboards and my academic work on statistical modelling prepare me well for this role.',
        status: 'pending', createdAt: daysAgo(2),
      },
      // Clarisse → Healthcare roles
      {
        job: communityHealth._id, applicant: clarisse._id,
        coverLetter: 'Having spent 9 months at Rwanda Biomedical Centre leading malaria prevention campaigns and training community health workers, I am precisely aligned with this role. I am passionate about primary healthcare access for all Rwandans.',
        status: 'accepted', createdAt: daysAgo(28),
        employerNotes: 'Excellent field experience. Strong references from RBC. Offer sent.',
      },
      {
        job: healthDataAnalyst._id, applicant: clarisse._id,
        coverLetter: 'My public health background combined with strong data collection and reporting skills from my RBC role position me well for this health data analyst role.',
        status: 'shortlisted', createdAt: daysAgo(15),
        employerNotes: 'Public health knowledge is a differentiator. Interview next week.',
      },
      {
        job: healthCommIntern._id, applicant: clarisse._id,
        coverLetter: 'Creating patient education materials was a core part of my work at RBC. I would bring both public health expertise and communication skills to this internship.',
        status: 'reviewed', createdAt: daysAgo(6),
      },
      // Kevin → Marketing/Comms roles
      {
        job: digitalPM._id, applicant: kevin._id,
        coverLetter: 'As a marketing and communications professional with experience growing a 50k+ audience at Kigali Today, I understand how to build digital products people love to use. I am excited to bring that lens to BankRwanda\'s mobile banking product.',
        status: 'reviewed', createdAt: daysAgo(11),
      },
      {
        job: uiDesigner._id, applicant: kevin._id,
        coverLetter: 'My content creation background has given me a deep appreciation for user experience and visual design. I have produced brand assets across digital and print, and I am eager to transition into a formal UX role.',
        status: 'pending', createdAt: daysAgo(4),
      },
      {
        job: healthCommIntern._id, applicant: kevin._id,
        coverLetter: 'I am passionate about using storytelling for social good. My media background at Kigali Today would bring fresh, engaging communication approaches to HealthCare Plus\'s outreach efforts.',
        status: 'shortlisted', createdAt: daysAgo(8),
        employerNotes: 'Strong writing portfolio. Impressive media experience.',
      },
      // Additional cross-applications for richer analytics
      {
        job: frontendIntern._id, applicant: jean._id,
        coverLetter: 'My completed Web Development course and React skills make me an ideal candidate for this frontend internship.',
        status: 'rejected', createdAt: daysAgo(40),
        employerNotes: 'Overqualified — redirected to full-time role.',
      },
      {
        job: frontendIntern._id, applicant: diane._id,
        coverLetter: 'I built and managed Inyange\'s digital presence and am keen to formalise my frontend development skills through this internship.',
        status: 'pending', createdAt: daysAgo(3),
      },
      {
        job: finAnalyst._id, applicant: patrick._id,
        coverLetter: 'My quantitative data science skills and completed Financial Planning course give me a strong foundation for financial analysis.',
        status: 'rejected', createdAt: daysAgo(30),
        employerNotes: 'Strong candidate — not enough pure finance experience at this stage.',
      },
    ]);
    console.log('✅ Applications created');

    // ── Mentorship Sessions ────────────────────────────────────────────────
    console.log('\n🤝 Creating mentorship sessions...');
    await MentorshipSession.create([
      // Completed sessions
      {
        mentor: alice._id, mentee: jean._id,
        topic: 'Breaking into Product Engineering at a Tech Company',
        type: 'one-on-one', scheduledAt: daysAgo(25), duration: 60,
        status: 'completed',
        meetingLink: 'https://meet.google.com/s1',
        mentorNotes: 'Jean is an excellent candidate — strong fundamentals, needs to improve system design thinking.',
        menteeNotes: 'Great session. Will focus on system design and open source contributions.',
        rating: 5, feedback: 'Alice was incredibly insightful. Gave me a clear roadmap for landing a role at TechRwanda.',
      },
      {
        mentor: robert._id, mentee: amina._id,
        topic: 'Building a Career in Investment Banking and Finance',
        type: 'one-on-one', scheduledAt: daysAgo(18), duration: 45,
        status: 'completed',
        meetingLink: 'https://meet.google.com/s2',
        mentorNotes: 'Amina has excellent analytical skills and finance knowledge. Recommended CFA Level 1.',
        menteeNotes: 'Confirmed: start CFA prep and apply for BankRwanda\'s trainee programme.',
        rating: 5, feedback: 'Robert shared invaluable industry insights and practical career advice. Highly recommend.',
      },
      {
        mentor: david._id, mentee: eric._id,
        topic: 'From University to Professional Engineering: What No One Tells You',
        type: 'one-on-one', scheduledAt: daysAgo(20), duration: 60,
        status: 'completed',
        rating: 4, feedback: 'Very grounded advice on navigating large construction projects and client management.',
      },
      {
        mentor: sophie._id, mentee: clarisse._id,
        topic: 'Healthcare Management and Leadership in Rwanda',
        type: 'one-on-one', scheduledAt: daysAgo(12), duration: 60,
        status: 'completed',
        rating: 5, feedback: 'Sophie connected me to key contacts at the Ministry of Health and gave me a clearer sense of my career path.',
      },
      {
        mentor: alice._id, mentee: patrick._id,
        topic: 'Data Science Career Paths in East Africa\'s Tech Ecosystem',
        type: 'one-on-one', scheduledAt: daysAgo(8), duration: 60,
        status: 'completed',
        rating: 5, feedback: 'Exceptional session. Alice helped me position my AI research for industry roles.',
      },
      // Confirmed upcoming sessions
      {
        mentor: robert._id, mentee: jean._id,
        topic: 'Understanding Fintech and Banking APIs',
        type: 'one-on-one', scheduledAt: daysAhead(4), duration: 60,
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/s6',
        notes: 'Prepare questions about BankRwanda\'s mobile API architecture.',
      },
      {
        mentor: alice._id, mentee: diane._id,
        topic: 'Product Management for Non-Technical Profiles',
        type: 'one-on-one', scheduledAt: daysAhead(6), duration: 45,
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/s7',
      },
      {
        mentor: david._id, mentee: kevin._id,
        topic: 'Entrepreneurship and Building a Business in Rwanda',
        type: 'one-on-one', scheduledAt: daysAhead(9), duration: 60,
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/s8',
      },
      // Pending requests
      {
        mentor: sophie._id, mentee: patrick._id,
        topic: 'AI and Machine Learning Applications in Healthcare',
        type: 'one-on-one', scheduledAt: daysAhead(12), duration: 60,
        status: 'pending',
        notes: 'Want to explore how ML can improve diagnostics in under-resourced clinics.',
      },
      {
        mentor: robert._id, mentee: amina._id,
        topic: 'CFA Exam Preparation Strategy',
        type: 'one-on-one', scheduledAt: daysAhead(15), duration: 60,
        status: 'pending',
      },
      {
        mentor: alice._id, mentee: eric._id,
        topic: 'Tech Tools for Construction Project Management',
        type: 'one-on-one', scheduledAt: daysAhead(18), duration: 45,
        status: 'pending',
      },
    ]);
    console.log('✅ Mentorship sessions created');

    // ── Payments ───────────────────────────────────────────────────────────
    console.log('\n💳 Creating payment records...');
    await Payment.create([
      {
        user: alice._id, type: 'subscription', amount: 500000, currency: 'RWF',
        method: 'card', status: 'completed',
        reference: 'REF-TECH-001', transactionId: 'TXN-20260120-001',
        description: 'TechRwanda Premium Plan – Annual subscription',
        metadata: { subscriptionPlan: 'premium', subscriptionDuration: 'annual' },
        createdAt: daysAgo(60),
      },
      {
        user: robert._id, type: 'subscription', amount: 500000, currency: 'RWF',
        method: 'momo', status: 'completed',
        reference: 'REF-BANK-002', transactionId: 'TXN-20260110-002',
        description: 'BankRwanda Finance Premium Plan – Annual subscription',
        metadata: { subscriptionPlan: 'premium', subscriptionDuration: 'annual' },
        createdAt: daysAgo(90),
      },
      {
        user: sophie._id, type: 'subscription', amount: 200000, currency: 'RWF',
        method: 'momo', status: 'completed',
        reference: 'REF-HCP-003', transactionId: 'TXN-20260220-003',
        description: 'HealthCare Plus Basic Plan – Annual subscription',
        metadata: { subscriptionPlan: 'basic', subscriptionDuration: 'annual' },
        createdAt: daysAgo(30),
      },
      {
        user: david._id, type: 'subscription', amount: 200000, currency: 'RWF',
        method: 'bank', status: 'completed',
        reference: 'REF-BRE-004', transactionId: 'TXN-20260205-004',
        description: 'BuildRight Engineering Basic Plan – Annual subscription',
        metadata: { subscriptionPlan: 'basic', subscriptionDuration: 'annual' },
        createdAt: daysAgo(45),
      },
      {
        user: alice._id, type: 'job_posting', amount: 25000, currency: 'RWF',
        method: 'card', status: 'completed',
        reference: 'REF-TECH-005', transactionId: 'TXN-20260305-005',
        description: 'Featured job listing – Data Engineer',
        metadata: { jobId: dataEng._id },
        createdAt: daysAgo(10),
      },
    ]);
    console.log('✅ Payments created');

    // ── Summary ────────────────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨  Database seeded successfully for capstone demo!\n');
    console.log('📧  Login credentials:\n');
    console.log('   🔑 Admin  : admin@opportunex.com     / Admin@123456');
    console.log('   👤 Youth  : jean.uwimana@example.com / password123');
    console.log('   👤 Youth  : amina.habimana@example.com / password123');
    console.log('   👤 Youth  : patrick.nzeyimana@example.com / password123');
    console.log('   🏢 Employer: alice@techrwanda.rw     / password123');
    console.log('   🏢 Employer: robert@bankrwanda.rw    / password123');
    console.log('   🏢 Employer: sophie@healthplus.rw    / password123');
    console.log('   🏢 Employer: david@buildright.rw     / password123');
    console.log('\n📊  Summary:');
    console.log(`   • ${youthUsers.length} youth users  •  ${employerUsers.length} employers  •  1 admin`);
    console.log(`   • ${jobs.length} jobs  •  24 applications`);
    console.log(`   • ${tests.length} skill tests  •  6 skill results with verified badges`);
    console.log(`   • ${courses.length} courses  •  13 course enrollments`);
    console.log('   • 11 mentorship sessions  •  5 payment records');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
