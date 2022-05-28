import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
// import TextField from "@material-ui/core/TextField";
// import { styled } from "@material-ui/core/styles";
import { useInput } from "../utils/useInput";

// import { Toast } from "./../utils/notifications";
import { Auth } from "aws-amplify";
// import Button from "@material-ui/core/Button";
// import CircularProgress from "@material-ui/core/CircularProgress";
import { Link, useNavigate, /*useHistory*/ } from "react-router-dom";

// const Field = styled(TextField)({
//   margin: "10px 0",
// });

// const DLink = styled(Link)({
//   margin: "15px 0",
//   textAlign: "right",
// });

const Signup: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  
  // const history = useHistory();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [company, setCompany] = useState('');

  const [email, setEmail] = useState('');
  // const { value: name, bind: bindName } = useInput('');
  // const { value: email, bind: bindEmail } = useInput('');
  // const { value: phone, bind: bindPhone } = useInput('');
  // const { value: company, bind: bindCompany } = useInput('');
  // const { value: password, bind: bindPassword } = useInput('');
  // const { value: confirmPassword, bind: bindConfirmPassword } = useInput('');

  const handleSignUp = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onSubmit={handleSignUp}
    >
      <h1 style={{ fontSize: "22px", fontWeight: 800 }}>
        {" "}
        New Account Registration
      </h1>
      <Fieldset legend={'Create Account'}>
        <InputText value={company} onChange={(e) => setCompany(e.target.value)} />
        <InputText value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <InputText value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <InputText value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </Fieldset>

      
      {/* <Field label="Name" {...bindName} />
      <Field label="Email" {...bindEmail} type="email" />
      <Field label="Phone" {...bindPhone} type="tel" />
      <Field label="Company" {...bindCompany} />
      <Field label="Password" type="password" {...bindPassword} />
      <Field
        label="Confirm Password"
        type="password"
        {...bindConfirmPassword}
      /> */}
      {/* <Button
        variant="contained"
        color="primary"
        size="large"
        type="submit"
        disabled={loading}
      >
        {loading && <CircularProgress size={20} style={{ marginRight: 20 }} />}
        Sign Up
      </Button>
      <DLink to="/signin">go to login &rarr;</DLink> */}
    </form>
  );
};

export default Signup;