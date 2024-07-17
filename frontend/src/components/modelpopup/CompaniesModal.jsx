import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { avatar1, avatar19, avatar20, avatar21, company_icon_01, profileuploadimg } from '../../Routes/ImagePath'
import Select from 'react-select';

const CompaniesModal = () => {

        const [fieldOne, setFieldOne]=useState(true);
        const [fieldTwo, setFieldTwo]=useState();
        const [fieldThree, setFieldThree]=useState();
        const [fieldFour, setFieldFour]=useState();

        const FieldsetTwo=()=>{
            setFieldOne(false)
            setFieldTwo(true)
            setFieldThree(false)
            setFieldFour(false)
        }

        const FieldsetThree=()=>{
            setFieldOne(false)
            setFieldTwo(false)
            setFieldThree(true)
            setFieldFour(false)
        }
        const FieldsetFour=()=>{
            setFieldOne(false)
            setFieldTwo(false)
            setFieldThree(false)
            setFieldFour(true)
        }


    const options = {
        allFieldsOptions: [
          { value: 'allFields', label: 'All Fields' },
          { value: 'contact', label: 'Contact' },
          { value: 'company', label: 'Company' }
        ],
        sortOptions: [
          { value: 'select', label: 'Select' },
          { value: 'lowest', label: 'Lowest' },
          { value: 'highest', label: 'Highest' }
        ],
        selectOptions: [
          { value: 'select', label: 'Select' },
          { value: 'hendry', label: 'Hendry' },
          { value: 'guillory', label: 'Guillory' },
          { value: 'jami', label: 'Jami' }
        ],
        lastNameOptions: [
          { value: 'select', label: 'Select' },
          { value: 'collins', label: 'Collins' },
          { value: 'konopelski', label: 'Konopelski' },
          { value: 'adams', label: 'Adams' }
        ],
        anotherSelectOptions: [
          { value: 'select', label: 'Select' },
          { value: 'barryCuda', label: 'Barry Cuda' },
          { value: 'tressaWexler', label: 'Tressa Wexler' }
        ],
        communicationOptions: [
          { value: 'select', label: 'Select' },
          { value: 'email', label: 'Email' },
          { value: 'call', label: 'Call' },
          { value: 'skype', label: 'Skype' }
        ],
        currencyOptions: [
          { value: 'select', label: 'Select' },
          { value: 'dollar', label: '$' },
          { value: 'euro', label: '€' }
        ],
        languageOptions: [
          { value: 'select', label: 'Select' },
          { value: 'english', label: 'English' },
          { value: 'french', label: 'French' }
        ],
        countryOptions: [
          { value: 'germany', label: 'Germany' },
          { value: 'usa', label: 'USA' }
        ]
      };

  return (
   
<div>
  {/* Add Company */}
  <div className="modal custom-modal fade custom-modal-two modal-padding" id="add_company" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header header-border justify-content-between p-0">
          <h5 className="modal-title">Add New Company</h5>
          <button type="button" className="btn-close position-static" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body p-0">
          <div className="add-details-wizard">
            <ul id="progressbar" className="progress-bar-wizard">
              <li  className={fieldOne ? "active" : ""}>
                <span><i className="la la-user-tie" /></span>
                <div className="multi-step-info">
                  <h6>Basic Info</h6>
                </div>
              </li>
              <li  className={fieldTwo ? "active" : ""}>									
                <span><i className="la la-map-marker" /></span>
                <div className="multi-step-info">
                  <h6>Address</h6>
                </div>
              </li>
              <li  className={fieldThree ? "active" : ""}>								
                <div className="multi-step-icon">
                  <span><i className="la la-icons" /></span>
                </div>
                <div className="multi-step-info">
                  <h6>Social Profiles</h6>
                </div>
              </li>
              <li  className={fieldFour ? "active" : ""}>								
                <div className="multi-step-icon">
                  <span><i className="la la-images" /></span>
                </div>
                <div className="multi-step-info">
                  <h6>Access</h6>
                </div>
              </li>
            </ul>
          </div>
          <div className="add-info-fieldset">
            <fieldset id="first-field" style={{ display: fieldOne ? "block" : "none" }}>
              <form action="/company">
                <div className="form-upload-profile">
                  <h6 className>Profile Image <span> *</span></h6>
                  <div className="profile-pic-upload">
                    <div className="profile-pic">
                      <span><img src={profileuploadimg} alt="Img" /></span>
                    </div>
                    <div className="employee-field">
                      <div className="mb-0">
                        <div className="image-upload mb-0">
                          <input type="file" />
                          <div className="image-uploads">
                            <h4>Upload</h4>
                          </div>
                        </div>
                      </div>
                      <div className="img-reset-btn">
                        <Link to="#">Reset</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contact-input-set">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Company Name <span className="text-danger">*</span></label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="col-form-label">Email <span className="text-danger"> *</span></label>
                          <div className="status-toggle small-toggle-btn d-flex align-items-center">
                            <span className="me-2 label-text">Option</span>
                            <input type="checkbox" id="user2" className="check" defaultChecked />
                            <label htmlFor="user2" className="checktoggle" />
                          </div>
                        </div>
                        <input className="form-control" type="email" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Phone Number 1<span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Phone Number 2 <span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Fax <span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Website</label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>										
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Reviews <span className="text-danger">*</span></label>
                           <Select options={options.allFieldsOptions} placeholder="All Fields" />

                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Owner <span className="text-danger">*</span></label>
                        <Select options={options.sortOptions} placeholder="Sort Options" />
    
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Tags <span className="text-danger">*</span></label>
                        <input className="input-tags form-control" id="inputBox" type="text" data-role="tagsinput" name="Label" defaultValue="Label, Label" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="col-form-label">Deals <span className="text-danger">*</span></label>
                          <Link to="#" className="add-new"><i className="la la-plus-circle me-2" />Add New</Link>
                        </div>
                        <Select options={options.selectOptions} placeholder="Select Options" />
    
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Industry <span className="text-danger">*</span></label>
                        <Select options={options.lastNameOptions} placeholder="Last Name Options" />
    
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Source <span className="text-danger">*</span></label>
                        <Select options={options.anotherSelectOptions} placeholder="Another Select Options" />
    
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Contact <span className="text-danger">*</span></label>
                        <Select options={options.communicationOptions} placeholder="Communication Options" />
    
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Currency <span className="text-danger">*</span></label>
                        <Select options={options.currencyOptions} placeholder="Currency Options" />
    
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Language <span className="text-danger">*</span></label>
                        <Select options={options.languageOptions} placeholder="Language Options" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">About Company<span className="text-danger">*</span></label>
                        <textarea className="form-control" rows={5} defaultValue={""} />
                      </div>
                    </div>
                    <div className="col-lg-12 text-end form-wizard-button">
                      <button className="button btn-lights reset-btn" type="reset">Reset</button>
                      <button className="btn btn-primary wizard-next-btn" type="button" onClick={FieldsetTwo}>Save &amp; Next</button>
                    </div>
                  </div>									
                </div>
              </form>
            </fieldset>
            <fieldset style={{ display: fieldTwo ? "block" : "none" }}>
              <form action="/company">
                <div className="contact-input-set">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Street Address<span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">City <span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">State / Province <span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Country <span className="text-danger">*</span></label>
                        <Select options={options.countryOptions} placeholder="Country Options" />

                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Zipcode <span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-lg-12 text-end form-wizard-button">
                      <button className="button btn-lights reset-btn" type="reset">Reset</button>
                      <button className="btn btn-primary wizard-next-btn" type="button" onClick={FieldsetThree}>Save &amp; Next</button>
                    </div>
                  </div>									
                </div>
              </form>
            </fieldset>
            <fieldset style={{ display: fieldThree ? "block" : "none" }}>
              <form action="/company">
                <div className="contact-input-set">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Facebook</label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Twitter</label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Linkedin</label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Skype</label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Whatsapp</label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Instagram</label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>	
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <Link to="#" className="add-new"><i className="la la-plus-circle me-2" />Add New</Link>
                      </div>
                    </div>	
                    <div className="col-lg-12 text-end form-wizard-button">
                      <button className="button btn-lights reset-btn" type="reset">Reset</button>
                      <button className="btn btn-primary wizard-next-btn" type="button" onClick={FieldsetFour}>Save &amp; Next</button>
                    </div>
                  </div>									
                </div>
              </form>
            </fieldset>
            <fieldset  style={{ display: fieldFour ? "block" : "none" }}>
              <form action="/company">
                <div className="contact-input-set">
                  <div className="input-blocks add-products">
                    <label className="mb-3">Visibility</label>
                    <div className="access-info-tab">
                      <ul className="nav nav-pills" id="pills-tab1" role="tablist">
                        <li className="nav-item" role="presentation">
                          <span className="custom_radio mb-0" id="pills-public-tab" data-bs-toggle="pill" data-bs-target="#pills-public" role="tab" aria-controls="pills-public" aria-selected="true">
                            <input type="radio" className="form-control" name="public" defaultChecked />
                            <span className="checkmark" /> Public</span>
                        </li>
                        <li className="nav-item" role="presentation">
                          <span className="custom_radio mb-0" id="pills-private-tab" data-bs-toggle="pill" data-bs-target="#pills-private" role="tab" aria-controls="pills-private" aria-selected="false">
                            <input type="radio" className="form-control" name="private" />
                            <span className="checkmark" /> Private</span>
                        </li>
                        <li className="nav-item" role="presentation">
                          <span className="custom_radio mb-0 active" id="pills-select-people-tab" data-bs-toggle="pill" data-bs-target="#pills-select-people" role="tab" aria-controls="pills-select-people" aria-selected="false">
                            <input type="radio" className="form-control" name="select-people" />
                            <span className="checkmark" /> Select People</span>
                        </li>
                      </ul>
                    </div>
                  </div>		
                  <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade" id="pills-public" role="tabpanel" aria-labelledby="pills-public-tab">
                    </div>
                    <div className="tab-pane fade" id="pills-private" role="tabpanel" aria-labelledby="pills-private-tab">
                    </div>
                    <div className="tab-pane fade show active" id="pills-select-people" role="tabpanel" aria-labelledby="pills-select-people-tab">
                      <div className="people-select-tab">
                        <h3>Select People</h3>
                        <div className="select-people-checkbox">
                          <label className="custom_check">
                            <input type="checkbox" />													
                            <span className="checkmark" />
                            <span className="people-profile">
                              <img src={avatar19} alt="Img" />
                              <Link to="#">Darlee Robertson</Link>
                            </span>
                          </label>
                        </div>
                        <div className="select-people-checkbox">
                          <label className="custom_check">
                            <input type="checkbox" />													
                            <span className="checkmark" />
                            <span className="people-profile">
                              <img src={avatar20} alt="Img" />
                              <Link to="#">Sharon Roy</Link>
                            </span>
                          </label>
                        </div>
                        <div className="select-people-checkbox">
                          <label className="custom_check">
                            <input type="checkbox" />													
                            <span className="checkmark" />
                            <span className="people-profile">
                              <img src={avatar21} alt="Img" />
                              <Link to="#">Vaughan</Link>
                            </span>
                          </label>
                        </div>
                        <div className="select-people-checkbox">
                          <label className="custom_check">
                            <input type="checkbox" />													
                            <span className="checkmark" />
                            <span className="people-profile">
                              <img src={avatar1} alt="Img" />
                              <Link to="#">Jessica</Link>
                            </span>
                          </label>
                        </div>
                        <div className="select-confirm-btn">
                          <Link to="#" className="btn danger-btn">Confirm</Link>
                        </div>
                      </div>
                    </div>
                  </div>	
                  <h5 className="mb-3">Status</h5>
                  <div className="status-radio-btns d-flex mb-3">
                    <div className="people-status-radio">
                      <input type="radio" className="status-radio" id="test1" name="radio-group" defaultChecked />
                      <label htmlFor="test1">Active</label>
                    </div>
                    <div className="people-status-radio">
                      <input type="radio" className="status-radio" id="test2" name="radio-group" />
                      <label htmlFor="test2">Private</label>
                    </div>
                    <div className="people-status-radio">
                      <input type="radio" className="status-radio" id="test3" name="radio-group" />
                      <label htmlFor="test3">Inactive</label>
                    </div>
                  </div>		
                  <div className="col-lg-12 text-end form-wizard-button">
                    <button className="button btn-lights reset-btn" type="reset">Reset</button>
                    <button className="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#success_msg">Save &amp; Next</button>
                  </div>			
                </div>
              </form>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Add Company */}
  {/* Edit Company */}
  <div className="modal custom-modal fade custom-modal-two modal-padding" id="edit_company" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header header-border justify-content-between p-0">
          <h5 className="modal-title">Edit Company</h5>
          <button type="button" className="btn-close position-static" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body p-0">
          <div className="add-details-wizard">
            <ul id="progressbar2" className="progress-bar-wizard">
              <li className={fieldOne ? "active" : ""}>
                <span><i className="la la-user-tie" /></span>
                <div className="multi-step-info">
                  <h6>Basic Info</h6>
                </div>
              </li>
              <li className={fieldTwo ? "active" : ""}>									
                <span><i className="la la-map-marker" /></span>
                <div className="multi-step-info">
                  <h6>Address</h6>
                </div>
              </li>
              <li className={fieldThree ? "active" : ""}>								
                <div className="multi-step-icon">
                  <span><i className="la la-icons" /></span>
                </div>
                <div className="multi-step-info">
                  <h6>Social Profiles</h6>
                </div>
              </li>
              <li className={fieldFour ? "active" : ""}>								
                <div className="multi-step-icon">
                  <span><i className="la la-images" /></span>
                </div>
                <div className="multi-step-info">
                  <h6>Access</h6>
                </div>
              </li>
            </ul>
          </div>
          <div className="add-info-fieldset">
            <fieldset id="edit-first-field" style={{ display: fieldOne ? "block" : "none" }}>
              <form action="/company">
                <div className="form-upload-profile">
                  <h6 className>Profile Image <span> *</span></h6>
                  <div className="profile-pic-upload">
                    <div className="profile-pic">
                      <span><img src={company_icon_01} alt="Img" /></span>
                    </div>
                    <div className="employee-field">
                      <div className="mb-0">
                        <div className="image-upload mb-0">
                          <input type="file" />
                          <div className="image-uploads">
                            <h4>Upload</h4>
                          </div>
                        </div>
                      </div>
                      <div className="img-reset-btn">
                        <Link to="#">Reset</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contact-input-set">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Company Name <span className="text-danger">*</span></label>
                        <input className="form-control" type="text" defaultValue="NovaWaveLLC" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="col-form-label">Email <span className="text-danger"> *</span></label>
                          <div className="status-toggle small-toggle-btn d-flex align-items-center">
                            <span className="me-2 label-text">Option</span>
                            <input type="checkbox" id="user3" className="check" defaultChecked />
                            <label htmlFor="user3" className="checktoggle" />
                          </div>
                        </div>
                        <input className="form-control" type="email" defaultValue="Robertson@example.com" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Phone Number 1<span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" defaultValue="+1 875455453" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Phone Number 2 <span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" defaultValue="+1 895455450" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Fax <span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Website</label>
                        <input className="form-control" type="text" defaultValue="Admin Website" />
                      </div>
                    </div>										
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Reviews <span className="text-danger">*</span></label>
                        <Select options={options.sortOptions} placeholder="Sort Options" />

                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Owner <span className="text-danger">*</span></label>
                        <Select options={options.selectOptions} placeholder="Select Options" />

                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Tags <span className="text-danger">*</span></label>
                        <input className="input-tags form-control" id="inputBox2" type="text" data-role="tagsinput" name="Label" defaultValue="Label, Label" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="col-form-label">Deals <span className="text-danger">*</span></label>
                          <Link to="#" className="add-new"><i className="la la-plus-circle me-2" />Add New</Link>
                        </div>
                        <Select options={options.lastNameOptions} placeholder="Last Name Options" />

                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Industry <span className="text-danger">*</span></label>
                        <Select options={options.anotherSelectOptions} placeholder="Another Select Options" />

                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Source <span className="text-danger">*</span></label>
                        <Select options={options.anotherSelectOptions} placeholder="Another Select Options" />

                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Contact <span className="text-danger">*</span></label>
                        <Select options={options.communicationOptions} placeholder="Communication Options" />

                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Currency <span className="text-danger">*</span></label>
                        <Select options={options.currencyOptions} placeholder="Currency Options" />
     
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Language <span className="text-danger">*</span></label>
                        <Select options={options.languageOptions} placeholder="Language Options" />

                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">About Company<span className="text-danger">*</span></label>
                        <textarea className="form-control" rows={5} defaultValue={""} />
                      </div>
                    </div>
                    <div className="col-lg-12 text-end form-wizard-button">
                      <button className="button btn-lights reset-btn" type="reset">Reset</button>
                      <button className="btn btn-primary wizard-next-btn" type="button" onClick={FieldsetTwo}>Save &amp; Next</button>
                    </div>
                  </div>									
                </div>
              </form>
            </fieldset>
            <fieldset style={{ display: fieldTwo ? "block" : "none" }}>
              <form action="/company">
                <div className="contact-input-set">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Street Address<span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" defaultValue="38 Simpson Stree" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">City <span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" defaultValue="Rock Island" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">State / Province <span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" defaultValue="USA" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Country <span className="text-danger">*</span></label>
                            <Select options={options.languageOptions} placeholder="Language Options" />

                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Zipcode <span className="text-danger"> *</span></label>
                        <input className="form-control" type="text" defaultValue={65} />
                      </div>
                    </div>
                    <div className="col-lg-12 text-end form-wizard-button">
                      <button className="button btn-lights reset-btn" type="reset">Reset</button>
                      <button className="btn btn-primary wizard-next-btn" type="button" onClick={FieldsetThree}>Save &amp; Next</button>
                    </div>
                  </div>									
                </div>
              </form>
            </fieldset>
            <fieldset style={{ display: fieldThree ? "block" : "none" }}>
              <form action="/company">
                <div className="contact-input-set">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Facebook</label>
                        <input className="form-control" type="text" defaultValue="Darlee Robertson" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Twitter</label>
                        <input className="form-control" type="text" defaultValue="Darlee Robertson" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Linkedin</label>
                        <input className="form-control" type="text" defaultValue="Darlee Robertson" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Skype</label>
                        <input className="form-control" type="text" defaultValue="Darlee Robertson" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Whatsapp</label>
                        <input className="form-control" type="text" defaultValue="Darlee Robertson" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">Instagram</label>
                        <input className="form-control" type="text" defaultValue="Darlee_Robertson" />
                      </div>
                    </div>	
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <Link to="#" className="add-new"><i className="la la-plus-circle me-2" />Add New</Link>
                      </div>
                    </div>	
                    <div className="col-lg-12 text-end form-wizard-button">
                      <button className="button btn-lights reset-btn" type="reset">Reset</button>
                      <button className="btn btn-primary wizard-next-btn" type="button" onClick={FieldsetFour}>Save &amp; Next</button>
                    </div>
                  </div>									
                </div>
              </form>
            </fieldset>
            <fieldset style={{ display: fieldFour ? "block" : "none" }}>
              <form action="/company">
                <div className="contact-input-set">
                  <div className="input-blocks add-products">
                    <label className="mb-3">Visibility</label>
                    <div className="access-info-tab">
                      <ul className="nav nav-pills" id="pills-tab2" role="tablist">
                        <li className="nav-item" role="presentation">
                          <span className="custom_radio mb-0" id="pills-public-tab2" data-bs-toggle="pill" data-bs-target="#pills-public2" role="tab" aria-controls="pills-public2" aria-selected="true">
                            <input type="radio" className="form-control" name="public" defaultChecked />
                            <span className="checkmark" /> Public</span>
                        </li>
                        <li className="nav-item" role="presentation">
                          <span className="custom_radio mb-0" id="pills-private-tab2" data-bs-toggle="pill" data-bs-target="#pills-private2" role="tab" aria-controls="pills-private2" aria-selected="false">
                            <input type="radio" className="form-control" name="private" />
                            <span className="checkmark" /> Private</span>
                        </li>
                        <li className="nav-item" role="presentation">
                          <span className="custom_radio mb-0 active" id="pills-select-people-tab2" data-bs-toggle="pill" data-bs-target="#pills-select-people2" role="tab" aria-controls="pills-select-people2" aria-selected="false">
                            <input type="radio" className="form-control" name="select-people" />
                            <span className="checkmark" /> Select People</span>
                        </li>
                      </ul>
                    </div>
                  </div>		
                  <div className="tab-content" id="pills-tabContent2">
                    <div className="tab-pane fade" id="pills-public2" role="tabpanel" aria-labelledby="pills-public-tab2">
                    </div>
                    <div className="tab-pane fade" id="pills-private2" role="tabpanel" aria-labelledby="pills-private-tab2">
                    </div>
                    <div className="tab-pane fade show active" id="pills-select-people2" role="tabpanel" aria-labelledby="pills-select-people-tab2">
                      <div className="people-select-tab">
                        <h3>Select People</h3>
                        <div className="select-people-checkbox">
                          <label className="custom_check">
                            <input type="checkbox" />													
                            <span className="checkmark" />
                            <span className="people-profile">
                              <img src={avatar19} alt="Img" />
                              <Link to="#">Darlee Robertson</Link>
                            </span>
                          </label>
                        </div>
                        <div className="select-people-checkbox">
                          <label className="custom_check">
                            <input type="checkbox" />													
                            <span className="checkmark" />
                            <span className="people-profile">
                              <img src={avatar20} alt="Img" />
                              <Link to="#">Sharon Roy</Link>
                            </span>
                          </label>
                        </div>
                        <div className="select-people-checkbox">
                          <label className="custom_check">
                            <input type="checkbox" />													
                            <span className="checkmark" />
                            <span className="people-profile">
                              <img src={avatar21} alt="Img" />
                              <Link to="#">Vaughan</Link>
                            </span>
                          </label>
                        </div>
                        <div className="select-people-checkbox">
                          <label className="custom_check">
                            <input type="checkbox" />													
                            <span className="checkmark" />
                            <span className="people-profile">
                              <img src={avatar1} alt="Img" />
                              <Link to="#">Jessica</Link>
                            </span>
                          </label>
                        </div>
                        <div className="select-confirm-btn">
                          <Link to="#" className="btn danger-btn">Confirm</Link>
                        </div>
                      </div>
                    </div>
                  </div>	
                  <h5 className="mb-3">Status</h5>
                  <div className="status-radio-btns d-flex mb-3">
                    <div className="people-status-radio">
                      <input type="radio" className="status-radio" id="test4" name="radio-group" defaultChecked />
                      <label htmlFor="test4">Active</label>
                    </div>
                    <div className="people-status-radio">
                      <input type="radio" className="status-radio" id="test5" name="radio-group" />
                      <label htmlFor="test5">Private</label>
                    </div>
                    <div className="people-status-radio">
                      <input type="radio" className="status-radio" id="test6" name="radio-group" />
                      <label htmlFor="test6">Inactive</label>
                    </div>
                  </div>		
                  <div className="col-lg-12 text-end form-wizard-button">
                    <button className="button btn-lights reset-btn" type="reset">Reset</button>
                    <button className="btn btn-primary" type="submit">Submit</button>
                  </div>			
                </div>
              </form>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Edit Company */}
  {/* Success Company */}
  <div className="modal custom-modal fade" id="success_msg" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-body">
          <div className="success-message text-center">
            <div className="success-popup-icon">
              <i className="la la-building" />
            </div>
            <h3>Company Created Successfully!!!</h3>
            <p>View the details of Company</p>
            <div className="col-lg-12 text-center form-wizard-button">
              <Link to="#" className="button btn-lights" data-bs-dismiss="modal">Close</Link>
              <Link to="/company-details" className="btn btn-primary">View Details</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Success Company */}
  {/* Delete Company */}
  <div className="modal custom-modal fade" id="delete_company" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-body">
          <div className="success-message text-center">
            <div className="success-popup-icon bg-danger">
              <i className="la la-trash-restore" />
            </div>
            <h3>Are you sure, You want to delete</h3>
            <p>Company ”NovaWaveLLC” from your Account</p>
            <div className="col-lg-12 text-center form-wizard-button">
              <Link to="#" className="button btn-lights" data-bs-dismiss="modal">Not Now</Link>
              <Link to="/company" className="btn btn-primary" data-bs-dismiss="modal">Okay</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Delete Company */}
  {/* Export */}
  <div className="modal custom-modal fade modal-padding" id="export" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header header-border justify-content-between p-0">
          <h5 className="modal-title">Export</h5>
          <button type="button" className="btn-close position-static" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body p-0">
          <form action="/companies">
            <div className="row">
              <div className="col-md-12">
                <div className="input-block mb-3">
                  <h5 className="mb-3">Export</h5>
                  <div className="status-radio-btns d-flex">
                    <div className="people-status-radio">
                      <input type="radio" className="status-radio" id="pdf" name="export-type" defaultChecked />
                      <label htmlFor="pdf">Person</label>
                    </div>
                    <div className="people-status-radio">
                      <input type="radio" className="status-radio" id="excel" name="export-type" />
                      <label htmlFor="excel">Organization</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <h4 className="mb-3">Filters</h4>
                <div className="input-block mb-3">
                  <label className="col-form-label">Fields <span className="text-danger">*</span></label>
                  <Select options={options.countryOptions} placeholder="Country Options" />

                </div>
              </div>
              <div className="col-md-6">
                <div className="input-block mb-3">
                  <label className="col-form-label">From Date <span className="text-danger">*</span></label>
                  <div className="cal-icon">									
                    <input className="form-control floating datetimepicker" type="text" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-block mb-3">
                  <label className="col-form-label">To Date <span className="text-danger">*</span></label>
                  <div className="cal-icon">
                    <input className="form-control floating datetimepicker" type="text" />
                  </div>
                </div>
              </div>
              <div className="col-lg-12 text-end form-wizard-button">
                <button className="button btn-lights reset-btn" type="reset" data-bs-dismiss="modal">Reset</button>
                <button className="btn btn-primary" type="submit">Export Now</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  {/* /Export */}
</div>
  )
}

export default CompaniesModal