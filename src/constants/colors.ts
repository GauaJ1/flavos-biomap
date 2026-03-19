export const COLORS = {
  primary: '#1E5631', // Verde Floresta mais vibrante e profundo
  secondary: '#A67C52', // Terra mais quente e vivo
  background: '#FAF8F5', // Bege extra suave para maior contraste e leveza
  surface: '#FFFFFF', // Branco puro
  text: '#2D3748', // Cinza azulado bem escuro (mais elegante que o #333)
  lightText: '#718096', // Cinza claro equilibrado
  accent: '#F6AD55', // Laranja-dourado super vivo para badges e atenção
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  primary: {
    shadowColor: '#1E5631', // Manual color to avoid early access error if any
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
