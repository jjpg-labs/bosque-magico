export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<AvatarSize, string> = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

interface GirlAvatarProps {
  size?: AvatarSize;
  className?: string;
}

/**
 * La guía del bosque. Decorativa: se marca aria-hidden para que los lectores
 * de pantalla no la lean en cada aparición.
 *
 * El mismo dibujo está en `assets/icon.svg`, que es de donde salen los iconos
 * de la PWA. Si se cambia aquí, hay que cambiarlo allí y ejecutar `npm run icons`.
 */
export function GirlAvatar({ size = 'md', className = '' }: GirlAvatarProps) {
  return (
    <div className={`relative inline-block ${SIZES[size]} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" focusable="false">
        <circle cx="60" cy="60" r="56" fill="#FDE047" stroke="#FACC15" strokeWidth="4" />

        {/* Camiseta de la selección: blanca, con ribete amarillo y franjas granates */}
        <path
          d="M 35 110 Q 60 90 85 110 L 95 120 L 25 120 Z"
          fill="#FEFCE8"
          stroke="#D6D3D1"
          strokeWidth="1.5"
        />
        <path
          d="M 51 99 Q 60 106 69 99"
          stroke="#FACC15"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 38 108 Q 43 101 49 98"
          stroke="#7F1D1D"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 82 108 Q 77 101 71 98"
          stroke="#7F1D1D"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Escudo en el pecho */}
        <path d="M 45 111 L 51 111 L 51 115 Q 48 118 45 115 Z" fill="#7F1D1D" />

        {/* Cuello y cabeza */}
        <rect x="52" y="72" width="16" height="15" fill="#FED7AA" rx="4" />
        <ellipse cx="60" cy="54" rx="26" ry="28" fill="#FED7AA" />

        {/* Orejas */}
        <circle cx="34" cy="54" r="5" fill="#FDBA74" />
        <circle cx="86" cy="54" r="5" fill="#FDBA74" />

        {/* Melenita: castaño medio, a la altura de la barbilla */}
        <path d="M 32 45 C 28 70 33 84 42 87 C 37 70 37 50 38 45 Z" fill="#5C3317" />
        <path d="M 88 45 C 92 70 87 84 78 87 C 83 70 83 50 82 45 Z" fill="#5C3317" />

        {/* Ojos */}
        <ellipse cx="48" cy="52" rx="4" ry="5.5" fill="#292524" />
        <ellipse cx="72" cy="52" rx="4" ry="5.5" fill="#292524" />
        <circle cx="46.5" cy="50" r="1.5" fill="#FFFFFF" />
        <circle cx="70.5" cy="50" r="1.5" fill="#FFFFFF" />

        {/* Pestañas */}
        <path d="M 42 47 Q 44 44 48 46" stroke="#292524" strokeWidth="1.5" fill="none" />
        <path d="M 78 47 Q 76 44 72 46" stroke="#292524" strokeWidth="1.5" fill="none" />

        {/* Sonrisa */}
        <path
          d="M 52 64 Q 60 70 68 64"
          stroke="#E11D48"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Mofletes sonrosados */}
        <ellipse cx="43.5" cy="60" rx="5" ry="3.5" fill="#FCA5A5" opacity="0.75" />
        <ellipse cx="76.5" cy="60" rx="5" ry="3.5" fill="#FCA5A5" opacity="0.75" />

        {/* Flequillo recto, tapando la frente */}
        <path
          d="M 33 47 C 35 29 49 23 60 23 C 71 23 87 29 89 47 C 86 39 80 36 74 37 C 68 38 64 39 60 39 C 52 39 44 37 38 39 C 36 40 34 43 33 47 Z"
          fill="#5C3317"
        />
        <path
          d="M 45 35 Q 52 43 58 37 Q 66 43 75 35 C 80 29 68 24 60 24 C 52 24 40 29 45 35 Z"
          fill="#8B5E34"
        />
      </svg>
    </div>
  );
}
