import styles from "./PageNotFound.module.css"
import Button from "@mui/material/Button"
import { Link } from "react-router"
import { useTheme } from "@mui/material"
import { Path } from "@/common/components/Routing/Routing.tsx"

type Props = {
  background?: string
}

export const PageNotFound = ({ background }: Props) => {
  const theme = useTheme()
  return (
    <>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>page not found</h2>
      <Button
        component={Link}
        to={Path.Main}
        sx={{
          backgroundColor: background || theme.palette.primary.light,
          color: "#fff",
          width: "fit-content",
          margin: "0 auto",
          padding: "10px",
          "&:hover": {
            backgroundColor: background || theme.palette.primary.main,
          },
        }}
      >
        Return to main page
      </Button>
    </>
  )
}
