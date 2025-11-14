import { MaintenanceLoginForm } from '@/components/maintenance/MaintenanceLoginForm';

export default function LoginPage() {
  return (
    // Diseño centrado simple con Tailwind
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <MaintenanceLoginForm />
    </div>
  );
}