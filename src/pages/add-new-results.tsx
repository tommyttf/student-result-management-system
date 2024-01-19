import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { Result, Score } from ".prisma/client";
import { trpc } from "@/utils/trpc";
import { showErrorMessage, showMessage } from "@/store/message";
import { useAppDispatch } from "@/store";

export default function AddNewResults() {
  const { data: courses } = trpc.getAllCourses.useQuery();
  const { data: students } = trpc.getAllStudents.useQuery();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Result>();
  const mutation = trpc.addNewResult.useMutation();
  const dispatch = useAppDispatch();

  const onSubmit = async (result: Result) => {
    try {
      const res = await mutation.mutateAsync(result);
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
        Add New Result
      </Grid>

      <Grid container justifyContent="center" alignItems="center" padding="8px">
        <FormControl sx={{ m: 1, minWidth: 300 }} error={!!errors?.courseId}>
          <InputLabel>Course Name</InputLabel>
          <Controller
            name="courseId"
            control={control}
            rules={{
              required: "Please select course",
            }}
            render={({ field: { onChange, value } }) => (
              <Select
                isLoading
                value={value}
                onChange={onChange}
                label="Course Name"
              >
                {Array.isArray(courses) &&
                  courses.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
              </Select>
            )}
          />
          <FormHelperText>
            {errors?.courseId ? errors.courseId.message : null}
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" padding="8px">
        <FormControl sx={{ m: 1, minWidth: 300 }} error={!!errors?.studentId}>
          <InputLabel>Student Name</InputLabel>
          <Controller
            name="studentId"
            control={control}
            rules={{
              required: "Please select student",
            }}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onChange={onChange} label="Student Name">
                {Array.isArray(students) &&
                  students.map(({ id, firstName, familyName }) => (
                    <MenuItem key={id} value={id}>
                      {firstName + " " + familyName}
                    </MenuItem>
                  ))}
              </Select>
            )}
          />
          <FormHelperText>
            {errors?.studentId ? errors.studentId.message : null}
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" padding="8px">
        <FormControl sx={{ m: 1, minWidth: 300 }} error={!!errors?.score}>
          <InputLabel>Score</InputLabel>
          <Controller
            name="score"
            control={control}
            rules={{
              required: "Please select score",
            }}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onChange={onChange} label="Score">
                {Object.keys(Score).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>
            {errors?.score ? errors.score.message : null}
          </FormHelperText>
        </FormControl>
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
