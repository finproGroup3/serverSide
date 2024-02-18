// Modal.jsx
import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";

export function DialogWithForm() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  return (
    <>
      <Button color="lightBlue" onClick={handleOpen}>
        Sign In
      </Button>
      <Dialog
        size="sm"
        open={open}
        onClose={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card>
          <CardBody className="p-4">
            <Typography className="text-center mb-4 font-semibold text-2xl">
              Sign In
            </Typography>
            <Input
              label="Email"
              size="regular"
              placeholder="Enter your email"
            />
            <Input
              label="Password"
              size="regular"
              placeholder="Enter your password"
              type="password"
            />
            <div className="flex items-center mt-4">
              <Checkbox color="lightBlue" label="Remember Me" />
            </div>
          </CardBody>
          <CardFooter className="justify-center">
            <Button color="lightBlue" onClick={handleOpen} ripple="light">
              Sign In
            </Button>
            <Typography
              color="blueGray"
              className="mt-4 flex justify-center text-sm"
            >
              Don't have an account?{" "}
              <a
                href="#signup"
                className="ml-1 font-bold text-lightBlue"
                onClick={handleOpen}
              >
                Sign up
              </a>
            </Typography>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
