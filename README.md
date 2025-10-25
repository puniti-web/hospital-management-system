<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======

## 🏥 Hospital Management System 

A complete MERN-style hospital management system built using **Node.js, Express, MySQL, and React**.
It provides secure role-based login for doctors and patients, appointment management, and ward assignment — all connected to a live MySQL database.

---

### 📁 Project Structure

```
hospital-management-system/
├── backend/
│   ├── server.js                # Main backend entry point
│   ├── db.js                    # MySQL database connection
│   ├── routes/
│   │   ├── authRoutes.js        # Login / Register APIs
│   │   ├── appointmentRoutes.js # Appointment booking APIs
│   │   └── wardRoutes.js        # Ward assignment (doctor/admin)
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── .env                     # (ignored) Environment variables
│   └── .env.example             # Safe sample environment file
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React UI components
│   │   ├── pages/               # Login, Dashboard pages
│   │   ├── App.js               # Main routing logic
│   │   └── index.js             # React root render
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Features

✅ **Authentication (JWT-based)**
→ Separate login for Doctors and Patients
→ Passwords hashed with **bcrypt**

✅ **MySQL Database Integration**
→ All user and appointment data is persistent and queryable

✅ **Role-Based Access Control**
→ Patients can book appointments
→ Doctors can view and manage their schedules
→ Admin can assign wards

✅ **React Frontend (localhost:3000)**
→ Clean UI for login and dashboards

✅ **RESTful API Architecture**
→ Follows clean MVC folder structure

---

## 🧩 Tech Stack

| Layer        | Technology                   |
| ------------ | ---------------------------- |
| **Frontend** | React.js (Vite or CRA)       |
| **Backend**  | Node.js, Express             |
| **Database** | MySQL                        |
| **Auth**     | JWT (jsonwebtoken), bcryptjs |
| **Testing**  | curl or Postman              |

---

## 🧠 Environment Setup

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hospitaldb
JWT_SECRET=secret
PORT=5000
```

Then start the server:

```bash
node server.js
```

It should print:

```
Server running on port 5000
Connected to MySQL
```

---

### 2️⃣ MySQL Setup

1. Open **MySQL Workbench**

2. Create database:

   ```sql
   CREATE DATABASE hospitaldb;
   USE hospitaldb;
   ```

3. Create required tables:

   ```sql
   CREATE TABLE Doctor (
     DoctorID INT AUTO_INCREMENT PRIMARY KEY,
     Name VARCHAR(100),
     Specialization VARCHAR(100),
     Contact VARCHAR(15),
     Email VARCHAR(100),
     Password VARCHAR(255)
   );

   CREATE TABLE Patient (
     PatientID INT AUTO_INCREMENT PRIMARY KEY,
     Name VARCHAR(100),
     Age INT,
     Gender VARCHAR(10),
     Contact VARCHAR(15),
     Address VARCHAR(255),
     Email VARCHAR(100),
     Password VARCHAR(255)
   );

   CREATE TABLE Appointment (
     AppointmentID INT AUTO_INCREMENT PRIMARY KEY,
     PatientID INT,
     DoctorID INT,
     AppointmentDate DATE,
     StartTime TIME,
     EndTime TIME,
     Reason VARCHAR(255),
     Status VARCHAR(20),
     FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
     FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
   );

   CREATE TABLE Ward (
     WardID INT AUTO_INCREMENT PRIMARY KEY,
     WardName VARCHAR(50),
     Capacity INT,
     AssignedDoctor INT,
     FOREIGN KEY (AssignedDoctor) REFERENCES Doctor(DoctorID)
   );
   ```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Then visit 👉 [http://localhost:3000](http://localhost:3000)

---

## 🔐 API Usage Examples

### Register Doctor

```bash
curl.exe -X POST "http://localhost:5000/api/auth/register/doctor" ^
-H "Content-Type: application/json" ^
-d "{\"Name\":\"Dr. Meera Sharma\",\"Specialization\":\"Cardiology\",\"Contact\":\"9999999999\",\"Email\":\"doctor@example.com\",\"Password\":\"doctor123\"}"
```

### Register Patient

```bash
curl.exe -X POST "http://localhost:5000/api/auth/register/patient" ^
-H "Content-Type: application/json" ^
-d "{\"Name\":\"Aman Patel\",\"Email\":\"patient@example.com\",\"Password\":\"patient123\"}"
```

### Login

```bash
curl.exe -X POST "http://localhost:5000/api/auth/login" ^
-H "Content-Type: application/json" ^
-d "{\"role\":\"doctor\",\"emailOrContact\":\"doctor@example.com\",\"password\":\"doctor123\"}"
```

### Book Appointment

```bash
curl.exe -X POST "http://localhost:5000/api/appointments/book" ^
-H "Authorization: Bearer <patient_token>" ^
-H "Content-Type: application/json" ^
-d "{\"doctorId\":1,\"appointmentDate\":\"2025-10-20\",\"startTime\":\"10:00:00\",\"endTime\":\"10:30:00\",\"reason\":\"Fever\"}"
```

---

## 🧑‍💻 Role Flow

| Role                 | Capabilities                                         |
| -------------------- | ---------------------------------------------------- |
| **Patient**          | Register, login, view profile, book appointments     |
| **Doctor**           | Login, view appointments, manage patients, see wards |
| **Admin (optional)** | Assign doctors to wards                              |

---

## 🌍 Deployment (AWS EC2)

1. Launch an **Ubuntu EC2 Instance**
2. Install Node.js, MySQL:

   ```bash
   sudo apt update
   sudo apt install nodejs npm mysql-server
   ```
3. Clone your repo:

   ```bash
   git clone https://github.com/<your-username>/hospital-management-system.git
   ```
4. Configure `.env` with your MySQL details
5. Start backend:

   ```bash
   cd backend
   node server.js
   ```
6. Build frontend:

   ```bash
   cd frontend
   npm run build
   ```
7. Serve build using `serve` or `nginx`

---

## 🧾 License

This project is open-source and available under the **MIT License**.
>>>>>>> 764fe217a43c40a4e9054706999d0cb7404485d2
