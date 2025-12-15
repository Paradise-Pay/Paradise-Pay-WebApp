import Link from 'next/link'
import Image from 'next/image'
import styles from './about.module.css'

export default function AboutPage() {
  const partners = [
    { 
      name: 'TechPay Solutions', 
      role: 'Payment Processing', 
      img: '/assets/partner1.jpg', 
      bio: 'Leading payment gateway provider ensuring secure and fast transactions.'
    },
    { 
      name: 'EventHub Pro', 
      role: 'Event Management', 
      img: '/assets/partner2.png', 
      bio: 'Comprehensive event management solutions for seamless experiences.'
    },
    { 
      name: 'SecureNet', 
      role: 'Security Services', 
      img: '/assets/partner3.png', 
      bio: 'Enterprise-grade security solutions protecting your transactions.'
    },
    { 
      name: 'VenueConnect', 
      role: 'Venue Partnerships', 
      img: '/assets/partner4.png', 
      bio: 'Extensive network of premium venues and event spaces.'
    },
  ]

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.title}>About Paradise Pay</h1>
          <p className={styles.subtitle}>
            We make event ticketing and payments effortless , secure, reliable,
            and delightful for creators and attendees.
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          {/* Mission Section */}
          <div className={styles.missionSection}>
            <h2 className={styles.sectionHeading}>Our Mission</h2>
            <p className={styles.lead}>
              Paradise Pay is built to empower event organizers with intuitive
              payments and ticketing tools so they can focus on what matters:
              creating unforgettable experiences.
            </p>
          </div>

          {/* Values Section */}
          <div className={styles.valuesSection}>
            <h2 className={styles.sectionHeading}>Our Core Values</h2>
            <div className={styles.values}>
              <article className={styles.valueCard} aria-labelledby="val-1">
                <div className={styles.valueIcon}>🛡️</div>
                <h3 id="val-1">Reliability</h3>
                <p>High availability and robust payments infrastructure you can trust.</p>
              </article>
              <article className={styles.valueCard} aria-labelledby="val-2">
                <div className={styles.valueIcon}>✨</div>
                <h3 id="val-2">Simplicity</h3>
                <p>Clean workflows so anyone can sell tickets in minutes.</p>
              </article>
              <article className={styles.valueCard} aria-labelledby="val-3">
                <div className={styles.valueIcon}>🔐</div>
                <h3 id="val-3">Security</h3>
                <p>Built-in best practices to keep payments and data safe.</p>
              </article>
            </div>
          </div>

          {/* Partners Section */}
          <div className={styles.teamSection}>
            <div className={styles.teamHeader}>
              <h2 className={styles.sectionHeading}>Our Partners</h2>
              <p className={styles.teamLead}>Trusted by industry leaders and innovators in event technology.</p>
            </div>
            <div className={styles.teamGrid} role="list">
              {partners.map((partner, index) => (
                <div className={styles.teamCard} role="listitem" key={index}>
                  <div className={styles.teamCardInner}>
                    <div className={styles.teamImageWrapper}>
                      <Image 
                        src={partner.img} 
                        alt={`${partner.name} logo`} 
                        width={250} 
                        height={250}
                        className={styles.teamImage}
                        style={{ objectFit: 'contain' }}
                        priority={false}
                      />
                      <div className={styles.imageOverlay}></div>
                    </div>
                    <div className={styles.teamInfo}>
                      <h3 className={styles.teamName}>{partner.name}</h3>
                      <p className={styles.teamRole}>{partner.role}</p>
                      <p className={styles.teamBio}>{partner.bio}</p>
                      <div className={styles.teamLinks}>
                        <a href="#" className={styles.socialLink} aria-label="Visit Website">🌐</a>
                        <a href="#" className={styles.socialLink} aria-label="Learn More">→</a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className={styles.ctaSection}>
            <h3 className={styles.ctaHeading}>Ready to get started?</h3>
            <p className={styles.ctaText}>Have questions? Our team is here to help.</p>
            <Link href="/contact" className={styles.ctaButton}>
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
