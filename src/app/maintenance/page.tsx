import { AdminLoginButton } from '../../components/ui/AdminLoginButton';

export default function MaintenancePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center">
            <h1 className="text-5xl font-bold mb-4">Serivecam en Mantenimiento</h1>
            <p className="text-xl text-gray-400 mb-8">Estamos mejorando tu seguridad. Vuelve pronto.</p>
            
            <AdminLoginButton className="mt-4" />
        </div>
    );
}