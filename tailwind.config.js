/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#DC2626',
                    dark: '#991B1B',
                    light: '#FEE2E2',
                },
                secondary: {
                    DEFAULT: '#2E3440',
                    light: '#3B4252',
                    lighter: '#4C566A',
                },
                accent: '#F87171',
                success: { DEFAULT: '#4ECB71', light: '#E8F8ED' },
                warning: { DEFAULT: '#F7B731', light: '#FFF4E0' },
                danger: { DEFAULT: '#EE5A6F', light: '#FFE8EC' },
                info: { DEFAULT: '#5B9BD5', light: '#E7F1FA' },
                surface: '#FFFFFF',
                'bg-main': '#F5F7FA',
                'bg-hover': '#F9FAFB',
                border: '#E5E7EB',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            boxShadow: {
                glow: '0 0 20px rgba(220,38,38,0.3)',
            },
            backgroundImage: {
                'primary-gradient': 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
            },
            borderRadius: {
                sm: '0.375rem',
                md: '0.5rem',
                lg: '0.75rem',
                xl: '1rem',
            },
            zIndex: {
                dropdown: '1000',
                fixed: '1030',
                modal: '1050',
            },
            width: {
                sidebar: '260px',
            },
            height: {
                header: '70px',
            },
        },
    },
    plugins: [],
};
