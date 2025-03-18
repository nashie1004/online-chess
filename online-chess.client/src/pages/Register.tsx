import { Button, Form, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import BaseApiService from "../services/BaseApiService";
import useAuthContext from "../hooks/useAuthContext";
import { useEffect } from "react";
import useNotificationContext from "../hooks/useNotificationContext";
import useSignalRContext from "../hooks/useSignalRContext";

const schema = z.object({
  userName: z.string().min(8, "Username must contain at least 8 character(s)"),
  password: z.string().min(8, "Password must contain at least 8 character(s)"),
});

type FormFields = z.infer<typeof schema>;

const registerService = new BaseApiService();

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { setNotificationState, notificationState } = useNotificationContext();
  const { userConnectionId } = useSignalRContext();

  const {
    register, handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormFields>({
    defaultValues: {
      userName: "",
      password: "",
    },
    resolver: zodResolver(schema)
  })

  async function submitForm(data: FormFields){
    if (!userConnectionId) return;

    const res = await registerService.basePost("/api/Auth/register", data);
    
    if (!res.isOk){
      setNotificationState({ 
        type: "SET_CUSTOMMESSAGE"
        , payload: { customMessage: res.message, customMessageType: "DANGER" } 
      });
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
            className="w-50 mt-5 form-fill-up"
          >
            <h1 className="hstack justify-content-center">
              <i className="bi bi-star-fill pe-2" style={{color: "#FFEB3B"}}></i>
              <span>
                ONLINE-CHESS.COM
              </span>
            </h1>
            <div className="form-body mt-4">
              <div className="form-body-content">
                <Form.Group className="mb-4 mt-3">
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
                <Form.Group className="mb-4">
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
                <Button 
                  disabled={loading || notificationState.hasMultipleTabsOpened}
                  className="w-100" 
                  size="lg"
                  type="submit">
                  {
                    loading ? <>
                      <Spinner 
                        size="sm"
                        animation="border" variant="dark" /> 
                    </> : <>Register</>
                  }
                </Button>
              </div>
              <div className="form-footer hstack justify-content-center">
                <NavLink to="/login" className="nav-link">Already have an account? Login here.</NavLink>
              </div>
            </div>
          </Form>
      </div>
    </div>
  );
}

