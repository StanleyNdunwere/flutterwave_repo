module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        lato: ["nunito", "sans-serif"],
        nunito: ["nunito", "tahoma"]
      },
      colors: {
        blue: {
          light: '#857dce',
          default: '#3326ae',
          dark: '#3326ae',
          search: "#f7f8ff",
        },
        orange: {
          light: '#ff342d',
          default: '#ff392b',
          dark: '#ff3a2b',
        }
      },
      gridTemplateRows: {
        header: "200px auto",
        body: "1fr 3fr"
      },
      gridTemplateColumns: {
        body: "450px auto",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
        "8xl": "6rem",
        "9xl": "7rem",
      },
      boxShadow: {
        around: "0 0 1.5rem 0.5rem rgba(4, 11, 60, 0.15)",
        aroundY: "0 1rem 1.2rem 0.5rem rgba(4, 11, 60, 0.15)",

      },
      height: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
        product: "430px",
        productDetail: "500px"
      },
      width: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
        product: "430px",
        productDetail: "500px"
      },
      minWidth: {
        'productCard': "300px",
      }
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}
