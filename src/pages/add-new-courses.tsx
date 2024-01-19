import { Controller, useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { useDispatch } from "react-redux";
import { showMessage } from "@/store/message";
import { Button, Grid, InputLabel, Stack, TextField } from "@mui/material";
import { Course } from "@prisma/client";

export default function AddNewCourses() {
  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm<Course>();
  const mutation = trpc.addNewCourse.useMutation();
  const dispatch = useDispatch();

  const onSubmit = async (course: Course) => {
    const result = await mutation.mutateAsync(course);
    console.log("result : ", result);
    if (result.status === 201) {
      reset();
      dispatch(showMessage({ message: result.message }));
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

      <Grid item xs={12} justifyContent="right">
        <Stack direction="row" justifyContent="end">
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
