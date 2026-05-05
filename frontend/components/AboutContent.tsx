'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from './Navbar'

const AboutContent = () => {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 scale-105 animate-kenburns bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-lux-darker" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.12),_transparent_55%)]" />
        </div>

        <div className="relative container mx-auto flex min-h-screen flex-col justify-center px-4 py-24 md:px-6">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold uppercase tracking-[0.35em] text-gold/90"
          >
            About Kirti Group
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            Building Future,{' '}
            <span className="gold-gradient-text">Creating Glory</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
          >
            A professionally driven real estate organization committed to delivering quality developments 
            and reliable consultancy services that create long-term value.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/projects"
              className="rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 py-3.5 text-sm font-semibold text-black shadow-gold transition hover:shadow-gold-lg"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-gold/40 hover:bg-white/10"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="relative py-24 bg-lux-darker">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1600566753386-07c8723c8db8?w=1920&q=80)'
            }}
          />
        </div>
        <div className="relative container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-4xl font-semibold text-white mb-6">
                  Who We Are
                </h2>
                <p className="text-white/70 mb-6 leading-relaxed text-lg">
                  Kirti Group is an emerging and dynamic name in the real estate sector, built on a strong 
                  foundation of experience, professionalism, and trust. As a parent organization, Kirti Group 
                  operates through its specialized verticals—Kirti Buildwell Pvt. Ltd., Kirti Real Estate 
                  Consultancy, and Kirti Infra Developers.
                </p>
                <p className="text-white/70 mb-8 leading-relaxed text-lg">
                  Driven by a team of seasoned professionals including architects, financial experts, and 
                  real estate consultants, the group brings deep industry insight and a practical approach to 
                  every project. Despite being a growing brand, our roots lie in years of hands-on experience 
                  in the real estate ecosystem.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="lux-card px-6 py-3">
                    <span className="text-gold text-sm font-semibold">Kirti Buildwell</span>
                  </div>
                  <div className="lux-card px-6 py-3">
                    <span className="text-gold text-sm font-semibold">Real Estate Consultancy</span>
                  </div>
                  <div className="lux-card px-6 py-3">
                    <span className="text-gold text-sm font-semibold">Infra Developers</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="lux-card p-8">
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-4xl font-display font-bold text-gold mb-2">10+</div>
                      <div className="text-sm text-white/60">Years Experience</div>
                    </div>
                    <div>
                      <div className="text-4xl font-display font-bold text-gold mb-2">50+</div>
                      <div className="text-sm text-white/60">Projects Delivered</div>
                    </div>
                    <div>
                      <div className="text-4xl font-display font-bold text-gold mb-2">100%</div>
                      <div className="text-sm text-white/60">Satisfaction</div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 relative">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
                    alt="Modern Architecture"
                    className="rounded-lg shadow-soft-lg"
                  />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/20 rounded-full blur-xl"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 bg-lux-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl font-semibold text-white mb-4">Vision & Mission</h2>
              <p className="text-white/60 text-lg">Our guiding principles and purpose</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lux-card p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-6 text-gold">🎯</div>
                  <h3 className="font-display text-2xl font-semibold text-white mb-4">Our Vision</h3>
                  <p className="text-white/70 leading-relaxed">
                    To establish Kirti Group as a trusted and forward-thinking real estate brand, delivering 
                    quality developments and reliable consultancy services that create long-term value for customers 
                    and stakeholders. We envision shaping sustainable communities and modern living spaces that 
                    contribute to growth, prosperity, and a better future.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lux-card p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-6 text-gold">🚀</div>
                  <h3 className="font-display text-2xl font-semibold text-white mb-4">Our Mission</h3>
                  <p className="text-white/70 leading-relaxed mb-6">
                    At Kirti Group, our mission is to deliver excellence across every aspect of real estate 
                    through our group companies—Kirti Buildwell Pvt. Ltd., Kirti Real Estate Consultancy, and 
                    Kirti Infra Developers.
                  </p>
                  <ul className="space-y-3 text-white/60">
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span>High-quality, well-planned developments with strong design standards</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span>Transparency, integrity, and professionalism in every transaction</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span>Customer-centric solutions tailored to individual needs</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-lux-darker">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl font-semibold text-white mb-4">Our Core Values</h2>
              <p className="text-white/60 text-lg">The principles that guide every decision and project</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: '🤝', title: 'Integrity & Transparency', desc: 'We believe in honest dealings and complete transparency, ensuring trust and long-term relationships.' },
                { icon: '⭐', title: 'Quality & Excellence', desc: 'We are committed to delivering high standards in design, development, and execution across all projects.' },
                { icon: '❤️', title: 'Customer-Centric Approach', desc: 'Our customers are at the heart of everything we do, delivering solutions that provide real value.' },
                { icon: '👥', title: 'Professional Expertise', desc: 'Our multidisciplinary team brings a well-rounded and practical approach to every project.' },
                { icon: '💡', title: 'Innovation & Growth', desc: 'We embrace modern practices and continuous improvement to meet evolving market expectations.' },
                { icon: '🏗️', title: 'Sustainable Development', desc: 'We focus on creating developments that are structurally sound and environmentally responsible.' }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="lux-card p-8 text-center group hover:shadow-gold transition-all duration-300"
                >
                  <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{value.icon}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-4">{value.title}</h3>
                  <p className="text-white/60 leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-24 bg-lux-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl font-semibold text-white mb-4">Leadership Team</h2>
              <p className="text-white/60 text-lg">Meet the visionaries behind Kirti Group's success</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Mr. Yogendra Singh',
                  role: 'Chairman & Managing Director',
                  avatar: '👨‍💼',
                  bio: 'A seasoned real estate professional with extensive experience in the industry. His leadership has been instrumental in establishing Kirti Group as a reliable and professionally managed organization.'
                },
                {
                  name: 'Ar. Shashank Srivastava',
                  role: 'Associate Director',
                  avatar: '👨‍🏗️',
                  bio: 'An accomplished architect with B.Arch. and M.Plan. degrees. As Founder of 5 Designers Group, he brings a rare blend of architectural creativity and strategic planning expertise.'
                },
                {
                  name: 'Mr. Dharmendra Singh',
                  role: 'Chief Executive Officer',
                  avatar: '👨‍💻',
                  bio: 'With over 22 years of experience, he has earned a reputation as a dependable property consultant and seasoned professional with strong leadership and decision-making abilities.'
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="lux-card p-8 text-center group hover:shadow-gold transition-all duration-300"
                >
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gold/20 to-gold/10 rounded-full flex items-center justify-center border-2 border-gold/30 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">{member.avatar}</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gold/20 rounded-full blur-xl"></div>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-gold text-sm font-semibold mb-4">{member.role}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Director's Messages Section */}
      <section className="py-24 bg-lux-darker">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl font-semibold text-white mb-4">Director's Messages</h2>
              <p className="text-white/60 text-lg">Insights from our leadership team</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lux-card p-8 relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                      <span className="text-2xl">🏛️</span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white mb-2">Ar. Shashank Srivastava</h3>
                      <p className="text-gold text-sm">Associate Director, Kirti Buildwell Pvt. Ltd.</p>
                    </div>
                  </div>
                  <blockquote className="text-white/70 italic leading-relaxed border-l-4 border-gold pl-6">
                    "As an architect, I have always believed that every space we create carries a purpose beyond 
                    its physical form—it shapes experiences, influences lifestyles, and defines the future of its users. 
                    For me, real estate is not just about building projects; it is about creating environments that 
                    people trust, invest in, and proudly associate with."
                  </blockquote>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lux-card p-8 relative"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white mb-2">Mr. Dharmendra Singh</h3>
                      <p className="text-gold text-sm">Chief Executive Officer</p>
                    </div>
                  </div>
                  <blockquote className="text-white/70 italic leading-relaxed border-l-4 border-gold pl-6">
                    "With years of experience in the real estate sector, I have witnessed the evolving needs of 
                    buyers, investors, and the market as a whole. At Kirti Group, our vision is to align this 
                    experience with a professional and transparent approach to deliver value-driven real estate solutions."
                  </blockquote>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-24 bg-lux-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl font-semibold text-white mb-8">Visit Our Office</h2>
              <div className="lux-card p-8 relative overflow-hidden">
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80)'
                    }}
                  />
                </div>
                <div className="relative z-10">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-gold mb-6">Office Address</h3>
                      <p className="text-white/80 leading-relaxed text-lg">
                        Meera Complex, 12, Pahad Nagar Tekariya<br />
                        Lucknow, Selhu Mau<br />
                        Uttar Pradesh 226303<br />
                        India
                      </p>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-gold mb-6">Get in Touch</h3>
                      <p className="text-white/80 mb-4 text-lg">📧 info@kirtibuildwell.com</p>
                      <p className="text-white/80 mb-4 text-lg">📞 +91-8881115002</p>
                      <p className="text-white/80 text-lg">🌐 www.kirtibuildwell.com</p>
                      <div className="mt-8 flex justify-center gap-4">
                        <Link
                          href="/contact"
                          className="rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-6 py-3 text-sm font-semibold text-black shadow-gold transition hover:shadow-gold-lg"
                        >
                          Contact Us
                        </Link>
                        <Link
                          href="/projects"
                          className="rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-sm font-semibold text-gold transition hover:bg-gold/20"
                        >
                          View Projects
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutContent
