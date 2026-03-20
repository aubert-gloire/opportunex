import { Target, Users, TrendingUp, Heart } from 'lucide-react';
import Card from '@/components/ui/Card';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-accent py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About OpportuneX</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            We're on a mission to bridge Rwanda's employment-education gap by connecting talented youth with meaningful career opportunities
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To empower Rwandan youth by providing a comprehensive platform that connects education with employment through skill verification, mentorship, and intelligent job matching.
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To become Rwanda's leading employment platform, where every graduate finds meaningful work that matches their skills and ambitions, contributing to national economic growth.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">
              The Challenge We're Solving
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Rwanda produces over 50,000 university graduates annually, yet faces a significant employment challenge. While there are approximately 14,500 entry-level positions available, many graduates struggle to find work that matches their qualifications.
              </p>
              <p>
                The gap isn't just about numbers—it's about connection. Employers need skilled, work-ready graduates, but traditional hiring methods often fail to identify the right talent. Meanwhile, graduates lack the networks, verified credentials, and guidance needed to navigate the job market effectively.
              </p>
              <p>
                OpportuneX bridges this gap through technology, creating a trusted ecosystem where skills are verified, mentorship is accessible, and job matching is intelligent and efficient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Youth First</h3>
              <p className="text-gray-600">
                We put the needs and aspirations of young Rwandans at the center of everything we do
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We maintain the highest standards in skill verification and employer vetting
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Impact</h3>
              <p className="text-gray-600">
                We measure success by the careers launched and lives transformed
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Us in Building Rwanda's Future
          </h2>
          <p className="text-xl text-gray-100 mb-8">
            Whether you're a student seeking opportunities or an employer looking for talent, OpportuneX is here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="accent" size="lg">
                Get Started Today
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-gray-50">
                Browse Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
