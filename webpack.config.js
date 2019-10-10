const path = require('path');





module.exports = {
    context: path.join(__dirname, 'src'),
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.bundle.js'
    }
}