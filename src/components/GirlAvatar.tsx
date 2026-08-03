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
 */
export function GirlAvatar({ size = 'md', className = '' }: GirlAvatarProps) {
  return (
    <div className={`relative inline-block ${SIZES[size]} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" focusable="false">
        <circle cx="60" cy="60" r="56" fill="#FDE047" stroke="#FACC15" strokeWidth="4" />

        {/* Vestido */}
        <path d="M 35 110 Q 60 90 85 110 L 95 120 L 25 120 Z" fill="#F472B6" />
        <circle cx="45" cy="102" r="3" fill="#DB2777" />
        <circle cx="60" cy="106" r="4" fill="#DB2777" />
        <circle cx="75" cy="102" r="3" fill="#DB2777" />

        {/* Cuello y cabeza */}
        <rect x="52" y="72" width="16" height="15" fill="#FED7AA" rx="4" />
        <ellipse cx="60" cy="54" rx="26" ry="28" fill="#FED7AA" />

        {/* Orejas */}
        <circle cx="34" cy="54" r="5" fill="#FDBA74" />
        <circle cx="86" cy="54" r="5" fill="#FDBA74" />

        {/* Pelo posterior */}
        <path d="M 33 45 C 30 70 34 82 42 85 C 38 70 38 50 38 45 Z" fill="#451A03" />
        <path d="M 87 45 C 90 70 86 82 78 85 C 82 70 82 50 82 45 Z" fill="#451A03" />

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

        {/* Corazones pintados en las mejillas */}
        <path
          d="M 39 58 C 39 55 42 55 43.5 57 C 45 55 48 55 48 58 C 48 61 43.5 63 43.5 64 C 43.5 63 39 61 39 58 Z"
          fill="#EC4899"
        />
        <path
          d="M 72 58 C 72 55 75 55 76.5 57 C 78 55 81 55 81 58 C 81 61 76.5 63 76.5 64 C 76.5 63 72 61 72 58 Z"
          fill="#EC4899"
        />

        {/* Flequillo */}
        <path
          d="M 34 46 C 36 30 50 24 60 24 C 70 24 84 30 86 46 C 76 36 68 38 60 40 C 52 38 44 36 34 46 Z"
          fill="#542605"
        />
        <path
          d="M 45 36 Q 52 44 58 38 Q 66 44 75 36 C 80 30 68 25 60 25 C 52 25 40 30 45 36 Z"
          fill="#78350F"
        />

        {/* Trencita de hilo */}
        <path
          d="M 38 32 C 34 40 32 50 31 62"
          stroke="#F43F5E"
          strokeWidth="3"
          fill="none"
          strokeDasharray="4,2"
        />
        <path
          d="M 38 32 C 34 40 32 50 31 62"
          stroke="#FFFFFF"
          strokeWidth="1"
          fill="none"
          strokeDasharray="2,4"
        />
      </svg>
    </div>
  );
}
