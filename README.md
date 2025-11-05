# U.S. GAAP Indirect Statement of Cash Flows Generator

A tool for generating U.S. GAAP compliant indirect method statements of cash flows from NetSuite quarterly income statement exports.

## Overview

This tool transforms quarterly income statement data and comparative quarterly data from NetSuite CSV exports into a properly formatted U.S. GAAP indirect statement of cash flows. The statement categorizes cash flows into the three required activity sections:

- **Cash Flows from Operating Activities** - Cash generated or used by core business operations
- **Cash Flows from Investing Activities** - Cash used for or generated from investments in long-term assets
- **Cash Flows from Financing Activities** - Cash flows related to debt, equity, and dividends

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

```bash
# Install dependencies
# (Add installation instructions based on your implementation)

# Run the tool
# (Add usage instructions based on your implementation)
```

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

## Configuration

(Add configuration options as implemented in your tool)

## Contributing

Contributions are welcome. Please ensure any changes maintain GAAP compliance and include appropriate test coverage.

## License

(Add your license information)

## Support

For questions or issues, please open an issue in the GitHub repository.
