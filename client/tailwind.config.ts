// client/tailwind.config.ts
import type { Config } from "tailwindcss";

const config = {
  
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {
      // Only the custom Maasai accents are needed here
      colors: {
        maasai: {
          red: "#c41e3a",
          blue: "#1e40af",
          green: "#166534",
          yellow: "#ca8a04",
          orange: "#ea580c",
        },
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  
} satisfies Config;

export default config;