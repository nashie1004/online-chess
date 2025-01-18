import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAuthContext from "../../hooks/useAuthContext";
import useIsFirstRender from "../../hooks/useIsFirstRender";

const schema = z.object({
    username: z.string().nonempty().min(8, "Username must contain at least 8 character(s)"),
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
    const { user } = useAuthContext();
    const [editableProfile, setEditableProfile] = useState(true);
    const isFirstRender = useIsFirstRender();
  
    const {
      register, handleSubmit, setError, watch,
      formState: { errors, isSubmitting }
    } = useForm<FormFields>({
      defaultValues: {
        username: user ? user.userName : "",
      },
      resolver: zodResolver(schema)
    });
  
    async function submitForm(data: FormFields){
      console.log("data =>", data)
    }
    
    const formValues = watch();
    const loading = isSubmitting;
  
    return <>
        <Form
            onSubmit={handleSubmit(submitForm)}
          >
            <Row>
              <Col>
                  <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    {...register("username")}
                    isValid={!errors.username && !editableProfile && formValues.username !== ""}
                    isInvalid={errors.username ? true : false}
                    type="text" 
                    placeholder="Enter Username" 
                    disabled={editableProfile} 
                    readOnly={editableProfile} 
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username ? errors.username.message : ""}
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
            <Form.Check  
              type="checkbox"
              label="Edit Profile"
              onChange={() => setEditableProfile(prev => !prev)}
            />
            <button 
              disabled={editableProfile} 
              type="submit" className="btn btn-primary w-100 mt-3">Edit</button>
        </Form>
    </>
}