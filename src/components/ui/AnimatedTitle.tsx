import Link from 'next/link';

export function AnimatedTitle() {
  const brandName = "ServcieCam"; // Título corregido
  
  return (
    <Link href="/" passHref legacyBehavior>
        {/* Aplicamos la clase animada directamente al tag 'a' */}
        <a className="animated-title">
            {brandName}
        </a>
    </Link>
  );
}