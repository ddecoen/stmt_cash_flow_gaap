# U.S. GAAP Indirect Statement of Cash Flows Generator

A tool for generating U.S. GAAP compliant indirect method statements of cash flows from NetSuite quarterly income statement exports.

## Overview

This tool transforms quarterly income statement data and comparative quarterly data from NetSuite CSV exports into a properly formatted U.S. GAAP indirect statement of cash flows. The statement categorizes cash flows into the three required activity sections:

- **Cash Flows from Operating Activities** - Cash generated or used by core business operations
- **Cash Flows from Investing Activities** - Cash used for or generated from investments in long-term assets
- **Cash Flows from Financing Activities** - Cash flows related to debt, equity, and dividends

## Installation

```bash
# Clone the repository
git clone https://github.com/ddecoen/stmt_cash_flow_gaap.git
cd stmt_cash_flow_gaap

# Install dependencies
npm install
```

## Development

```bash
# Start the development server
npm run dev

# The application will be available at http://localhost:5173
```

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Input Requirements

### Required CSV Files

1. **Quarterly Income Statement** - Current period income statement exported from NetSuite
2. **Quarterly Comparison Income Statement** - Comparative period data for calculating changes in balance sheet accounts

### Expected CSV Format

CSV files should be exported from NetSuite with standard income statement line items. The tool will process:

- Revenue and expense accounts
- Net income calculations
- Period-over-period changes for working capital adjustments

## U.S. GAAP Indirect Method

The indirect method starts with net income and adjusts for:

### Operating Activities
- Non-cash expenses (depreciation, amortization)
- Changes in working capital:
  - Accounts receivable
  - Inventory
  - Prepaid expenses
  - Accounts payable
  - Accrued liabilities
- Gains/losses on asset dispositions

### Investing Activities
- Capital expenditures
- Purchases and sales of property, plant, and equipment
- Acquisitions and divestitures
- Investment purchases and sales

### Financing Activities
- Proceeds from debt issuance
- Debt repayments
- Equity issuance
- Share repurchases
- Dividend payments

## Usage

The application provides a step-by-step wizard interface to generate your cash flow statement:

### Step 1: Upload
1. Upload your **Comparative Balance Sheet** CSV file (containing two consecutive periods)
2. Upload your **Income Statement** CSV file (current period)
3. Click Continue once both files are uploaded

### Step 2: Enter Balances
Enter the required information:
- **Cash Balances**: Beginning and ending cash amounts
- **Operating Activities Adjustments**: 
  - Depreciation and amortization
  - Changes in accounts receivable (increase is negative)
  - Changes in inventory (increase is negative)
  - Changes in accounts payable (increase is positive)
  - Changes in accrued liabilities (increase is positive)
- **Investing Activities**: Capital expenditures
- **Financing Activities**: 
  - Proceeds from debt
  - Debt repayments
  - Dividends paid

### Step 3: Generate
The application automatically generates your cash flow statement using the indirect method.

### Step 4: Export
View your completed statement and:
- **Print** the statement for physical records
- **Export to CSV** for further analysis or import into other systems

## Output

The tool generates a properly formatted statement of cash flows that:

- Reconciles net income to net cash from operations
- Separately presents investing and financing activities
- Shows the net change in cash and cash equivalents
- Complies with ASC 230 (Statement of Cash Flows) requirements

## GAAP Compliance

This tool follows U.S. GAAP standards as outlined in:

- **ASC 230** - Statement of Cash Flows
- **Indirect Method** - Begins with net income and adjusts for accrual accounting items

### Key Requirements Met

- Proper classification of cash flows by activity type
- Reconciliation of net income to operating cash flows
- Disclosure of non-cash investing and financing activities (if applicable)
- Consistent presentation period-over-period

## Benefits

- **Automated Processing** - Eliminates manual statement preparation
- **GAAP Compliant** - Ensures proper classification and presentation
- **Time Savings** - Reduces quarterly close cycle time
- **Accuracy** - Minimizes human error in calculations and classifications
- **Audit Ready** - Produces properly formatted statements for financial reporting

## Technical Details

### Data Flow

1. Import quarterly income statement CSV files from NetSuite
2. Parse and validate financial data
3. Calculate period-over-period changes
4. Classify items into operating, investing, and financing activities
5. Apply indirect method adjustments
6. Generate formatted cash flow statement

### Account Classification

The tool uses predefined rules to classify accounts into appropriate cash flow categories based on:

- Account names and types
- Transaction nature
- GAAP classification requirements

## Technology Stack

- **React** - User interface framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Papa Parse** - CSV parsing library

## Contributing

Contributions are welcome. Please ensure any changes maintain GAAP compliance and include appropriate test coverage.

## License

MIT

## Support

For questions or issues, please open an issue in the GitHub repository.
