import { Controller, useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { showErrorMessage, showMessage } from "@/store/message";
import { Button, Grid, InputLabel, Stack, TextField } from "@mui/material";
import { Course } from "@prisma/client";
import { useAppDispatch } from "@/store";

export default function AddNewCourses() {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Course>();
  const mutation = trpc.addNewCourse.useMutation();
  const dispatch = useAppDispatch();

  const onSubmit = async (course: Course) => {
    try {
      const res = await mutation.mutateAsync(course);
      if (res.status === 201) {
        reset();
        dispatch(showMessage({ message: res.message }));
      }
    } catch (err) {
      if (typeof err === "string") {
        dispatch(showErrorMessage({ message: err }));
      } else if (err instanceof Error) {
        dispatch(showErrorMessage({ message: err.message }));
      }
    }
  };
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} textAlign="center">
        Add New Course
      </Grid>

      <Grid container justifyContent="center" alignItems="center" padding="8px">
        <InputLabel>Course Name: </InputLabel>
        <Controller
          name="name"
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
              error={!!errors?.name}
              helperText={errors?.name ? errors.name.message : null}
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
          <Button
            onClick={() => {
              reset();
            }}
            variant="outlined"
          >
            Reset
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
