import React from "react";

import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { Applogo } from "../../../../../Routes/ImagePath";

const PaySlip = () => {
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Payslip"
          title="Dashboard"
          subtitle="Payslip"
          modal="#add_categories"
          name="Add Salary"
        />

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h4 className="payslip-title">
                  Payslip for the month of August 2024
                </h4>
                <div className="row">
                  <div className="col-sm-6 m-b-20">
                    <img src={Applogo} className="inv-logo" alt="Logo" />
                    <ul className="list-unstyled mb-0">
                      <li>BizWork</li>
                      <li>391A Nam Ky Khoi Nghia Street,</li>
                      <li>Ward 14, District 3,</li>
                      <li>HCM City, Vietnam, </li>
                    </ul>
                  </div>
                  <div className="col-sm-6 m-b-20">
                    <div className="invoice-details">
                      <h3 className="text-uppercase">Payslip #49029</h3>
                      <ul className="list-unstyled">
                        <li>
                          Salary Month: <span>August, 2024</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 m-b-20">
                    <ul className="list-unstyled">
                      <li>
                        <h5 className="mb-0">
                          <strong>Tony Sama</strong>
                        </h5>
                      </li>
                      <li>
                        <span>Web Designer</span>
                      </li>
                      <li>Employee ID: BW-014</li>
                      <li>Joining Date: 1 Jan 2023</li>
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div>
                      <h4 className="m-b-10">
                        <strong>Earnings</strong>
                      </h4>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td>
                              <strong>Basic Salary</strong>{" "}
                              <span className="float-end">$2500</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong> Allowance</strong>{" "}
                              <span className="float-end">$100</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Bonus</strong>{" "}
                              <span className="float-end">$150</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Overtime</strong>{" "}
                              <span className="float-end">$550</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Total Earnings</strong>{" "}
                              <span className="float-end">
                                <strong>$3300</strong>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div>
                      <h4 className="m-b-10">
                        <strong>Deductions</strong>
                      </h4>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td>
                              <strong>Tax Deducted at Source (T.D.S.)</strong>{" "}
                              <span className="float-end">$0</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Provident Fund</strong>{" "}
                              <span className="float-end">$0</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>ESI</strong>{" "}
                              <span className="float-end">$0</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Loan</strong>{" "}
                              <span className="float-end">$300</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Total Deductions</strong>{" "}
                              <span className="float-end">
                                <strong>$300</strong>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <p>
                      <strong>Net Salary: $3000</strong> (Three thousand $
                       only.)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaySlip;
