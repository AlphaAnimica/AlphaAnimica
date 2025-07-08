# VetConnect - Veterinary Trainee Platform

A modern web platform connecting veterinary trainees with clinic opportunities. Built with React, Node.js, and SQLite.

## Features

### For Trainees
- ✅ Create account and upload resumes
- ✅ Browse available clinic positions/internships
- ✅ Apply for training opportunities
- ✅ View clinic profiles and requirements
- ✅ Communicate with clinic owners/doctors
- ✅ Track application status
- ✅ Search with filters (paid/free, geolocation, level, skills)
- ✅ Free trial (5 applications) with premium upgrade option

### For Clinics
- ✅ Create clinic profile
- ✅ Post new opportunities or positions
- ✅ See and track trainee applications
- ✅ Schedule interviews and send email notifications
- ✅ Update post/position status
- ✅ Premium posting options

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express.js
- **Database**: SQLite (easily upgradable to PostgreSQL)
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Email**: Nodemailer (configured but needs setup)

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vet-trainee-platform
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000).

### Manual Installation

If the above doesn't work, install dependencies manually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

## Project Structure

```
vet-trainee-platform/
├── server/                 # Backend API
│   ├── index.js           # Main server file
│   └── package.json       # Backend dependencies
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
├── uploads/               # File uploads (created automatically)
├── database.sqlite        # SQLite database (created automatically)
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Trainee Routes
- `GET/POST /api/trainee/profile` - Trainee profile management

### Clinic Routes
- `GET/POST /api/clinic/profile` - Clinic profile management

### Opportunities
- `GET /api/opportunities` - List opportunities with filters
- `GET /api/opportunities/:id` - Get opportunity details
- `POST /api/opportunities` - Create new opportunity (clinic only)

### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Submit application
- `PUT /api/applications/:id/status` - Update application status

### Interviews
- `POST /api/interviews` - Schedule interview

## Environment Setup

### Email Configuration
To enable email notifications, update the email configuration in `server/index.js`:

```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
```

### Database
The application uses SQLite by default. To switch to PostgreSQL:

1. Install PostgreSQL dependencies
2. Update database connection in `server/index.js`
3. Update table creation scripts for PostgreSQL syntax

## Usage

### For Trainees
1. Register as a trainee
2. Complete your profile with education, skills, and experience
3. Upload your resume
4. Browse opportunities using filters
5. Apply to positions with cover letters
6. Track your application status

### For Clinics
1. Register as a clinic
2. Complete your clinic profile
3. Post training opportunities
4. Review incoming applications
5. Schedule interviews
6. Update application statuses

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Database Reset
Delete `database.sqlite` and restart the server to reset the database.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue in the repository.

---

**Note**: This is a prototype version. For production use, consider:
- Implementing proper payment processing
- Adding more robust security measures
- Setting up proper email services
- Using a production database (PostgreSQL/MySQL)
- Adding comprehensive testing
- Implementing rate limiting and API protection 