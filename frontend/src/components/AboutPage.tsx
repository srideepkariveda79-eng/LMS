import React from 'react'
import { Building2, Target, Lightbulb, Users, Award, Heart, TrendingUp, Globe } from 'lucide-react'
import surekhaPhoto from '../assets/surekha.png'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50/20">

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-semibold">About Arohak</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Who We Are</h1>
            <p className="text-xl sm:text-2xl text-white/90 font-light">A dedicated team to grow your company</p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-amber-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p className="leading-relaxed">
                  Arohak was born from a simple yet profound belief - that we could make a meaningful impact on the lives of others. Since our inception in <span className="font-semibold text-red-600">2016</span>, we have been on a relentless journey to turn aspirations into achievements.
                </p>
                <p className="leading-relaxed">
                  A cornerstone of our values is our <span className="font-semibold text-amber-600">"Empowered Team"</span>. Our team members aren't just employees; they are cherished contributors and an integral part of our extended family.
                </p>
                <p className="leading-relaxed">
                  Arohak is committed to diversity and gender equality, proudly championing female talent within our workforce. Our expertise spans <span className="font-semibold">Software Development, UX/UI, Cloud Solutions, IoT, Mobile App Development and Wearables</span> for the enterprise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-red-50 to-amber-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-2 bg-gradient-to-br from-red-700 to-amber-600 flex items-center justify-center p-8 sm:p-12">
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl bg-white">
                      <img src={surekhaPhoto} alt="Surekha Reddy Pailla" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">Surekha Reddy Pailla</h3>
                    <p className="text-white/80 text-sm">Founder & CEO</p>
                  </div>
                </div>
                <div className="md:col-span-3 p-8 sm:p-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-6 h-6 text-red-600" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Leadership Excellence</h2>
                  </div>
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      <span className="font-semibold text-red-600">Surekha Reddy Pailla</span>, the esteemed Founder & CEO of Arohak Inc. Surekha's journey in the IT sector spans over <span className="font-semibold">15 years</span>, marked by significant achievements in leading operations of service companies.
                    </p>
                    <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-xl p-6 my-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-600" />
                        Remarkable Achievements
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {[
                          'Scaled company to 150+ employees',
                          'Achieved $18 million in revenue',
                          "'Fastest Growing Company' by ITServe.Org (2021-2022)",
                          "'FAST100' accolade by USPAACC (2022)",
                          'Ranked #1012 in INC5000 (2023)',
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">•</span>
                            <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="leading-relaxed">
                      Beyond her remarkable business acumen, Surekha is deeply invested in social responsibility, dedicating a portion of her earnings to support the education of needy children.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-700 to-red-600 rounded-2xl shadow-xl p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-white/90 leading-relaxed text-lg">
                  Our mission at Arohak is to unlock the potential of businesses through state-of-the-art IT solutions. We prioritize a partnership approach, focusing on our clients' unique needs to deliver impactful outcomes and build lasting relationships.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-600 to-red-600 rounded-2xl shadow-xl p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-white/90 leading-relaxed text-lg">
                  Our vision at Arohak is to emerge as a global beacon in transformative IT solutions. We imagine a world where every business can tap into the vast potential of technology to set new benchmarks in innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20 bg-red-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-100 px-4 py-2 rounded-full mb-4">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-semibold">Our Values</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do at Arohak</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Users, title: 'Empowered Team', desc: 'Our team members are cherished contributors and an integral part of our extended family.', color: 'from-red-600 to-amber-500' },
                { icon: Heart, title: 'Human-Centered Design', desc: 'We solve complex problems through empathy and user-focused innovation.', color: 'from-amber-500 to-red-500' },
                { icon: Users, title: 'Diversity & Inclusion', desc: 'Committed to gender equality and championing diverse talent in our workforce.', color: 'from-red-700 to-red-500' },
                { icon: TrendingUp, title: 'Excellence', desc: 'Delivering state-of-the-art solutions with unwavering commitment to quality.', color: 'from-red-600 to-amber-600' },
                { icon: Heart, title: 'Social Responsibility', desc: 'Making a positive impact beyond business through community support.', color: 'from-amber-600 to-red-600' },
                { icon: Lightbulb, title: 'Innovation', desc: 'Turning aspirations into achievements through cutting-edge technology.', color: 'from-red-500 to-amber-500' },
              ].map((v, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-red-100">
                  <div className={`w-12 h-12 bg-gradient-to-br ${v.color} rounded-lg flex items-center justify-center mb-4`}>
                    <v.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl text-white/90 mb-8">Join us on the journey to unlock your potential through innovative IT solutions</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-red-700 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transition-colors duration-200 shadow-lg">
                Get Started <TrendingUp className="w-5 h-5" />
              </a>
              <a href="/courses" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors duration-200 border-2 border-white/30">
                Explore Courses
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
