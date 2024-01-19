import { Button, Grid, InputLabel, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { Controller, useForm } from "react-hook-form";
import { sub } from "date-fns";

import { z } from "zod";

import { Student } from ".prisma/client";
import { trpc } from "@/utils/trpc";
import { showErrorMessage, showMessage } from "@/store/message";
import { useAppDispatch } from "@/store";

export default function AddNewStudents() {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Student>();
  const mutation = trpc.addNewStudent.useMutation();
  const dispatch = useAppDispatch();

  const validateDOB = (dateOfBirth) => {
    try {
      z.date()
        .max(sub(new Date(), { years: 10 }))
        .parse(dateOfBirth);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        if (err.issues[0].code === "too_big") {
          return "New student must be at least 10 years old";
        }
        return err.issues[0].message;
      }
      return err?.message;
    }
  };
  const validateEmail = (email: string) => {
    try {
      z.string().email().parse(email);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        return err.issues[0].message;
      }
      return err?.message;
    }
  };
  const onSubmit = async (student: Student) => {
    try {
      const res = await mutation.mutateAsync(student);
      if (res.status === 201) {
        reset();
        dispatch(showMessage({ message: res.message }));
      }
    } catch (err) {
      dispatch(showErrorMessage({ message: err.message }));
    }
  };
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} textAlign="center">
        Add New Student
      </Grid>

      <Grid container justifyContent="center" alignItems="center" padding="8px">
        <InputLabel>First Name: </InputLabel>
        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          rules={{
            required: { value: true, message: "Invalid input" },
          }}
          render={({ field: { onChange, value, ref } }) => (
            <TextField
              onChange={onChange}
              value={value}
              inputRef={ref}
              error={!!errors?.firstName}
              helperText={errors?.firstName ? errors.firstName.message : null}
            />
          )}
        />
      </Grid>
      <Grid container justifyContent="center" alignItems="center" padding="8px">
        <InputLabel>Family Name: </InputLabel>
        <Controller
          name="familyName"
          control={control}
          defaultValue=""
          rules={{
            required: { value: true, message: "Invalid input" },
          }}
          render={({ field: { onChange, value, ref } }) => (
            <TextField
              onChange={onChange}
              value={value}
              inputRef={ref}
              error={!!errors?.familyName}
              helperText={errors?.familyName ? errors.familyName.message : null}
            />
          )}
        />
      </Grid>
      <Grid container justifyContent="center" alignItems="center" padding="8px">
        <InputLabel>Date Of Birth: </InputLabel>

        <Controller
          control={control}
          name="dateOfBirth"
          defaultValue={null}
          rules={{
            required: { value: true, message: "Invalid input" },
            validate: validateDOB,
          }}
          render={({ field: { onChange, value, ref } }) => (
            <DatePicker
              onChange={onChange}
              value={value}
              inputRef={ref}
              maxDate={sub(new Date(), { years: 10 })}
              format="MM/dd/yyyy"
              slotProps={{
                textField: {
                  error: !!errors?.dateOfBirth,
                  helperText: errors?.dateOfBirth?.message
                    ? errors.dateOfBirth.message
                    : null,
                },
              }}
            />
          )}
        />
      </Grid>
      <Grid container justifyContent="center" alignItems="center" padding="8px">
        <InputLabel>Email: </InputLabel>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: { value: true, message: "Invalid input" },
            validate: validateEmail,
          }}
          render={({ field: { onChange, value, ref } }) => (
            <TextField
              onChange={onChange}
              value={value}
              inputRef={ref}
              error={!!errors?.email}
              helperText={errors?.email ? errors.email.message : null}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" justifyContent="center">
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disableElevation
          >
            Submit
          </Button>
          <Button onClick={reset} variant="outlined">
            Reset
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
