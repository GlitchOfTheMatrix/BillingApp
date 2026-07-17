import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../../../app/router/routes";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../../schemas/loginSchema";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError("");

      await login(data);

      navigate(ROUTES.DASHBOARD);
    } catch (error: unknown) {
      // Log unexpected error for debugging
      // Set a user-friendly message; if the error contains a message use it
      console.error(error);

      let message: string;
      if (typeof error === "string") {
        message = error;
      } else if (error instanceof Error) {
        message = error.message;
      } else {
        message = "Invalid email or password.";
      }

      setServerError(message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Sign In</h1>

      {serverError && <p className={styles.error}>{serverError}</p>}

      <div className={styles.field}>
        <label htmlFor="email">Email</label>

        <input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...register("email")}
        />

        {errors.email && (
          <span className={styles.validation}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Password</label>

        <input
          type="password"
          placeholder="••••••••"
          {...register("password")}
        />

        {errors.password && (
          <span className={styles.validation}>{errors.password.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className={styles.button}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
