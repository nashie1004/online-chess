import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAuthContext from "../../hooks/useAuthContext";
import useIsFirstRender from "../../hooks/useIsFirstRender";
import { toast } from "react-toastify";
import { GenericReturnMessage } from "../../services/BaseApiService";
import useSignalRContext from "../../hooks/useSignalRContext";
import { authHandlers, authInvokers } from "../../game/utilities/constants";

const schema = z.object({
    newUsername: z.string().nonempty().min(8, "New username must contain at least 8 character(s)"),
    oldPassword: z.string().nonempty().min(8, "Old password must contain at least 8 character(s)"),
    newPassword: z.string().nonempty().min(8, "New password must contain at least 8 character(s)")
  }).superRefine(({ oldPassword, newPassword }, ctx) => {
    if (oldPassword === newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The old and new password should be different.",
        path: ['newPassword']
      });
    }
  });
  
type FormFields = z.infer<typeof schema>;

export default function ProfileForm(){
    const { user, setUserName } = useAuthContext();
    const [editableProfile, setEditableProfile] = useState(true);
    const isFirstRender = useIsFirstRender();
    const { addHandler, removeHandler, invoke } = useSignalRContext();
  
    const {
      register, handleSubmit, watch,
      formState: { errors, isSubmitting }
    } = useForm<FormFields>({
      defaultValues: {
        newUsername: user ? user.userName : "",
        oldPassword: "sup3rADMIN@!!0_P@ssw0rd", newPassword: "sup3rADMIN@!!0_P@ssw0rd"
      },
      resolver: zodResolver(schema)
    });
  
    async function submitForm(data: FormFields){
      invoke(authInvokers.EditAccount, {
        oldUserName: user?.userName, ...data 
      });
    }

    useEffect(() => {

      async function init(){
        await addHandler(authHandlers.onEditAccount, (res: GenericReturnMessage) => {{
          toast(res.message, { type: res.isOk ? "success" : "error" });
    
          if (!res.isOk) return;
    
          // if username is updated
          if (res.data.newUsername){
            setUserName(res.data.newUsername);
          }
        }});
      }

      init();

      return () => {
        removeHandler(authHandlers.onEditAccount);
      };
    }, []);
    
    const formValues = watch();
    const loading = isSubmitting;
  
    return <>
        <Form
            onSubmit={handleSubmit(submitForm)}
            className="mb-3"
          >
          <div className="match-form-header">
              <h5 className="">
                  <i className="bi bi-clipboard2-check pe-2"  style={{ color: "#FFEB3B", fontSize: "1.6rem" }}></i> ACCOUNT INFORMATION
              </h5>
          </div>
            <div className="match-form-body">
              <Row>
                <Col>
                    <Form.Group className="mb-3">
                    <Form.Label>New Username</Form.Label>
                    <Form.Control 
                      {...register("newUsername")}
                      isValid={!errors.newUsername && !editableProfile && formValues.newUsername !== ""}
                      isInvalid={errors.newUsername ? true : false}
                      type="text" 
                      placeholder="Enter New Username" 
                      disabled={editableProfile} 
                      readOnly={editableProfile} 
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.newUsername ? errors.newUsername.message : ""}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control 
                      {...register("oldPassword")}
                      isValid={!errors.oldPassword && !editableProfile && formValues.oldPassword !== ""}
                      isInvalid={errors.oldPassword ? true : false}
                      type="password" 
                      placeholder="Enter Old Password" 
                      disabled={editableProfile} 
                      readOnly={editableProfile} 
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.oldPassword ? errors.oldPassword.message : ""}
                      </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control 
                      {...register("newPassword")}
                      isValid={!errors.newPassword && !editableProfile && formValues.newPassword !== ""}
                      isInvalid={errors.newPassword ? true : false}
                      type="password" 
                      placeholder="Enter New Password" 
                      disabled={editableProfile} 
                      readOnly={editableProfile} 
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.newPassword ? errors.newPassword.message : ""}
                      </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="form-check mb-3">
                <input 
                  onChange={() => setEditableProfile(prev => !prev)}
                  type="checkbox" className="form-check-input" />
                <label htmlFor="" className="form-check-label mt-1 ps-1">Edit Profile</label>
              </div>
                <Button 
                disabled={loading || editableProfile}
                className="w-100 btn-1" 
                type="submit">
                {
                  loading ? <>
                    <Spinner 
                      size="sm"
                      animation="border" variant="dark" /> 
                  </> : <>Edit</>
                }
                </Button>
            </div>
        </Form>
    </>
}