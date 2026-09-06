import './globals.css';
import { AppProvider } from '@/context/AppContext';
import AppShell from '@/components/AppShell';

export const metadata = {
  title: 'Pariksha AI — Diagnose the Gap. Personalize the Path.',
  description: 'AI-powered competency assessment platform for India\'s Official Statistical System. Diagnose skill gaps, get personalized course recommendations, and auto-generate quizzes from any content.',
  keywords: 'Pariksha AI, iGOT Karmayogi, competency assessment, skill gap analysis, AI quiz generator, official statistics',
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
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
