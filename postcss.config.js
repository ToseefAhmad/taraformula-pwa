module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-fontpath'),
        require('autoprefixer'),
        require('tailwindcss')('./tailwind.config.js')
    ]
};
