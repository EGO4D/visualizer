// Copyright (c) Meta Platforms, Inc. and affiliates. All Rights Reserved.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Elevation, InputGroup, Intent } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";

import "./LoginView.scss";

const LOCAL_KEY = 'api-key';

function LoginView() {
  const [showPassword, setShowPassword] = useState(false);
  const [login_key, setLoginKey] = useState(localStorage.getItem(LOCAL_KEY));
  const navigate = useNavigate();

  const handleLockClick = () => { setShowPassword(!showPassword); }
  const handleLogIn = () => {
    localStorage.setItem(LOCAL_KEY, login_key);
    navigate("/");
  }

  const lockButton = (
      <Tooltip2 placement="top-end" content={`${showPassword ? "Hide" : "Show"} Key`} >
          <Button
              id="login-show-password-button"
              icon={showPassword ? "unlock" : "lock"}
              intent={Intent.PRIMARY}
              minimal={true}
              onClick={handleLockClick}
          />
      </Tooltip2>
  );

  return <div className='login-main'>
    <Card className="login-dialog" interactive={false} elevation={Elevation.THREE}>
        <h1>Ego4D Dataset</h1>
        <InputGroup
            value={login_key}
            onChange={event => setLoginKey(event.target.value)}
            placeholder="Enter your licensed AWS Access ID"
            rightElement={lockButton}
            type={showPassword ? "text" : "password"}
        />
        <Button className="login-button" onClick={handleLogIn}>Log In</Button>
        <br/><br/>
        <p>Don't have one or license expired? Request one at <a href="https://ego4ddataset.com/">ego4ddataset.com</a>.</p>
    </Card>
  </div>
}

export default LoginView;
