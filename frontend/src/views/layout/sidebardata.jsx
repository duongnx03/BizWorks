
export const SidebarData = [
  {
    tittle: "MAIN",
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: "Dashboard",
        hasSubRoute: true,
        showSubRoute: false,
        route: "#",
        icon: "la la-dashcube",
        subMenus: [
          {
            menuValue: "Admin Dashboard",
            route: "/admin-dashboard",
          },
          {
            menuValue: "Employee Dashboard",
            route: "/employee-dashboard",
          },
          {
            menuValue: "Leads Dashboard",
            route: "/leads-dashboard",
          },
        ],
      },
    ],
  },

  {
    role: "ADMIN",
    tittle: "Admin",
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: "Admintration",
        hasSubRoute: true,
        showSubRoute: false,
        route: "#",
        icon: "la la-user",
        subMenus: [
          {
            menuValue: "All Employees",
            route: "/employees",
          },
          {
            menuValue: "View Employee Requests",
            route: "/view-employee-requests",
          },
          {
            menuValue: "View Attendance Complaint Requests",
            route: "/view-attendance-complaint-requests",
          },
          {
            menuValue: "View Overtime Requests",
            route: "/view-overtime-requests",
          },
          {
            menuValue: "Approve Attendance Complaint",
            route: "/approve-attendance-complaint",
          },
          {
            menuValue: "Approve Overtime Requests",
            route: "/approve-overtime-requests",
          },
          {
            menuValue: 'All Leave Requests',
            route: "/leave-requests",
          },
          // {
          //   menuValue: 'Holidays',
          //   route: "/holidays",
          // },
          {
            menuValue: "Departments",
            route: "/departments",
          }, 
          {
            menuValue: 'Training Programs',
            route: "/training-programs",
          },
          {
            menuValue: 'Job Posting',
            route: "/job-posting-list",
          },
          {
            menuValue: 'Job Application',
            route: "/job-application-list/admin",
          },
          
        ],
      },
    ],
  },
  {
    role: "MANAGE",
    tittle: "Manager",
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: "Management",
        hasSubRoute: true,
        showSubRoute: false,
        route: "#",
        icon: "la la-user",
        subMenus: [
          {
            menuValue: "All Employees",
            route: "/manage-employees",
          },
          {
            menuValue: "Missed CheckOut Correction",
            route: "/missed-checkout-correction",
          },
          {
            menuValue: "Approve Employee Requests",
            route: "/approve-employee-requests",
          },
          {
            menuValue: "Approve Attendance Complaint",
            route: "/approve-attendance-complaint",
          },
          {
            menuValue: "Approve Overtime Requests",
            route: "/approve-overtime-requests",
          },
          {
            menuValue: "Attendance",
            route: "/attendance-employee",
          },
          {
            menuValue: "Attendance Data",
            route: "/attendance-data",
          },
          {
            menuValue: 'Attendance Complaint',
            route: "/attendance-complaint",
          },
          {
            menuValue: "Overtime",
            route: "/overtime",
          },
          {
            menuValue: 'All Leave Requests',
            route: "/leave-requests",
          },
          {
            menuValue: "Departments",
            route: "/departments",
          },
          {
            menuValue: 'Training Programs',
            route: "/training-programs",
          },
          {
            menuValue: 'Job Posting',
            route: "/job-posting-list",
          },
          {
            menuValue: 'Job Application',
            route: "/job-application-list/manage",
          },
          {
            menuValue: "Profile",
            route: "/profile"
          },
        ],
      },
    ],
  },
  {
    role: "LEADER",
    tittle: "Leader",
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: "Lead",
        hasSubRoute: true,
        showSubRoute: false,
        route: "#",
        icon: "la la-user",
        subMenus: [
          {
            menuValue: "Manage Team Employees",
            route: "/leader-employees",
          },
          {
            menuValue: "Approve Attendance Complaint",
            route: "/approve-attendance-complaint",
          },
          {
            menuValue: "Approve Overtime Requests",
            route: "/approve-overtime-requests",
          },
          {
            menuValue: "Attendance",
            route: "/attendance-employee",
          },
          {
            menuValue: "Attendance Data",
            route: "/attendance-data",
          },
          {
            menuValue: 'Attendance Complaint',
            route: "/attendance-complaint",
          },
          {
            menuValue: "Overtime",
            route: "/overtime",
          },
          {
            menuValue: 'All Leave Requests',
            route: "/leave-requests",
          },
          {
            menuValue: "Departments",
            route: "/departments",
          },
          {
            menuValue: 'Training Programs',
            route: "/training-programs",
          },
          {
            menuValue: 'Job Posting',
            route: "/job-posting-list",
          },
          {
            menuValue: 'Job Application',
            route: "/job-application-list",
          },
          {
            menuValue: "Violation",
            route: "/violations",
          },
          {
            menuValue: "Profile",
            route: "/profile"
          },
        ],
      },
    ],
  },
  {
    role: "EMPLOYEE",
    tittle: "Employee",
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: "Employees",
        hasSubRoute: true,
        showSubRoute: false,
        route: "#",
        icon: "la la-user",
        subMenus: [
          {
            menuValue: "Attendance",
            route: "/attendance-employee",
          },
          {
            menuValue: "Attendance Data",
            route: "/attendance-data",
          },
          {
            menuValue: 'Attendance Complaint',
            route: "/attendance-complaint",
          },
          {
            menuValue: "Overtime",
            route: "/overtime",
          },
          {
            menuValue: "My Violation",
            route: "/violations_user",
          },
          // {
          //   menuValue: 'Holidays',
          //   route: "/holidays",
          // },
          {
            menuValue: 'Leave Request',
            route: "/leave-requests-employee",
          },
          {
            menuValue: "Leaves",
            route: "/leaves-employee",
          },
          {
            menuValue: "Training Programs",
            route: "/training-programs",
          },
          {
            menuValue: "Profile",
            route: "/profile"
          },
        ],
      },
    ],
  },
  // {
  //   tittle: 'CRM',
  //   showAsTab: false,
  //   separateRoute: false,
  //   menu: [
  //     {
  //       menuValue: 'Contacts',
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       route: "/contact-list",
  //       icon: "la la-user-shield",
  //     },
  //     {
  //       menuValue: 'Companies',
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       route: "/companies",
  //       icon: "la la-building",
  //     },
  //     {
  //       menuValue: 'Deals',
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       route: "/deals",
  //       icon: "la la-cubes",
  //     },
  //     {
  //       menuValue: 'Leads',
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       route: "/leads-list",
  //       icon: "la la-chart-area",
  //     },
  //     {
  //       menuValue: 'Pipeline',
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       route: "/pipeline",
  //       icon: "la la-exchange-alt",
  //     },
  //     {
  //       menuValue: 'Analytics',
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       route: "/analytics",
  //       icon: "la la-dice",
  //     },
  //     {
  //       menuValue: 'Activities',
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       route: "/activities",
  //       icon: "la la-directions",
  //     },
  //   ],
  // },
  {
    role: ["ADMIN", "MANAGE"],
    tittle: "HR",
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: "Payroll",
        hasSubRoute: true,
        showSubRoute: false,
        icon: "la la-money",
        subMenus: [
          {
            menuValue: "Salary",
            route: "/salary",
          },
          {
            menuValue: "Payroll Items",
            route: "/payroll-items",
          },
          {
            menuValue: "Taxes",
            route: "/taxes",
          },
          {
            menuValue: "ViolationType",
            route: "/violation-types",
          },
          {
            menuValue: "Violation",
            route: "/violations",
          },
        ],
      },
      {
        menuValue: "Sales",
        hasSubRoute: true,
        showSubRoute: false,
        icon: "la la-files-o",
        subMenus: [
          // {
          //   menuValue: "Estimates",
          //   route: "/estimates",
          // },
          // {
          //   menuValue: "Invoices",
          //   route: "/invoices",
          // },
          {
            menuValue: "Payments",
            route: "/payments",
          },
          {
            menuValue: "Expenses",
            route: "/expenses",
          },
          // {
          //   menuValue: "Provident Fund",
          //   route: "/provident-fund",
          // },
        ],
      },
      {
        menuValue: "Reports",
        hasSubRoute: true,
        showSubRoute: false,
        icon: "la la-chart-pie",
        subMenus: [
          // {
          //   menuValue: "Expense Report",
          //   route: "/expense-reports",
          // },
          // {
          //   menuValue: "Invoice Report",
          //   route: "/invoice-reports",
          // },
          // {
          //   menuValue: "Payments Report",
          //   route: "/payments-reports",
          // },
          // {
          //   menuValue: "Project Report",
          //   route: "/project-reports",
          // },
          // {
          //   menuValue: "Task Report",
          //   route: "/task-reports",
          // },
          {
            menuValue: "Attendance Report",
            route: "/attendance-reports",
          },
          // {
          //   menuValue: "Leave Report",
          //   route: "/leave-reports",
          // },
          // {
          //   menuValue: "Payslip Report",
          //   route: "/payslip-reports",
          // },
          {
            menuValue: "Daily Report",
            route: "/daily-reports",
          },
          {
            menuValue: "Violation Report",
            route: "/violation_complaints",
          },
          // {
          //   menuValue: "User Report",
          //   route: "/user-reports",
          // },
          // {
          //   menuValue: "Employee Report",
          //   route: "/employee-reports",
          // },
        ],
      },
    ],
  },
];
