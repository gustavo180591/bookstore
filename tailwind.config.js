import { fontFamily } from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/@tailwindcss/forms/**/*.{html,js,svelte,ts}",
    "./node_modules/@tailwindcss/typography/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    forms,
    typography,
  ],
};
