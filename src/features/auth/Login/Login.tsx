import { selectThemeMode } from "@/app/app-slice"
import { useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import { Controller, useForm } from "react-hook-form"

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  type LoginInputs = {
    email: string
    password: string
    rememberMe: boolean
  }

  const onSubmit = (data: LoginInputs) => {
    console.log(data)
    reset()
  }

  return (
    <Grid container justifyContent={"center"}>
      <FormControl>
        <FormLabel>
          <p>
            To login get registered
            <a
              style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
              href="https://social-network.samuraijs.com"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p>
            <b>Email:</b> free@samuraijs.com
          </p>
          <p>
            <b>Password:</b> free
          </p>
        </FormLabel>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <TextField
              label="Email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email && errors.email.message}
              {...register("email", {
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/,
                  message: "Incorrect email",
                },
              })}
            />
            <TextField
              type="password"
              label="Password"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password && errors.password.message}
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
                },
              })}
            />

            {/*<span>{errors.password && errors.password.message}</span>*/}

            {/*<FormControlLabel label="Remember me" control={<Checkbox />} {...register("rememberMe")} />*/}

            <FormControlLabel
              label="Remember me"
              control={
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field: { value, ...restProps } }) => <Checkbox {...restProps} checked={value} />}
                />
              }
            />

            {/*<input type="checkbox" {...register("rememberMe")}/>*/}

            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  )
}
