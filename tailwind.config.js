module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Heebo", "sans-serif"],
                bobbie: ['"BN Bobbie Sans"', "sans-serif"],
            },
            colors: {
                "button-primary": "var(--button-primary)",
                "custom-green": {
                    DEFAULT: "#24BD0A",
                    hover: "#188805",
                },
            },
        },
    },
    // ...restante da config
};
