import React, { useEffect, useRef, useState } from 'react'
import { company_icon_01, company_icon_02, company_icon_03, company_icon_04, company_icon_05, company_icon_06, company_icon_07, company_icon_08, company_icon_09, company_icon_10 } from '../../../Routes/ImagePath';
import { Link } from 'react-router-dom';
import { Table } from "antd";
import Select from 'react-select';
import CompaniesModal from '../../../components/modelpopup/CompaniesModal';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import AddNotes from '../../../components/modelpopup/Crm/AddNotes';



const Companies = () => {

  const [showFilter, setShowFilter] = useState(false);
  const [fieldInputs, setFieldInputs] = useState(false);
  const [focused, setFocused] = useState(false);
  const [focusedTwo, setFocusedTwo] = useState(false);
  const [focusedThree, setFocusedThree] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputValueTwo, setInputValueTwo] = useState("");
  const [inputValueThree, setInputValueThree] = useState("");

  const data = [
    {
      name: "NovaWaveLLC",
      phone: "+1 875455453",
      email: "Robertson@example.com",
      tags: "Promotion",
      location: "Germany",
      rating: 4.2,
      owner: "Hendry",
      social_links: ["la la-envelope", "la la-phone-volume", "lab la-facebook-messenger", "la la-skype", "la la-facebook"],
      status: "Active",
      stars: "fa fa-star filled",
      image: company_icon_01

    },
    {
      name: "BlueSky Industries",
      phone: "+1 989757485",
      email: "sharon@example.com",
      tags: "Rated",
      location: "USA",
      rating: 5.0,
      owner: "Guillory",
      social_links: ["la la-envelope", "la la-phone-volume", "lab la-facebook-messenger", "la la-skype", "la la-facebook"],
      status: "Active",
      stars: "fa fa-star",
      image: company_icon_02
    },
    {
      name: "SilverHawk",
      phone: "+1 546555455",
      email: "Vaughan12@example.com",
      tags: "Promotion",
      location: "Canada",
      rating: 3.5,
      owner: "Jami",
      social_links: ["la la-envelope", "la la-phone-volume", "lab la-facebook-messenger", "la la-skype", "la la-facebook"],
      status: "Inactive",
      stars: "fa fa-star filled",
      image: company_icon_03
    },
    {
      name: "SummitPeak",
      phone: "+1 454478787",
      email: "Jessica13@example.com",
      tags: "Rated",
      location: "India",
      rating: 4.5,
      owner: "Theresa",
      social_links: ["la la-envelope", "la la-phone-volume", "lab la-facebook-messenger", "la la-skype", "la la-facebook"],
      status: "Active",
      stars: "fa fa-star",
      image: company_icon_04
    },
    {
      name: "RiverStone Ventur",
      phone: "+1 124547845",
      email: "CarolTho3@example.com",
      tags: "Rejected",
      location: "China",
      rating: 4.7,
      owner: "Espinosa",
      social_links: ["la la-envelope", "la la-phone-volume", "lab la-facebook-messenger", "la la-skype", "la la-facebook"],
      status: "Active",
      stars: "fa fa-star",
      image: company_icon_05
    },
    {
      name: "Bright Bridge Grp",
      phone: "+1 478845447",
      email: "Dawnmercha@example.com",
      tags: "Rated",
      location: "Japan",
      rating: 5.0,
      owner: "Martin",
      social_links: ["la la-envelope", "la la-phone-volume", "lab la-facebook-messenger", "la la-skype", "la la-facebook"],
      status: "Active",
      stars: "fa fa-star filled",
      image: company_icon_06
    },
    {
      name: "CoastalStar Co.",
      phone: "+1 215544845",
      email: "Rachel@example.com",
      tags: "Rejected",
      location: "Indonesia",
      rating: 3.1,
      owner: "Newell",
      social_links: ["la la-envelope", "la la-phone-volume", "lab la-facebook-messenger", "la la-skype", "la la-facebook"],
      status: "Active",
      stars: "fa fa-star",
      image: company_icon_07

    },
    {
      name: "HarborView",
      phone: "+1 121145471",
      email: "Jonelle@example.com",
      tags: "Rejected",
      location: "Cuba",
      rating: 5.0,
      owner: "Janet",
      social_links: ["la la-envelope", "la la-phone-volume", "lab la-facebook-messenger", "la la-skype", "la la-facebook"],
      status: "Active",
      stars: "fa fa-star",
      image: company_icon_08
    },
    {
      name: "Golden Gate Ltd",
      phone: "+1 321454789",
      email: "Jonathan@example.com",
      tags: "Collab",
      location: "Isreal",
      rating: 2.7,
      owner: "Craig",
      social_links: ["la la-envelope", "la la-phone-volume", "lab la-facebook-messenger", "la la-skype", "la la-facebook"],
      status: "Active",
      stars: "fa fa-star",
      image: company_icon_09
    },
    {
      name: "Redwood Inc",
      phone: "+1 278907145",
      email: "brook@example.com",
      tags: "Calls",
      location: "Colombia",
      rating: 3.0,
      owner: "Daniel",
      social_links: ["la la-envelope", "la la-phone-volume", "lab la-facebook-messenger", "la la-skype", "la la-facebook"],
      status: "Active",
      stars: "fa fa-star",
      image: company_icon_10
    }
  ]

  const columns = [

    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="d-flex">
          <div>
            <div className="set-star star-select star-position">
              <i className={record.stars} />
            </div>
          </div>
          <div>
            <h2 className="table-avatar d-flex align-items-center table-padding">
              <Link to="/company-details" className="company-img"><img src={record.image} alt="UserImage" /></Link>
              <Link to="/company-details" className="profile-split">{record.name}</Link>
            </h2>
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },

    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) =>
        a.email.length - b.email.length,
    },

    {
      title: "Tags",
      dataIndex: "tags",
      render: (text) =>
        <span className={
          text === 'Promotion' ? 'badge badge-soft-info' :
            text === 'Rated' ? 'badge badge-soft-warning' :
              text === 'Rejected' ? 'badge badge-soft-danger' :
                text === 'Calls' ? 'badge badge-soft-purple' :

                  'badge badge-soft-danger'}>
          {text}</span>,


      sorter: (a, b) =>
        a.tags.length - b.tags.length,
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: (a, b) => a.location.length - b.location.length,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (text) =>
        <div className="set-star">
          <i className="fa fa-star filled me-2" />{text}
        </div>
      ,

      sorter: (a, b) => a.rating.length - b.rating.length,
    },
    {
      title: "Owner",
      dataIndex: "owner",
      sorter: (a, b) => a.owner.length - b.owner.length,
    },


    {
      title: "Contact",
      dataIndex: "Contact",
      render: () => (
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

      ),



      sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div className="dropdown action-label">
          <Link to="#" className={text === "Inactive" ? "btn btn-white btn-sm badge-outline-danger status-color-dg" :
            "btn btn-white btn-sm badge-outline-success status-color"}> {text} </Link>
        </div>

      ),



      sorter: (a, b) => a.owner.length - b.owner.length,
    },


    {
      title: "Action",
      sorter: "true",
      render: () => (
        <div className="dropdown dropdown-action text-end">
          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_company"
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_company"
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
            <Link className="dropdown-item" to="/company-details">
              <i className="fa-regular fa-eye"></i> Preview</Link>

              <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#add_notes" ><i class="la la-file-prescription"></i> Notes</Link>


          </div>
        </div>
      ),
    },
  ];


  const optionSort = [
    { value: 'Germany', label: 'Germany' },
    { value: 'USA', label: 'USA' },
    { value: 'Canada', label: 'Canada' },
    { value: 'India', label: 'India' },
    { value: 'China', label: 'China' }
  ];

  const optionsSortValue = [
    { value: 'sortAlphabet', label: 'Sort By Alphabet' },
    { value: 'ascending', label: 'Ascending' },
    { value: 'descending', label: 'Descending' },
    { value: 'recentlyViewed', label: 'Recently Viewed' },
    { value: 'recentlyAdded', label: 'Recently Added' }
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


  const customStyles = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
        color: state.isFocused ? "#fff" : "#000",
        "&:hover": {
            backgroundColor: "#ff9b44",
        },
    }),
};

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
                  <Link to="#" className={fieldInputs ? "list-view btn btn-link active-filter" : "list-view btn btn-link"} id="filter_search" onClick={() => setFieldInputs(!fieldInputs)}><i className="las la-filter" /></Link>
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
        <div className="filter-filelds" id="filter_inputs" style={{ display: fieldInputs ? "block" : "none" }} >
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
                  styles={customStyles}
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
                  styles={customStyles}

                />
              </div>
            </li>
            <li>

              <div className={showFilter ? "form-sorts dropdown table-filter-show" : "form-sorts dropdown"} >
                <Link to="#" className="dropdown-toggle" id="table-filter" onClick={() => setShowFilter(!showFilter)}><i className="las la-filter me-2" />Filter</Link>
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
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
              />
            </div>
          </div>
        </div>
      </div>
      <CompaniesModal />
      <AddNotes/>
    </div>



  )
}

export default Companies