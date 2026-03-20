import { Link } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, Award, TrendingUp, CheckCircle, Building2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-600 to-accent py-20 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight">
              Bridge Rwanda's
              <span className="block text-accent mt-2">Employment-Education Gap</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
              Connect with opportunities through mentorship, skill verification, and job matching
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="accent" size="lg" className="w-full sm:w-auto text-lg font-semibold">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50 text-lg font-semibold"
                >
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-display text-5xl md:text-6xl font-bold text-primary mb-3 tracking-tight">50,000+</div>
              <div className="text-base md:text-lg text-gray-600 font-medium">University Graduates Annually</div>
            </div>
            <div>
              <div className="font-display text-5xl md:text-6xl font-bold text-accent mb-3 tracking-tight">14,500+</div>
              <div className="text-base md:text-lg text-gray-600 font-medium">Entry-Level Jobs Available</div>
            </div>
            <div>
              <div className="font-display text-5xl md:text-6xl font-bold text-primary mb-3 tracking-tight">1,000+</div>
              <div className="text-base md:text-lg text-gray-600 font-medium">Verified Employers</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tight">
              How OpportuneX Works
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto">
              Three simple steps to launch your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="text-center p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">1. Create Your Profile</h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Sign up and build your professional profile with skills, education, and experience
              </p>
            </Card>

            <Card hover className="text-center p-8">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">2. Verify Your Skills</h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Take skill tests to earn verified badges that showcase your abilities to employers
              </p>
            </Card>

            <Card hover className="text-center p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">3. Get Matched & Apply</h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Receive personalized job recommendations and connect with top employers in Rwanda
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-8 tracking-tight">
                Why Choose OpportuneX?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg md:text-xl text-gray-900 mb-2">Verified Companies</h4>
                    <p className="text-gray-600 leading-relaxed">
                      All employers are verified to ensure legitimate opportunities
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg md:text-xl text-gray-900 mb-2">Skill Certification</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Earn badges through skill tests that prove your capabilities
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg md:text-xl text-gray-900 mb-2">Mentorship Access</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Connect with industry professionals for career guidance
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg md:text-xl text-gray-900 mb-2">Smart Job Matching</h4>
                    <p className="text-gray-600 leading-relaxed">
                      AI-powered recommendations based on your profile and skills
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-10">
              <TrendingUp className="w-16 h-16 text-primary mb-6" />
              <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Join 10,000+ Students & Graduates
              </h3>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                From University of Rwanda, ALU, AUCA, and other leading institutions finding their dream careers
              </p>
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full text-lg font-semibold">
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Universities */}
      <section className="py-20 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-gray-600 font-medium text-sm md:text-base tracking-wide uppercase mb-12">
            Trusted by Students from Top Rwandan Universities
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-70">
            <div className="font-display text-2xl md:text-3xl font-semibold text-gray-700">University of Rwanda</div>
            <div className="font-display text-2xl md:text-3xl font-semibold text-gray-700">ALU</div>
            <div className="font-display text-2xl md:text-3xl font-semibold text-gray-700">AUCA</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 leading-relaxed font-light max-w-2xl mx-auto">
            Join OpportuneX today and connect with opportunities that match your skills and ambitions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=youth">
              <Button variant="accent" size="lg" className="w-full sm:w-auto text-lg font-semibold">
                I'm Looking for Jobs
              </Button>
            </Link>
            <Link to="/register?role=employer">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50 text-lg font-semibold"
              >
                <Building2 className="w-5 h-5 mr-2" />
                I'm Hiring Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
