'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// 1. Definición del Schema de Validación (Seguridad y TypeScript)
const LoginSchema = z.object({
  username: z.string().min(1, 'El usuario es obligatorio.'),
  password: z.string().min(1, 'La contraseña es obligatoria.'),
});

/**
 * @description Servel Action para autenticar al administrador del Maintenance Mode.
 */
export async function authenticateAdmin(prevState: any, formData: FormData) {
  // 2. Validación de Entrada
  const validatedFields = LoginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Fallo de validación. Asegúrate de rellenar ambos campos.',
    };
  }

  const { username, password } = validatedFields.data;

  // 3. Chequeo de Credenciales Estáticas (admin/prod)
  const IS_VALID_CREDENTIALS = username === 'admin' && password === 'prod';

  if (IS_VALID_CREDENTIALS) {
    // 4. Autenticación Exitosa: Creación de Cookie de Sesión
    cookies().set('admin-session', 'authenticated', {
      httpOnly: true, // Seguridad: No accesible por JavaScript del lado del cliente.
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 días de sesión
      path: '/',
    });

    // 5. Redirección
    redirect('/');

  } else {
    // 6. Autenticación Fallida
    return {
      success: false,
      message: 'Credenciales de administrador incorrectas.',
    };
  }
}