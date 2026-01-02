import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import './GenerateReport.css'
import TrailNavBar from '../TrailNavBar/TrailNavBar'

function GenerateReport() {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trailId) {
      axios.get(`http://localhost:5000/trailDetails?trailId=${trailId}`)
        .then(response => {
          if (response.data && response.data.length > 0) {
            setTrail(response.data[0]);
          }
        })
        .catch(error => {
          console.error('Error fetching trail:', error);
        });
    }
  }, [trailId]);

  const handleNavigation = (page) => {
    if (page === 'dashboard') {
      navigate(`/TrailDashboard/${trailId}`);
    } else if (page === 'participants') {
      navigate(`/ListOfParticipants/${trailId}`);
    } else if (page === 'events') {
      navigate(`/updateevents/${trailId}`);
    } else if (page === 'report') {
      // Already on report
      return;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const generatePDF = () => {
    if (!trail) {
      alert('Trail data not available');
      return;
    }

    setLoading(true);

    // Use setTimeout to ensure state updates
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPosition = 20;

        // Header
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, pageWidth, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Clinical Trial Report', pageWidth / 2, 20, { align: 'center' });

        // Reset text color
        doc.setTextColor(0, 0, 0);
        yPosition = 45;

        // Trial Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        const titleText = String(trail.title || 'Untitled Trial');
        doc.text(titleText, 14, yPosition);
        yPosition += 10;

        // Generated Date
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 14, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 15;

        // Basic Information Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('Trial Information', 14, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;

        const basicInfo = [
          ['Trail ID', String(trail.trailId || 'N/A')],
          ['Pharma ID', String(trail.pharmaId || 'N/A')],
          ['Phase', `Phase ${trail.phase || 'N/A'}`],
          ['Gender Requirement', String(trail.gender || 'N/A')],
          ['Minimum Age', `${trail.minAge || 'N/A'} years`],
          ['Progress', `${trail.progress || 0}%`]
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [],
          body: basicInfo,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: 14, right: 14 },
          styles: { fontSize: 10 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 },
            1: { cellWidth: 'auto' }
          }
        });

        yPosition = doc.lastAutoTable.finalY + 15;

        // Description Section
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('Description', 14, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const description = String(trail.description || 'No description available');
        const descriptionLines = doc.splitTextToSize(description, pageWidth - 28);
        doc.text(descriptionLines, 14, yPosition);
        yPosition += (descriptionLines.length * 5) + 10;

        // Eligibility Criteria
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('Eligibility Criteria', 14, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;

        const eligibilityInfo = [
          ['Obesity Category', String(trail.obesityCategory || 'N/A')],
          ['BP Category', String(trail.bpCategory || 'N/A')],
          ['Diabetes Status', String(trail.diabetesStatus || 'N/A')],
          ['Asthma', trail.hasAsthma ? 'Yes' : 'No'],
          ['Chronic Illnesses', trail.hasChronicIllnesses ? 'Yes' : 'No']
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [],
          body: eligibilityInfo,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: 14, right: 14 },
          styles: { fontSize: 10 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 },
            1: { cellWidth: 'auto' }
          }
        });

        yPosition = doc.lastAutoTable.finalY + 15;

        // Enrollment & Events Section
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('Enrollment & Events', 14, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;

        const enrollmentInfo = [
          ['Participants Required', String(trail.participantsRequired || 0)],
          ['Participants Enrolled', String(trail.participantsEnrolled || 0)],
          ['Enrollment Rate', `${trail.participantsRequired > 0 ? Math.round((trail.participantsEnrolled / trail.participantsRequired) * 100) : 0}%`],
          ['Adverse Events Reported', String(trail.adverseEventsReported || 0)],
          ['High Severity Events', String(trail.adverseEventsHigh || 0)],
          ['Medium Severity Events', String(trail.adverseEventsMedium || 0)],
          ['Low Severity Events', String(trail.adverseEventsLow || 0)]
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [],
          body: enrollmentInfo,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: 14, right: 14 },
          styles: { fontSize: 10 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 },
            1: { cellWidth: 'auto' }
          }
        });

        yPosition = doc.lastAutoTable.finalY + 15;

        // Impact Analysis
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('Impact Analysis', 14, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;

        const negativeImpacts = trail.negativeImpacts || [];
        const positiveImpacts = trail.positiveImpacts || [];
        const totalNegative = negativeImpacts.reduce((sum, val) => sum + (val || 0), 0);
        const totalPositive = positiveImpacts.reduce((sum, val) => sum + (val || 0), 0);

        const impactData = [
          ['Negative Impacts (Total)', String(totalNegative)],
          ['Positive Impacts (Total)', String(totalPositive)],
          ['Phase 1 Negative', String(negativeImpacts[0] || 0)],
          ['Phase 1 Positive', String(positiveImpacts[0] || 0)],
          ['Phase 2 Negative', String(negativeImpacts[1] || 0)],
          ['Phase 2 Positive', String(positiveImpacts[1] || 0)],
          ['Phase 3 Negative', String(negativeImpacts[2] || 0)],
          ['Phase 3 Positive', String(positiveImpacts[2] || 0)]
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [],
          body: impactData,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: 14, right: 14 },
          styles: { fontSize: 10 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 },
            1: { cellWidth: 'auto' }
          }
        });

        yPosition = doc.lastAutoTable.finalY + 15;

        // Phase Timeline
        if (trail.phaseDates && Object.keys(trail.phaseDates).length > 0) {
          if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(41, 128, 185);
          doc.text('Phase Timeline', 14, yPosition);
          doc.setTextColor(0, 0, 0);
          yPosition += 8;

          const phaseData = Object.entries(trail.phaseDates).map(([phase, date]) => [
            `Phase ${phase}`,
            formatDate(date)
          ]);

          autoTable(doc, {
            startY: yPosition,
            head: [],
            body: phaseData,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            margin: { left: 14, right: 14 },
            styles: { fontSize: 10 },
            columnStyles: {
              0: { fontStyle: 'bold', cellWidth: 60 },
              1: { cellWidth: 'auto' }
            }
          });

          yPosition = doc.lastAutoTable.finalY + 15;
        }

        // Participants List
        if (trail.participantsId && trail.participantsId.length > 0) {
          if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(41, 128, 185);
          doc.text('Enrolled Participants', 14, yPosition);
          doc.setTextColor(0, 0, 0);
          yPosition += 8;

          const participantData = trail.participantsId.map((id, index) => [
            String(index + 1),
            String(id)
          ]);

          autoTable(doc, {
            startY: yPosition,
            head: [['#', 'Participant ID']],
            body: participantData,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            margin: { left: 14, right: 14 },
            styles: { fontSize: 10 }
          });
        }

        // Footer on all pages
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
          doc.text('ClinTrack - Clinical Trial Management System', pageWidth / 2, pageHeight - 5, { align: 'center' });
        }

        // Save the PDF
        const fileName = `${String(trail.title).replace(/[^a-z0-9]/gi, '_')}_Report_${new Date().getTime()}.pdf`;
        doc.save(fileName);

        setLoading(false);
        alert('Report generated successfully!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        setLoading(false);
        alert(`Error generating report: ${error.message}. Please try again.`);
      }
    }, 100);
  };

  return (
    <div className='report-layout'>
      <TrailNavBar trailId={trailId} onNavigate={handleNavigation} trailInfo={trail} />
      
      <div className='report-with-navbar'>
        <div className='report-page'>
          <div className='report-header'>
            <div className='report-header__text'>
              <h1 className='report-header__subtitle'>Trail Report</h1>
              <h1 className='report-header__title'>Generate PDF Report</h1>
            </div>
          </div>

          {trail ? (
            <div className='report-content'>
              <div className='report-card'>
                <div className='report-card__header'>
                  <div className='report-card__icon'>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className='report-icon'>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className='report-card__title-section'>
                    <h2 className='report-card__title'>{trail.title}</h2>
                    <p className='report-card__subtitle'>Clinical Trial Report Overview</p>
                  </div>
                </div>

                <div className='report-card__stats'>
                  <div className='report-stat'>
                    <div className='report-stat__label'>Trail ID</div>
                    <div className='report-stat__value'>{trail.trailId}</div>
                  </div>
                  <div className='report-stat'>
                    <div className='report-stat__label'>Phase</div>
                    <div className='report-stat__value'>Phase {trail.phase}</div>
                  </div>
                  <div className='report-stat'>
                    <div className='report-stat__label'>Participants</div>
                    <div className='report-stat__value'>{trail.participantsEnrolled} / {trail.participantsRequired}</div>
                  </div>
                  <div className='report-stat'>
                    <div className='report-stat__label'>Progress</div>
                    <div className='report-stat__value'>{trail.progress}%</div>
                  </div>
                  <div className='report-stat'>
                    <div className='report-stat__label'>Adverse Events</div>
                    <div className='report-stat__value report-stat__value--warning'>{trail.adverseEventsReported}</div>
                  </div>
                </div>

                <div className='report-card__info'>
                  <h3 className='report-info__title'>Report Contents</h3>
                  <div className='report-info__grid'>
                    <div className='report-info__item'>
                      <svg className='report-info__icon' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Trial Information & Description</span>
                    </div>
                    <div className='report-info__item'>
                      <svg className='report-info__icon' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Eligibility Criteria</span>
                    </div>
                    <div className='report-info__item'>
                      <svg className='report-info__icon' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Enrollment Statistics</span>
                    </div>
                    <div className='report-info__item'>
                      <svg className='report-info__icon' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Adverse Events Analysis</span>
                    </div>
                    <div className='report-info__item'>
                      <svg className='report-info__icon' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Impact Analysis (Positive & Negative)</span>
                    </div>
                    <div className='report-info__item'>
                      <svg className='report-info__icon' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Phase Timeline</span>
                    </div>
                    <div className='report-info__item'>
                      <svg className='report-info__icon' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Enrolled Participants List</span>
                    </div>
                  </div>
                </div>

                <button 
                  className='report-generate-btn' 
                  onClick={generatePDF}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="report-btn-spinner" viewBox="0 0 24 24">
                        <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <svg className='report-btn-icon' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Generate & Download PDF Report
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className='report-loading'>
              <div className='report-loading__spinner'></div>
              <p>Loading trail data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GenerateReport