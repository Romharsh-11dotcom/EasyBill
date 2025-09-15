# EasyBill

EasyBill is a simple, browser-based billing software designed to help small businesses efficiently manage company profiles, customers, products, and invoices. The entire application runs locally in your browser, storing data using `localStorage`—no backend required!

## Features

- **Company Registration:** Save your company name, address, and PAN for each invoice.
- **Customer Management:** Add, view, and delete customers, including their name, phone, email, address, and PAN.
- **Product List:** Add, view, and delete products with unit pricing.
- **Invoice Creation:** 
  - Select customers and products.
  - Enter quantity, discount, and VAT options.
  - Add multiple items per invoice.
  - Instantly calculate totals.
- **Invoice Management:**
  - View all saved invoices.
  - Download invoices as images (PNG).
  - Delete invoices.
- **Modern UI:** Responsive, clean design using Roboto font and gradients.
- **Local Persistence:** All data (company, customers, products, invoices) is stored in your browser’s localStorage.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Romharsh-11dotcom/EasyBill.git
   ```

2. **Open the Application:**
   - Simply open `index.html` in your browser.
   - No dependencies or server required.

## Usage

1. **Register Your Company:**  
   Enter your company details at the top and click "Save Company".

2. **Add Customers:**  
   Fill in customer information and click "Add Customer". You can manage your customer list.

3. **Add Products:**  
   Enter product name and unit price, then click "Add Product".

4. **Create an Invoice:**  
   - Select a customer.
   - Optionally enable/disable discount and VAT.
   - Add products with quantity.
   - Click "Add Item" to build your invoice.
   - When done, click "Save Invoice".

5. **Manage Invoices:**  
   - View all saved invoices below.
   - Download any invoice as a PNG image.
   - Delete invoices as needed.

## Technologies Used

- **HTML5 & CSS3:** For structure and styling.
- **Vanilla JavaScript:** Handles all interactions and data management.
- **localStorage:** Persists data locally in the browser.
- **html2canvas:** Used to download invoices as images.

## Notes

- All data is stored locally. Clearing browser storage will remove all saved information.
- The app works entirely offline after loading.

## License

MIT

---

Made with ❤️ by [Romharsh-11dotcom](https://github.com/Romharsh-11dotcom)
