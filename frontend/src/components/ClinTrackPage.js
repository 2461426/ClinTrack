import "../styles/ClinTrackPage.css";
import Menu from "./Menu";

const ClinTrackPage = () => {
  return (
    <div className="clintrack-page">
      {/* NAVBAR */}
      <Menu />

      {/* MAIN CONTENT: Full-cover hero image */}
      <main className="clintrack-page__main">
        <section
          className="clintrack-hero"
          aria-labelledby="clintrack-left-title"
        >
          <h2 id="clintrack-left-title" className="clintrack-page__visually-hidden">
            Clinical Trial Guidelines
          </h2>

          <div className="clintrack-hero__media">
            <img
              src="https://www.clinicaltrialsarena.com/wp-content/uploads/sites/22/2023/05/GettyImages-1382981225.jpg"
              alt="Clinical trials illustration"
              className="clintrack-hero__img"
            />
          </div>
        </section>

        {/* BOTTOM BANNER */}
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
      </main>
    </div>
  );
};

export default ClinTrackPage;


