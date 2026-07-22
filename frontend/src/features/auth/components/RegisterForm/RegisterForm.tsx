import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";

import { ROUTES } from "../../../../app/router/routes";
import { useAuth } from "../../hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "../../schemas/registerSchema";
import Button from "../../../../components/common/Button/Button";
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setServerError("");
      await registerUser(data);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      let message = "An unknown error occurred.";
      
      if (error?.response?.data) {
        const data = error.response.data;
        if (data.error) {
          message = String(data.error);
        } else {
          message = JSON.stringify(data);
        }
      } else if (error?.message) {
        message = error.message;
      }
      
      setServerError(message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Create an Account</h1>

      {serverError && (
        <div style={{ padding: '12px', backgroundColor: '#dc2626', color: 'white', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
          {serverError}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          {...register("name")}
        />
        {errors.name && (
          <span className={styles.validation}>{errors.name.message}</span>
        )}
      </div>

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
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <span className={styles.validation}>{errors.password.message}</span>
        )}
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        fullWidth
        size="lg"
      >
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </Button>

      <div className={styles.link}>
        Already have an account? <Link to={ROUTES.LOGIN}>Sign In</Link>
      </div>
    </form>
  );
}
