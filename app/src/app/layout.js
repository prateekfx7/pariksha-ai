import './globals.css';
import { AppProvider } from '@/context/AppContext';
import AppShell from '@/components/AppShell';

export const metadata = {
  title: 'Pariksha AI — Diagnose the Gap. Personalize the Path.',
  description: 'AI-powered competency assessment platform for India\'s Official Statistical System. Diagnose skill gaps, get personalized course recommendations, and auto-generate quizzes from any content.',
  keywords: 'Pariksha AI, iGOT Karmayogi, competency assessment, skill gap analysis, AI quiz generator, official statistics',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#141210',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pariksha_theme');if(t){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
