# Jolly Children Academic Center - Desktop School Management System

A comprehensive cross-platform desktop application built with Electron and React for managing school operations, student records, attendance, grading, billing, and more.

## 🎯 Features

### Core Modules
- **Dashboard** - Overview of key metrics and quick actions
- **Student Management** - Complete student records with profiles
- **Enrollment** - Multi-step student enrollment process
- **Attendance** - Daily attendance tracking with statistics
- **Grading** - Academic performance and grade management
- **Billing** - Invoice generation and payment tracking
- **Staff Management** - Employee records and role management
- **Communications** - Announcements and messaging system
- **Reports** - Comprehensive reporting with export options
- **Settings** - System configuration and user management

### Key Features
- 🔐 Secure login system with role-based access
- 📱 Responsive design that works on various screen sizes
- 🎨 Modern Material-UI design with professional theming
- 📊 Real-time statistics and analytics
- 📄 Comprehensive reporting with PDF/Excel export
- 🔄 Real-time data synchronization
- 🖥️ Cross-platform desktop application (Windows, macOS, Linux)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jolly-children-academic-center
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run electron-dev
   ```

4. **Build for production**
   ```bash
   # For Windows (recommended)
   npm run electron-pack-simple
   
   # Or use the batch file (run as administrator)
   build-admin.bat
   
   # Or use PowerShell
   .\build.ps1
   ```

### Development Scripts

```bash
# Start React development server
npm start

# Run Electron in development mode
npm run electron

# Run both React and Electron in development
npm run electron-dev

# Build React app for production
npm run build

# Package Electron app for distribution
npm run electron-pack
```

## 🏗️ Project Structure

```
src/
├── components/
│   └── Layout/
│       └── Layout.tsx          # Main application layout
├── pages/
│   ├── Login/
│   │   └── Login.tsx           # Authentication page
│   ├── Dashboard/
│   │   └── Dashboard.tsx       # Main dashboard
│   ├── Students/
│   │   ├── Students.tsx       # Student list management
│   │   └── StudentProfile.tsx  # Individual student profiles
│   ├── Enrollment/
│   │   └── Enrollment.tsx      # Student enrollment process
│   ├── Attendance/
│   │   └── Attendance.tsx     # Attendance tracking
│   ├── Grading/
│   │   └── Grading.tsx         # Grade management
│   ├── Billing/
│   │   └── Billing.tsx         # Invoice and payment management
│   ├── Staff/
│   │   └── Staff.tsx          # Staff management
│   ├── Communications/
│   │   └── Communications.tsx # Messaging and announcements
│   ├── Reports/
│   │   └── Reports.tsx        # Report generation
│   └── Settings/
│       └── Settings.tsx        # System settings
├── App.tsx                     # Main application component
└── index.tsx                   # Application entry point
```

## 🎨 UI/UX Design

### Design Principles
- **User-Friendly**: Intuitive navigation and clear visual hierarchy
- **Responsive**: Adapts to different screen sizes and orientations
- **Accessible**: Follows accessibility guidelines for all users
- **Professional**: Clean, modern design suitable for educational institutions

### Color Scheme
- **Primary**: Blue (#1976d2) - Trust and professionalism
- **Secondary**: Pink (#dc004e) - Energy and creativity
- **Success**: Green - Positive actions and status
- **Warning**: Orange - Caution and attention
- **Error**: Red - Alerts and critical actions

### Typography
- **Font Family**: Roboto, Helvetica, Arial, sans-serif
- **Hierarchy**: Clear distinction between headings, body text, and captions

## 🔐 Authentication & Security

### User Roles
- **Admin**: Full system access and user management
- **Registrar**: Student and enrollment management
- **Teacher**: Attendance and grading access
- **Finance**: Billing and payment management
- **Receptionist**: Basic student and attendance functions

### Demo Credentials
```
Admin:
Email: admin@jollychildren.edu
Password: admin123

Teacher:
Email: teacher@jollychildren.edu
Password: teacher123
```

## 📊 Key Features by Module

### Dashboard
- Real-time statistics and metrics
- Quick action buttons
- Recent activities feed
- Upcoming events calendar

### Student Management
- Comprehensive student profiles
- Search and filter capabilities
- Academic history tracking
- Parent/guardian information

### Enrollment
- Multi-step enrollment wizard
- Form validation and error handling
- Academic year and grade selection
- Payment information collection

### Attendance
- Daily attendance marking
- Class-wise attendance tracking
- Attendance statistics and reports
- Export functionality

### Grading
- Subject-wise grade entry
- Grade calculation and averaging
- Academic performance tracking
- Report card generation

### Billing
- Invoice generation and management
- Payment tracking and history
- Outstanding balance monitoring
- Financial reporting

### Staff Management
- Employee record management
- Role and permission assignment
- Department organization
- Contact information management

### Communications
- Announcement system
- Email and SMS notifications
- Message templates
- Communication history

### Reports
- Comprehensive reporting system
- Multiple export formats (PDF, Excel, CSV)
- Custom date ranges and filters
- Automated report generation

### Settings
- School information management
- User account management
- System preferences
- Backup and security settings

## 🛠️ Technical Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Professional UI component library
- **React Router** - Client-side routing
- **Context API** - State management

### Desktop
- **Electron** - Cross-platform desktop framework
- **electron-builder** - Application packaging and distribution

### Development Tools
- **Create React App** - Development environment
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📱 Responsive Design

The application is designed to work seamlessly across different screen sizes:
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Optimized layout with collapsible navigation
- **Mobile**: Touch-friendly interface with bottom navigation

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=Jolly Children Academic Center
```

### Electron Configuration
The Electron main process is configured in `public/electron.js` with:
- Security best practices
- Window management
- Menu configuration
- Auto-updater setup

## 📦 Building and Distribution

### Development Build
```bash
npm run electron-dev
```

### Production Build
```bash
npm run build
npm run electron-pack
```

### Distribution
The built application will be available in the `dist/` directory with platform-specific installers:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` portable application

## 🚀 Deployment

### Local Installation
1. Build the application: `npm run electron-pack`
2. Run the installer from the `dist/` directory
3. Launch the application from your desktop

### Network Deployment
1. Set up a central database server
2. Configure API endpoints in the application
3. Deploy the application to client machines
4. Configure user accounts and permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and FAQ

## 🔧 Troubleshooting

### Windows Build Issues

If you encounter symbolic link errors during the build process:

1. **Run as Administrator**: Right-click Command Prompt or PowerShell and select "Run as administrator"

2. **Use the simple build script**:
   ```bash
   npm run electron-pack-simple
   ```

3. **Use the provided batch file** (run as administrator):
   ```bash
   build-admin.bat
   ```

4. **Use PowerShell script**:
   ```powershell
   .\build.ps1
   ```

### Common Issues

- **Symbolic Link Errors**: Use `npm run electron-pack-simple` instead of `npm run electron-pack`
- **Permission Errors**: Run terminal as administrator
- **Build Failures**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 🔮 Future Enhancements

- **Mobile App**: Companion mobile application
- **Cloud Sync**: Real-time data synchronization
- **Advanced Analytics**: Machine learning insights
- **Integration**: Third-party service integrations
- **Multi-language**: Internationalization support
- **Offline Mode**: Offline functionality with sync

## 📞 Contact

**Jolly Children Academic Center, Inc.**
- Website: www.jollychildren.edu
- Email: info@jollychildren.edu
- Phone: +1 (555) 123-4567

---

Built with ❤️ for educational excellence
#   j o l l y - c h i l d r e n - s c h o o l - m a n a g e m e n t  
 #   j o l l y - c h i l d r e n - s c h o o l - m a n a g e m e n t  
 