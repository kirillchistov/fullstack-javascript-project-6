// Сборка фронтенд-ассетов (CSS/JS) в каталог dist для раздачи через Fastify Static.

import path from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mode = process.env.NODE_ENV || 'development';

export default {
  mode,
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
  ],
};
