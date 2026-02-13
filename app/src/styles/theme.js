import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "blue",
  primaryShade: 6,
  fontFamily: "Inter, system-ui, sans-serif",
  radius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },  
  defaultRadius: "md",
  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
    },
    Table: {
      defaultProps: {
        striped: true,
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: false,
      },
    },
  },
});