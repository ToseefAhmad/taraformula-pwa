module.exports = {
    theme: {
        fontFamily: {
            sans: ['Arsenal', 'sans-serif'],
            serif: ['FreightBig Pro', 'serif'],
            arabicHeadline: ['TaraArabic Light', 'serif'],
            arabicText: ['Tajawal Regular', 'serif'],
            arabicHeadline5: ['Tajawal Medium', 'serif'],
            yotpo: ['Yotpo Font', 'serif']
        },
        screens: {
            xxs: '390px',
            xs: '480px', // => @media (min-width: 480px) { ... }
            sm: '640px',
            md: '768px',
            'md+1': '769px',
            lg: '1024px',
            xl: '1280px',
            '1.5xl': '1366px',
            '2xl': '1441px',
            betterHover: { raw: '(hover: hover)' }
        },
        container: {
            screens: {},
            center: true
        },
        colors: {
            inherit: 'inherit',
            current: 'currentColor',
            transparent: 'transparent',
            white: {
                DEFAULT: '#FFFFFF'
            },
            almostWhite: {
                DEFAULT: '#F9F8F8'
            },
            whitePinkish: {
                DEFAULT: '#FAF8F7'
            },
            whiteSmoke: {
                DEFAULT: '#F5F3F3'
            },
            black: {
                DEFAULT: '#000000',
                80: 'rgba(0, 0, 0, 0.80)',
                60: 'rgba(0, 0, 0, 0.60)'
            },
            pastelBrown: {
                DEFAULT: '#806958',
                60: 'rgba(128, 105, 88, 0.60)',
                20: 'rgba(128, 105, 88, 0.20)'
            },
            red: {
                DEFAULT: '#FD3C1D',
                80: 'rgba(253, 60, 29, 0.80)',
                60: 'rgba(253, 60, 29, 0.60)',
                40: 'rgba(253, 60, 29, 0.40)',
                20: 'rgba(253, 60, 29, 0.20)',
                5: 'rgba(253, 60, 29, 0.05)'
            },
            lightRed: {
                DEFAULT: '#fd8a77'
            },
            darkRed: {
                DEFAULT: 'rgb(201 37 45)'
            },
            green: {
                DEFAULT: '#023527',
                90: 'rgba(2, 53, 39, 0.90)',
                80: 'rgba(2, 53, 39, 0.80)',
                60: 'rgba(2, 53, 39, 0.60)',
                40: 'rgba(2, 53, 39, 0.40)',
                20: 'rgba(2, 53, 39, 0.20)',
                5: 'rgba(2, 53, 39, 0.05)',
                1: 'rgba(3, 53, 39, 1)'
            },
            gray: {
                DEFAULT: '#CAC3C3',
                80: 'rgba(202, 195, 195, 0.80)',
                60: 'rgba(202, 195, 195, 0.60)',
                40: 'rgba(202, 195, 195, 0.40)',
                30: 'rgba(202, 195, 195, 0.30)',
                20: 'rgba(202, 195, 195, 0.20)',
                10: 'rgba(202, 195, 195, 0.10)',
                5: 'rgba(202, 195, 195, 0.05)'
            },
            gray2: {
                DEFAULT: '#9B9B9B'
            },
            gray3: {
                DEFAULT: '#EFEDED',
                80: 'rgba(239, 237, 237, 0.80)',
                60: 'rgba(239, 237, 237, 0.60)',
                40: 'rgba(239, 237, 237, 0.40)',
                20: 'rgba(239, 237, 237, 0.20)'
            },
            gray4: {
                DEFAULT: '#CEC9C9'
            },
            gray5: {
                DEFAULT: '#E1E0E1'
            },
            gray6: {
                DEFAULT: '#F5F3F3'
            },
            gray7: {
                DEFAULT: '#EEECEC',
                40: 'rgba(238, 236, 236, 0.40)'
            },
            gray8: {
                DEFAULT: '#F2F2F2'
            },
            gray9: {
                DEFAULT: '#E2E2E2'
            },
            gray10: {
                DEFAULT: '#E6E1DB'
            },
            brown: {
                DEFAULT: '#996958',
                80: 'rgba(153, 105, 88, 0.80)',
                60: 'rgba(153, 105, 88, 0.60)',
                50: 'rgba(153, 105, 88, 0.50)',
                40: 'rgba(153, 105, 88, 0.40)',
                20: 'rgba(153, 105, 88, 0.20)',
                10: 'rgba(153, 105, 88, 0.10)'
            },
            zircon: {
                DEFAULT: '#e0e6e4'
            },
            purple: {
                DEFAULT: '#331C2E',
                80: 'rgba(51, 28, 46, 0.80)',
                60: 'rgba(51, 28, 46, 0.60)',
                40: 'rgba(51, 28, 46, 0.40)',
                20: 'rgba(51, 28, 46, 0.20)'
            },
            neutral: {
                100: 'rgb(245 245 245)'
            }
        },
        borderColor: theme => ({
            ...theme('colors'),
            default: '#D2CCCC'
        }),
        fontSize: {
            0: '0',
            xxs: [
                '0.625rem', // 10px
                {
                    lineHeight: '0.9375rem'
                }
            ],
            xs: [
                '0.75rem', // 12px
                {
                    lineHeight: '1rem'
                }
            ],
            ss: [
                '0.875rem', // 14px
                {
                    lineHeight: '1.375rem'
                }
            ],
            sm: [
                '0.9375rem', // 15px
                {
                    lineHeight: '1.25rem'
                }
            ],
            base: [
                '1.125rem', // 18px
                {
                    lineHeight: '1.5rem'
                }
            ],
            lg: [
                '1.375rem', // 22px
                {
                    lineHeight: '1.75rem'
                }
            ],
            xl: [
                '1.625rem', // 26px
                {
                    letterSpacing: '-0.016rem',
                    lineHeight: '1.75rem'
                }
            ],
            '2xl': [
                '1.75rem', // 28px
                {
                    letterSpacing: '-0.018rem',
                    lineHeight: '2rem'
                }
            ],
            '3xl': [
                '1.875rem', // 30px
                {
                    letterSpacing: '-0.019rem',
                    lineHeight: '2.25rem'
                }
            ],
            '4xl': [
                '2.125rem', // 34px
                {
                    letterSpacing: '-0.021rem',
                    lineHeight: '2.5rem'
                }
            ],
            '5xl': [
                '3rem', // 48px
                {
                    letterSpacing: '-0.03rem',
                    lineHeight: '1'
                }
            ],
            '6xl': [
                '3.438rem', // 55px
                {
                    letterSpacing: '-0.034rem',
                    lineHeight: '1'
                }
            ],
            '7xl': [
                '4.5rem', // 72px
                {
                    letterSpacing: '-0.045rem',
                    lineHeight: '1'
                }
            ]
        },
        extend: {
            spacing: {
                '0.5': '0.125rem',
                '0.75': '0.1875rem',
                '1.25': '0.3125rem',
                '1.5': '0.375rem',
                '2.5': '0.625rem',
                '3': '0.75rem',
                '3.5': '0.875rem',
                '4.5': '1.125rem',
                '5.5': '1.375rem',
                '6.5': '1.625rem',
                '7.5': '1.875rem',
                '9.5': '2.375rem',
                '10': '2.5rem',
                '10.5': '2.625rem',
                '11.5': '2.875rem',
                '12.5': '3.125rem',
                '13': '3.25rem',
                '13.5': '3.375rem',
                '14.5': '3.625rem',
                '15': '3.75rem',
                '17': '4.25rem',
                '18': '4.5rem',
                '25': '6.25rem',
                '26': '6.5rem',
                '35': '8.75rem',
                '44.5': '11.125rem'
            },
            gap: {
                mobile: '2.5rem',
                desktop: '3rem'
            },
            width: {
                content: '66.393%',
                'min-content': '60%',
                '9/10': '90%'
            },
            maxWidth: {
                mobile: '480px',
                desktop: '1440px',
                '50': '50%'
            },
            minWidth: {
                '3': '0.75rem',
                '26': '6.5rem'
            },
            height: {
                min: 'min-content',
                fit: 'fit-content'
            },
            minHeight: {
                '0': '0',
                '5.5': '1.375rem',
                '10': '2.5rem',
                '12': '3rem',
                '12.5': '3.125rem',
                '15': '3.75rem',
                '72.5': '18.125rem',
                '74': '18.5rem',
                'screen-desktop': 'calc(100vh - 72px)',
                'screen-mobile': 'calc(100vh - 62px)'
            },
            padding: {
                mobile: '17px',
                desktop: '52px'
            },
            margin: {
                mobile: '17px'
            },
            translate: {
                '100vw': '100vw',
                '100vw-100%': 'calc(100vw - 100%)'
            },
            gridTemplateColumns: {
                '2-mobile': 'calc(100% - theme(width.content) - theme(gap.mobile)) theme(width.content)',
                '2-desktop': 'calc(100% - theme(width.content) - theme(gap.desktop)) theme(width.content)',
                '2-min-desktop': 'calc(100% - theme(width.min-content) - theme(gap.desktop)) theme(width.min-content)',
                '15': 'repeat(15, minmax(0, 1fr))',
                'orders-table': '29% 23% 1fr 26%',
                'orders-table-xs': '21% 17% 1fr 1fr 12% 19%',
                'orders-table-sm': '25% 20% 20% 1fr 22%',
                'orders-table-md': '20% 16% 17% 1fr 11% 20%',
                'orders-table-lg': '21% 15% 17% 1fr 12% 18%',
                'orders-table-xl': '17% 13% 20% 13% 1fr 1fr 14%',
                'checkout-template-cols': '5fr 3fr',
                '2-mobile-reverse': 'theme(width.content) calc(100% - theme(width.content) - theme(gap.mobile))',
                '2-desktop-reverse': 'theme(width.content) calc(100% - theme(width.content) - theme(gap.desktop))',
                '2-min-desktop-reverse':
                    'theme(width.min-content) calc(100% - theme(width.min-content) - theme(gap.desktop))'
            },
            strokeWidth: {
                '1.5': '1.5'
            },
            lineHeight: {
                dd: '1.21',
                '6.5': '1.625rem'
            },
            keyframes: {
                'element-loader': {
                    '0%': { 'background-position': '0 50%' },
                    '50%': { 'background-position': '100% 50%' },
                    '100%': { 'background-position': '0 50%' }
                }
            },
            animation: {
                'content-loader': 'element-loader 2s ease infinite'
            },
            backgroundImage: {
                'join-mailing': "url('./img/join-mailing.png')"
            }
        },
        zIndex: {
            '1': 1,
            '2': 2,
            '3': 3,
            '10': 10,
            '20': 20,
            '30': 30,
            '40': 40,
            '999': 999,
            '99998': 99998,
            '99999': 99999,
            auto: 'auto'
        }
    },
    variants: {
        extend: {
            padding: ['even', 'odd'],
            letterSpacing: ['hover'],
            borderWidth: ['hover'],
            strokeWidth: ['hover']
        }
    }
};
