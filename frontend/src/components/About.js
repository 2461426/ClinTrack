 
import "../styles/About.css";
import { Link } from "react-router-dom";
import ParticipantNavbar from "./ParticipantNavbar";
import Footer from "./Footer";
 
const UserAbout = () => (
  <>
    <ParticipantNavbar />
    <section className="about" aria-labelledby="about-title">
      {/* Existing grid */}
      <div className="about__grid">
        <article className="about-card" aria-labelledby="who-we-are-title">
          <figure className="about-card__media">
            <img
              src="https://www.olympus-europa.com/medical/rmt/media/Content/Content-MSD/Images/ContentHub/Supporting-the-Continuum-of-Care-through-Healthcare-Digitalization/hismiss_main.jpg"
              alt="Research institute building"
              className="about-card__img1"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
              }}
            />
          </figure>
          <h3 id="who-we-are-title" className="about-card__title">Who We Are</h3>
          <p className="about-card__text">
            ClinTrack supports sponsors, CROs, and site networks across therapeutic
            areas. The platform brings study stakeholders together with secure data
            sharing, role-based access, and audit-ready workflows.
          </p>
          <ul className="about-card__list">
            <li>Leadership</li>
            <li>Organization</li>
            <li>Community Voices</li>
            <li>History</li>
          </ul>
        </article>
 
        <article className="about-card" aria-labelledby="what-we-do-title">
          <figure className="about-card__media">
            <img
              src="https://diyhealth.com/wp-content/uploads/2019/01/Get-a-DNA-Test-1-800x534.jpg"
              alt="Laboratory benchtop setup"
              className="about-card__img2"
              style={{
                width: "100%",
                height: "367px",
                display: "block",
                objectFit: "cover",
              }}
            />
          </figure>
          <h3 id="what-we-do-title" className="about-card__title">What We Do</h3>
          <p className="about-card__text">
            We enable teams to plan, conduct, and monitor trials more efficiently.
            Core modules cover study design, site activation, participant management,
            eSource &amp; ePRO capture, safety reporting, and analytics.
          </p>
          <ul className="about-card__list">
            <li>Mission &amp; Goals</li>
            <li>Budget &amp; Pricing</li>
            <li>Platform Almanac</li>
            <li>Impact &amp; Outcomes</li>
          </ul>
        </article>
      </div>
 
      {/* NEW: FDA & ICH GCP section */}
      <section className="about-gcp" aria-labelledby="gcp-title">
        <div className="about-gcp__header">
          <h2 id="gcp-title" className="about-gcp__title">
            Our Compliance: FDA E6(R3) &amp; ICH GCP
          </h2>
          <p className="about-gcp__lead">
            We align with modern, risk‑based Good Clinical Practice—prioritizing participant
            safety, data integrity, and transparent oversight across every trial.
          </p>
        </div>
 
        <div className="about-gcp__grid">
          {/* Card 1: FDA E6(R3) */}
          <article className="gcp-card" aria-labelledby="fda-title">
            <h3 id="fda-title" className="gcp-card__title">
              FDA E6(R3) Highlights
            </h3>
            <ul className="gcp-card__list">
              <li><strong>Quality‑by‑Design:</strong> Identify and manage critical‑to‑quality factors.</li>
              <li><strong>Risk‑based oversight:</strong> Proportional monitoring and fit‑for‑purpose controls.</li>
              <li><strong>Modern trial models:</strong> Decentralized elements and digital data sources.</li>
              <li><strong>Clear roles:</strong> Defined sponsor &amp; investigator responsibilities.</li>
              <li><strong>Participant protection:</strong> Safety and reliability at the center.</li>
            </ul>
          </article>
 
          {/* Card 2: ICH GCP 13 principles (compact) */}
          <article className="gcp-card" aria-labelledby="ich-title">
            <h3 id="ich-title" className="gcp-card__title">
              ICH GCP – 13 Core Principles
            </h3>
            <div className="gcp-principles">
              <ol className="gcp-principles__list">
                <li>Ethical conduct (Helsinki)</li>
                <li>Risk–benefit justification</li>
                <li>Subject welfare prevails</li>
                <li>Adequate prior information</li>
                <li>Scientific, detailed protocol</li>
                <li>IRB/IEC approval &amp; compliance</li>
                <li>Qualified medical oversight</li>
                <li>Qualified staff &amp; training</li>
                <li>Informed consent</li>
                <li>Accurate data handling</li>
                <li>Confidentiality &amp; privacy</li>
                <li>IP manufacturing &amp; control</li>
                <li>Quality systems throughout</li>
              </ol>
            </div>
          </article>
        </div>
 
        {/* Optional: subtle source line (non-link or link if desired) */}
        <p className="about-gcp__note" role="note">
          Guidance informed by FDA E6(R3) and ICH E6 GCP principles.
        </p>
      </section>
 
      {/* Existing banner and footer */}
      <Footer />
    </section>
  </>
);
 
export default UserAbout;
 
 