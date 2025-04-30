# 🌍 Wanderlust - Travel & Stay Booking Platform

Wanderlust is a full-featured travel and destination booking web application where users can explore, list, and book unique stays around the world. It provides user authentication, listing creation, search filters, reviews, and an interactive map-based browsing experience.

---

## 🚀 Features

- User registration and login system
- Host can create, edit, and delete property listings
- Advanced search and filtering
- Interactive map integration for geolocation-based browsing
- Review and rating system
- Responsive UI for all screen sizes

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Templating Engine**: EJS
- **Authentication**: Passport.js
- **Map Integration**: Mapbox
- **Image Upload**: Cloudinary
- **Geocoding**: Mapbox Geocoding API

---

## 🧱 Project Structure (MVC)

```bash
wanderlust/
│
├── models/          # Mongoose schemas (User, Listing, Review)
├── routes/          # Express route handlers
├── controllers/     # Route logic (MVC architecture)
├── public/          # Static assets (CSS, JS, images)
├── views/           # EJS templates
├── utils/           # Utility functions (middleware, cloudinary, mapbox)
├── Snapshots/     # Project screenshots
├── .env             # Environment variables (NOT pushed to GitHub)
├── app.js           # Main server entry
└── package.json


⚙️ **Setup & Installation**
### 1. Clone the Repository
git clone https://github.com/yourusername/wanderlust.git
cd wanderlust

### 2. Install Dependencies
npm install
Setup Environment Variables

### 3. Create a .env file in the root directory:
DATABASE_URL=your_mongodb_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAPBOX_TOKEN=your_mapbox_token
SECRET=your_session_secret

### 4. Run the App
npm start
Visit http://localhost:8080 in your browser.

🖼️ **Snapshots**
🏠 Home Page

🔐 Sign Up Page

🔑 Login Page

🔍 Search Listings

➕ Create Listing

🏕️ Show Listing (Property Details)

✏️ Edit Listing

⭐ Reviews Section

🗺️ Map Integration Page

🤝 Contribution
Contributions are welcome! Feel free to fork the repo and submit a pull request.

📄 License
This project is open-source and available under the MIT License.

🙌 Author
Made with ❤️ by Kalash Kashyap
