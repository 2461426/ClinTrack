
import "../styles/About.css";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import ParticipantNavbar from "./ParticipantNavbar/ParticipantNavbar";
const UserAbout = () => (
  <><ParticipantNavbar/>
  <section className="about" aria-labelledby="about-title">
    {/* <header className="about__header">
      <p className="about__lead">
        ClinTrack is a clinical research operations platform that helps teams manage
        trials, participants, and compliance workflows—streamlining study startup,
        execution, and reporting.
      </p>
    </header> */}
     
    <div className="about__grid">
      <article className="about-card" aria-labelledby="who-we-are-title">
        <figure className="about-card__media">
          <img
            src="https://www.olympus-europa.com/medical/rmt/media/Content/Content-MSD/Images/ContentHub/Supporting-the-Continuum-of-Care-through-Healthcare-Digitalization/hismiss_main.jpg"
            alt="Research institute building"
            className="about-card__img1"
            style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
          />
        </figure>
          <h3 className="about-card__title">
            Who We Are
          </h3>
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
            style={{ width: "100%", height: "367px", display: "block", objectFit: "cover" }}
          />
          </figure>
          <h3 className="about-card__title">
            What We Do
          </h3>
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
    <div className="clintrack-page__banner">
          <div className="container py-3 text-center">
            <p className="m-0 clintrack-page__banner-text">
              All the trials are conducted according to FDA and ICH-GCP guidelines.
            </p>
          </div>
          <div className="container-copyright">
          <small>© {new Date().getFullYear()} Clin Track. All rights reserved.</small>
        </div>
        </div>
  </section>
  </>
);
export default UserAbout;


