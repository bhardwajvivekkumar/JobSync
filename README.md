🌟 JobSync

I noticed a real-world problem many job seekers face: keeping track of multiple job applications, interviews, follow-ups, and statuses across different platforms is overwhelming. Spreadsheets and notes quickly become messy, making it easy to miss deadlines or lose track of progress.

To solve this, I built JobSync — a smart job application tracker that helps users organize their applications in one place, track progress visually, and receive timely follow-up reminders.

---


||--What JobSync Does--||


--Functionalities--

Add & Organize Applications - Save details like company, job title, status, location, and tags.

Track Your Journey - See where you stand with applications: applied, interview, offer, or rejection.

Never Miss a Follow-up - Get notified when it’s time to follow up.

Visual Dashboard - Clean charts to view:

Total applications count

Monthly trends (bar chart)

Status breakdown (donut chart)

Daily activity heatmap

Stay Updated → Read job market blogs right inside your dashboard.

Successfully export you all job application in two dedicated forms PDF and CSV.

---


--Technology used--

Frontend → React + MUI (Material-UI) + Typescript

Backend → Node.js + Express

Database → MongoDB (Mongoose ODM)

Validation → Zod (schema-based validation)

Auth → JWT for secure login & registration

ResetPassword - AuthMailer

---

--Screenshots--

<img width="1836" height="964" alt="Screenshot from 2025-08-19 18-35-19" src="https://github.com/user-attachments/assets/4b820fbc-5950-4072-ac13-5bbde7b2cf25" />
<img width="1836" height="964" alt="Screenshot from 2025-08-19 18-36-21" src="https://github.com/user-attachments/assets/bf1be58b-999a-4047-bfa4-f9a8ebef7547" />
<img width="1836" height="964" alt="Screenshot from 2025-08-19 18-36-29" src="https://github.com/user-attachments/assets/a17624b8-0d32-4d50-a77a-05c07bbdff1a" />
<img width="1836" height="964" alt="Screenshot from 2025-08-19 18-36-46" src="https://github.com/user-attachments/assets/bf3f0a2c-3848-4961-b77f-e6785927f709" />

---


## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/jobSync
cd jobSync
```

### 2. Install server dependencies
```bash
cd server
npm run dev
```

### 3. Set up environment variables
Create a `.env` file in `/server`:
```
MONGO_URI=your_mongodb_uri
JWT=your_jwt_secret
CLIENT_URL=http://localhost:5173
GMAIL_USER=your gmail
GMAIL_APP_PASSWORD=your 16 digit gmail passcode 
MAIL_FROM="JobSync <your gmail>"
```

### 4. Install client dependencies
```bash
cd ../client
npm run dev
```

---

📂 Project Structure
```
JobSync/
│── backend/
│   ├── controllers/   # Business logic
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routes
│   ├── middleware/    # Auth & error handling
│   └── server.ts      # App entry point
│
│── frontend/
│   ├── src/
│   │   ├── pages/     # Dashboard, Applications, Auth
│   │   ├── components # Reusable UI (cards, charts, dialogs)
│   │   └── Services/     # API handler
│   └── package.json
│
└── README.md
```

---

--Contributing--

Contributions, issues, and feature requests are welcome!
Open an issue or submit a pull request.

---

## Author

Vivek Kumar  
📧 [vk3411389@gmail.com]
