'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs'; // Use promises API for async/await
import path from 'path';
import { revalidatePath } from 'next/cache'; // Import revalidatePath

// --- Mantenimiento (Nueva Arquitectura Dinámica) ---

const stateFilePath = path.join(process.cwd(), 'src/lib', 'maintenance-state.json');

/**
 * @description Lee el estado de mantenimiento desde el archivo JSON. Es la nueva "única fuente de verdad".
 * @returns {Promise<boolean>} El estado actual del modo mantenimiento.
 */
export async function getMaintenanceStatus(): Promise<boolean> {
  try {
    const data = await fs.readFile(stateFilePath, 'utf-8');
    const state = JSON.parse(data);
    return state.isMaintenance;
  } catch (error) {
    // Si el archivo no existe o hay un error, asumimos que el modo mantenimiento está desactivado.
    console.error('Could not read maintenance state file, defaulting to false:', error);
    return false;
  }
}

/**
 * @description Cambia el estado del modo mantenimiento en el archivo JSON y revalida la cache.
 * @param newStatus El nuevo estado booleano para el modo mantenimiento.
 */
export async function toggleMaintenanceMode(newStatus: boolean) {
  try {
    const state = { isMaintenance: newStatus };
    await fs.writeFile(stateFilePath, JSON.stringify(state, null, 2), 'utf-8');
    
    // ¡Magia! Esto le dice a Next.js que la data de la ruta '/' ha cambiado y debe ser regenerada.
    revalidatePath('/');

    return { success: true, message: `Modo Mantenimiento ${newStatus ? 'ACTIVADO' : 'DESACTIVADO'}.` };
  } catch (error) {
    console.error('Error writing to maintenance state file:', error);
    return { success: false, message: 'Fallo al cambiar el modo mantenimiento.' };
  }
}


// --- Autenticación (Sin cambios) ---

const MAINTENANCE_ROUTE = '/maintenance';

const LoginSchema = z.object({
  username: z.string().min(1, 'El usuario es obligatorio.'),
  password: z.string().min(1, 'La contraseña es obligatoria.'),
});

export async function authenticateAdmin(prevState: any, formData: FormData) {
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
  const IS_VALID_CREDENTIALS = username === 'admin' && password === 'prod';

  if (IS_VALID_CREDENTIALS) {
    cookies().set('admin-session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    redirect('/');
  } else {
    return {
      success: false,
      message: 'Credenciales de administrador incorrectas.',
    };
  }
}

/**
 * @description Elimina la cookie de sesión del administrador.
 */
export async function logoutAdmin() {
  'use server';
  // Eliminar la cookie de sesión
  cookies().set('admin-session', '', { maxAge: 0, path: '/' });
  // Redirigir a la página principal, donde el page.tsx lo bloqueará si es necesario.
  redirect(MAINTENANCE_ROUTE);
}