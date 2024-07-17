import React, { useEffect, useRef, useState } from 'react'
import { avatar19, avatar20, avatar21, avatar22, avatar23, company_icon_01, company_icon_02, company_icon_03, company_icon_04, company_icon_05, company_icon_06, company_icon_07, company_icon_08, company_icon_09, company_icon_10 } from '../../../Routes/ImagePath'
import { Link } from 'react-router-dom';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import CompaniesModal from '../../../components/modelpopup/CompaniesModal';



const CompaniesGrid = () => {

    const[showFilter, setShowFilter]=useState(false);
    const[fieldInputs, setFieldInputs]=useState(false);
  const [focused, setFocused] = useState(false);
  const [focusedTwo, setFocusedTwo] = useState(false);
  const [focusedThree, setFocusedThree] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputValueTwo, setInputValueTwo] = useState("");
  const [inputValueThree, setInputValueThree] = useState("");

    const optionsSortValue = [
        { value: 'sortAlphabet', label: 'Sort By Alphabet' },
        { value: 'ascending', label: 'Ascending' },
        { value: 'descending', label: 'Descending' },
        { value: 'recentlyViewed', label: 'Recently Viewed' },
        { value: 'recentlyAdded', label: 'Recently Added' }
      ];

      const optionSort = [
        { value: 'Germany', label: 'Germany' },
        { value: 'USA', label: 'USA' },
        { value: 'Canada', label: 'Canada' },
        { value: 'India', label: 'India' },
        { value: 'China', label: 'China' }
      ];

      const handleLabelClick = () => {
        setFocused(true);
      };
    
      const handleInputBlur = () => {
        if (inputValue === "") {
          setFocused(false);
        }
      };
      const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value !== "" && !focused) {
          setFocused(true);
        }
      };
  
      const handleLabelClickTwo = () => {
        setFocusedTwo(true);
      };
    
      const handleInputBlurTwo = () => {
        if (inputValueTwo === "") {
          setFocusedTwo(false);
        }
      };
      const handleInputChangeTwo = (e) => {
        const value = e.target.value;
        setInputValueTwo(value);
        if (value !== "" && !focusedTwo) {
          setFocusedTwo(true);
        }
      };
  
      const handleLabelClickThree = () => {
        setFocusedThree(true);
      };
    
      const handleInputBlurThree = () => {
        if (inputValueThree === "") {
          setFocusedThree(false);
        }
      };
      const handleInputChangeThree = (e) => {
        const value = e.target.value;
        setInputValueThree(value);
        if (value !== "" && !focusedThree) {
          setFocusedThree(true);
        }
      };
  
      const initialSettings = {
        endDate: new Date("2020-08-11T12:30:00.000Z"),
        ranges: {
          "Last 30 Days": [
            new Date("2020-07-12T04:57:17.076Z"),
            new Date("2020-08-10T04:57:17.076Z"),
          ],
          "Last 7 Days": [
            new Date("2020-08-04T04:57:17.076Z"),
            new Date("2020-08-10T04:57:17.076Z"),
          ],
          "Last Month": [
            new Date("2020-06-30T18:30:00.000Z"),
            new Date("2020-07-31T18:29:59.999Z"),
          ],
          "This Month": [
            new Date("2020-07-31T18:30:00.000Z"),
            new Date("2020-08-31T18:29:59.999Z"),
          ],
          Today: [
            new Date("2020-08-10T04:57:17.076Z"),
            new Date("2020-08-10T04:57:17.076Z"),
          ],
          Yesterday: [
            new Date("2020-08-09T04:57:17.076Z"),
            new Date("2020-08-09T04:57:17.076Z"),
          ],
        },
        startDate: new Date("2020-08-04T04:57:17.076Z"), // Set "Last 7 Days" as default
        timePicker: false,
      };


      const [isFullScreen, setFullScreen] = useState(false);
  const maximizeBtnRef = useRef(null);

  useEffect(() => {
    const handleClick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setFullScreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          setFullScreen(false);
        }
      }
    };

    const cleanup = () => {
      if (isFullScreen && document.exitFullscreen) {
        document.exitFullscreen();
        setFullScreen(false);
      }
    };

    const maximizeBtn = maximizeBtnRef.current;
    maximizeBtn.addEventListener('click', handleClick);

    // Cleanup function to remove the event listener and exit fullscreen on component unmount
    return () => {
      maximizeBtn.removeEventListener('click', handleClick);
      cleanup();
    };
  }, [isFullScreen]);

  return (
   
 <div className="page-wrapper">
  {/* Page Content */}
  <div className="content container-fluid">
    {/* Page Header */}
    <div className="page-header">
      <div className="row align-items-center">
        <div className="col-md-4">
          <h3 className="page-title">Companies</h3>
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/admin-dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item active">Companies</li>
          </ul>
        </div>
        <div className="col-md-8 float-end ms-auto">
          <div className="d-flex title-head">
            <div className="view-icons">
              <Link to="#" className="grid-view btn btn-link"><i className="las la-redo-alt" /></Link>
              <Link to="#" className="list-view btn btn-link" id="collapse-header" ref={maximizeBtnRef}><i className="las la-expand-arrows-alt" /></Link>
              <Link to="#" className={fieldInputs ? "list-view btn btn-link active-filter" : "list-view btn btn-link"} id="filter_search"  onClick={() => setFieldInputs(!fieldInputs)}><i className="las la-filter" /></Link>
            </div>
            <div className="form-sort">
              <Link to="#" className="list-view btn btn-link" data-bs-toggle="modal" data-bs-target="#export"><i className="las la-file-export" />Export</Link>
            </div>
            <Link to="#" className="btn add-btn" data-bs-toggle="modal" data-bs-target="#add_company"><i className="la la-plus-circle" /> Add Company</Link>
          </div>
        </div>
      </div>
    </div>
    {/* /Page Header */}
    {/* Search Filter */}
    <div className="filter-filelds" id="filter_inputs" style={{display : fieldInputs ? "block":"none"}} >
      <div className="row filter-row">
        <div className="col-xl-2">  
        <div
            className={
              focused || inputValue !== ""
                ? "input-block form-focus focused"
                : "input-block form-focus"
            }
          >
            <input
              type="text"
              className="form-control floating"
              value={inputValue}
              onFocus={handleLabelClick}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
            />
            <label className="focus-label" onClick={handleLabelClick}>
              Company Name
            </label>
          </div>
        </div>
        <div className="col-xl-2">  
        <div
            className={
              focusedTwo || inputValueTwo !== ""
                ? "input-block form-focus focused"
                : "input-block form-focus"
            }
          >
            <input
              type="text"
              className="form-control floating"
              value={inputValueTwo}
              onFocus={handleLabelClickTwo}
              onBlur={handleInputBlurTwo}
              onChange={handleInputChangeTwo}
            />
            <label className="focus-label" onClick={handleLabelClickTwo}>
             Email
            </label>
          </div>
        </div>
        <div className="col-xl-2">  
        <div
            className={
              focusedThree || inputValueThree !== ""
                ? "input-block form-focus focused"
                : "input-block form-focus"
            }
          >
            <input
              type="text"
              className="form-control floating"
              value={inputValueThree}
              onFocus={handleLabelClickThree}
              onBlur={handleInputBlurThree}
              onChange={handleInputChangeThree}
            />
            <label className="focus-label" onClick={handleLabelClickThree}>
              Phone Number
            </label>
          </div>
        </div>
        <div className="col-xl-2">  
          <div className="input-block mb-3 form-focus focused">
          <DateRangePicker initialSettings={initialSettings}>
                    <input
                      className="form-control  date-range bookingrange"
                      type="text"
                    />
                  </DateRangePicker>
                  <label className="focus-label">From - To Date</label>

          </div>
        </div>
        <div className="col-xl-2"> 
          <div className="input-block mb-3 form-focus select-focus">
          <Select
      options={optionSort}
      placeholder="--Select--"
      className="select floating"
      isSearchable={false}
    />
            <label className="focus-label">Location</label>
          </div>
        </div>
        <div className="col-xl-2">  
          <Link to="#" className="btn btn-success w-100"> Search </Link>  
        </div>     
      </div>
    </div>
    <hr />
    {/* /Search Filter */}
    <div className="filter-section filter-bottom">
      <ul>
        <li>
          <div className="view-icons">
            <Link to="/companies" className="list-view btn btn-link active"><i className="las la-list" /></Link>
            <Link to="/companies-grid" className="grid-view btn btn-link"><i className="las la-th" /></Link>
          </div>
        </li>
        <li>
          <div className="form-sort value-contain">
            <i className="las la-sort-alpha-up-alt" />
            <Select
      options={optionsSortValue}
      placeholder="Sort By Alphabet"
      className="select w-100"
      isSearchable={false}
    />
          </div>
        </li>
        <li>
          
          <div className={showFilter ? "form-sorts dropdown table-filter-show" :"form-sorts dropdown"} >
            <Link to="#" className="dropdown-toggle" id="table-filter"  onClick={() => setShowFilter(!showFilter)}><i className="las la-filter me-2"/>Filter</Link>
            <div className="filter-dropdown-menu" style={{ display: showFilter ? "block" : "none" }}>
              <div className="filter-set-view">
                <div className="filter-set-head">
                  <h4>Filter</h4>
                </div>
                <div className="accordion" id="accordionExample">
                  <div className="filter-set-content">
                    <div className="filter-set-content-head">
                      <Link to="#" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Rating<i className="las la-angle-right" /></Link>
                    </div>
                    <div className="filter-set-contents accordion-collapse collapse show" id="collapseOne" data-bs-parent="#accordionExample">
                      <ul>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" defaultChecked />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="rating">
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star filled" />
                            <span>5.0</span>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="rating">
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star" />
                            <span>4.0</span>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="rating">
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star" />
                            <i className="fa fa-star" />
                            <span>3.0</span>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="rating">
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star" />
                            <i className="fa fa-star" />
                            <i className="fa fa-star" />
                            <span>2.0</span>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="rating">
                            <i className="fa fa-star filled" />
                            <i className="fa fa-star" />
                            <i className="fa fa-star" />
                            <i className="fa fa-star" />
                            <i className="fa fa-star" />
                            <span>1.0</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="filter-set-content">
                    <div className="filter-set-content-head">
                      <Link to="#" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">Owner<i className="las la-angle-right" /></Link>
                    </div>
                    <div className="filter-set-contents accordion-collapse collapse" id="collapseTwo" data-bs-parent="#accordionExample">
                      <ul>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" defaultChecked />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="collapse-inside-text">
                            <h5>Hendry</h5>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="collapse-inside-text">
                            <h5>Guillory</h5>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="collapse-inside-text">
                            <h5>Jami</h5>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="collapse-inside-text">
                            <h5>Theresa</h5>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="collapse-inside-text">
                            <h5>Espinosa</h5>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="filter-set-content">
                    <div className="filter-set-content-head">
                      <Link to="#" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">Tags<i className="las la-angle-right" /></Link>
                    </div>
                    <div className="filter-set-contents accordion-collapse collapse" id="collapseThree" data-bs-parent="#accordionExample">
                      <ul>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" defaultChecked />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="collapse-inside-text">
                            <h5>Promotion</h5>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="collapse-inside-text">
                            <h5>Rated</h5>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="collapse-inside-text">
                            <h5>Rejected</h5>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="collapse-inside-text">
                            <h5>Collab</h5>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                          </div>
                          <div className="collapse-inside-text">
                            <h5>Calls</h5>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="filter-reset-btns">
                  <Link to="#" className="btn btn-light">Reset</Link>
                  <Link to="#" className="btn btn-primary">Filter</Link>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div className="search-set">
            <div className="search-input">
              <Link to="#" className="btn btn-searchset"><i className="las la-search" /></Link>
              <div className="dataTables_filter">
                <label> <input type="search" className="form-control form-control-sm" placeholder="Search" /></label>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div className="row mt-4">
      <div className="col-xxl-3 col-xl-4 col-md-6">
        <div className="contact-grid">
          <div className="grid-head">
            <div className="users-profile">
              <Link to="#" className="company-icon">
                <img src={company_icon_01} alt="Img" />
              </Link>
              <h5 className="name-user">
                <Link to="#">NovaWaveLLC</Link>
                <span className="set-star mt-1">
                  <i className="fa fa-star filled me-2" />5.0
                </span>
              </h5>
            </div>
            <div className="dropdown">
              <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#edit_company"><i className="fa-solid fa-pencil m-r-5" /> Edit</Link>
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_company"><i className="fa-regular fa-trash-can m-r-5" /> Delete</Link>
                <Link className="dropdown-item" to="/company-details"><i className="fa-regular fa-eye" /> Preview</Link>
              </div>
            </div>
          </div>
          <div className="grid-body">
            <div className="address-info">
              <span><i className="la la-envelope-open" />robertson@example.com</span>
              <span><i className="la la-phone-volume" />+1 12445-47878</span>
              <span><i className="la la-map-marker" />United States</span>
            </div>
            <div className="grid-badges">
              <span className="badge badge-soft-info">Promotion</span>
            </div>
          </div>
          <div className="grid-footer d-flex justify-content-between">
            <ul className="social-links d-flex align-items-center">
              <li>
                <Link to="#"><i className="la la-envelope" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-phone-volume" /></Link>
              </li>
              <li>
                <Link to="#"><i className="lab la-facebook-messenger" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-skype" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-facebook " /></Link>
              </li>
            </ul>
            <div className="users-group">
              <ul>
                <li><Link to="#"><img src={avatar19} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar20} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar21} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar22} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar23} alt="Img" /></Link></li>
                <li><Link to="#" className="total-group-member">+16</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-xl-4 col-md-6">
        <div className="contact-grid">
          <div className="grid-head">
            <div className="users-profile">
              <Link to="#" className="company-icon">
                <img src={company_icon_02} alt="Img" />
              </Link>
              <h5 className="name-user">
                <Link to="#">BlueSky Industries</Link>
                <span className="set-star mt-1">
                  <i className="fa fa-star filled me-2" />4.0
                </span>
              </h5>
            </div>
            <div className="dropdown">
              <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#edit_company"><i className="fa-solid fa-pencil m-r-5" /> Edit</Link>
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_company"><i className="fa-regular fa-trash-can m-r-5" /> Delete</Link>
                <Link className="dropdown-item" to="/company-details"><i className="fa-regular fa-eye" /> Preview</Link>
              </div>
            </div>
          </div>
          <div className="grid-body">
            <div className="address-info">
              <span><i className="la la-envelope-open" />sharon@example.com</span>
              <span><i className="la la-phone-volume" />+1 19026-83921</span>
              <span><i className="la la-map-marker" />Germany</span>
            </div>
            <div className="grid-badges">
              <span className="badge badge-soft-warning">Rated</span>
            </div>
          </div>
          <div className="grid-footer d-flex justify-content-between">
            <ul className="social-links d-flex align-items-center">
              <li>
                <Link to="#"><i className="la la-envelope" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-phone-volume" /></Link>
              </li>
              <li>
                <Link to="#"><i className="lab la-facebook-messenger" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-skype" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-facebook " /></Link>
              </li>
            </ul>
            <div className="users-group">
              <ul>
                <li><Link to="#"><img src={avatar19} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar20} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar21} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar22} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar23} alt="Img" /></Link></li>
                <li><Link to="#" className="total-group-member">+16</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-xl-4 col-md-6">
        <div className="contact-grid">
          <div className="grid-head">
            <div className="users-profile">
              <Link to="#" className="company-icon">
                <img src={company_icon_03} alt="Img" />
              </Link>
              <h5 className="name-user">
                <Link to="#">SilverHawk</Link>
                <span className="set-star mt-1">
                  <i className="fa fa-star filled me-2" />4.2
                </span>
              </h5>
            </div>
            <div className="dropdown">
              <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#edit_company"><i className="fa-solid fa-pencil m-r-5" /> Edit</Link>
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_company"><i className="fa-regular fa-trash-can m-r-5" /> Delete</Link>
                <Link className="dropdown-item" to="/company-details"><i className="fa-regular fa-eye" /> Preview</Link>
              </div>
            </div>
          </div>
          <div className="grid-body">
            <div className="address-info">
              <span><i className="la la-envelope-open" />vaughan@example.com</span>
              <span><i className="la la-phone-volume" />+1 17240-61041</span>
              <span><i className="la la-map-marker" />Canada</span>
            </div>
            <div className="grid-badges">
              <span className="badge badge-soft-info">Promotion</span>
            </div>
          </div>
          <div className="grid-footer d-flex justify-content-between">
            <ul className="social-links d-flex align-items-center">
              <li>
                <Link to="#"><i className="la la-envelope" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-phone-volume" /></Link>
              </li>
              <li>
                <Link to="#"><i className="lab la-facebook-messenger" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-skype" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-facebook " /></Link>
              </li>
            </ul>
            <div className="users-group">
              <ul>
                <li><Link to="#"><img src={avatar19} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar20} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar21} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar22} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar23} alt="Img" /></Link></li>
                <li><Link to="#" className="total-group-member">+16</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-xl-4 col-md-6">
        <div className="contact-grid">
          <div className="grid-head">
            <div className="users-profile">
              <Link to="#" className="company-icon">
                <img src={company_icon_04} alt="Img" />
              </Link>
              <h5 className="name-user">
                <Link to="#">SummitPeak</Link>
                <span className="set-star mt-1">
                  <i className="fa fa-star filled me-2" />4.5
                </span>
              </h5>
            </div>
            <div className="dropdown">
              <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#edit_company"><i className="fa-solid fa-pencil m-r-5" /> Edit</Link>
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_company"><i className="fa-regular fa-trash-can m-r-5" /> Delete</Link>
                <Link className="dropdown-item" to="/company-details"><i className="fa-regular fa-eye" /> Preview</Link>
              </div>
            </div>
          </div>
          <div className="grid-body">
            <div className="address-info">
              <span><i className="la la-envelope-open" />jessica@example.com</span>
              <span><i className="la la-phone-volume" />+1 16027-49102</span>
              <span><i className="la la-map-marker" />India</span>
            </div>
            <div className="grid-badges">
              <span className="badge badge-soft-warning">Rated</span>
            </div>
          </div>
          <div className="grid-footer d-flex justify-content-between">
            <ul className="social-links d-flex align-items-center">
              <li>
                <Link to="#"><i className="la la-envelope" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-phone-volume" /></Link>
              </li>
              <li>
                <Link to="#"><i className="lab la-facebook-messenger" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-skype" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-facebook " /></Link>
              </li>
            </ul>
            <div className="users-group">
              <ul>
                <li><Link to="#"><img src={avatar19} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar20} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar21} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar22} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar23} alt="Img" /></Link></li>
                <li><Link to="#" className="total-group-member">+16</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-xl-4 col-md-6">
        <div className="contact-grid">
          <div className="grid-head">
            <div className="users-profile">
              <Link to="#" className="company-icon">
                <img src={company_icon_05} alt="Img" />
              </Link>
              <h5 className="name-user">
                <Link to="#">RiverStone V entur</Link>
                <span className="set-star mt-1">
                  <i className="fa fa-star filled me-2" />3.9
                </span>
              </h5>
            </div>
            <div className="dropdown">
              <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#edit_company"><i className="fa-solid fa-pencil m-r-5" /> Edit</Link>
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_company"><i className="fa-regular fa-trash-can m-r-5" /> Delete</Link>
                <Link className="dropdown-item" to="/company-details"><i className="fa-regular fa-eye" /> Preview</Link>
              </div>
            </div>
          </div>
          <div className="grid-body">
            <div className="address-info">
              <span><i className="la la-envelope-open" />carol@example.com</span>
              <span><i className="la la-phone-volume" />+1 18454-01578</span>
              <span><i className="la la-map-marker" />China</span>
            </div>
            <div className="grid-badges">
              <span className="badge badge-soft-info">Promotion</span>
            </div>
          </div>
          <div className="grid-footer d-flex justify-content-between">
            <ul className="social-links d-flex align-items-center">
              <li>
                <Link to="#"><i className="la la-envelope" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-phone-volume" /></Link>
              </li>
              <li>
                <Link to="#"><i className="lab la-facebook-messenger" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-skype" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-facebook " /></Link>
              </li>
            </ul>
            <div className="users-group">
              <ul>
                <li><Link to="#"><img src={avatar19} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar20} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar21} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar22} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar23} alt="Img" /></Link></li>
                <li><Link to="#" className="total-group-member">+16</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-xl-4 col-md-6">
        <div className="contact-grid">
          <div className="grid-head">
            <div className="users-profile">
              <Link to="#" className="company-icon">
                <img src={company_icon_06} alt="Img" />
              </Link>
              <h5 className="name-user">
                <Link to="#">Bright Bridge Grp</Link>
                <span className="set-star mt-1">
                  <i className="fa fa-star filled me-2" />4.7
                </span>
              </h5>
            </div>
            <div className="dropdown">
              <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#edit_company"><i className="fa-solid fa-pencil m-r-5" /> Edit</Link>
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_company"><i className="fa-regular fa-trash-can m-r-5" /> Delete</Link>
                <Link className="dropdown-item" to="/company-details"><i className="fa-regular fa-eye" /> Preview</Link>
              </div>
            </div>
          </div>
          <div className="grid-body">
            <div className="address-info">
              <span><i className="la la-envelope-open" />dawn@example.com</span>
              <span><i className="la la-phone-volume" />+1 13816-03649</span>
              <span><i className="la la-map-marker" />Japan</span>
            </div>
            <div className="grid-badges">
              <span className="badge badge-soft-danger">Rejected</span>
            </div>
          </div>
          <div className="grid-footer d-flex justify-content-between">
            <ul className="social-links d-flex align-items-center">
              <li>
                <Link to="#"><i className="la la-envelope" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-phone-volume" /></Link>
              </li>
              <li>
                <Link to="#"><i className="lab la-facebook-messenger" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-skype" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-facebook " /></Link>
              </li>
            </ul>
            <div className="users-group">
              <ul>
                <li><Link to="#"><img src={avatar19} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar20} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar21} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar22} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar23} alt="Img" /></Link></li>
                <li><Link to="#" className="total-group-member">+16</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-xl-4 col-md-6">
        <div className="contact-grid">
          <div className="grid-head">
            <div className="users-profile">
              <Link to="#" className="company-icon">
                <img src={company_icon_07} alt="Img" />
              </Link>
              <h5 className="name-user">
                <Link to="#">CoastalStar Co.</Link>
                <span className="set-star mt-1">
                  <i className="fa fa-star filled me-2" />4.8
                </span>
              </h5>
            </div>
            <div className="dropdown">
              <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#edit_company"><i className="fa-solid fa-pencil m-r-5" /> Edit</Link>
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_company"><i className="fa-regular fa-trash-can m-r-5" /> Delete</Link>
                <Link className="dropdown-item" to="/company-details"><i className="fa-regular fa-eye" /> Preview</Link>
              </div>
            </div>
          </div>
          <div className="grid-body">
            <div className="address-info">
              <span><i className="la la-envelope-open" />rachel@example.com</span>
              <span><i className="la la-phone-volume" />+1 18914-51047</span>
              <span><i className="la la-map-marker" />Indonesia</span>
            </div>
            <div className="grid-badges">
              <span className="badge badge-soft-warning">Rated</span>
            </div>
          </div>
          <div className="grid-footer d-flex justify-content-between">
            <ul className="social-links d-flex align-items-center">
              <li>
                <Link to="#"><i className="la la-envelope" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-phone-volume" /></Link>
              </li>
              <li>
                <Link to="#"><i className="lab la-facebook-messenger" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-skype" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-facebook " /></Link>
              </li>
            </ul>
            <div className="users-group">
              <ul>
                <li><Link to="#"><img src={avatar19} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar20} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar21} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar22} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar23} alt="Img" /></Link></li>
                <li><Link to="#" className="total-group-member">+16</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-xl-4 col-md-6">
        <div className="contact-grid">
          <div className="grid-head">
            <div className="users-profile">
              <Link to="#" className="company-icon">
                <img src={company_icon_08} alt="Img" />
              </Link>
              <h5 className="name-user">
                <Link to="#">HarborView</Link>
                <span className="set-star mt-1">
                  <i className="fa fa-star filled me-2" />4.2
                </span>
              </h5>
            </div>
            <div className="dropdown">
              <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#edit_company"><i className="fa-solid fa-pencil m-r-5" /> Edit</Link>
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_company"><i className="fa-regular fa-trash-can m-r-5" /> Delete</Link>
                <Link className="dropdown-item" to="/company-details"><i className="fa-regular fa-eye" /> Preview</Link>
              </div>
            </div>
          </div>
          <div className="grid-body">
            <div className="address-info">
              <span><i className="la la-envelope-open" />jonelle@example.com</span>
              <span><i className="la la-phone-volume" />+1 18314-01527</span>
              <span><i className="la la-map-marker" />Cuba</span>
            </div>
            <div className="grid-badges">
              <span className="badge badge-soft-danger">Rejected</span>
            </div>
          </div>
          <div className="grid-footer d-flex justify-content-between">
            <ul className="social-links d-flex align-items-center">
              <li>
                <Link to="#"><i className="la la-envelope" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-phone-volume" /></Link>
              </li>
              <li>
                <Link to="#"><i className="lab la-facebook-messenger" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-skype" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-facebook " /></Link>
              </li>
            </ul>
            <div className="users-group">
              <ul>
                <li><Link to="#"><img src={avatar19} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar20} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar21} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar22} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar23} alt="Img" /></Link></li>
                <li><Link to="#" className="total-group-member">+16</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-xl-4 col-md-6">
        <div className="contact-grid">
          <div className="grid-head">
            <div className="users-profile">
              <Link to="#" className="company-icon">
                <img src={company_icon_09} alt="Img" />
              </Link>
              <h5 className="name-user">
                <Link to="#">Golden Gate Ltd</Link>
                <span className="set-star mt-1">
                  <i className="fa fa-star filled me-2" />3.5
                </span>
              </h5>
            </div>
            <div className="dropdown">
              <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#edit_company"><i className="fa-solid fa-pencil m-r-5" /> Edit</Link>
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_company"><i className="fa-regular fa-trash-can m-r-5" /> Delete</Link>
                <Link className="dropdown-item" to="/company-details"><i className="fa-regular fa-eye" /> Preview</Link>
              </div>
            </div>
          </div>
          <div className="grid-body">
            <div className="address-info">
              <span><i className="la la-envelope-open" />jonelle@example.com</span>
              <span><i className="la la-phone-volume" />+1 18314-01527</span>
              <span><i className="la la-map-marker" />Cuba</span>
            </div>
            <div className="grid-badges">
              <span className="badge badge-soft-info">Promotion</span>
            </div>
          </div>
          <div className="grid-footer d-flex justify-content-between">
            <ul className="social-links d-flex align-items-center">
              <li>
                <Link to="#"><i className="la la-envelope" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-phone-volume" /></Link>
              </li>
              <li>
                <Link to="#"><i className="lab la-facebook-messenger" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-skype" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-facebook " /></Link>
              </li>
            </ul>
            <div className="users-group">
              <ul>
                <li><Link to="#"><img src={avatar19} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar20} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar21} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar22} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar23} alt="Img" /></Link></li>
                <li><Link to="#" className="total-group-member">+16</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-xl-4 col-md-6">
        <div className="contact-grid">
          <div className="grid-head">
            <div className="users-profile">
              <Link to="#" className="company-icon">
                <img src={company_icon_10} alt="Img" />
              </Link>
              <h5 className="name-user">
                <Link to="#">Redwood Inc</Link>
                <span className="set-star mt-1">
                  <i className="fa fa-star filled me-2" />4.4
                </span>
              </h5>
            </div>
            <div className="dropdown">
              <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="material-icons">more_vert</i></Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#edit_company"><i className="fa-solid fa-pencil m-r-5" /> Edit</Link>
                <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_company"><i className="fa-regular fa-trash-can m-r-5" /> Delete</Link>
                <Link className="dropdown-item" to="/company-details"><i className="fa-regular fa-eye" /> Preview</Link>
              </div>
            </div>
          </div>
          <div className="grid-body">
            <div className="address-info">
              <span><i className="la la-envelope-open" />jonelle@example.com</span>
              <span><i className="la la-phone-volume" />+1 18314-01527</span>
              <span><i className="la la-map-marker" />Cuba</span>
            </div>
            <div className="grid-badges">
              <span className="badge badge-soft-danger">Rejected</span>
            </div>
          </div>
          <div className="grid-footer d-flex justify-content-between">
            <ul className="social-links d-flex align-items-center">
              <li>
                <Link to="#"><i className="la la-envelope" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-phone-volume" /></Link>
              </li>
              <li>
                <Link to="#"><i className="lab la-facebook-messenger" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-skype" /></Link>
              </li>
              <li>
                <Link to="#"><i className="la la-facebook " /></Link>
              </li>
            </ul>
            <div className="users-group">
              <ul>
                <li><Link to="#"><img src={avatar19} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar20} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar21} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar22} alt="Img" /></Link></li>
                <li><Link to="#"><img src={avatar23} alt="Img" /></Link></li>
                <li><Link to="#" className="total-group-member">+16</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="load-more-btn text-center">
          <Link to="#" className="btn btn-primary">Load More Companies<i className="spinner-border" /></Link>
        </div>
      </div>
    </div>
  </div>
  <CompaniesModal/>
</div>


  )
}

export default CompaniesGrid