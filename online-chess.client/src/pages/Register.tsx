import { Button, Form, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import BaseApiService from "../services/BaseApiService";
import { toast } from 'react-toastify';
import useAuthContext from "../hooks/useAuthContext";
import { useEffect } from "react";

const schema = z.object({
  userName: z.string().min(8, "Username must contain at least 8 character(s)"),
  password: z.string().min(8, "Password must contain at least 8 character(s)"),
});

type FormFields = z.infer<typeof schema>;

const registerService = new BaseApiService();

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const {
    register, handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormFields>({
    defaultValues: {
      userName: "sup3rADMIN",
      password: "sup3rADMIN@!!0_P@ssw0rd",
    },
    resolver: zodResolver(schema)
  })

  async function submitForm(data: FormFields){
    const res = await registerService.basePost("/api/Auth/register", data);
    
    if (!res.isOk){
      toast(res.message, { type: "error" })
      return;
    }

    navigate("/login");
  }

  useEffect(() => {
    if (user){
      navigate("/");
    }
  }, [])

  const loading = isSubmitting;

  return (
    <div className="col">
      <div className="d-flex justify-content-center"> 
          <Form
            onSubmit={handleSubmit(submitForm)}
            className="w-50 mt-5"
          >
            <h3>Register an account</h3>
            <NavLink to="/login" className="nav-link text-primary">Or Login</NavLink>
            <Form.Group className="my-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                {...register("userName")}
                isValid={!errors.userName}
                isInvalid={errors.userName ? true : false}
                type="text" 
                placeholder="Enter Username" />
              <Form.Control.Feedback type="invalid">
                {errors.userName ? errors.userName.message : ""}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                {...register("password")}
                isValid={!errors.password}
                isInvalid={errors.password ? true : false}
                type="password" 
                placeholder="Enter Password" />
              <Form.Control.Feedback type="invalid">
                {errors.password ? errors.password.message : ""}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button 
                disabled={loading}
                className="w-50" 
                type="submit">
                {
                  loading ? <>
                    <Spinner 
                      size="sm"
                      animation="border" variant="dark" /> 
                  </> : <>Submit</>
                }
              </Button>
            </div>
          </Form>
      </div>
    </div>
  );
}

