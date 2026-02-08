# Notes CSBS

A clean, academic resource platform for CSBS students at BMS College of Engineering, Bangalore.

## 🎓 About

Notes CSBS is a student-built platform providing organized access to:

- **Semester-wise Notes** - Unit-organized study materials
- **Exam Papers** - CIE-1, CIE-2, CIE-3, and SEE previous years
- **Lab Resources** - Lab manuals and guides
- **Reference Books** - Recommended textbooks

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Supabase (Database, Auth, Storage)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd notes-csbs
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
notes-csbs/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── integrations/   # Supabase integration
│   └── lib/            # Utilities and helpers
├── public/             # Static assets
└── supabase/           # Supabase functions and migrations
```

## 🗄️ Database Schema

### Tables

- `semesters` - Semester information
- `subjects` - Subject details with semester mapping
- `resources` - Notes, papers, and books with metadata
- `units` - Unit information for subjects

## 🎨 Features

- **Dark Mode** - Optimized reading experience
- **Responsive Design** - Works on all devices
- **Fast Performance** - Optimized loading and navigation
- **Clean UI** - Academic library aesthetic
- **Type-safe** - Built with TypeScript

## 👥 Contributors

Made with ❤️ by students, for students:

- Tushar Jain
- Ayush Kumar
- Niranjan K
- Rishabh Gupta

## 📧 Contact

For feedback or issues: [notescsbsbmsce@gmail.com](mailto:notescsbsbmsce@gmail.com)

## 📄 License

This project is for educational purposes at BMS College of Engineering.

---

**Note**: This project is not officially affiliated with BMS College of Engineering.
