import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { Applogo } from "../../../../../Routes/ImagePath";
import { toWords } from "number-to-words";

const PaySlip = () => {
  const location = useLocation();
  const { salary } = location.state || {}; // Retrieve salary from the state

  if (!salary) {
    return <div>No salary data available.</div>; // Handle case where data is not passed
  }

  // Assuming salary has the necessary fields
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
                Payslip for the month of {new Date(salary.year, salary.month - 1).toLocaleString('default', { month: 'long' })} {salary.year}                </h4>
                <div className="row">
                  <div className="col-sm-6 m-b-20">
                    <img src={Applogo} className="inv-logo" alt="Logo" />
                    <ul className="list-unstyled mb-0">
                      <li>BizWorks</li>
                      <li>391A Nam Ky Khoi Nghia Street,</li>
                      <li>Ward 14, District 3,</li>
                      <li>HCM City, Vietnam, </li>
                    </ul>
                  </div>
                  <div className="col-sm-6 m-b-20">
                    <div className="invoice-details">
                      <h3 className="text-uppercase">Payslip #{salary.salaryCode}</h3>
                      <ul className="list-unstyled">
                        <li>
                        Salary Month: <span>{new Date(salary.year, salary.month - 1).toLocaleString('default', { month: 'long' })}, {salary.year}</span>
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
                          <strong>{salary.employee?.fullname}</strong>
                        </h5>
                      </li>
                      <li>
                        <span>{salary.employee?.position}</span>
                      </li>
                      <li>Joining Date: {new Date(salary.employee?.startDate).toLocaleDateString()}</li>
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
                              <strong>Basic Salary</strong> 
                              <span className="float-end">${salary.basicSalary.toFixed(2)}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Allowance</strong> 
                              <span className="float-end">${salary.allowances.toFixed(2)}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Bonus</strong> 
                              <span className="float-end">${salary.bonusSalary.toFixed(2)}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Overtime</strong> 
                              <span className="float-end">${salary.overtimeSalary.toFixed(2)}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Total Earnings</strong> 
                              <span className="float-end">
                                <strong>${(salary.basicSalary + salary.allowances + salary.bonusSalary + salary.overtimeSalary).toFixed(2)}</strong>
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
                              <strong>Tax Deducted at Source (T.D.S.)</strong> 
                              <span className="float-end">$0.00</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>VAT</strong> 
                              <span className="float-end">$0.00</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Violations</strong> 
                              <span className="float-end">${salary.deductions.toFixed(2)}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Advance Salary</strong> 
                              <span className="float-end">${salary.advanceSalary.toFixed(2)}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Total Deductions</strong> 
                              <span className="float-end">
                                <strong>${(salary.deductions + salary.advanceSalary).toFixed(2)}</strong>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <p>
                      <strong>Net Salary: ${salary.totalSalary.toFixed(2)}</strong> ({toWords(salary.totalSalary).replace(/,/g, '')} dollars only.)
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
