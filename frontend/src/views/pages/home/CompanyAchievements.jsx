import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./Header";

const CompanyAchievements = () => {
    return (
      <>
      <Header />
      <div className="container my-5">
      <h2 className="text-center mb-4">Our Company Achievements</h2>
      <div className="row">
          {/* Achievement 1 */}
          <div className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                  <img 
                      src="https://www.slideteam.net/media/catalog/product/cache/1280x720/c/o/company_achievements_powerpoint_presentation_slides_Slide04.jpg" 
                      className="card-img-top" 
                      alt="Achievement 1" 
                  />
                  <div className="card-body">
                      <h5 className="card-title">Global Expansion</h5>
                      <p className="card-text">
                          In 2021, we successfully expanded our operations to 5 new countries, reaching a global presence in over 20 markets. This marked a significant milestone in our growth strategy.
                      </p>
                  </div>
                  <div className="card-footer">
                      <small className="text-muted">Year: 2021</small>
                  </div>
              </div>
          </div>

          {/* Achievement 2 */}
          <div className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                  <img 
                      src="https://www.slideteam.net/media/catalog/product/cache/1280x720/c/o/company_achievements_powerpoint_presentation_slides_Slide15.jpg" 
                      className="card-img-top" 
                      alt="Achievement 2" 
                  />
                  <div className="card-body">
                      <h5 className="card-title">Award for Innovation</h5>
                      <p className="card-text">
                          We received the prestigious Innovation Award in 2020 for our cutting-edge technology solutions in the e-commerce sector. This recognition highlights our commitment to pushing the boundaries of what is possible.
                      </p>
                  </div>
                  <div className="card-footer">
                      <small className="text-muted">Year: 2020</small>
                  </div>
              </div>
          </div>

          {/* Achievement 3 */}
          <div className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                  <img 
                      src="https://www.slidekit.com/wp-content/uploads/2022/08/Company-Achievements-Ppt.jpg" 
                      className="card-img-top" 
                      alt="Achievement 3" 
                  />
                  <div className="card-body">
                      <h5 className="card-title">Sustainability Initiatives</h5>
                      <p className="card-text">
                          In 2019, we launched our sustainability initiatives, reducing carbon emissions by 30% and promoting eco-friendly practices across all our branches globally.
                      </p>
                  </div>
                  <div className="card-footer">
                      <small className="text-muted">Year: 2019</small>
                  </div>
              </div>
          </div>

          {/* Achievement 4 */}
          <div className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                  <img 
                      src="https://www.slideteam.net/media/catalog/product/cache/1280x720/c/o/company_achievements_and_challenges_powerpoint_presentation_slides_Slide01.jpg" 
                      className="card-img-top" 
                      alt="Achievement 4" 
                  />
                  <div className="card-body">
                      <h5 className="card-title">100K+ Satisfied Clients</h5>
                      <p className="card-text">
                          In 2022, we celebrated a major milestone by surpassing 100,000 satisfied clients. This achievement reflects our dedication to providing excellent customer service and high-quality products.
                      </p>
                  </div>
                  <div className="card-footer">
                      <small className="text-muted">Year: 2022</small>
                  </div>
              </div>
          </div>

          {/* Achievement 5 */}
          <div className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                  <img 
                      src="https://i.ytimg.com/vi/RoifQzp2sQ8/maxresdefault.jpg" 
                      className="card-img-top" 
                      alt="Achievement 5" 
                  />
                  <div className="card-body">
                      <h5 className="card-title">Top Employer Award</h5>
                      <p className="card-text">
                          For three consecutive years (2020-2022), we were recognized as a Top Employer for our outstanding workplace culture and employee engagement programs.
                      </p>
                  </div>
                  <div className="card-footer">
                      <small className="text-muted">Years: 2020-2022</small>
                  </div>
              </div>
          </div>

          {/* Achievement 6 */}
          <div className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                  <img 
                      src="https://images.squarespace-cdn.com/content/v1/552f35bee4b0955308211538/1430366401677-8EG3IKWSLJX46T5WJGBT/image-asset.jpeg?format=1000w" 
                      className="card-img-top" 
                      alt="Achievement 6" 
                  />
                  <div className="card-body">
                      <h5 className="card-title">Charity and Social Impact</h5>
                      <p className="card-text">
                          Our company is committed to giving back. In 2023, we donated over $1 million to various charities and launched social impact initiatives aimed at supporting underprivileged communities.
                      </p>
                  </div>
                  <div className="card-footer">
                      <small className="text-muted">Year: 2023</small>
                  </div>
              </div>
          </div>
      </div>
  </div>
  </>
    );
};

export default CompanyAchievements;
